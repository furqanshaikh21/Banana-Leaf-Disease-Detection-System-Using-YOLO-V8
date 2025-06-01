from flask import Flask, render_template, request, jsonify
import os
from ultralytics import YOLO
import yaml
import numpy as np 

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'

# Load the model and data configuration
model = YOLO('best.pt')

# Load class names from data.yaml
with open('data.yaml', 'r') as f:
    data_config = yaml.safe_load(f)
    class_names = data_config['names']
    print("Available disease classes:", class_names)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return {'error': 'No image uploaded'}, 400
    
    file = request.files['image']
    if file.filename == '':
        return {'error': 'No image selected'}, 400

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)
    
    try:
        # detection with increased confidence threshold
        results = model.predict(filepath, conf=0.3, iou=0.5)  # Adjust these thresholds
        result = results[0]
        
        print("\nDebug - Detection Results:")
        
        if len(result.boxes) > 0:
            # Get all detections and their confidences
            boxes = result.boxes
            confidences = [float(box.conf[0]) for box in boxes]
            class_ids = [int(box.cls[0]) for box in boxes]
            
            print(f"Found {len(boxes)} detections")
            for i, (conf, cls_id) in enumerate(zip(confidences, class_ids)):
                print(f"Detection {i+1}: {class_names[cls_id]} (Confidence: {conf:.2f})")
            
            # Get the index of the most confident detection
            max_conf_idx = np.argmax(confidences)
            best_class_id = class_ids[max_conf_idx]
            best_confidence = confidences[max_conf_idx]
            
            disease_name = class_names[best_class_id]
            
            print(f"\nSelected prediction:")
            print(f"Disease: {disease_name}")
            print(f"Confidence: {best_confidence:.2f}")
            
            return jsonify({
                'disease': disease_name,
                'confidence': best_confidence,
                'image_path': filepath,
                'all_detections': [
                    {
                        'disease': class_names[cls_id],
                        'confidence': float(conf)
                    } for cls_id, conf in zip(class_ids, confidences)
                ]
            })
        else:
            print("No detections found")
            return jsonify({
                'disease': 'No disease detected',
                'confidence': 0.0,
                'image_path': filepath
            })
            
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({
            'error': 'Error during prediction',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(port=5000, debug=True)
