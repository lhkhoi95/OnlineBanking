from re import T
from db import db
from models.user import UserModel
from models.history import TransactionHistoryModel
from datetime import datetime

class BankAccountModel(db.Model):
    # create bank_accounts table
    __tablename__ = 'bank_accounts'
    id = db.Column(db.Integer(), primary_key=True)
    balance = db.Column(db.Float(precision=2))
    passcode = db.Column(db.String(), nullable=False) # allow 0001 to be stored in the DB
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id', ondelete="CASCADE"))
    user = db.relationship('UserModel')
    
    # in parent class, kids = db.relationship('KidModel', parent)
    transactions = db.relationship(
        'TransactionHistoryModel',
        back_populates="bank_account",
        passive_deletes=True
    )
    
    # show BankAccount balance
    def json(self):
        return {
                'id': self.id, 
                'user_id': self.user_id,
                'balance': self.balance
        }
    
    def __init__(self, user_id, passcode, balance=0):
        self.user_id = user_id
        self.balance = balance
        self.passcode = passcode
        
    def deposit(self, bank_id, money):
        try:
            # retrieve account with given bank_id
            account = BankAccountModel.query.get(bank_id)
            # update balance
            account.balance += money
            # add to transaction history
            transaction_history = TransactionHistoryModel(bank_id, f"+{money}", datetime.now())

            transaction_history.save_to_db()
            db.session.commit()
            return {'message': 'Transaction complete'}, 200
        except:
            db.session.rollback()
            return {'message': 'Cannot deposit due to Internal Server Error'}, 500 # Internal Server Error
        
    def withdraw(self, bank_id, money):
        # retrieve account with given bank_id
    
        account = BankAccountModel.query.get(bank_id)
        try:
            # update balance
            account.balance -= money
            # add to transaction history
            transaction_history = TransactionHistoryModel(bank_id, f"-{money}", datetime.now())
            transaction_history.save_to_db()
            db.session.commit()
            return {'message': 'Transaction complete'}, 200
        except:
            db.session.rollback()
            return {'message': 'Cannot withdraw due to Internal Server Error'}, 500 # Internal Server Error
        
    def transfer(self, recipient_account, money):
        try:
            # withdraw money from the sender and add to transaction history
            self.balance -= money
            transaction_history = TransactionHistoryModel(self.id, f"-{money}", datetime.now())
            transaction_history.save_to_db()

            # deposit money to the recipient and add to transaction history
            recipient_account.balance += money
            transaction_history = TransactionHistoryModel(recipient_account.id, f"+{money}", datetime.now())
            transaction_history.save_to_db()

            db.session.commit()
            return {'message': 'Transaction complete'}, 200
        except:
            db.session.rollback() # to rollback all the changes.
            return {'message': 'Internal Server Error'}, 500 # Internal Server Error
    
    def close_this_account(self, bank_id):
        # delete all transaction histories associated with this bank_id
        transcations = TransactionHistoryModel.find_by_bank_id(bank_id)
        try:
            if transcations:
                for transaction in transcations:
                    db.session.delete(transaction)
                    db.session.flush()
            # close the bank account associated with this bank_id
            account = self.query.filter_by(id=bank_id).first()
            db.session.delete(account)
            db.session.commit()
            return {'message': f"Successfully deleted"}, 200 # OK
        except:
            db.session.rollback()
            return {'message': 'Internal Server Error'}, 500 # Internal Server Error
    
    @classmethod
    def get_number_of_accounts_by_user_id(cls, user_id):
        accountList = [x.json() for x in BankAccountModel.query.filter_by(user_id=user_id)]
        return {'accounts': len(accountList)}

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
    
    @classmethod
    def find_the_first_bank_id(cls, email):
        # retrieve user with the email
        recipient = UserModel.find_by_email(email)
        if recipient is None:
            return {'message': 'Cannot find a user associated with this email'}, 404 # not found
        
        # Find the first banking account.
        how_many_accounts = BankAccountModel.get_number_of_accounts_by_user_id(recipient.id)
        if how_many_accounts['accounts'] == 0:
            return {'message': 'The recipient has not yet opened a banking account'}, 404 # not found
        
        # get first account
        recipient_accounts = BankAccountModel.find_bank_accounts_by_user_id(recipient.id)
        recipient_first_account = BankAccountModel.find_bank_account_by_bank_id(recipient_accounts[0].id)
        return recipient_first_account, 302 # found
    
    @classmethod
    def find_bank_account_by_bank_id(cls, bank_id):
        return BankAccountModel.query.filter_by(id=bank_id).first()
    
    @classmethod
    def find_bank_accounts_by_user_id(cls, user_id):
        return BankAccountModel.query.filter_by(user_id=user_id).all()

    # return a list of tuples, each tuple contains a bank_id
    @classmethod
    def get_list_of_bank_ids(cls, user_id):
        return BankAccountModel.query.with_entities(
                                BankAccountModel.id).filter_by(user_id=user_id).all()
        
    @classmethod
    def find_bank_by_user_id(cls, user_id):
        return BankAccountModel.query.filter_by(user_id=user_id).all()

