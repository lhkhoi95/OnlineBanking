from flask_restful import Resource, reqparse

class TransacionHistory(Resource):
    parser = reqparse.RequestParser()

    parser.add_argument(
        "id",
        type=int,
        required=True,
        help="bank id cannot be left blank!"
    )
    
    