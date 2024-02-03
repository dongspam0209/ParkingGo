from multiprocessing import freeze_support
import os
os.environ['KMP_DUPLICATE_LIB_OK']='True'

if __name__ == '__main__':
    freeze_support()  # Call freeze_support() only on Windows

    from ultralytics import YOLO 
 
    # Load the model.
    model = YOLO('yolov8n.pt')
    
    # Training.
    results = model.train(
    data='C:/Users/VCL/Desktop/d0ng1nah/datasets/data.yaml',
    imgsz=640,
    epochs=130,
    batch=3,
    name='car',
    degrees=20,
    scale= 0.3,
    )
