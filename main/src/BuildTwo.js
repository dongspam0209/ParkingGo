import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {BiSolidDoorOpen} from 'react-icons/bi'
import {TbArrowBearLeft} from 'react-icons/tb'

import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

import 'bootstrap/dist/css/bootstrap.min.css';
import './BuildTwo.css';
 // Connect to your server's socket

const BuildTwo = () => {
  const [isParked, setIsParked] = useState(false); 
  const [parkingData, setParkingData] = useState([]);
  const [selectedBest, setSelectedBest] = useState(null);
  const [storedPsNumber, setStoredPsNumber] = useState(null);
  const [buttonStatus, setButtonStatus] = useState(null);
  const [selectedPs, setSelectedPs] = useState(null);

  
  const handleToggle = (value) => {
    setSelectedBest(value.length > 0 ? value[value.length - 1] : null);
  };
  
  const getClassNameForPark=(id)=>{
    
    switch (id) {
      case 'A1': return "e258_977";
      case 'A2': return "e258_976";
      case 'A3': return "e258_975";
      case 'A4': return "e258_974";
      case 'A5': return "e258_973";
      case 'A6': return "e258_972";
      case 'A7': return "e258_971";
      case 'A8': return "e258_970";
      case 'A9': return "e258_969";

      case 'B1': return "e258_986";
      case 'B2': return "e258_985";
      case 'B3': return "e258_984";
      case 'B4': return "e258_983";
      case 'B5': return "e258_982";
      case 'B6': return "e258_981";
      case 'B7': return "e258_980";
      case 'B8': return "e258_979";

      case 'C1': return "e258_988";
      case 'C2': return "e258_989";
      case 'C3': return "e258_990";
      case 'C4': return "e258_991";
      case 'C5': return "e258_992";
      case 'C6': return "e258_993";

      case 'D1': return "e258_1017";
      case 'D2': return "e258_1018";
      case 'D3': return "e258_1019";
      case 'D4': return "e258_1020";
      case 'D5': return "e258_1021";
      case 'D6': return "e258_1022";
      case 'D7': return "e258_1023";
      case 'D8': return "e258_1024";
      case 'D9': return "e258_1025";
      case 'D10': return "e258_1026";

      case 'E1': return "e258_1008";
      case 'E2': return "e258_1007";
      case 'E3': return "e258_1006";
      case 'E4': return "e258_1005";
      case 'E5': return "e258_1004";
      case 'E6': return "e258_1003";

      case 'F1': return "e258_1002";
      case 'F2': return "e258_1001";
      case 'F3': return "e258_1000";
      case 'F4': return "e258_999";
      case 'F5': return "e258_998";
      case 'F6': return "e258_997";

      case 'G1': return "e258_996";
      case 'G2': return "e258_995";

      case 'H1': return "e258_1015";
      case 'H2': return "e258_1014";
      case 'H3': return "e258_1013";

      case 'I1': return "e258_1012";
      case 'I2': return "e258_1011";
      case 'I3': return "e258_1010";

      default: return '';
    }
  
  
  };

  const getColorForOccupied = (park) => {
    if (park.Ps_isOccupied === 1) return 'red';
    if (selectedBest === 1 && park.Ps_best === 1) return 'blue'; // Easiest to park
    if (selectedBest === 2 && park.Ps_best === 2) return 'pink'; // Closest to entry
    return 'green'; // Default color for unoccupied
  };

  useEffect(() => {
    const intervalId = setInterval(() => { // Assign interval to a variable to clear it.
      axios.get('http://localhost:8080/parking_space/num2')
        .then(response => {
          if (response.data.success) {
            const filteredData = response.data.ParkingSpace.filter(park => park.Parking_lot_Pl_id === 1);
            setParkingData(filteredData);
          }
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
        });
    }, 2000); // Polling interval set at 5 seconds
  
    return () => clearInterval(intervalId); // This is important to clear the interval when the component unmounts.
  }, []);

  const handleButtonClick = (psNumber,color) => {

    setStoredPsNumber(psNumber);
    setButtonStatus(color === 'red'? 'Already Occupied': 'Park here?' );
    setSelectedPs(psNumber);
    setIsParked(false);
  };

  const handleParkedClick = () => {
    if (isParked) {
      // If already parked, reset everything
      setStoredPsNumber(null);
      setButtonStatus(null);
      setSelectedPs(null);
      setIsParked(false);
    } else if (storedPsNumber) {
      // Set the current space as parked
      setButtonStatus('Parked');
      setIsParked(true);
    }
  };

  const buttonStyle = (park) => {
    if (isParked) {
      if (park.Ps_number === selectedPs) {
        // Maintain style for the selected parking space
        return { backgroundColor: 'white', color: 'black', cursor: 'default' };
      } else {
        // Non-interactive style for other spaces
        return { backgroundColor: getColorForOccupied(park), cursor: 'default' };
      }
    } else if (park.Ps_number === selectedPs) {
      // Interactive style for the currently selected space
      return { backgroundColor: 'white', color: 'black' };
    }
    // Default style for unselected parking spaces
    return { backgroundColor: getColorForOccupied(park) };
  };

  return (
    <div className="e258_897">

      {/* object building */}
      <div class="door_pos"><BiSolidDoorOpen size={24}/></div>
      <div class="road_arrow"><TbArrowBearLeft size={24}/></div>
      <div class="road_1"/>      
      <div class="road_2"/>      
      <div class="road_3"/>      
      {/* object building */}
      <div class="e258_933">&nbsp; No2. Building</div>
      <div class="e258_934"></div>
      <div class="tree"/>
      <div class="tree_2"/>
      <div class="tree_3"/>
      <div class="tree_4"/>

      <div class="e263_149">
        <div class="e258_899"></div>
        <div class="e258_901">&nbsp; No4. Building</div>
      </div>
      {/* parking lot */}

      <div className="e263_148">
  {parkingData.map(park => {
    const style = buttonStyle(park);
    const content = isParked ? (
      <div
        key={park.Ps_id}
        className={getClassNameForPark(park.Ps_number)}
        style={style}
      >
        {/* Optionally, you can display the parking space number or any other content here */}
      </div>
    ) : (
      <button
        key={park.Ps_id}
        parkinglot={1}
        className={getClassNameForPark(park.Ps_number)}
        style={style}
        onClick={() => handleButtonClick(park.Ps_number, getColorForOccupied(park))}
      />
    );
    return content;
  })}
</div>
      <div className="button">
        <ToggleButtonGroup type="checkbox" value={selectedBest} onChange={handleToggle}>
          <ToggleButton id="tbg-btn-1"  value={1}>
            Easiest to Park
          </ToggleButton>
          <ToggleButton id="tbg-btn-2" value={2}>
          Closest to Entry
          </ToggleButton>
        </ToggleButtonGroup>
        
      </div>
      <div className='parkspace_stat'>
      <button
          style={{
            backgroundColor: isParked ? 'pink' : '#4CAF50', // Override background color dynamically
            color: isParked ? 'black' : 'white', // Override text color dynamically
            // Other styles will be taken from your CSS
          }}
          onClick={handleParkedClick}
        >
          {buttonStatus || 'Select a Space'} {/* Display default text if buttonStatus is empty */}
        </button>
      </div>
     
    </div>
  );
};

export default BuildTwo;