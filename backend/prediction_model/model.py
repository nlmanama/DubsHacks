import pandas as pd
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import pickle

data = pd.read_csv('data_moods.csv')
col_feats = ['danceability', 'acousticness', 'energy', 'instrumentalness',
            'liveness', 'valence', 'loudness', 'speechiness']
X = data[col_feats]
y = data['mood']

X = MinMaxScaler().fit_transform(X)

rf = RandomForestClassifier()
rf.fit(X, y)

pickle.dump(rf, open('model.pkl', 'wb'))
