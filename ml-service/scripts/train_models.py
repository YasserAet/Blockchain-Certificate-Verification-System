import os
import json
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, mean_squared_error
import joblib

class MLPipeline:
    def __init__(self):
        self.models_dir = Path('models')
        self.models_dir.mkdir(exist_ok=True)
        self.results = {}
    
    def load_data(self, csv_file):
        print(f"Loading: {csv_file}")
        df = pd.read_csv(csv_file)
        print(f"  Shape: {df.shape}")
        return df
    
    def train_classifier(self, X, y):
        print("Training Classifier...")
        
        unique_classes = np.unique(y)
        if len(unique_classes) < 2:
            print("[!] Need at least 2 classes")
            return
        
        min_class_size = min(np.bincount(y))
        stratify = y if min_class_size >= 2 else None
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=stratify)
        scaler = StandardScaler()
        X_tr = scaler.fit_transform(X_train)
        X_te = scaler.transform(X_test)
        model = RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
        model.fit(X_tr, y_train)
        y_pred = model.predict(X_te)
        acc = accuracy_score(y_test, y_pred)
        print(f"[+] Accuracy: {acc:.4f}")
        joblib.dump(model, self.models_dir / "classifier.pkl")
        joblib.dump(scaler, self.models_dir / "classifier_scaler.pkl")
        self.results["classifier"] = {"accuracy": float(acc)}
    
    def train_regressor(self, X, y):
        print("Training Regressor...")
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        scaler = StandardScaler()
        X_tr = scaler.fit_transform(X_train)
        X_te = scaler.transform(X_test)
        model = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
        model.fit(X_tr, y_train)
        y_pred = model.predict(X_te)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        print(f"[+] RMSE: {rmse:.4f}")
        joblib.dump(model, self.models_dir / "regressor.pkl")
        joblib.dump(scaler, self.models_dir / "regressor_scaler.pkl")
        self.results["regressor"] = {"rmse": float(rmse)}
    
    def save_results(self):
        path = self.models_dir / "results.json"
        with open(path, "w") as f:
            json.dump(self.results, f, indent=2)
        print(f"[+] Results: {path}")

def find_csv_files(folder_path):
    """Find all CSV files in a folder"""
    csv_files = []
    if os.path.exists(folder_path):
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                if file.endswith('.csv'):
                    csv_files.append(os.path.join(root, file))
    return csv_files

def get_base_path():
    """Get the base project path"""
    script_dir = Path(__file__).parent.parent.parent
    return script_dir

def main():
    print("="*60)
    print("Random Forest Training")
    print("="*60)
    
    base_path = get_base_path()
    pipeline = MLPipeline()
    count = 0
    
    print("\n[1] Coursera Dataset")
    coursera_dir = base_path / "Datasets" / "Coursera Course Dataset"
    csv_files = find_csv_files(str(coursera_dir))
    if csv_files:
        try:
            df = pipeline.load_data(csv_files[0])
            if "course_rating" in df.columns:
                X = df.drop("course_rating", axis=1).select_dtypes(include=[np.number])
                y = df["course_rating"]
                if len(X) > 0:
                    pipeline.train_regressor(X, y)
                    count += 1
            else:
                print(f"  No 'course_rating' column. Columns: {df.columns.tolist()}")
        except Exception as e:
            print(f"  Error: {e}")
    else:
        print(f"  No CSV files found in {coursera_dir}")
    
    print("\n[2] Text Classification Dataset")
    text_dir = base_path / "Datasets" / "Text Document Classification Dataset"
    csv_files = find_csv_files(str(text_dir))
    if csv_files:
        try:
            df = pipeline.load_data(csv_files[0])
            numeric = df.select_dtypes(include=[np.number]).columns.tolist()
            object_cols = df.select_dtypes(include=['object']).columns.tolist()
            
            if len(numeric) >= 1 and len(object_cols) >= 1:
                X = df[numeric]
                y_text = df[object_cols[0]]
                y_encoded = pd.factorize(y_text)[0]
                pipeline.train_classifier(X, y_encoded)
                count += 1
            else:
                print(f"  Insufficient data: numeric={len(numeric)}, text={len(object_cols)}")
        except Exception as e:
            print(f"  Error: {e}")
    else:
        print(f"  No CSV files found in {text_dir}")
    
    print("\n[3] OCR Dataset")
    ocr_dir = base_path / "Datasets" / "standard OCR dataset"
    if os.path.exists(str(ocr_dir)):
        print("  Processing OCR images...")
        try:
            from PIL import Image
            ocr_features = []
            ocr_labels = []
            
            for root, dirs, files in os.walk(str(ocr_dir)):
                for file in files:
                    if file.endswith(('.png', '.jpg', '.jpeg')):
                        img_path = os.path.join(root, file)
                        try:
                            img = Image.open(img_path).convert('L')
                            img_array = np.array(img).flatten()[:100]
                            if len(img_array) == 100:
                                ocr_features.append(img_array)
                                label = os.path.basename(root)
                                ocr_labels.append(label)
                        except Exception as e:
                            print(f"    Error processing image {img_path}: {e}")
                    if len(ocr_features) >= 200:
                        break
                if len(ocr_features) >= 200:
                    break
            
            if len(ocr_features) > 10:
                X = pd.DataFrame(ocr_features)
                y = pd.Series(ocr_labels)
                print(f"  Found {len(ocr_features)} images")
                pipeline.train_classifier(X, y)
                count += 1
            else:
                print(f"  Not enough images: {len(ocr_features)}")
        except Exception as e:
            print(f"  Error: {e}")
    else:
        print(f"  OCR directory not found")
    
    print("\n[4] Synthetic Fraud Data")
    X = np.random.randn(1000, 10)
    y = ((X[:, 0] > 0.5) & (X[:, 1] < -0.5)).astype(int)
    X = pd.DataFrame(X, columns=[f"f{i}" for i in range(10)])
    pipeline.train_classifier(X, y)
    count += 1
    
    pipeline.save_results()
    print("\n" + "="*60)
    print(f"[+] Done! {count} datasets processed")
    print("="*60)

if __name__ == "__main__":
    main()