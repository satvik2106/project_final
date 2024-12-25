import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.preprocessing import image
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
import matplotlib.pyplot as plt
import cv2
import base64
import os
from pymongo import MongoClient

# MongoDB connection
mongo_client = MongoClient("mongodb+srv://satvikvattipalli1311:8I4SOudfJO8n8fIp@signare.w1j4f.mongodb.net/?retryWrites=true&w=majority&appName=Signare")
db = mongo_client.test
collection = db.accounts

# Load the pre-trained model
<<<<<<< HEAD
model_path = os.path.join(os.path.dirname(__file__), '../Signature_verification(DL model).h5')
trained_model = load_model(model_path)
=======
trained_model = load_model("../Signature_verification(DL model).h5")

>>>>>>> e1bfd445ff420f14508e4882b9e97fd2af8ff77a
# Create Flask app
app = Flask(__name__)
CORS(app)

# Function to retrieve and store the signature in a file
def retrieve_and_store_signature(account_number):
    record = collection.find_one({"accountNumber": str(account_number)})
    if record and "image" in record:
        signature_data = record["image"]
        if isinstance(signature_data, str):  # Decode base64 string
            signature_data = base64.b64decode(signature_data)
        stored_signature = np.frombuffer(signature_data, dtype=np.uint8)
        stored_signature = cv2.imdecode(stored_signature, cv2.IMREAD_GRAYSCALE)
        stored_signature = cv2.resize(stored_signature, (256, 256))  # Resize for consistency

        # Save the stored signature to a file
        stored_signature_path = "stored_signature.jpg"
        cv2.imwrite(stored_signature_path, stored_signature)

        return stored_signature_path
    else:
        raise ValueError("Signature not found in the database.")

# Feature extraction model
def create_advanced_embedding_model(trained_model):
    feature_extractor = Model(inputs=trained_model.inputs, outputs=trained_model.layers[-8].output)
    return feature_extractor

feature_extractor = create_advanced_embedding_model(trained_model)

# Image preprocessing function
def preprocess_image(image_path):
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    return img_array

# Signature verification endpoint
@app.route('/api/signature/verify', methods=['POST'])
def verify_signature():
    try:
        account_number = request.form['account_number']
        verifying_signature_file = request.files['verifying_signature']

        # Retrieve and save the stored signature
        stored_signature_path = retrieve_and_store_signature(account_number)

        # Save the verifying signature temporarily
        verifying_signature_path = "verifying_signature.jpg"
        verifying_signature_file.save(verifying_signature_path)

        # Preprocess images
        stored_image = preprocess_image(stored_signature_path)
        verifying_image = preprocess_image(verifying_signature_path)

        # Extract embeddings
        stored_embedding = feature_extractor.predict(stored_image).flatten()
        verifying_embedding = feature_extractor.predict(verifying_image).flatten()

        # Calculate cosine similarity
        similarity = cosine_similarity([stored_embedding], [verifying_embedding])[0][0]

        # Threshold for decision
        threshold = 0.8
        result = "Genuine" if similarity > threshold else "Forged"

        return jsonify({"similarity": float(similarity), "result": result})

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
