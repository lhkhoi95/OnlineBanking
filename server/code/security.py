import hashlib
from models.bank_account import BankAccountModel
def hash_password(pw):
    salt = "5gz"
    db_password = pw + salt
    h = hashlib.md5(db_password.encode())
    return h.digest()

# Validate data for a bank account.
def validate_data(account, data, user_id, type):
    if account is None:
        return {'message': 'Bank id does not exist in database'}, 404 # not found
    
    # check if user has at least one banking account to deposit/withdraw
    how_many_accounts = BankAccountModel.get_number_of_accounts_by_user_id(user_id)
    if how_many_accounts['accounts'] == 0:
        return {'message': f'You must open at least one banking account to'}, 400 # bad request
    
    # check if bank_id belong to this user
    bankID_list = account.get_list_of_bank_ids(user_id) # return a list of tuples
    if (data['id'],) not in bankID_list:
        return {'message': 'This bank id does not belong to this user'}, 400 # bad request
    
    # check if withdrawal amount is greater than 0 and less than or equal to balance.
    if type == "withdraw" and (data['money'] < 0 or data['money'] > account.balance):
            return {'message': 'Withdraw amount is greater than balance'}, 400 # bad request
    
    # check if deposit amount is less than 0.
    if type == "deposit" and data['money'] <=0:
            return {'message': 'Cannot deposit negative amount'}, 400 # bad request
    
    # check if passcode is correct
    if account.passcode != data['passcode']:
        return {'message': 'Incorrect passcode'}, 400 # bad request
    
    return {'message': 'data is valid'}, 200