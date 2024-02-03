import './Jungseok.css';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
// import {BiSolidDoorOpen} from 'react-icons/bi'
// import {TbArrowBearLeft} from 'react-icons/tb'
import 'bootstrap/dist/css/bootstrap.min.css';


const Jungseok = () => {
  const [isParked, setIsParked] = useState(false); 
  const [parkingData, setParkingData] = useState([]);
  const [selectedBest, setSelectedBest] = useState(null);
  const [storedPsNumber, setStoredPsNumber] = useState(null);
  const [buttonStatus, setButtonStatus] = useState(null);
  const [selectedPs, setSelectedPs] = useState(null);
  
  
  const handleToggle = (value) => {
    // Update the selectedBest state to the last selected value or null if no button is selected
    setSelectedBest(value.length > 0 ? value[value.length - 1] : null);
  };
  
  const getClassNameForPark = (id) => {
    switch(id) {
        case 'A1': return "e237_417";
        case 'A2': return "e237_416";
        case 'A3': return "e237_415";
        case 'A4': return "e237_414";
        case 'A5': return "e237_413";
        case 'A6': return "e237_412";
        case 'A7': return "e237_411";
        case 'A8': return "e237_410";
        case 'A9': return "e237_409";
        case 'A10': return "e237_408";
        case 'A11': return "e237_407";
        case 'A12': return "e237_406";

        case 'B1': return "e237_405";
        case 'B2': return "e237_404";
        case 'B3': return "e237_403";

        case 'C1': return "e237_402";
        case 'C2': return "e237_401";
        case 'C3': return "e237_400";
        case 'C4': return "e237_399";
        case 'C5': return "e237_398";
        case 'C6': return "e237_397";
        case 'C7': return "e237_396";
        case 'C8': return "e237_395";
        case 'C9': return "e237_394";
        case 'C10': return "e237_393";
        case 'C11': return "e237_392";
        case 'C12': return "e237_391";
        case 'C13': return "e237_390";
        case 'C14': return "e237_389";
        case 'C15': return "e237_388";
        case 'C16': return "e237_387";
        case 'C17': return "e237_386";
        case 'C18': return "e237_385";
        case 'C19': return "e237_384";
        case 'C20': return "e237_383";
        case 'C21': return "e237_382";
        case 'C22': return "e237_381";
        case 'C23': return "e237_380";
        case 'C24': return "e237_379";
        case 'C25': return "e237_378";
        case 'C26': return "e237_377";
        case 'C27': return "e237_376";
        case 'C28': return "e237_375";
        case 'C29': return "e237_374";
        case 'C30': return "e237_373";
        case 'C31': return "e237_372";
        case 'C32': return "e237_371";

        case 'D1': return "e237_452";
        case 'D2': return "e237_451";

        case 'E1': return "e237_450";
        case 'E2': return "e237_449";
        case 'E3': return "e237_448";
        case 'E4': return "e237_447";
        case 'E5': return "e237_446";
        case 'E6': return "e237_445";
        case 'E7': return "e237_444";

        case 'F1': return "e237_443";
        case 'F2': return "e237_442";
        case 'F3': return "e237_441";
        case 'F4': return "e237_440";

        case 'G1': return "e237_439";
        case 'G2': return "e237_438";
        case 'G3': return "e237_437";
        case 'G4': return "e237_436";
        case 'G5': return "e237_435";
        case 'G6': return "e237_434";

        case 'H1': return "e237_433";
        case 'H2': return "e237_432";
        case 'H3': return "e237_431";
        case 'H4': return "e237_430";
        case 'H5': return "e237_429";

        case 'I1': return "e237_428";
        case 'I2': return "e237_423";
        case 'I3': return "e237_424";
        case 'I4': return "e237_425";
        case 'I5': return "e237_426";
        case 'I6': return "e237_427";

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
      axios.get('http://localhost:8080/parking_space/jeongseok')
        .then(response => {
          if (response.data.success) {
            const filteredData = response.data.ParkingSpace.filter(park => park.Parking_lot_Pl_id === 3);
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
      setButtonStatus('Parked ');
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
    <div>
      <div class="e237_370"></div>
      <div class="road_4"></div>
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
        parkinglot={3}
        className={getClassNameForPark(park.Ps_number)}
        style={style}
        onClick={() => handleButtonClick(park.Ps_number, getColorForOccupied(park))}
      />
    );
    return content;
  })}
      {/* object building */}
      <div className="e237_421"></div>
      <div className="e237_420"></div>
      <div className="e237_419"></div>
      <div className="e237_418"></div>
      <div className="e237_453"></div>
      <div className="e231_370"></div>


      <div className="button">
        <ToggleButtonGroup type="checkbox" value={selectedBest} onChange={handleToggle}>
          <ToggleButton id="tbg-btn-1" value={1}>
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

export default Jungseok;

