import cv2
import json
import numpy as np
import math

points = []

def euclidean_distance(point1, point2):
    # Calculate the Euclidean distance between two points
    return math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2)

try:
    with open('./map/num2.json', 'r') as f:  # Open the file in read mode
        data = json.load(f)
        shapes = data['parking_status']  # Assuming the JSON structure you provided
except FileNotFoundError:
    shapes = []

def mouse_callback(event, x, y, flags, param):
    global points, shapes

    if event == cv2.EVENT_LBUTTONDOWN:
        points.append((x, y))
        print(points)
        if len(points) == 4:
            n = input("How many spaces ? : ")
            direction = input("세로 줄 : 0, 가로 줄 : 1 - ")
            groupname = input("groupname:")
            for i, part in enumerate(partition(points, n, direction)):
                shapes.append({'ID': groupname + str(int(n)-int(i)), 'coordinates': part, 'occupied': None})
            points = []
        print(shapes)
            
            
    if event == cv2.EVENT_RBUTTONDOWN:
        pixel = (x, y)
        closest_shape = None
        min_distance = float('inf')
        
        for i, shape in enumerate(shapes):  # Fixed variable name from 'points' to 'shape'
            center_x = (shape['coordinates'][0][0] + shape['coordinates'][3][0]) / 2
            center_y = (shape['coordinates'][0][1] + shape['coordinates'][3][1]) / 2
            center_point = (center_x, center_y)

            distance = euclidean_distance(pixel, center_point)
            if distance < min_distance:
                min_distance = distance
                # print(distance)
                closest_shape = i
        shapes.pop(closest_shape)

    with open('./map/num2.json', 'w') as f:  # Open the file in write mode
        json.dump({'parking_status': shapes}, f, indent=4)  # Save the shapes with indentation for readability


# 1: 왼위, 2: 우위, 3: 왼아, 4: 우아
def partition(points, n, split_direction):
    n = int(n)

    left_top, right_top, left_bottom, right_bottom = points
    
    if split_direction == '0':
        sub_square_width = (right_top[0] - left_top[0]) / n
        print(right_top[0], left_top[0], n)
        # sub_square_height = left_bottom[1] - left_top[1]

        smaller_squares = []
        for i in range(n):
            
            lt = (left_top[0] + i * sub_square_width, left_top[1])
            rt = (left_top[0] + (i+1) * sub_square_width,left_top[1] )
            lb = (left_bottom[0]+ i * sub_square_width, left_bottom[1])
            rb = (left_bottom[0] +  (i+1) * sub_square_width, left_bottom[1])
        
            
            smaller_squares.append([lt, lb, rb, rt])
            # print([(x1, y1), (x2, y1), (x2, y2), (x1, y2)])

    elif split_direction == '1':
        sub_square_height = (left_bottom[1] - left_top[1]) / n
        sub_square_width = right_top[0] - left_top[0]

        smaller_squares = []
        for i in range(n):
            lt = (left_top[0], left_top[1]+ i * sub_square_height)
            rt = (right_top[0] ,left_top[1] + i * sub_square_height)
            lb = (left_top[0] , left_top[1]+ (i+1) * sub_square_height)
            rb = (right_top[0] , left_top[1]+ (i+1) * sub_square_height)

            # rt = (right_top[0], right_top[1] + i * sub_square_height)
            # lt = (left_top[0], right_top[1] + i * sub_square_height)
            # rb = (right_bottom[0], right_bottom[1] - (i+1) * sub_square_height)
            # lb = (left_bottom[0], left_bottom[1] - (i+1) * sub_square_height)

            
            smaller_squares.append([lt, lb, rb, rt])
    else:
        raise ValueError("Invalid split direction. Use 0 or 1")

    return smaller_squares

cap = cv2.VideoCapture('.\\testvideos\\num2.MP4')
cv2.namedWindow('image')
ret, src = cap.read()

original_width = src.shape[1]
original_height = src.shape[0]
# 크기 (큼)

new_width = 1500
aspect_ratio = original_height / original_width
new_height = int(new_width * aspect_ratio)

src = cv2.resize(src, (new_width, new_height)) #작게 만듦

while True:
    ret, src = cap.read()
    if not ret:
        break

    # Resize the source image here in the loop so it updates on each iteration
    src = cv2.resize(src, (new_width, new_height))

    # Draw all the remaining shapes on the new source image
    for shape in shapes:
        coordinates = shape['coordinates']
        polygon_points = np.array(coordinates, dtype=np.int32)
        cv2.polylines(src, [polygon_points], isClosed=True, color=(0, 255, 0), thickness=2)

    cv2.imshow('image', src)
    cv2.setMouseCallback('image', mouse_callback)

    # Use a waitKey delay that's a bit longer for better performance and less CPU usage
    if cv2.waitKey(20) == ord('q'):
        break

cv2.destroyAllWindows()
