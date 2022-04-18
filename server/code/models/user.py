from db import db

# extends the Model class in SQLAlchemy
class UserModel(db.Model):
    # create users table
    __tablename__ = 'users'
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(25),nullable=False,unique=True)
    password = db.Column(db.String())
    email = db.Column(db.String(62), unique=True, nullable=False)
    first_name = db.Column(db.String())
    last_name = db.Column(db.String())
    bank_accounts = db.relationship(
        'BankAccountModel',
        back_populates='user',
        cascade="all, delete",
        passive_deletes=True
    )
     
    def json(self):
        return {
            'user_id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name
            }
    
    # parameterized constructor
    def __init__(self, username, password, email, first_name, last_name):
        self.username = username
        self.password = password
        self.email = email
        self.first_name = first_name
        self.last_name = last_name

    # add a new user to database
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
    
    @classmethod
    def find_by_username(cls, username):
        # SELECT * FROM users WHERE username=username LIMIT 1
        return cls.query.filter_by(username=username).first()
        
    @classmethod
    def find_by_email(cls, email):
        # SELECT * FROM users WHERE username=username LIMIT 1
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_id(cls, _id):
        # SELECT * FROM users WHERE username=username LIMIT 1
        return cls.query.filter_by(id=_id).first()