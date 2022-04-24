from db import db
from datetime import datetime
class DeleteAccountModel(db.Model):
    # create delete_accounts table
    __tablename__ = 'delete_accounts'
    id = db.Column(db.Integer(), primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    bank_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    
    def json(self):
        date = self.date.strftime("%m-%d-%Y, %H:%M:%S")
        return {
            'bank_id': self.bank_id,
            'user_id': self.user_id,
            'date': date
        }
        
    # parameterized constructor
    def __init__(self, user_id, bank_id, date):
        self.bank_id = bank_id
        self.user_id = user_id
        self.date = date

    @classmethod
    def find_deleted_accounts_by_user_id(cls, user_id):
        return DeleteAccountModel.query.filter_by(user_id=user_id).all()
    
    def save_to_db(self):
        db.session.add(self)