# AI/ML Datasets for Certificate Verification System

## Specific Kaggle & Public Datasets

### 1. Certificate & Document Image Datasets

#### Primary Certificate Datasets
- **Certificate Dataset (Kaggle)**
  - Link: https://www.kaggle.com/datasets/techsash/certificate-dataset
  - Contains: 1000+ certificate images (academic, professional)
  - Use: Training document classification models

- **Document Image Dataset**
  - Link: https://www.kaggle.com/datasets/patrickaudriaz/document-classification-dataset
  - Contains: 5000+ scanned documents (receipts, certificates, invoices)
  - Use: Document type classification

- **Educational Certificates Dataset**
  - Link: https://www.kaggle.com/datasets/umerfarooq28/educational-certificates
  - Contains: Academic certificates from various institutions
  - Use: Template learning and field extraction

#### Document Layout Datasets
- **RVL-CDIP (Document Classification)**
  - Link: https://www.kaggle.com/datasets/shaz13/rvl-cdip
  - Contains: 400,000+ grayscale document images (16 categories)
  - Use: Document classification backbone

- **DocVQA Dataset**
  - Link: https://rrc.cvc.uab.es/?ch=17
  - Contains: 50,000+ document images with QA pairs
  - Use: Visual document understanding

- **FUNSD (Form Understanding)**
  - Link: https://guillaumejaume.github.io/FUNSD/
  - Contains: 199 real forms with annotations
  - Use: Layout extraction and field detection

### 2. OCR & Text Recognition Datasets

- **ICDAR 2019 Robust Reading**
  - Link: https://rrc.cvc.uab.es/
  - Contains: Text detection & recognition benchmark
  - Use: OCR model training/validation

- **SynthText Dataset**
  - GitHub: https://github.com/ankush-me/SynthText
  - Contains: 800,000+ synthetic text images
  - Use: Training text detection models

- **CORD (Consolidated Receipt Dataset)**
  - Link: https://github.com/clovaai/cord
  - Contains: 1,000+ receipts with field annotations
  - Use: OCR and structured extraction

- **IAM Handwriting Database**
  - Link: http://www.fki.inf.unibe.ch/databases/iam-handwriting-database
  - Contains: Handwritten text samples
  - Use: Signature and handwriting recognition

### 3. Fraud Detection & Tampering Datasets

- **CASIA Image Tampering Detection**
  - Link: http://forensics.idealtest.org/
  - Contains: 12,000+ authentic + tampered images
  - Use: Training fraud detection (copy-move, splicing)

- **Columbia Image Splicing Dataset**
  - Link: https://www.ee.columbia.edu/ln/dvmm/downloads/authsplcuncmp/
  - Contains: Authentic and spliced images
  - Use: Detecting image manipulation

- **Fake Document Detection Dataset (Kaggle)**
  - Link: https://www.kaggle.com/datasets/divyansh22/online-payment-fraud-detection
  - Contains: Fraud patterns in documents
  - Use: Anomaly detection training

- **Forged Signature Dataset**
  - Link: https://www.kaggle.com/datasets/ishanikathuria/handwritten-signature-datasets
  - Contains: Real vs forged signatures
  - Use: Signature verification models

### 4. Skills Taxonomy & NLP Datasets

- **O*NET Skills Database**
  - Link: https://www.onetcenter.org/database.html
  - Contains: 1000+ standardized occupation skills
  - Use: Skill taxonomy mapping
  - Format: Free downloadable database

- **ESCO Skills Taxonomy (European)**
  - Link: https://ec.europa.eu/esco/portal/download
  - Contains: 13,000+ skills, occupations, qualifications
  - Use: Multi-language skill extraction
  - Format: CSV/RDF downloads

- **Job Skills Dataset (Kaggle)**
  - Link: https://www.kaggle.com/datasets/asaniczka/1-3m-linkedin-jobs-and-skills-2024
  - Contains: 1.3M+ LinkedIn jobs with skills
  - Use: Job-skill matching, demand analysis

- **Course Skills Dataset**
  - Link: https://www.kaggle.com/datasets/PromptCloudHQ/udemy-courses-dataset-50k-courses
  - Contains: 50K+ online courses with skills
  - Use: Certificate-skill mapping

### 5. Multi-Language OCR Datasets

- **ICDAR Multilingual Dataset**
  - Link: https://rrc.cvc.uab.es/
  - Contains: Text in 10+ languages
  - Use: Multi-language OCR training

- **MLT (Multi-Lingual Text) Dataset**
  - Link: https://rrc.cvc.uab.es/?ch=15
  - Contains: 20,000+ images (9 languages)
  - Use: International certificate support

### 6. Signature & Seal Detection

- **Signature Verification Dataset (Kaggle)**
  - Link: https://www.kaggle.com/datasets/robinreni/signature-verification-dataset
  - Contains: 30+ genuine/forged signature pairs
  - Use: Signature matching models

