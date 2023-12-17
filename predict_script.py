import joblib
import sys
import json
import os, sys
# Load the machine learning model from the pickle file
model = joblib.load('D:\React projects\Fy Hr Forcast\hr forcast backend\Models\scaler.pkl')

# Get input data from command line arguments
input_data = json.loads(sys.argv[1])

# Perform prediction
prediction_result = model.predict([input_data])[0]

# Print the prediction result
print("hsx",json.dumps(input_data))