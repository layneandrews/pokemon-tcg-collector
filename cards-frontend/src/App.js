import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import { Route, Routes, useNavigate } from "react-router-dom"
// import { createGlobalStyle } from "styled-components"
// import { useEffect, useState } from "react"
// import Home from "./components/Home"
// import ProductionForm from "./components/ProductionForm"
// import ProductionEdit from "./components/ProductionEdit"
// import Navigation from "./components/Navigation"
// import ProductionDetail from "./components/ProductionDetail"
// import NotFound from "./components/NotFound"
// import Authentication from "./components/Authentication"

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home/>}/>
    </Routes>
  );
}

export default App;