- **GPDS Synthetic Signature Dataset**
  - Link: http://www.gpds.ulpgc.es/
  - Contains: 4000+ synthetic signatures
  - Use: Signature detection training

### 7. QR Code & Barcode Datasets

- **QR Code Detection Dataset (Kaggle)**
  - Link: https://www.kaggle.com/datasets/datasets/qr-code-detection
  - Contains: QR codes in various contexts
  - Use: QR/barcode extraction from certificates

## Synthetic Data Generation

Since real certificate datasets are limited, we'll generate synthetic data:

### Tools for Synthetic Certificate Generation
- **Faker + PIL (Python)**: Generate fake names, dates, institutions
- **DocCreator**: https://doc-creator.labri.fr/ - Synthetic document generator
- **SynthText**: Overlay text on certificate templates
- **Data Augmentation**: Rotate, blur, compress real samples

### Synthetic Dataset Plan
1. Create 50 certificate templates (academic + professional)
2. Generate 10,000 synthetic certificates with variations:
   - Different names, dates, institutions
   - Various fonts, logos, seals
   - Simulated scanning artifacts
3. Create 2,000 tampered versions:
   - Altered dates/names
   - Copy-pasted signatures
   - Compression artifacts
   - Resampling detection targets

## Dataset Acquisition Strategy

### Phase 1: Immediate (Week 1-2)
- Download Kaggle certificate datasets (3 datasets above)
- Download CASIA tampering dataset
- Download O*NET skills taxonomy
- Set up synthetic generation pipeline

### Phase 2: Training Preparation (Week 3-4)
- Label 500 certificate images manually (bounding boxes)
- Generate 10,000 synthetic certificates
- Create 2,000 tampered samples
- Download FUNSD and RVL-CDIP for layout models

### Phase 3: Model Training (Week 5-8)
- Use pre-trained LayoutLMv3 + fine-tune on certificates
- Train fraud detection on CASIA + synthetic tampered data
- Train signature detector on GPDS + custom data
- Fine-tune multilingual OCR on ICDAR

## Data Storage & Organization

```
datasets/
├── certificates/
│   ├── real/
│   │   ├── academic/
│   │   └── professional/
│   ├── synthetic/
│   └── tampered/
├── ocr/
│   ├── icdar/
│   ├── synthtext/
│   └── multilingual/
├── fraud/
│   ├── casia/
│   ├── columbia/
│   └── signatures/
├── skills/
│   ├── onet/
│   ├── esco/
│   └── job_postings/
└── annotations/
    ├── certificate_labels.json
    └── field_annotations/
```

## Labeling Tools

- **LabelStudio**: https://labelstud.io/ (OCR, bounding boxes, NER)
- **CVAT**: https://www.cvat.ai/ (Image annotation, object detection)
- **Prodigy**: https://prodi.gy/ (NLP annotation for skill extraction)

## Pre-trained Models to Use

### Document Understanding
- **LayoutLMv3** (Hugging Face): `microsoft/layoutlmv3-base`
- **Donut** (Hugging Face): `naver-clova-ix/donut-base`
- **TrOCR** (Hugging Face): `microsoft/trocr-base-handwritten`

### Image Classification
- **EfficientNet-B0** (TorchVision): Lightweight CNN for fraud detection
- **ResNet-50** (TorchVision): Feature extraction backbone

### NLP & Skills
- **XLM-RoBERTa** (Hugging Face): `xlm-roberta-base` - Multilingual NER
- **Sentence-BERT** (Hugging Face): `sentence-transformers/all-MiniLM-L6-v2`

### OCR
- **Tesseract 5.0**: Open-source OCR (100+ languages)
- **PaddleOCR**: https://github.com/PaddlePaddle/PaddleOCR (Multi-language)
- **EasyOCR**: https://github.com/JaidedAI/EasyOCR (80+ languages)

## Dataset License Summary

| Dataset | License | Commercial Use | Attribution |
|---------|---------|----------------|-------------|
| Kaggle Certificates | Varies | Check individual | Yes |
| RVL-CDIP | Public Domain | Yes | No |
| CASIA | Research Only | No | Yes |
| O*NET | Public Domain | Yes | No |
| ESCO | CC-BY 4.0 | Yes | Yes |
| FUNSD | CC-BY-SA | Yes | Yes |

## Next Steps

1. **Download Priority Datasets** (Today):
   - Certificate Dataset (Kaggle)
   - CASIA Tampering
   - O*NET Skills
   - FUNSD

2. **Set Up Synthetic Pipeline** (This Week):
   - Create certificate templates
   - Build faker-based generator
   - Generate 1000 samples for testing

3. **Manual Labeling** (Next Week):
   - Label 100 real certificates
   - Create field annotations
   - Validate extraction pipeline

4. **Model Fine-tuning** (Week 3-4):
   - Fine-tune LayoutLMv3 on labeled data
   - Train fraud detector on CASIA
   - Test OCR accuracy on real samples
