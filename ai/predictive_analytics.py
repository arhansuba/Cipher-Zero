# ai/predictive_analytics.py

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

class PredictiveAnalytics:
    def __init__(self, data):
        """
        Initialize the PredictiveAnalytics class with a dataset.
        
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
        Train a linear regression model on the preprocessed data.
        """
        self.model = LinearRegression()
        self.model.fit(self.X_train, self.y_train)

    def evaluate_model(self):
        """
        Evaluate the trained model using mean squared error.
        
        :return: Mean squared error of the model.
        """
        if not self.model:
            raise ValueError("Model has not been trained yet.")
        y_pred = self.model.predict(self.X_test)
        mse = mean_squared_error(self.y_test, y_pred)
        return mse

    def predict(self, new_data):
        """
        Predict outcomes using the trained model.
        
        :param new_data: A DataFrame with new data to predict.
        :return: Predictions for the new data.
        """
        if not self.model:
            raise ValueError("Model has not been trained yet.")
        return self.model.predict(new_data)
