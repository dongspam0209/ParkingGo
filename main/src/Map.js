/*global kakao*/

// 추후에 주차자리에 맞는 빈자리 출력하는 시스템 구축해야함.

import React, { useEffect, useState } from 'react'
import './Map.css';
import { Link } from 'react-router-dom';
import { FaCarAlt } from "react-icons/fa"
import { GoSearch } from "react-icons/go"
import axios from 'axios'

const Map = () => {
    const [clickedMarkerContent, setClickMarkerContent] = useState(null);
    const [clickedMarkerId,setClickMarkerID]=useState(null);
    const [parkingData, setParkingData] = useState({});

    useEffect(() => {

        const fetchParkingData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/getParkingData');
                if(response.data && response.status === 200) {
                    const dataObj = {};
                    response.data.forEach(park => {
                        dataObj[park.Pl_id] = {
                            totalSpaces: park.Pl_total_spaces,
                            occupiedSpaces: park.Pl_occupied_spaces
                        }
                    });
                    setParkingData(dataObj);
                }
            } catch(error) {
                console.error('Failed to fetch parking data: ', error);
            }
        };

        fetchParkingData();

        var container = document.getElementById('map');
        var options = {
            center: new kakao.maps.LatLng(37.4492, 126.654),
            level: 3
        };
        var map = new kakao.maps.Map(container, options);
        map.setDraggable(false);

        var positions = [
            {
                park_id:1,
                content: 'Building_2',
                latlng: new kakao.maps.LatLng(37.450769, 126.655142)
            },
            {
                park_id:2,
                content: 'Main_Building',
                latlng: new kakao.maps.LatLng(37.448542, 126.653943)
            },
            {
                park_id:3,
                content: 'Jungseok',
                latlng: new kakao.maps.LatLng(37.449582, 126.652135)
            },
            {
                park_id:4,
                content: 'Law_school',
                latlng: new kakao.maps.LatLng(37.448181, 126.652453)
            },
            {
                park_id:5,
                content: 'LEC',
                latlng: new kakao.maps.LatLng(37.447447, 126.654358)
            }
        ];

        for (var i = 0; i < positions.length; i++) {
            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: positions[i].latlng // 마커의 위치
            });

            var infowindow = new kakao.maps.InfoWindow({
                content: positions[i].content, // 인포윈도우에 표시할 내용
                removable: true
            });

            kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow, positions[i].content,positions[i].park_id));

        }
        
        function makeOverListener(map, marker, infowindow, content,id) {
            return function () {
                infowindow.open(map, marker);
                setClickMarkerContent(content);
                setClickMarkerID(id);
            };
            
        }
    }, []);


    return (
        <div>
            <div class="e151_226"></div>
            <div class="e151_227">
                <input type="text" id="search_input" placeholder="Where to park?" />
            </div>
            <div class="e151_228">
                <button><GoSearch /></button>
            </div>

            <div id="map" style={{ width: "420px", height: "450px", marginTop: "60px" }}></div>

            {clickedMarkerContent && (
                <Link key={clickedMarkerId} to={`/park/${clickedMarkerId}`}>
                <div class="e151_183">
                    <div class="e151_184"></div>
                    <div class="e151_185" >Inha University</div>
                    <div class="e151_187">{clickedMarkerContent}</div>
                    <div class="e151_186" >
                        {parkingData[clickedMarkerId] ? `${parkingData[clickedMarkerId].totalSpaces-parkingData[clickedMarkerId].occupiedSpaces}/${parkingData[clickedMarkerId].totalSpaces} Parking spots` : 'Loading...' }
                        </div>
                    <div class="e151_188">
                        <div class="e151_190"><FaCarAlt /></div>
                    </div>
                </div>
                </Link>
                
            )}

        </div>
    )
}

export default Map;