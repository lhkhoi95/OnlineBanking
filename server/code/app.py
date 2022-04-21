from flask import Flask, jsonify
from flask_restful import Api
from resources.user import UserRegister, UserLogin, UserLogout, User
from resources.bank_account import (
    OpenBankAccount,
    BankAccountList,
    CloseBankAccount,
    WithDraw,
    Deposit,
    TransferMoney,
    )
# from resources.history import TransactionHistory
from resources.test import Test
from flask_jwt_extended import JWTManager
from datetime import timedelta
from resources.test import Test
from db import db
from blocklist import BLOCKLIST
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db' # create data.db file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# JWT-EXTENDED SETUP
app.config["JWT_SECRET_KEY"] = "you-don't-know-this-secret-key-if-you-don't-look-at-it"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)
# Callback function to check if a JWT exists in the BLOCKLIST
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in BLOCKLIST

# Display this message when the user needs to login to get a new access_token.
@jwt.revoked_token_loader
def revoked_token_response(jwt_header, jwt_payload):
    return jsonify(message=f"I'm sorry. You need to login to get a new access_token"), 401 # unauthorized
    
# create the tables
@app.before_first_request
def create_tables():
    db.create_all()

# Endpoints
api.add_resource(UserRegister, '/register') # http://127.0.0.1:5000/register
api.add_resource(UserLogin, '/login') # http://127.0.0.1:5000/login
api.add_resource(UserLogout, '/logout') # http://127.0.0.1:5000/logout
api.add_resource(User, '/user') # http://127.0.0.1:5000/user
api.add_resource(OpenBankAccount, '/openBankAccount') # http://127.0.0.1:5000/openBankAccount
api.add_resource(BankAccountList, '/bankAccounts') # http://127.0.0.1:5000/bankAccounts
# api.add_resource(TransactionHistory, '/history') # http://127.0.0.1:5000/history
api.add_resource(Deposit, '/deposit') # http://127.0.0.1:5000/deposit
api.add_resource(WithDraw, '/withdraw') # http://127.0.0.1:5000/withdraw
api.add_resource(TransferMoney, '/transfer') # http://127.0.0.1:5000/transfer
api.add_resource(CloseBankAccount, '/account') # http://127.0.0.1:5000/account
api.add_resource(Test, '/test') #test route

if __name__ == '__main__':
    db.init_app(app)
    app.run(port=5000, debug=True)