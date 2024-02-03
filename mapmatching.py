import cv2
import numpy as np
from ultralytics import YOLO

# Load YOLO model (Replace with the correct path to your YOLOv8 model)
model = YOLO('C:\\Users\\VCL\\Desktop\\donghannah\\runs\\detect\\car13\\weights\\best.pt')

# Read and preprocess images
dst_img = cv2.imread('.\\testvideos\\original.jpg')
src_img = cv2.imread('.\\testvideos\\otherday.jpg')
# 히스토그램 등화를 사용하여 이미지의 대비를 개선 

# 이후 SIFT 특징 추출 및 매칭 과정을 수행
gray_1 = cv2.cvtColor(dst_img, cv2.COLOR_BGR2GRAY)
gray_2 = cv2.cvtColor(src_img, cv2.COLOR_BGR2GRAY)

# cv2.imshow('dst', gray_1)

# cv2.imshow('src', gray_2)

gray_1 = cv2.equalizeHist(gray_1)
gray_2 = cv2.equalizeHist(gray_2)
# cv2.imshow('dste', gray_1)

# cv2.imshow('srce', gray_2)
# Get YOLO predictions
results_1 = model.predict(dst_img, conf=0.4)
results_2 = model.predict(src_img,  conf=0.4)

def draw_yolo_predictions(image, results):
    for r in results:
        boxes = r.boxes
        for box in boxes:
            box_np = box.cpu().numpy()
            # Extract coordinates and confidence
            x1, y1, x2, y2 = box_np.xyxy[0][0], box_np.xyxy[0][1], box_np.xyxy[0][2], box_np.xyxy[0][3]
            # Draw rectangle and confidence score
            cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
            # cv2.putText(image, f'{r.classNames[box.classID[0]]}: {conf:.2f}', (int(x1), int(y1-10)), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)
    return image
dst_img_with_yolo = draw_yolo_predictions(dst_img.copy(), results_1)
src_img_with_yolo = draw_yolo_predictions(src_img.copy(), results_2)

# Display YOLO predictions
cv2.imshow('YOLO Predictions on Original Image', dst_img_with_yolo)
cv2.imshow('YOLO Predictions on Other Image', src_img_with_yolo)
cv2.waitKey(0)

# Create a mask for features detection
mask_1 = np.ones_like(gray_1, dtype=np.uint8) * 255  
mask_2 = np.ones_like(gray_2, dtype=np.uint8) * 255  # mask is white (features allowed to be detected everywhere)
# mask is white (features allowed to be detected everywhere)

# Black-out the regions in the mask where cars are detected by YOLO
def apply_mask(image, results, mask, expansion=10):
    for r in results:
        boxes = r.boxes
    for box in boxes:
        box_np = box.cpu().numpy()
        # Extract coordinates
        x1, y1, x2, y2 = box_np.xyxy[0][0],  box_np.xyxy[0][1], box_np.xyxy[0][2], box_np.xyxy[0][3]   
        # Draw filled rectangle with zeros (black out the area)
        x1 = max(x1 - expansion, 0)
        y1 = max(y1 - expansion, 0)
        x2 = min(x2 + expansion, image.shape[1])
        y2 = min(y2 + expansion, image.shape[0])
        # Apply mask
        cv2.rectangle(mask, (int(x1), int(y1)), (int(x2),int(y2)), 0, -1)
    return mask

mask_1 = apply_mask(dst_img, results_1, mask_1)
mask_2 = apply_mask(src_img, results_2, mask_2)

cv2.imshow('Mask_1',  mask_1)
cv2.imshow('Mask_2',  mask_2)


cv2.waitKey(0)
# Initialize SIFT detector
sift = cv2.SIFT_create()

# Detect SIFT features with mask
keypoints_1, descriptor_1 = sift.detectAndCompute(gray_1, mask_1)
keypoints_2, descriptor_2 = sift.detectAndCompute(gray_2, mask_2)

# Draw keypoints for both images
dst_img_keypoints = cv2.drawKeypoints(dst_img, keypoints_1, None)
src_img_keypoints = cv2.drawKeypoints(src_img, keypoints_2, None)

# Display keypoints
cv2.imshow('Original Image Keypoints', dst_img_keypoints)
cv2.imshow('Rotated Image Keypoints', src_img_keypoints)
cv2.waitKey(0)

# Initialize the matcher
bf = cv2.BFMatcher(cv2.NORM_L2, crossCheck=True)

# Match descriptors between the two images
matches = bf.match(descriptor_1, descriptor_2)

# Sort the matches based on distance
matches = sorted(matches, key=lambda x: x.distance)

# Draw matches
matched_img = cv2.drawMatches(dst_img, keypoints_1, src_img, keypoints_2, matches[:50], None, flags=2)

# Display matches
cv2.imshow('Matches', matched_img)
cv2.waitKey(0)


# Extract the matched keypoints
source_pts = np.float32([keypoints_1[m.queryIdx].pt for m in matches]).reshape(-1, 1, 2)
destination_pts = np.float32([keypoints_2[m.trainIdx].pt for m in matches]).reshape(-1, 1, 2)

# Find homography
transformation_matrix, inliers = cv2.findHomography(destination_pts, source_pts, cv2.RANSAC)

# Warp the image to align with the destination image
aligned_image = cv2.warpPerspective(src_img, transformation_matrix, (dst_img.shape[1], dst_img.shape[0]))

# Display the aligned image
cv2.imshow("Aligned Image", aligned_image)
cv2.waitKey(0)
# Draw only inliers keypoints and matches
inlier_matches = [m for i, m in enumerate(matches) if inliers[i]]

# Draw inliers matches
inliers_img = cv2.drawMatches(dst_img, keypoints_1, src_img, keypoints_2, inlier_matches, None, flags=2)

# Display inliers matches
# cv2.imshow('Inliers Matches', inliers_img)
cv2.waitKey(0)

cv2.destroyAllWindows()
