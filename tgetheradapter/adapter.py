from bridge import Bridge


class Adapter:

    def __init__(self, input):
        self.id = input.get('id', '1')
        self.request_data = input.get('data')
        if self.validate_request_data():
            self.bridge = Bridge()
            self.set_params()
            self.create_request()
        else:
            self.result_error('No data provided')

    def validate_request_data(self):
        if self.request_data is None:
            return False
        if self.request_data == {}:
            return False
        return True

    def set_params(self):
        self.userId = self.request_data.get("userId")
        self.amountPaid = self.request_data.get("amountPaid")
        self.contractId = self.request_data.get("contractId")
    def create_request(self):
        try:
            params = {
                'userId': self.userId,
                'amount': self.amountPaid,
                'contractId': self.contractId,
            }
            base_url = 'https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/markispaid?userId={}&contractId={}&amountPaid={}'.format(self.userId,self.contractId,self.amountPaid)
            response = self.bridge.request(base_url)
            print(base_url)
            print(response.json())


            data = response.json()


            self.result = data['response']
            data['result'] = self.result

            self.result_success(data)
        except Exception as e:
            self.result_error(e)
        finally:
            self.bridge.close()


    def result_success(self, data):
        self.result = {
            'jobRunID': self.id,
            'data': data,
            'result': self.result,
            'statusCode': 200,
        }

    def result_error(self, error):
        self.result = {
            'jobRunID': self.id,
            'status': 'errored',
            'error': f'There was an error: {error}',
            'statusCode': 500,
        }
