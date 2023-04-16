from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import cross_val_score
from sklearn.metrics import accuracy_score
import numpy as np
import json
import dump

X_train = np.load('X_train.npy')
y_train = np.load('y_train.npy')
print('X_train:{0}, y_train:{1}'.format(X_train.shape, y_train.shape))

clf = RandomForestClassifier()
print('Cross Validation Score: {0}'.format(np.mean(cross_val_score(clf, X_train, y_train, cv=10))))

clf.fit(X_train, y_train)

X_test = np.load('X_test.npy')
y_test = np.load('y_test.npy')

pred = clf.predict(X_test)
print('Accuracy: {}'.format(accuracy_score(y_test, pred)))

json.dump(dump.forest_to_json(clf), open('../model/classifier.json', 'w'))

