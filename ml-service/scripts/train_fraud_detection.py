"""
Fraud Detection Model Training
Train CNN-based model to detect forged certificates
"""

import json
import numpy as np
from pathlib import Path
from PIL import Image
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from torchvision import transforms, models
import pickle

class FraudDetectionTrainer:
    def __init__(self, data_dir: str = "training_data/certificates", model_dir: str = "models"):
        self.data_dir = Path(data_dir)
        self.model_dir = Path(model_dir)
        self.model_dir.mkdir(parents=True, exist_ok=True)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {self.device}")
        
    def load_dataset(self):
        """Load synthetic certificate images and labels"""
        images = []
        labels = []
        
        # Load metadata
        for metadata_file in self.data_dir.glob("metadata_*.json"):
            with open(metadata_file, 'r') as f:
                metadata_list = json.load(f)
            
            for metadata in metadata_list:
                try:
                    img_path = Path(metadata['filepath'])
                    if img_path.exists():
                        img = Image.open(img_path).convert('RGB')
                        img = img.resize((224, 224))  # ResNet input size
                        img_array = np.array(img) / 255.0
                        images.append(img_array)
                        
                        label = 1 if metadata['label'] == 'forged' else 0
                        labels.append(label)
                except Exception as e:
                    print(f"Error loading {metadata.get('filename')}: {e}")
        
        return np.array(images), np.array(labels)
    
    def create_model(self):
        """Create ResNet-50 model for transfer learning"""
        model = models.resnet50(pretrained=True)
        
        # Freeze early layers
        for param in model.layer1.parameters():
            param.requires_grad = False
        for param in model.layer2.parameters():
            param.requires_grad = False
        
        # Replace final layer for binary classification
        num_features = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Linear(num_features, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, 1),
            nn.Sigmoid()
        )
        
        return model.to(self.device)
    
    def train(self, epochs: int = 10, batch_size: int = 32, learning_rate: float = 0.001):
        """Train fraud detection model"""
        print("\nLoading dataset...")
        X, y = self.load_dataset()
        
        if len(X) == 0:
            print("ERROR: No training data found! Generate synthetic certificates first.")
            return
        
        print(f"Dataset loaded: {len(X)} images")
        print(f"Class distribution: {np.sum(y == 0)} authentic, {np.sum(y == 1)} forged")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        X_train, X_val, y_train, y_val = train_test_split(
            X_train, y_train, test_size=0.15, random_state=42, stratify=y_train
        )
        
        # Convert to tensors
        X_train_tensor = torch.from_numpy(X_train).permute(0, 3, 1, 2).float().to(self.device)
        y_train_tensor = torch.from_numpy(y_train).float().unsqueeze(1).to(self.device)
        
        X_val_tensor = torch.from_numpy(X_val).permute(0, 3, 1, 2).float().to(self.device)
        y_val_tensor = torch.from_numpy(y_val).float().unsqueeze(1).to(self.device)
        
        # Create dataloaders
        train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        
        val_dataset = TensorDataset(X_val_tensor, y_val_tensor)
        val_loader = DataLoader(val_dataset, batch_size=batch_size)
        
        # Create model
        print("\nCreating model...")
        model = self.create_model()
        
        # Loss and optimizer
        criterion = nn.BCELoss()
        optimizer = optim.Adam(model.parameters(), lr=learning_rate)
        
        # Training loop
        print(f"\nTraining for {epochs} epochs...\n")
        best_val_f1 = 0
        
        for epoch in range(epochs):
            # Training
            model.train()
            train_loss = 0
            for X_batch, y_batch in train_loader:
                optimizer.zero_grad()
                outputs = model(X_batch)
                loss = criterion(outputs, y_batch)
                loss.backward()
                optimizer.step()
                train_loss += loss.item()
            
            # Validation
            model.eval()
            val_loss = 0
            val_preds = []
            val_targets = []
            
            with torch.no_grad():
                for X_batch, y_batch in val_loader:
                    outputs = model(X_batch)
                    loss = criterion(outputs, y_batch)
                    val_loss += loss.item()
                    val_preds.extend(outputs.cpu().numpy().flatten())
                    val_targets.extend(y_batch.cpu().numpy().flatten())
            
            # Calculate metrics
            val_preds_binary = (np.array(val_preds) > 0.5).astype(int)
            val_accuracy = accuracy_score(val_targets, val_preds_binary)
            val_precision = precision_score(val_targets, val_preds_binary, zero_division=0)
            val_recall = recall_score(val_targets, val_preds_binary, zero_division=0)
            val_f1 = f1_score(val_targets, val_preds_binary, zero_division=0)
            
            print(f"Epoch {epoch+1}/{epochs}")
            print(f"  Train Loss: {train_loss/len(train_loader):.4f}")
            print(f"  Val Loss: {val_loss/len(val_loader):.4f}")
            print(f"  Val Accuracy: {val_accuracy:.4f}")
            print(f"  Val Precision: {val_precision:.4f}")
            print(f"  Val Recall: {val_recall:.4f}")
            print(f"  Val F1: {val_f1:.4f}\n")
            
            # Save best model
            if val_f1 > best_val_f1:
                best_val_f1 = val_f1
                torch.save(model.state_dict(), self.model_dir / "fraud_detection_best.pth")
                print(f"  ✓ Saved best model (F1: {val_f1:.4f})\n")
        
        # Test set evaluation
        print("Evaluating on test set...")
        model.load_state_dict(torch.load(self.model_dir / "fraud_detection_best.pth"))
        model.eval()
        
        X_test_tensor = torch.from_numpy(X_test).permute(0, 3, 1, 2).float().to(self.device)
        y_test_tensor = torch.from_numpy(y_test).float().unsqueeze(1).to(self.device)
        
        test_preds = []
        test_targets = []
        
        with torch.no_grad():
            for i in range(0, len(X_test_tensor), batch_size):
                X_batch = X_test_tensor[i:i+batch_size]
                outputs = model(X_batch)
                test_preds.extend(outputs.cpu().numpy().flatten())
                test_targets.extend(y_test_tensor[i:i+batch_size].cpu().numpy().flatten())
        
        test_preds_binary = (np.array(test_preds) > 0.5).astype(int)
        test_accuracy = accuracy_score(test_targets, test_preds_binary)
        test_precision = precision_score(test_targets, test_preds_binary, zero_division=0)
        test_recall = recall_score(test_targets, test_preds_binary, zero_division=0)
        test_f1 = f1_score(test_targets, test_preds_binary, zero_division=0)
        test_roc_auc = roc_auc_score(test_targets, test_preds)
        
        print("\n" + "="*60)
        print("TEST SET RESULTS")
        print("="*60)
        print(f"Accuracy:  {test_accuracy:.4f}")
        print(f"Precision: {test_precision:.4f}")
        print(f"Recall:    {test_recall:.4f}")
        print(f"F1 Score:  {test_f1:.4f}")
        print(f"ROC-AUC:   {test_roc_auc:.4f}")
        
        # Confusion matrix
        cm = confusion_matrix(test_targets, test_preds_binary)
        print(f"\nConfusion Matrix:")
        print(f"  True Negatives:  {cm[0,0]}")
        print(f"  False Positives: {cm[0,1]}")
        print(f"  False Negatives: {cm[1,0]}")
        print(f"  True Positives:  {cm[1,1]}")
        
        # Save metrics
        metrics = {
            "accuracy": float(test_accuracy),
            "precision": float(test_precision),
            "recall": float(test_recall),
            "f1_score": float(test_f1),
            "roc_auc": float(test_roc_auc),
            "confusion_matrix": cm.tolist()
        }
        
        with open(self.model_dir / "fraud_detection_metrics.json", 'w') as f:
            json.dump(metrics, f, indent=2)
        
        print(f"\n✓ Model saved to: {self.model_dir / 'fraud_detection_best.pth'}")
        print(f"✓ Metrics saved to: {self.model_dir / 'fraud_detection_metrics.json'}")

def main():
    print("Fraud Detection Model Training\n")
    print("="*60)
    
    trainer = FraudDetectionTrainer()
    trainer.train(epochs=5, batch_size=16, learning_rate=0.001)

if __name__ == "__main__":
    main()
