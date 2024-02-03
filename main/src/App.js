// import logo from './logo.svg'; // 앱 로고 이미지
import './App.css'; // 앱 스타일

import { BrowserRouter,Route,Routes, useParams } from 'react-router-dom'
import React from 'react'// 리액트 core

import Maps from './Map'
import Jungseok from './Jungseok';
import BuildTwo from './BuildTwo';
import User from './User'
import Park from './ParkSpace'
import Join from './Join'
function App() {


  

  const Paging = () => {
    const { clickedMarkerId } = useParams();
    if (clickedMarkerId === '1') {
      return <BuildTwo />;
    }
    else if (clickedMarkerId === '3') {
      return <Jungseok/>;
    }
    return null;
  }

  return (
    <BrowserRouter> 
      <div className="App">
        <Routes>
          <Route path="/" element={<User />} />
          <Route path="/maps" element={<Maps/>}/>
          <Route path='/user/join' element={<Join/>}/>
          <Route path='/park' element={<Park />} />
          <Route path="/park/:clickedMarkerId" element={<Paging />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
