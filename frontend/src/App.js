import React, { Component } from "react";
import HeaderComponent from "./components/HeaderComponent";
import "./App.scss";
import { Route, Routes } from 'react-router-dom';
import SingleDateComponent from "./components/SingleDateComponent";
import MultiDateComponent from "./components/MultiDateComponent";

class App extends Component {
  render() {
    return (

      <div className="App">
        <HeaderComponent />
        <Routes>
          <Route exact path='/' element={<SingleDateComponent />} />
          <Route exact path='/singleDateComponent' element={<SingleDateComponent />} />
          <Route exact path='multiDateComponent' element={<MultiDateComponent />} />
        </Routes>
      </div>

    );
  }
} 

export default App;
