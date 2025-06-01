from ultralytics import YOLO

# Load a pretrained model
model = YOLO('yolov8n.pt')

# Train the model using our custom data
model.train(
    data='data.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    name='banana_disease_model'
)
