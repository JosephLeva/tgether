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
    
    body= json.loads(event["body"])
    
    
    
    userid= body["userid"]
    
    if "address" in body:
        address = body["address"]
    else:
        address = None
    
    if "isjoin" in body:
        if body["isjoin"] == False:
            isjoin= False
        else:
            isjoin = True
    else:
        isjoin= True
    
    print(isjoin)

    
    conn = psycopg2.connect(host=host,
                        port='5432',
                        user= username,
                        password=password,
                        database=dbname) 

    cursor = conn.cursor()
    cursor.execute("Select * from usersettings where userid= '%s'"% userid)
    row = cursor.fetchone()
    print(row)

    if row == None:
        print("insert")
        cursor = conn.cursor()
        cursor.execute( "INSERT INTO usersettings (userid, address, isjoin) VALUES (%s,%s,%s)", ( userid, address, isjoin))
        conn.commit()
    
    else:
        print("update")
        
        cursor.execute('Update usersettings set address = %s , isjoin= %s where userid = %s', (address, isjoin, userid))
        conn.commit()
        
    

    


    

        
    
    
    
            
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps({"address": address, "isjoin": isjoin
            
        }),
        'headers': {
        "Access-Control-Allow-Origin" : "*", 
        "Access-Control-Allow-Methods" : "GET,OPTIONS,POST", 
        "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token", 
      }
    }


