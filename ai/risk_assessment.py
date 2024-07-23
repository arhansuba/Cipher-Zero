# ai/risk_assessment.py

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

class RiskAssessment:
    def __init__(self, data):
        """
        Initialize the RiskAssessment class with a dataset.
        
        :param data: A Pandas DataFrame containing the dataset.
        """
        self.data = data
        self.model = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None

    def preprocess_data(self, target_column):
        """
        Preprocess the data for modeling.
        
        :param target_column: The name of the column to predict.
        """
        X = self.data.drop(columns=[target_column])
        y = self.data[target_column]
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    def train_model(self):
        """
        Train a logistic regression model on the preprocessed data.
        """
        self.model = LogisticRegression(max_iter=1000)
        self.model.fit(self.X_train, self.y_train)

    def evaluate_model(self):
        """
        Evaluate the trained model using accuracy score and classification report.
        
        :return: A tuple containing accuracy score and classification report.
        """
        if not self.model:
            raise ValueError("Model has not been trained yet.")
        y_pred = self.model.predict(self.X_test)
        accuracy = accuracy_score(self.y_test, y_pred)
        report = classification_report(self.y_test, y_pred)
        return accuracy, report

    def predict(self, new_data):
        """
        Predict outcomes using the trained model.
        
        :param new_data: A DataFrame with new data to predict.
        :return: Predictions for the new data.
        """
        if not self.model:
            raise ValueError("Model has not been trained yet.")
        return self.model.predict(new_data)
