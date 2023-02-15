import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Container } from "react-bootstrap";

import Add from "./components/Quality/Add";
import Header from "./components/Header";
import Report from "./components/Report/Report";
import Home from "./components/Home";
import Dying from "./components/Dying/Dying";
import QualityList from "./components/Quality/List";
import AddQuality from "./components/Quality/Add";
import AddReceipt from "./components/Receipt/AddReceipt";
import QualityReport from "./components/Report/QualityReport";
import QualityDetailReport from "./components/Report/QualityDetailReport";

function App() {

  var currentURL = window.location.origin;

  return (
    <>
      <Header />
      <Container>
        <div className="mt-5">
          <Routes>
            {(currentURL !== "https://yashharia.github.io" ) && 
              <>
              <Route exact path="/receipt" element={<AddReceipt type="Receipt" />} />
              <Route exact path="/edit/receipt/:editid" element={<AddReceipt type="Receipt" />} />
              <Route exact path="/edit/receipt/dispatch/:editid" element={<AddReceipt type="Dispatch" />}/>
              <Route exact path="/dispatch" element={<AddReceipt type="Dispatch" />}/>
              </>
            }
            <Route path="/dispact-report" element={<Report type="Dispatch"/>} />
            <Route path="/report" element={<Report type="Receipt"/>} />
            <Route path="/quality-report" element={<QualityReport/>} />
            <Route path="/quality-wise-report" element={<QualityDetailReport/>} />
            <Route path="/master/quality" element={<QualityList />} />
            <Route path="/master/add/quality/" element={<AddQuality />} />
            <Route path="/master/edit/quality/:editname" element={<AddQuality />} />
            <Route path="/master/add/dying" element={<Dying />} />
            <Route path="/" element={<Home />} />

          </Routes>
        </div>
      </Container>
    </>
  );
}

export default App;
