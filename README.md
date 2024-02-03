# ParkingGo
### Parking Control with drone videos! using YOLOv8 & top view dataset

- test_videos : Please contact us via the email in the Q&A.

- Notion link : <https://peppermint-swing-713.notion.site/8ae18027e6be46d88c352567f2a0ae1e?pvs=4>

- dataset : <https://public.roboflow.com/object-detection/pklot/1>

- check the main directory to review the web program code
## System Workflow
![image](https://github.com/dongspam0209/ParkingGo/assets/98256216/0e096e2d-6b13-4291-a43d-bb37250ad7ec)
1. Make parking lot frame (parkingspacepicker.py)
2. YOLOv8 to extract the bounding box and confidence of the car object.
3. When, IoU(Intersection of Unit) is over specific threshold, Car is parked.
4. We used the Euclidean distance between those two center points.
5. Easiest to Park : A parking space with many vacant spaces nearby (NorthSouthWestEast)
6. Closest to Entrance : Euclidean distance betweent parking space and building entrance
   * The entrance of the building was set arbitrarily
## run_jeongseok.py
![image](https://github.com/dongspam0209/ParkingGo/assets/98256216/d6e71fe1-4b18-41f8-948a-5cfecfc1b8e5)
1. Import model and jeongseok_parkinglot videos and json of jeongseok_parkinglot.
2. YOLOv8 detects car objects in jeongseok_parkinglot videos and update parking status in json
## run_num2.py
![image](https://github.com/dongspam0209/ParkingGo/assets/98256216/755857ac-0d2b-4f6f-8672-5daa5d4d1805)
1. Import model and num2_parkinglot videos and json of num2_parkinglot.
2. YOLOv8 detects car objects in num2_parkinglot videos and update parking status in json

## parkingspacepicker.py
Make the frame of the parking lot and store the coordinates of the frame into json. This frame will be used to detect whether the car is parked . 

## mapmatching.py
Align rotated image by using YOLOv8 and SIFT. Masking bounding boxes which are detected by YOLOv8 and then, use SIFT algorithm. 

![image](https://github.com/dongspam0209/ParkingGo/assets/98256216/a82a5ea9-a64f-4394-ba5a-456d61d2d817) ![image](https://github.com/dongspam0209/ParkingGo/assets/98256216/55025746-6955-486a-9cc4-68b463656cca)


## Q&A
- Harry(KimJaeMin) woals424@naver.com
- Daniel(KimJiHun) jihun1005@gmail.com
- Skye(KimHwaHyeon) ymlee4075@naver.com
- Ian(KimDongHan) iankim010209@gmail.com
