# 🍌 Banana Leaf Disease Detection Using AI

This project uses a YOLO-based deep learning model to detect and classify diseases in banana leaves from uploaded images. The web application is built with Flask and provides a simple dashboard for users to upload images and view predictions.

## 🚀 Features

- Upload banana leaf images and detect diseases automatically.
- Uses a custom-trained YOLO model for high accuracy.
- Displays prediction confidence and all detected diseases.
- Simple web dashboard for easy interaction.

## 🖥️ Dashboard

<!-- Option 1: Inline image (hosted on GitHub or elsewhere) -->
![Dashboard Screenshot](https://github.com/furqanshaikh21/Banana-Leaf-Disease-Detection-System-Using-YOLO-V8/blob/65a5b93c4a968b9cb69666c3a9f1f092349eabc9/Images/Screenshot%202025-06-01%20230135.png)

<!-- Option 2: Local image in the repo (place your image in the images/ folder) -->
<!-- ![Dashboard Screenshot](images/dashboard.png) -->

## 🔍 Findings

<!-- Option 1: Inline image (hosted on GitHub or elsewhere) -->
![Findings Example](https://github.com/furqanshaikh21/Banana-Leaf-Disease-Detection-System-Using-YOLO-V8/blob/c6a6afe4ea91a68599244b10391ef8af1c2a84ae/Images/Screenshot%202025-06-01%20230114.png)

<!-- Option 2: Local image in the repo (place your image in the images/ folder) -->
<!-- ![Findings Example](images/findings.png) -->

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/banana-leaf-disease-detection.git
   cd banana-leaf-disease-detection
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Add your YOLO model and data config:**
   - Place your trained YOLO model file as `best.pt` in the project root.
   - Ensure `data.yaml` (with class names) is present in the root.

4. **Run the app:**
   ```bash
   python app.py
   ```
   The app will be available at [http://localhost:5000](http://localhost:5000).

## 📁 Project Structure

```
.
├── app.py
├── data.yaml
├── best.pt
├── requirements.txt
├── static/
│   └── uploads/
├── templates/
│   └── index.html
└── images/
    ├── dashboard.png
    └── findings.png
```

## 📝 Usage

- Open the web dashboard.
- Upload a banana leaf image.
- View detected diseases and their confidence scores.

## 🤖 Model

- The model is based on [YOLO](https://github.com/ultralytics/ultralytics).
- You can retrain or fine-tune the model with your own dataset.
