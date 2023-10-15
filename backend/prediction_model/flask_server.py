from pymongo import MongoClient
from flask import Flask
from flask import request
import numpy as np
import pandas as pd
import pickle

uri = 'mongodb+srv://chiphamthilan:peppy1720@cluster0.qh02ino.mongodb.net/?retryWrites=true&w=majority'
app = Flask(__name__)
model = pickle.load(open('model.pkl', 'rb'))

client = MongoClient(uri)
db = client.curd
myCollection = db.myColl

@app.route('/predict', methods=['POST'])
def get_prediction():
    df = request.json
    df = pd.json_normalize(df)
    col_feats = ['danceability', 'acousticness', 'energy', 'instrumentalness',
                'liveness', 'valence', 'loudness', 'speechiness']
    X = df[col_feats]
    preds = model.predict(X)
    happy = 0
    sad = 0
    calm = 0
    energetic = 0
    for i in preds:
        if i == 'Happy':
            happy+=1
        elif i == 'Sad':
            sad+=1
        elif i == 'Calm':
            calm+=1
        else:
            energetic+=1
    n = len(preds)
    # toInsert = {'_id': 0, 'Happy': happy/n, 'Sad': sad/n, 'Calm': calm/n, 'Energetic': energetic/n }
    # x = myCollection.insert_one(toInsert)
    myquery = {'_id': 0}
    newvalues = {"$set": {'Happy': happy/n, 'Sad': sad/n, 'Calm': calm/n, 'Energetic': energetic/n }}
    myCollection.update_one(myquery, newvalues)
    x = 'updated'
    return "Prediction Outputted!"

if __name__ == "__main__":
    app.run(port=8000, debug=True)