from flask_restful import Resource
from flask_jwt_extended import get_jwt_identity, jwt_required
from models.delete_record import DeleteAccountModel

class DeleteHistory(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        user_id = get_jwt_identity()
        return {"deleted_accounts" : [x.json() for x in DeleteAccountModel.find_deleted_accounts_by_user_id(user_id)]}


    