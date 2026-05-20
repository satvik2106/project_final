# app.py
import os
from flask import Flask, request, jsonify
import cv2
import numpy as np

app = Flask(__name__)

# Constants
# Use relative path instead of D:/New/model
MODEL_PATH = os.environ.get("MODEL_PATH", os.path.join(os.path.dirname(__file__), "model"))
IMG_HEIGHT, IMG_WIDTH = 128, 128

# Gracefully load model
model = None
try:
    from tensorflow.keras.models import load_model
    if os.path.exists(MODEL_PATH):
        model = load_model(MODEL_PATH)
        print(f"Successfully loaded model from {MODEL_PATH}")
    else:
        print(f"WARNING: Model path {MODEL_PATH} does not exist.")
except Exception as e:
    print(f"WARNING: Failed to load model from {MODEL_PATH}. Error: {e}")

def preprocess_image(file_path):
    img = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (IMG_WIDTH, IMG_HEIGHT))
    img = img / 255.0
    img = img.reshape(1, IMG_HEIGHT, IMG_WIDTH, 1)  # Add batch & channel
    return img

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'ML Model not loaded on server. Please upload model to ' + MODEL_PATH}), 503
        
    uploaded_file = request.files.get('file') or request.files.get('verifying_signature')
    if not uploaded_file:
        return jsonify({'error': 'No file uploaded. Make sure to send file or verifying_signature.'}), 400
        
    temp_dir = 'temp'
    os.makedirs(temp_dir, exist_ok=True)
    uploaded_path = os.path.join(temp_dir, uploaded_file.filename)
    uploaded_file.save(uploaded_path)

    # Process image
    img = preprocess_image(uploaded_path)
    prediction = model.predict(img)
    predicted_class = np.argmax(prediction)  # 0 = Forged, 1 = Genuine

    os.remove(uploaded_path)  # Cleanup
    result = "Genuine" if predicted_class == 1 else "Forged"
    # Note: Returning dict with 'result' and 'similarity' to match VerificationPage.js expectations
    similarity = float(np.max(prediction)) # Get confidence/similarity
    return jsonify({'result': result, 'similarity': similarity})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
