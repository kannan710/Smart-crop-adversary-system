import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from flask import Flask, jsonify, request
from flask_cors import CORS

np.random.seed(42)
TOTAL_ROWS = 350
CROPS = ['Wheat', 'Rice', 'Corn']


def generate_status(ndvi, moisture, temperature):
    score = 0
    
    if ndvi >= 0.75: score += 2
    elif ndvi >= 0.65: score += 1

    if moisture >= 40: score += 2
    elif moisture >= 20: score += 1

    if 24 <= temperature <= 30: score += 2
    elif 20 <= temperature <= 34: score += 1

    if score >= 5:
        return 'Excellent'
    elif score >= 3:
        return 'Good'
    else:
        return 'Average'



df = pd.read_csv("crop_dataset_350_rows.csv")

print("\nDataset Shape:", df.shape)
print(df.head())

df.to_csv("crop_dataset_350_rows.csv", index=False)


df['crop_encoded'] = df['crop'].astype('category').cat.codes
df['status_encoded'] = df['status'].astype('category').cat.codes

status_mapping = dict(enumerate(df['status'].astype('category').cat.categories))
crop_mapping = dict(enumerate(df['crop'].astype('category').cat.categories))

X = df[['ndvi','moisture','temperature','crop_encoded']]
y = df['status_encoded']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

model = RandomForestClassifier(
    n_estimators=150,
    max_depth=8,
    random_state=42
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred, output_dict=True)

feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': model.feature_importances_
}).sort_values(by='Importance', ascending=False)

def predict_crop_health(crop, ndvi, moisture, temperature):
    crop_encoded = list(crop_mapping.values()).index(crop)
    
    sample = pd.DataFrame([{
        'ndvi': ndvi,
        'moisture': moisture,
        'temperature': temperature,
        'crop_encoded': crop_encoded
    }])
    
    pred = model.predict(sample)[0]
    return status_mapping[pred]


# Example prediction
result = predict_crop_health(
    crop='Rice',
    ndvi=0.79,
    moisture=47,
    temperature=29
)

app = Flask(__name__)
CORS(app) 

@app.route("/api/results", methods=["GET"])
def get_results():
    output = {
        "dataset_shape": df.shape,
        "status_mapping": status_mapping,
        "crop_mapping": crop_mapping,
        "model_accuracy": round(accuracy * 100, 2),
        "classification_report": report,
        "feature_importance": feature_importance.to_dict(orient="records"),
        "example_prediction": {
            "crop": "Rice",
            "ndvi": 0.79,
            "moisture": 47,
            "temperature": 29,
            "predicted_status": result
        }
    }

    return jsonify(output)


@app.route("/api/predict", methods=["POST"])
def api_predict():
    data = request.json

    crop = data.get("crop")
    ndvi = float(data.get("ndvi"))
    moisture = float(data.get("moisture"))
    temperature = float(data.get("temperature"))

    prediction = predict_crop_health(crop, ndvi, moisture, temperature)

    return jsonify({
        "crop": crop,
        "moisture": moisture,
        "ndvi": ndvi,
        "status": prediction
    })


if __name__ == "__main__":
    app.run(debug=True)