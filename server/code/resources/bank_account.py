from security import validate_data
from flask_restful import Resource, reqparse
from models.bank_account import BankAccountModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from datetime import datetime
# private variables for withdraw and deposit
_bank_account_parser = reqparse.RequestParser()
_bank_account_parser.add_argument("id",
                    type=int,
                    required=True,
                    help="bank id cannot be left blank!"
                    )
_bank_account_parser.add_argument("passcode",
                    type=str,
                    required=True,
                    help="passcode cannot be left blank!"
                    )
_bank_account_parser.add_argument("money",
                    type=float,
                    required=True,
                    help="money cannot be left blank!"
                    )


# open a new banking account will require a passcode to be stored in the database.
class OpenBankAccount(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("passcode",
                        type=str,
                        required=True,
                        help="Passcode cannot be left blank!"
                        )
    
    # Open a new banking account
    @classmethod
    @jwt_required()
    def post(cls):
        data = cls.parser.parse_args()
        user_id = get_jwt_identity()
        how_many_accounts = BankAccountModel.get_number_of_accounts_by_user_id(user_id)

        # length of passcode must be 4 and must be digit
        if len(data['passcode']) != 4 or not data['passcode'].isdigit():
            return {'message': 'Must be a 4-digit passcode'}, 400
            
        # no more than 3 banking accounts allowed.
        if how_many_accounts['accounts'] < 3:
            account = BankAccountModel(user_id, data['passcode'])
            account.save_to_db()
        else:
            return {'message': 'You can only open 3 bank accounts'}, 400 # bad request
        
        return {'message': 'Bank account created'}, 201 # created
        


# return all the bank accounts belong to the current user
class BankAccountList(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        user_id = get_jwt_identity()
        # convert objects into list using list comprehension
        return {'bank_accounts': [x.json() for x in BankAccountModel.find_bank_by_user_id(user_id)]} # SELECT * FROM bank_accounts WHERE user_id=user_id

    
# deposit money into account
class Deposit(Resource):
    @classmethod
    @jwt_required()
    def post(cls):

        data = _bank_account_parser.parse_args()
        user_id = get_jwt_identity()
        
        account = BankAccountModel.find_bank_account_by_bank_id(data['id'])
        
        data_check = validate_data(account, data, user_id, type="deposit")
        if data_check[0]['message'] != "data is valid":
            return data_check

        message = account.deposit(data['id'], data['money'])
        return {'message': message[0]['message']}, message[1] # OK or 500
        
# withdraw money from account

class WithDraw(Resource):
    @classmethod
    @jwt_required()
    def post(cls):

        data = _bank_account_parser.parse_args()
        user_id = get_jwt_identity()
        
        account = BankAccountModel.find_bank_account_by_bank_id(data['id'])
        
        data_check = validate_data(account, data, user_id, type="withdraw")
        if data_check[0]['message'] != "data is valid":
            return data_check
        
        message = account.withdraw(data['id'], data['money'])
        return {'message': message[0]['message']}, message[1] # OK or 500

# transfer money from one account to another
class TransferMoney(Resource):
    parser = reqparse.RequestParser()
    # bank id from the sender
    parser.add_argument("id",
                        type=int,
                        required=True,
                        help="bank id cannot be left blank!"
                        )
    parser.add_argument("passcode",
                    type=str,
                    required=True,
                    help="passcode cannot be left blank!"
                    )
    parser.add_argument("money",
                        type=float,
                        required=True,
                        help="money cannot be left blank!"
                        )
    parser.add_argument("recipient_email",
                        type=str,
                        required=True,
                        help="recipient_email cannot be left blank!"
                        )
    
    @classmethod
    @jwt_required()
    def post(cls):
        data = TransferMoney.parser.parse_args()
        user_id = get_jwt_identity()
        
        # find the sender bank accounts with associated bank id
        sender_account = BankAccountModel.find_bank_account_by_bank_id(data['id'])
        
        message = validate_data(sender_account, data, user_id, type="withdraw")
        if message[0]['message'] != "data is valid":
            return message
    
        # find recipient's first bank id
        recipient_first_account = BankAccountModel.find_the_first_bank_id(data['recipient_email'])
        
        # if not found, return the associated message.
        if recipient_first_account[1] != 302:
            return {'message' : recipient_first_account[0]['message']}, recipient_first_account[1]
        
        message = sender_account.transfer(recipient_first_account[0], data['money']) # transfer money from sender to recipient

        return {'message': message[0]['message']}, message[1] # OK or 500

# close a banking account will require bank_id and passcode
class CloseBankAccount(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("id",
                        type=int,
                        required=True,
                        help="bank id cannot be left blank!"
                        )
    parser.add_argument("passcode",
                    type=str,
                    required=True,
                    help="passcode cannot be left blank!"
                    )

    @classmethod
    @jwt_required()
    def delete(cls):
        data = CloseBankAccount.parser.parse_args()
        user_id = get_jwt_identity()
        
        account = BankAccountModel.find_bank_account_by_bank_id(data['id'])

        data_check = validate_data(account, data, user_id, type="")
        if data_check[0]['message'] != "data is valid":
            return data_check
        
        message = account.close_this_account(data['id'])
        return {'message': message[0]['message']}, message[1] # OK or 500

