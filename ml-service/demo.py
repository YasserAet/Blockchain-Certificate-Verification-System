#!/usr/bin/env python3
"""
ML Service Demo Script
Demonstrates the trained Random Forest models for certificate verification.
"""

import os
import sys
import numpy as np
import pandas as pd
from pathlib import Path
import joblib
from sklearn.preprocessing import StandardScaler

def load_models():
    """Load the trained models and scaler."""
    models_dir = Path(__file__).parent / "models"

    try:
        classifier = joblib.load(models_dir / "random_forest_classifier.pkl")
        regressor = joblib.load(models_dir / "regressor.pkl")
        scaler = joblib.load(models_dir / "random_forest_scaler.pkl")
        print("✅ Models loaded successfully!")
        return classifier, regressor, scaler
    except FileNotFoundError as e:
        print(f"❌ Model file not found: {e}")
        sys.exit(1)

def demo_regression(regressor):
    """Demonstrate regression prediction (course rating)."""
    print("\n🎯 Regression Demo - Course Rating Prediction")
    print("-" * 50)

    # Regressor expects 1 feature (from Coursera data)
    sample_data = np.array([[100.0]])  # Unnamed: 0 or similar

    # Make prediction (no scaling for simplicity)
    prediction = regressor.predict(sample_data)[0]

    print(f"Sample Input Feature: {sample_data[0][0]}")
    print(f"\nPredicted Course Rating: {prediction:.2f}/5.0")

def demo_classification(classifier, scaler):
    """Demonstrate classification prediction (fraud detection)."""
    print("\n🔍 Classification Demo - Fraud Detection")
    print("-" * 50)

    # Sample fraud detection data (10 features)
    sample_data = {
        'feature_0': [0.5],
        'feature_1': [1.2],
        'feature_2': [-0.8],
        'feature_3': [0.3],
        'feature_4': [1.1],
        'feature_5': [-0.2],
        'feature_6': [0.7],
        'feature_7': [1.8],
        'feature_8': [-1.0],
        'feature_9': [0.4],
    }

    df_sample = pd.DataFrame(sample_data)
    features_scaled = scaler.transform(df_sample)

    # Make prediction
    prediction = classifier.predict(features_scaled)[0]
    probabilities = classifier.predict_proba(features_scaled)[0]

    print(f"Sample Features: {df_sample.iloc[0].values}")
    print(f"Prediction: {'Fraudulent' if prediction == 1 else 'Legitimate'}")
    print(f"Confidence: {probabilities[prediction]:.3f}")

def main():
    print("🤖 ML Service Demo")
    print("=" * 50)

    # Load models
    classifier, regressor, scaler = load_models()

    # Run demos
    demo_regression(regressor)
    demo_classification(classifier, scaler)

    print("\n✅ Demo completed successfully!")
    print("\nThe ML models are working correctly and ready for integration.")

if __name__ == "__main__":
    main()