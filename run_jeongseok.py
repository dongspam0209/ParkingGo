import cv2
import json
import cvzone
import numpy as np
from ultralytics import YOLO
import json
model = YOLO('C:\\Users\\VCL\\Desktop\\donghannah\\runs\\detect\\car13\\weights\\best.pt')
cap = cv2.VideoCapture('testvideos\\230824_jeongseok.mp4')
entry  = {
    "num2": {"X": 509, "Y": 767},
    "jeongseok" : {"X": 1417, "Y": 495}
}

def distance(p1, p2):
    return np.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)

# Replace the pickle load part with json load
posList = []
try:
    with open('.\\0\\src\\230824_jeongseok.json', 'r') as f:  # Open the file in read mode
        posList = json.load(f)['parking_status']  # Access the 'parking_status' key
except FileNotFoundError:
    print("File not found, creating a new list")
    posList = []

# 각주차 자리의 좌표들 픽셀
def draw_yolo_results(img, boxes):
    img_copy = img.copy()
    for box in boxes:
        box_cpu = box.cpu().numpy()
        x1, y1, x2, y2 = map(int, box_cpu.xyxy[0])
        cv2.rectangle(img_copy, (x1, y1), (x2, y2), (0, 255, 0), 2)
    return img_copy

def is_point_inside_rectangle(px, py, x, y, width, height):
    if x <= px < x + width and y <= py < y + height:
        return True
    return False

def count_empty_neighbors(spot, posList, distance_threshold=150):
    # Count the empty neighbors within a certain distance threshold
    count = 0
    spot_center = ((spot['coordinates'][0][0] + spot['coordinates'][2][0]) / 2, 
                   (spot['coordinates'][0][1] + spot['coordinates'][2][1]) / 2)
    
    for neighbor in posList:
        if not neighbor['occupied']:
            neighbor_center = ((neighbor['coordinates'][0][0] + neighbor['coordinates'][2][0]) / 2, 
                               (neighbor['coordinates'][0][1] + neighbor['coordinates'][2][1]) / 2)
            dist = np.sqrt((spot_center[0] - neighbor_center[0]) ** 2 + (spot_center[1] - neighbor_center[1]) ** 2)
            if dist < distance_threshold:
                count += 1
    return count

def mark_entry_point(img, entry):
    entry_point = (entry["jeongseok"]["X"], entry["jeongseok"]["Y"])
    cv2.circle(img, entry_point, radius=15, color=(0, 255, 255), thickness=-1)  # -1 thickness fills the circle

def checkSpaces(centers):


    for data in posList:
        data['occupied'] = False  # Reset all to unoccupied initially
        data['Ps_best'] = 0

    # Determine occupied spots
    for center in centers:
        closest_dist = float('inf')
        closest_spot = None
        for data in posList:
            lt, lb, rb, rt = data['coordinates']
            pos_center = (lt[0]+rb[0])/2, (lt[1]+rb[1])/2
            dist = np.sqrt((center[0] - pos_center[0]) ** 2 + (center[1] - pos_center[1]) ** 2)
            if dist < closest_dist and not data['occupied'] and dist < 15:
                closest_dist = dist
                closest_spot = data
        if closest_spot:
            closest_spot['occupied'] = True

    # Identify the easiest_to_park spot
    easiest_to_park = None
    max_empty_neighbors = -1
    for data in posList:
        if not data['occupied']:
            empty_neighbors = count_empty_neighbors(data, posList)
            if empty_neighbors > max_empty_neighbors:
                max_empty_neighbors = empty_neighbors
                easiest_to_park = data
    print(max_empty_neighbors, easiest_to_park)


        # Identify the closest_to_entry spot
    closest_to_entry = None
    closest_dist_to_entry = float('inf')
    entry_point = (entry["jeongseok"]["X"], entry["jeongseok"]["Y"])
    for data in posList:
        if not data['occupied']:
            lt, lb, rb, rt = data['coordinates']
            spot_center = (lt[0]+rb[0])/2, (lt[1]+rb[1])/2
            dist_to_entry = distance(entry_point, spot_center)
            if dist_to_entry < closest_dist_to_entry:
                closest_dist_to_entry = dist_to_entry
                closest_to_entry = data

    for data in posList:
        color = (0, 0, 200) if data['occupied'] else (0, 200, 0)  # Color for occupied and unoccupied
        if data is easiest_to_park:
            color = (255, 0, 0)  # Blue color for easiest to park
            data['Ps_best'] = 1
        if data is closest_to_entry:
            color = (255, 0, 255)  # Pink color for closest to entry
            data['Ps_best'] = 2  # Set best to 2 for closest to entry



        polygon_points = np.array(data['coordinates'], dtype=np.int32)
        cv2.polylines(img, [polygon_points], isClosed=True, color=color, thickness=2)

    # After processing all spots, the best spot is found and marked, return the list
    return posList


fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter('output.mp4', fourcc, 20.0, (1200, 675))
# 영상 저장


while True:
    success, img = cap.read()
    if not success:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        success, img = cap.read()

    original_width = img.shape[1]
    original_height = img.shape[0]
    # 크기 (큼)

    new_width = 1500
    aspect_ratio = original_height / original_width
    new_height = int(new_width * aspect_ratio)

    img = cv2.resize(img, (new_width, new_height)) #작게 만듦

    if not cap.isOpened():
        print("Error: Couldn't open the video file.")
        exit()

    results = model.predict(img)
    # 바운딩박스 정보


    centers = []

    for r in results:
        boxes = r.boxes #바운딩박스 정보

    # yolo_result_img = draw_yolo_results(img, boxes)  # YOLO 결과만 그리기
    # cv2.imshow("YOLO Results", yolo_result_img)
    for box in boxes:
        box_cpu = box.cpu().numpy()
        center = [(box_cpu.xyxy[0][0] + box_cpu.xyxy[0][2]) / 2, (box_cpu.xyxy[0][1] + box_cpu.xyxy[0][3]) / 2]
        center = int(center[0]), int(center[1])

        if center[0] < new_width and center[1] < new_height:
            centers.append(center)
    mark_entry_point(img, entry)
            #centers: 바운딩박스 중앙점 모음

    parking_statuses = checkSpaces(centers)
    parking_data = {'parking_status': posList}
    with open('C:\\Users\\VCL\\Desktop\\donghannah\\0\\src\\230824_jeongseok.json', 'w') as file:
        json.dump(parking_data, file, indent=4)  # Save with indentation

    
    cv2.imshow("Image", img)
    key = cv2.waitKey(1)

    out.write(img)

    if key == ord('q'):
        break

out.release()
