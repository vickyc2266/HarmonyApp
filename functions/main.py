# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app
from firebase_admin import firestore
import json
import datetime

app = initialize_app()
db = firestore.client()

# Define a custom function to serialize datetime objects 
def serialize_datetime(obj): 
    if isinstance(obj, datetime.datetime): 
        return obj.isoformat() 
    raise TypeError("Type not serializable") 
  
@https_fn.on_request(region="europe-west1")
def api(req: https_fn.Request) -> https_fn.Response:
    data = []
    match req.path:
        case "/mismatches":
            docs = db.collection("mismatches").stream()
            for doc in docs:
                d = doc.to_dict()
                d["fbid"] = doc.id
                data.append(d)
        case "/shares":
            match req.method:
                case "POST":
                    payload = req.json
                    update_time, share_ref = db.collection("imports").add(payload)
                    return https_fn.Response(json.dumps({"share_id": share_ref}), mimetype="application/json")
                case "GET":
                    share_id = req.args.get('id')
                    doc = db.collection("imports").document(share_id).get()
                    return https_fn.Response(json.dumps(doc), mimetype="application/json")
        case "/harmonisations":
            docs = db.collection("harmonisations").stream()
            for doc in docs:
                d = doc.to_dict()
                d["fbid"] = doc.id
                data.append(d)
        case "/ratings":
            docs = db.collection("ratings").stream()
            for doc in docs:
                d = doc.to_dict()
                d["fbid"] = doc.id
                data.append(d)
        case _ :
            data.append("No such end point " + req.path )
    return https_fn.Response(json.dumps(data, default=serialize_datetime), mimetype="application/json")