from flask_restful import Resource, reqparse
from models.user import UserModel
from models.bank_account import BankAccountModel
from security import hash_password
from flask import render_template, redirect
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    jwt_required,
    get_jwt_identity
)
from blocklist import BLOCKLIST

# retrieve user's information
class User(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        user_id = get_jwt_identity()
        user = UserModel.find_by_id(user_id)

        return user.json(), 200

    
class UserRegister(Resource):
    # username, password, and email address, first name, last name, 
    parser = reqparse.RequestParser()
    parser.add_argument("username",
                        type=str,
                        required=True,
                        help="username cannot be left blank!"
                        )
    parser.add_argument("password",
                        type=str,
                        required=True,
                        help="Password cannot be left blank!"
                        )
    parser.add_argument("email",
                    type=str,
                    required=True,
                    help="Email address cannot be left blank!"
                    )
    parser.add_argument("first_name",
                        type=str,
                        required=True,
                        help="First name cannot be left blank!"
                        )
    parser.add_argument("last_name",
                        type=str,
                        required=True,
                        help="Last name cannot be left blank!"
                        )
    
    # add a new user to the database
    def post(cls):
        data = UserRegister.parser.parse_args()
        
        # hash the password
        data['password'] = hash_password(data['password'])
        
        # duplicate username
        if UserModel.find_by_username(data['username']):
            return {"message": "This username already exists"}, 400 # bad request from client
        
        # email was used to register
        if UserModel.find_by_email(data['email']):
            return {"message": "Email already in used"}, 400 # bad request from client
        
        # pass the information into the UserModel class.
        user = UserModel(**data)
        # save this user to the data base
        user.save_to_db()
        
        return {"Message": "User created successfully"}, 201 # created

class UserLogin(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("username",
                        type=str,
                        required=True,
                        help="username cannot be left blank!"
                        )
    parser.add_argument("password",
                        type=str,
                        required=True,
                        help="Password cannot be left blank!"
                        )

    @classmethod
    def post(cls):
        # parse data
        data = UserLogin.parser.parse_args()

        hash_pw = hash_password(data['password'])
        
        user = UserModel.find_by_username(data['username'])

        if user is None:
            return {'message': 'username does not exist'}, 404 # user not found
        if user.password != hash_pw:
            return {'message': 'Incorrect password'}, 400 # bad request
        access_token = create_access_token(identity=user.id)
        return {'access_token': access_token}


        # account =  {
        #     'user_identity': user.json(),
        #     'bank_accounts': [x.json() for x in BankAccountModel.find_bank_accounts_by_user_id(session['user_id'])]} # SELECT * FROM bank_accounts WHERE user_id=session['user_id']
        #return {'bank_accounts': account}
        #return render_template('profile.html', user_id=user.id)
        # return redirect('/test')

class UserLogout(Resource):
    @classmethod
    @jwt_required()
    def post(cls):
        jti = get_jwt()["jti"]
        BLOCKLIST.add(jti)
        return {'message': 'logged out'}