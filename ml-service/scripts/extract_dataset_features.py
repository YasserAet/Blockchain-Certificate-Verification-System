import os
import zipfile
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer

def extract_and_prepare_data():
    """Extract and prepare data from your Datasets folder"""
    print("Extracting datasets...")
    
    datasets_dir = Path("Datasets")
    extract_dir = Path("training_data/extracted")
    extract_dir.mkdir(parents=True, exist_ok=True)
    
    # Extract all zip files
    for zip_file in datasets_dir.glob("*.zip"):
        print(f"\nExtracting: {zip_file.name}")
        with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
    
    print("\n✓ Files extracted to:", extract_dir)
    
    # List extracted files
    for root, dirs, files in os.walk(extract_dir):
        for file in files:
            file_path = os.path.join(root, file)
            print(f"  - {file_path}")

def prepare_certificate_dataset():
    """Prepare certificate dataset for ML"""
    print("\n" + "="*60)
    print("Preparing Certificate Dataset")
    print("="*60)
    
    extract_dir = Path("training_data/extracted")
    
    # Look for CSV files
    csv_files = list(extract_dir.glob("**/*.csv"))
    
    if csv_files:
        for csv_file in csv_files:
            print(f"\nProcessing: {csv_file.name}")
            df = pd.read_csv(csv_file)
            print(f"  Shape: {df.shape}")
            print(f"  Columns: {df.columns.tolist()}")
            print(f"  Data types:\n{df.dtypes}")
            print(f"  Sample:\n{df.head()}")

if __name__ == "__main__":
    extract_and_prepare_data()
    prepare_certificate_dataset()