"""
OCR Dataset Preparation Script
Extracts features from OCR training images for model training
"""

import os
import numpy as np
from pathlib import Path
from PIL import Image
import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib


class OCRDataPreparation:
    def __init__(self, data_dir=None, output_dir=None):
        # Make paths repo-root relative so script can be run from any CWD.
        # repo root is two parents above this script (ml-service/scripts -> repo root)
        repo_root = Path(__file__).resolve().parents[2]
        if data_dir is None:
            self.data_dir = repo_root / "Datasets" / "standard OCR dataset"
        else:
            self.data_dir = Path(data_dir)

        if output_dir is None:
            # place outputs under ml-service/training_data by default
            self.output_dir = Path(__file__).resolve().parents[1] / "training_data"
        else:
            self.output_dir = Path(output_dir)

        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def extract_image_features(self, image_path):
        """Extract features from a single image"""
        try:
            img = Image.open(image_path).convert('L')  # Convert to grayscale
            img_array = np.array(img)
            
            # Basic features
            features = {
                'mean_pixel': np.mean(img_array),
                'std_pixel': np.std(img_array),
                'min_pixel': np.min(img_array),
                'max_pixel': np.max(img_array),
                'aspect_ratio': img_array.shape[1] / img_array.shape[0] if img_array.shape[0] > 0 else 0,
                'edge_density': np.mean(np.abs(np.diff(img_array.flatten()))),
            }
            
            return features
        except Exception as e:
            print(f"Error processing {image_path}: {e}")
            return None
    
    def prepare_ocr_training_data(self, limit=100):
        """Extract features from OCR training dataset"""
        print("\n" + "="*60)
        print("Preparing OCR Training Data")
        print("="*60)
        
        training_dir = self.data_dir / "data" / "training_data"
        
        if not training_dir.exists():
            print(f"[!] Training directory not found: {training_dir}")
            return None
        
        data = []
        labels = []
        
        # Process each character folder (0-9, A-Z)
        for char_folder in sorted(training_dir.iterdir()):
            if not char_folder.is_dir():
                continue
            
            char_label = char_folder.name
            images = list(char_folder.glob("*.png"))[:limit]
            
            print(f"\nProcessing '{char_label}': {len(images)} images")
            
            for img_path in images:
                features = self.extract_image_features(img_path)
                if features:
                    data.append(features)
                    labels.append(char_label)
        
        if len(data) == 0:
            print("[-] No images found!")
            return None
        
        df = pd.DataFrame(data)
        df['label'] = labels
        
        print(f"\n[+] Extracted {len(df)} images with {len(df.columns)-1} features")
        print(f"  Classes: {df['label'].unique()}")
        print(f"  Class distribution:\n{df['label'].value_counts()}")
        
        # Save dataset
        output_file = self.output_dir / "ocr_training_data.csv"
        df.to_csv(output_file, index=False)
        print(f"\n[+] Saved to: {output_file}")
        
        return df
    
    def prepare_ocr_testing_data(self, limit=50):
        """Extract features from OCR testing dataset"""
        print("\n" + "="*60)
        print("Preparing OCR Testing Data")
        print("="*60)
        
        testing_dir = self.data_dir / "data" / "testing_data"
        
        if not testing_dir.exists():
            print(f"[!] Testing directory not found: {testing_dir}")
            return None
        
        data = []
        labels = []
        
        # Process each character folder
        for char_folder in sorted(testing_dir.iterdir()):
            if not char_folder.is_dir():
                continue
            
            char_label = char_folder.name
            images = list(char_folder.glob("*.png"))[:limit]
            
            print(f"Processing '{char_label}': {len(images)} images")
            
            for img_path in images:
                features = self.extract_image_features(img_path)
                if features:
                    data.append(features)
                    labels.append(char_label)
        
        if len(data) == 0:
            print("❌ No images found!")
            return None
        
        df = pd.DataFrame(data)
        df['label'] = labels
        
        print(f"\n[+] Extracted {len(df)} images")
        
        # Save dataset
        output_file = self.output_dir / "ocr_testing_data.csv"
        df.to_csv(output_file, index=False)
        print(f"[+] Saved to: {output_file}")
        
        return df


def main():
    print("="*60)
    print("OCR Dataset Preparation")
    print("="*60)
    
    ocr = OCRDataPreparation()
    
    # Prepare training data
    train_df = ocr.prepare_ocr_training_data(limit=20)  # Limit to 20 per class for faster processing
    
    # Prepare testing data
    test_df = ocr.prepare_ocr_testing_data(limit=10)
    
    if train_df is not None and test_df is not None:
        print("\n" + "="*60)
        print("[+] OCR Data Preparation Complete!")
        print("="*60)
        print("\nYou can now use these files with train_models.py:")
        print("  - training_data/ocr_training_data.csv")
        print("  - training_data/ocr_testing_data.csv")


if __name__ == "__main__":
    main()
