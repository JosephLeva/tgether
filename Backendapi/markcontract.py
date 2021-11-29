import json
import boto3
import base64
import urllib3
import codecs
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

    
    
    userId= json.loads(event["body"])["userid"]
    print(username)

    
    conn = psycopg2.connect(host=host,
                        port='5432',
                        user= username,
                        password=password,
                        database=dbname) 
    
    
    request="https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    http = urllib3.PoolManager()
    r = http.request('GET',request, headers={
        "Accept":"*/*",
        "Accept-Encoding":"gzip,deflate,br",
        "Connection": "keep-alive"
    })
    
    data= r.data.decode('ISO-8859-1')
    
    #wow this stinks but idk why json.loads is not working
    
    print(data)
    val= data.split("usd\":")
    val= val[1].split('}')[0]
    val = float(val)
    
                        
    cursor = conn.cursor()
    cursor.execute("INSERT INTO contracts (userid, ethval) VALUES (%s, %s)", (userId, val))
    conn.commit()
    cursor = conn.cursor()
    cursor.execute("select * from contracts where userid='%s' order by joinid desc"% userId)
    row = cursor.fetchone()
    
    retContractId= row[0]
    retUserId= row[1]
    retJoinId=row[2]
    print(retContractId,retUserId,retJoinId)
    
    
    cursor.execute("Select address, isjoin from usersettings where userid= '%s'"% retUserId)
    row = cursor.fetchone() 
    
    address=""
    isjoin= bool()
    if row != None:
        address= row[0]
        isjoin= row[1]
        if isjoin == True:
        
            cursor.execute( "INSERT INTO payers (contractid, userid, address) VALUES (%s, %s, %s)",(retContractId, retUserId, address))
            conn.commit()
            
    
    
        
    
    
            
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps({
            'contractId': retContractId,
            'userId': retUserId,
            'joinId': retJoinId,
        }),
        'headers': {
        "Access-Control-Allow-Origin" : "*", 
        "Access-Control-Allow-Methods" : "GET,OPTIONS,POST", 
        "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token", 
      }
    }

