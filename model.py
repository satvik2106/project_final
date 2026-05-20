import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import load_model
from sklearn.metrics import classification_report, confusion_matrix
import tensorflow as tf
import matplotlib.pyplot as plt

# Constants
IMG_HEIGHT, IMG_WIDTH = 128, 128
DATA_PATH = r"D:\New"
EPOCHS = 45
BATCH_SIZE = 32
MODEL_SAVE_PATH = r"D:\New\model"

# Load and preprocess the dataset
# Ensure the DATA_PATH is correct
DATA_PATH = "D:/Signature"  # Adjust this to your actual directory

# Load and preprocess the dataset
def load_images():
    images, labels = [],[]
    for category in ['genuine', 'forged']:
        path = os.path.join(DATA_PATH, category)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Path does not exist: {path}")

        for filename in os.listdir(path):
#             print(f"Processing file: {filename}")
            id_owner = filename.split('-')[1][:3]
            id_signer = filename.split('-')[1][5:8]
            label = 1 if id_owner == id_signer else 0

            img = cv2.imread(os.path.join(path, filename), cv2.IMREAD_GRAYSCALE)
            img = cv2.resize(img, (IMG_WIDTH, IMG_HEIGHT))
            img = img / 255.0
            images.append(img)
            labels.append(label)

    images = np.array(images).reshape(-1, IMG_HEIGHT, IMG_WIDTH, 1)
    labels = np.array(labels)
    return images, labels


# Load the dataset
X, y = load_images()
y = to_categorical(y, num_classes=2)

# Split the dataset
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

print(f"Training set shape: {X_train.shape}, Testing set shape: {X_test.shape}")

# Build the CNN model
def build_model():
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=(IMG_HEIGHT, IMG_WIDTH, 1)),
        MaxPooling2D((2, 2)),
        Dropout(0.25),
        
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Dropout(0.25),
        
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Dropout(0.25),
        
        Flatten(),
        Dense(128, activation='relu'),
        Dropout(0.5),
        Dense(1, activation='sigmoid') 
    ])
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

# Create and train the model
model = build_model()
history = model.fit(X_train, y_train, epochs=EPOCHS, batch_size=BATCH_SIZE, validation_data=(X_val, y_val))

# Save the trained model
model.save(MODEL_SAVE_PATH)
print("Model saved successfully.")

# Evaluate the model



test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Accuracy: {test_accuracy * 100:.2f}%")
print(f"Test Loss: {test_loss:.4f}")

# Generate classification report and confusion matrix
y_pred = model.predict(X_test)
y_pred_classes = np.argmax(y_pred, axis=1)
y_true_classes = np.argmax(y_test, axis=1)

print("\nClassification Report:")
print(classification_report(y_true_classes, y_pred_classes, target_names=["Forged", "Genuine"], zero_division=1))

print("\nConfusion Matrix:")
print(confusion_matrix(y_true_classes, y_pred_classes))

# Function to preprocess and predict a single signature
def predict_signature(file_path):
    img = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (IMG_WIDTH, IMG_HEIGHT))
    img = img / 255.0
    img = img.reshape(1, IMG_HEIGHT, IMG_WIDTH, 1)  # Add batch and channel dimensions

    prediction = model.predict(img)
    predicted_class = np.argmax(prediction)  # 0 for forged, 1 for genuine

    if predicted_class == 1:
        return "Genuine ✔"
    else:
        return "Forged ✘"

# Test prediction on a new signature
test_image_path = r"C:\Users\vajra\Downloads\sig1.jpg"

# Read the image (color or grayscale)
image1 = cv2.imread(test_image_path, cv2.IMREAD_COLOR)  # For color image
# gray_image = cv2.imread(test_image_path, cv2.IMREAD_GRAYSCALE)  # For grayscale image

# Convert BGR (OpenCV default) to RGB for Matplotlib
image_uploaded = cv2.cvtColor(image1, cv2.COLOR_BGR2RGB)

# Display the images
plt.figure(figsize=(10, 5))

# Display the color image
plt.subplot(1, 2, 1)
plt.imshow(image_uploaded)
plt.title("Uploaded Image")
plt.axis("off")

image_stored_path=r"D:\New\genuine\IMG-20241202.jpg"
image2 = cv2.imread(image_stored_path, cv2.IMREAD_COLOR)  # For color image
# Convert BGR (OpenCV default) to RGB for Matplotlib
image_stored = cv2.cvtColor(image2, cv2.COLOR_BGR2RGB)
plt.subplot(1, 2, 2)
plt.imshow(image_stored)
plt.title("Stored Image")
plt.axis("off")

# Display the grayscale image

result = predict_signature(test_image_path)
print(f"The tested signature is classified as: {result}")
