import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Form,
  Row,
  Alert,
  Col,
  Container,
} from "react-bootstrap";
import Select from "react-select";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  where,
  orderBy,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { getAllQualities, getChallans, normalDateFormat } from "../../api/firebase-api";
import { disabledStyles } from "../../dropdown/disabledStyles";
import CloseBtn from "../CloseBtn/CloseBtn";
import ReactTable from "../ReactTable/ReactTable";

export default function ViewReport() {
  const [qualitylist, setqualitylist] = useState([]);
  const [qualityData, setqualityData] = useState([]);
  const [data, setdata] = useState([]);
  const [name, setname] = useState("");
  const [type, settype] = useState("");
  const [dataValue, setdataValue] = useState("");

  const getData = async () => {
    if (name && type) {
      let q = query(collection(db, 'Challan'), orderBy("challanDateTime"),where("qualities","array-contains", name));
      getChallans(q).then(filterArray => {setdata(filterArray);})
    }
  };

  useEffect(() => {
    const getValues = async () => {
      const allqualities = await getAllQualities();
      setqualitylist(allqualities);
    };
    getValues();
  }, []);

  const getListDetails = (name, listName) => {
    let arr = [...qualitylist];
    let obj = arr.filter((o) => o.name === name);
    var valueArr = [];
    if (obj.length > 0) {
      var value = Object.entries(obj[0][listName]).map(([key, value]) => {
        try {
          valueArr.push({ value: key, label: key });
        } catch (e) {
          console.log("push error", e);
        }
      });
      return valueArr;
    }
    return valueArr;
  };

  let qualitynames = qualitylist.map((item, i) => {
    return { value: item.name, label: item.name };
  });
  
  var total = 0;
  function compare( a, b ) {
    if ( a.challanDateTime < b.challanDateTime )return -1;
    if ( a.challanDateTime > b.challanDateTime )return 1;
    return 0;
  }
  var passbookData = data.sort( compare ).filter((item)=> item.dataValue === dataValue && item.taka_quality === name);

  if(name && dataValue){
    var openingBalObj = qualitylist.find(item => {return item.name == name})
    var openingBal = openingBalObj[openingBalObj.type][dataValue].quantity
    passbookData.unshift({
      dying: 'Opening balance', 
      num_of_taka: openingBal
    })
  }

  var dispatchTotal = 0;
  var receiptTotal = 0;
  return (
    <>
      <h4 className="text-center">Quality Wise Report</h4>
      <Row className="pt-3">
        <Col xs={6}   sm={3} className="my-2">
          <Select  
            options={qualitynames} value={{ value: name, label: name }} isSearchable={true} maxMenuHeight={100}
            onChange={(e) => {
              setname(e.value);settype("");setdataValue("");
              const currentActiveInput = document.querySelector('input:focus');
              const nextActiveInput = currentActiveInput.nextElementSibling;
              nextActiveInput.focus();
              }}/>
        </Col>
        <Col xs={6} sm={3} className="my-2">
          <Select
            options={getListDetails(name, "color")}
            isSearchable={true} isDisabled={getListDetails(name, "color").length > 0 ? false : true}
            styles={disabledStyles} maxMenuHeight={100} onChange={(e) => {settype("color");setdataValue(e.value);}}/>
        </Col>
        <Col xs={6}  sm={3} className="my-2">
          <Select
            options={getListDetails(name, "chartwise")}
            isSearchable={true} isDisabled={getListDetails(name, "chartwise").length > 0 ? false : true}
            styles={disabledStyles} maxMenuHeight={100} onChange={(e) => {settype("chartwise");setdataValue(e.value);}}/>
        </Col>
        <Col xs={6}  sm={3} className="my-2">
          <Select
            options={getListDetails(name, "design")}
            isSearchable={true} maxMenuHeight={100} 
            classNamePrefix="react-select"
            isDisabled={getListDetails(name, "design").length > 0 ? false : true}
            styles={disabledStyles}
            onChange={(e) => {
              settype("design");
              setdataValue(e.value);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col className="text-center w-100 p-3">
          <Button variant="primary" onClick={getData}>
            Filter
          </Button>
          <CloseBtn />
        </Col>
      </Row>

      {data.length > 0 ? (
        <>
        <Table
          className="table-bordered bordered-table"
          size="sm"
          style={{ width: "70%" }}
        >
          <tr>
            <th>Date</th>
            <th>Challan</th>
            <th>Dying</th>
            <th>Dispatch</th>
            <th>Receipt</th>
            <th>Total</th>
          </tr>
          {passbookData.map((item, i) => {
            var color = item.type == "Receipt" ? "#b2e9b2" : "#fda09b";
            var num_of_taka = ((item.num_of_taka === undefined || isNaN(item.num_of_taka))? 0 : item.num_of_taka)
            if (item.type == "Dispatch"){
              total = total - num_of_taka;
              dispatchTotal = dispatchTotal + num_of_taka;
            }
            else{
              total = total + num_of_taka;
              if (item.type == "Receipt") receiptTotal = receiptTotal + num_of_taka;
            }
            console.log(num_of_taka, 'num of taka', item.type)
            return (
              <tr>
                <td> {(item.challanDateTime)?normalDateFormat(item.challanDateTime) : ""}</td>
                <td> {item.challanNo}</td>
                <td> {item.dying}</td>
                <td style={{ background: color }}>
                  {item.type == "Dispatch" ? item.num_of_taka : ""}
                </td>
                <td style={{ background: color }}>
                  {item.type == "Receipt" ? item.num_of_taka : ""}
                </td>
                <td style={{ background: color }}>{total}</td>
              </tr>
            );
          })}
           <tr>
                <td></td>
                <td></td>
                <td><b>Total</b></td>
                <td><b>{dispatchTotal}</b></td>
                <td><b>{receiptTotal}</b></td>
                <td></td>
            </tr>
        </Table>
        <div className="text-center"><CloseBtn/></div>
        </>
      ) : (
        <h4>No reports yet</h4>
      )}
    </>
  );
}
