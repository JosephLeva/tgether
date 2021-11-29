import json
import boto3
import base64
from botocore.exceptions import ClientError
import psycopg2
def lambda_handler(event, context):
    secret_name = "arn:aws:secretsmanager:us-east-1:367750083312:secret:tgether/dblightsail-KOeUx1"
    region_name = "us-east-1"
    print(event)

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    # In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    # See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    # We rethrow the exception by default.

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'DecryptionFailureException':
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InternalServiceErrorException':
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidParameterException':
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidRequestException':
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'ResourceNotFoundException':
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
    else:
        # Decrypts secret using the associated KMS CMK.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
        else:
            secret = base64.b64decode(get_secret_value_response['SecretBinary'])
    
    secret =json.loads(secret)
    username= secret["username"]
    password= secret["password"]
    host = secret["host"]
    dbname= secret["dbname"]
    
    
    
    body = json.loads(event["body"])
    joinid= body["joinid"]
    userid= body['userid']

    
    conn = psycopg2.connect(host=host,
                        port='5432',
                        user= username,
                        password=password,
                        database=dbname) 

    cursor = conn.cursor()
    
    
    #update is ready
    
    
    cursor.execute("Select contractid, ethval from contracts where joinid= '%s'"% joinid)
    
    row = cursor.fetchone() 
    contractId= row[0]
    ethval= row[1]

    cursor.execute('Update payers set isready = %s where userid = %s and contractid= %s', (True, userid, contractId))
    conn.commit()
    
    
    #check all is ready
    
    cursor.execute("select isready from payers where contractId= '%s'"% contractId)
    rows = cursor.fetchall()
    
    ready= False
    for row in rows:
        if row[0] == True:
            ready = True
        else:
            ready = False
            break
    
    
    #if all tue then we go on
    if ready:
        
        lambda_client = boto3.client('lambda')
        lambda_payload = {"queryStringParameters": {
                         "joinid":joinid
                     }}
        response= lambda_client.invoke(FunctionName='tgether_getitems', 
                     InvocationType='RequestResponse',
                     Payload=json.dumps(lambda_payload))
                     
        
    
    
        items= json.loads(json.loads(response["Payload"].read().decode('utf-8'))["body"])["items"]
        
        for item in items:
            numUsers= len(item["users"]) 
            print(numUsers)
            priceper = float(item["itemprice"]) / numUsers
            print(priceper)
            cursor.execute('Update contractitems set numusers = %s, priceper= %s where itemid = %s and contractid= %s', (numUsers, priceper, item['itemid'],contractId))
            conn.commit()
            cursor.execute('Update contractitemuser set numusers = %s, priceper= %s where itemid = %s and contractid= %s', (numUsers, priceper, item['itemid'],contractId))
            conn.commit()
        
        
        #get all our users, then for each user get totals 
        
        
        cursor.execute("select userid from payers where contractid = '%s'"% contractId)
        userlist= cursor.fetchall()
        
        amountlist=[]
        
        total= float(0) 
        for user in userlist:
            print(user)
            curs = conn.cursor()
            curs.execute("select priceper from contractitemuser where contractid = %s and userid= %s", (contractId, user[0]))
            amts = curs.fetchall()
            for amt in amts:
                total+= amt[0]
                

            curs.execute('Update payers set amount = %s where userid = %s', (total, userid))
            conn.commit()
            
    
            total= float(0)
        
        curs.execute('Update contracts set isready = %s where contractid = %s ', (True, contractId))
        conn.commit()
        
        
        #send sqs message for transactions
        sqsBody ={"contractid":contractId}
        client = boto3.client('sqs')
        
        response= client.send_message(
            QueueUrl= "https://sqs.us-east-1.amazonaws.com/367750083312/Tgetherqueue.fifo",
            MessageBody= json.dumps(sqsBody),
            MessageGroupId="send",
            MessageDeduplicationId = contractId
            )
            
        

    
        
        


        return {
            'statusCode': 200,
            'body': json.dumps({"response": "Ready"}),
            'headers': {
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Methods" : "GET,OPTIONS,POST", 
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token", 
          }
        }
        
    print("we are returning")
    
    
    return {
            'statusCode': 200,
            'body': json.dumps({"response": "NotReady"}),
            'headers': {
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Methods" : "GET,OPTIONS,POST", 
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token", 
          }
        }


