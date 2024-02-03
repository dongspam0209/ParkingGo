import cv2
import numpy as np
from ultralytics import YOLO

# Load a model)
# model = YOLO('yolov8n.pt')  # load an official model
model = YOLO('C:\\Users\\VCL\\Desktop\\donghannah\\runs\\detect\\car13\\weights\\best.pt')  # load a custom model

results = model.predict(source=".\\DJI_0136.mp4", save=True, show=True, boxes=True)
