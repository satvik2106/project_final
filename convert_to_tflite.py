"""
Convert the full Keras .h5 model to a TFLite model for the feature extractor.
This creates a much smaller runtime footprint (~5MB vs ~400MB for full TensorFlow).
"""
import os
import numpy as np
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

from tensorflow.keras.models import Model, load_model
import tensorflow as tf

# Load the original model
model_path = os.path.join('backend', 'deeplearning', 'Signature_verification(DL model).h5')
print(f"Loading model from {model_path}...")
trained_model = load_model(model_path)

# Create the feature extractor (same as verify_signature.py)
feature_extractor = Model(inputs=trained_model.inputs, outputs=trained_model.layers[-8].output)
print(f"Feature extractor created. Input shape: {feature_extractor.input_shape}, Output shape: {feature_extractor.output_shape}")

# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(feature_extractor)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# Save
output_path = os.path.join('backend', 'deeplearning', 'feature_extractor.tflite')
with open(output_path, 'wb') as f:
    f.write(tflite_model)

print(f"TFLite model saved to {output_path}")
print(f"Original model size: {os.path.getsize(model_path) / 1024 / 1024:.1f} MB")
print(f"TFLite model size: {os.path.getsize(output_path) / 1024 / 1024:.1f} MB")
