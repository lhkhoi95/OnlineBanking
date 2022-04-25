from flask_restful import Resource
from flask_jwt_extended import get_jwt_identity, jwt_required
from models.history import TransactionHistoryModel
from models.bank_account import BankAccountModel
class TransacionHistory(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        user_id = get_jwt_identity()
        # get bank id list by user id
        ids_list = BankAccountModel.get_list_of_all_bank_ids(user_id)
        history = []
        for bank_id in ids_list:
            transactions = TransactionHistoryModel.find_by_bank_id(bank_id[0])
            for t in transactions:
                history.append(t.json())
        return {"transactions" : history}
        # get transaction with corresponding to those bank_ids

    