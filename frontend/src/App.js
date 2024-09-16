import React from 'react';
import Login from "./Components/Login"
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Signup from "./Components/Signup";
import Home from './Components/Home';
import Update from './Components/Update';
import Pay from './Components/Pay'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path='/home/:id' element={<Home />}></Route>
        <Route path='/update/:id' element={<Update />}></Route>
        <Route path="/pay/:id" element={<Pay />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
