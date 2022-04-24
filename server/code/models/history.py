from db import db
from datetime import datetime
class TransactionHistoryModel(db.Model):
    # create transaction table
    __tablename__ = 'transaction_history'
    id = db.Column(db.Integer(), primary_key=True)
    transfer_amount = db.Column(db.String(), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    bank_id = db.Column(db.Integer, db.ForeignKey('bank_accounts.id', ondelete="CASCADE"), nullable=False)
    url = db.Column(db.String)
    # in kid's class, parent = db.relationship('ParentModel', "kids")
    bank_account = db.relationship('BankAccountModel', back_populates="transactions")


    def json(self):
        date = self.date.strftime("%m-%d-%Y, %H:%M:%S")
        return {
            'bank_id': self.bank_id,
            'transfer_amount': self.transfer_amount,
            'date': date,
            'url' : self.url
        }
        
    # parameterized constructor
    def __init__(self, bank_id, transfer_amount, date, url=""):
        self.bank_id = bank_id
        self.transfer_amount = transfer_amount
        self.date = date
        self.url = url
        
    # retrieve all transaction histories with user_id    
    @classmethod
    def find_by_user_id(cls, user_id):       
        return TransactionHistoryModel.query.filter_by(user_id=user_id).all()

    @classmethod
    def find_by_bank_id(cls, bank_id):
        return TransactionHistoryModel.query.filter_by(bank_id=bank_id).all()
    
    def save_to_db(self):
        #self.id = "hehe"
        db.session.add(self)
