from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from db import db

class CreateTable(db.Model):
    __tablename__= 'test'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Integer)
    
    def __init__(self, value):
        self.value = value
        
    def json(self):
        return {
            'value': self.value
        }    
    @classmethod
    def get_value(cls):
        return cls.query.all()
    
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class Test(Resource):
    __tablename__ = ''
    parser = reqparse.RequestParser()
    # bank id from the sender
    parser.add_argument("incoming_value",
                        type=int,
                        required=True,
                        help="incoming_value cannot be left blank!"
                        )
    @classmethod
    # @jwt_required()
    def get(cls):
        return {'message': 'hello world'}

    @classmethod
    def post(cls):
        data = cls.parser.parse_args()
        
        test = CreateTable(data['incoming_value'])
        test.save_to_db()
        
        return {'value in db =': [x.json() for x in test.get_value()]}
        