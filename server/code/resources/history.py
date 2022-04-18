from flask_restful import Resource, reqparse

class HistoryTransaction(Resource):
    parser = reqparse.RequestParser()

    parser.add_argument(
        "id",
        type=int,
        required=True,
        help="bank id cannot be left blank!"
    )
    
    