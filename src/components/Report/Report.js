import React, { useState } from "react";
import { Col, Container } from "react-bootstrap";
import { Button, Table, Form, Row, Modal } from "react-bootstrap";
import { db } from "../../firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  where,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { BsFillTrashFill, BsPencilFill} from "react-icons/bs";
import Select from "react-select";
import ReactTable from "../ReactTable/ReactTable";
import { getAllQualities, getChallans, getFinalTime, getMonthDayYear, getValueFormatDate, normalDateFormat } from "../../api/firebase-api";
import { disabledStyles } from "../../dropdown/disabledStyles";
import CloseBtn from "../CloseBtn/CloseBtn";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";

const Report = ({ type }) => {
  var today= new Date();
  var todayTimestamp = getFinalTime(new Date());
  var priorDate = getFinalTime(new Date().setDate(today.getDate() - 7));

  const [quickDates, setQuickDates] = useState();
  const [fromDate, setfromDate] = useState(priorDate);
  const [toDate, settoDate] = useState(todayTimestamp);
  const [challanNo, setchallanNo] = useState("");
  const [dying, setdying] = useState("");
  const [data, setdata] = useState([]);
  const [dyinglist, setdyinglist] = useState([]);
  const [qualitylist, setqualitylist] = useState([]);

  const [name, setname] = useState("");
  const [qualityType, setqualityType] = useState("");
  const [dataValue, setdataValue] = useState("");

  var currentURL = window.location.origin;

  const getData = async() => {
    let q = query(collection(db, 'Challan'), where("type", "==", type));
    if(quickDates !== "" && quickDates != undefined){
      var date = new Date(getMonthDayYear(new Date()))
      var todayDate = getValueFormatDate(new Date().getTime());
      var yesterday = date.setDate(date.getDate() - 1);
      if (quickDates === 'today') date = new Date(todayDate).getTime();
      if (quickDates === 'yesterday') date = getFinalTime(yesterday);
      q = query(q, where("timestamp", "==",date),orderBy("challanNo"))
    }else{
      q = query(q, where("challanDateTime", ">=", getFinalTime(fromDate)), where("challanDateTime", "<=", getFinalTime(toDate)),orderBy("challanDateTime"));
    }

    await getChallans(q).then(filterArray => setdata(filterArray))
  };

  React.useEffect(() => {
    const dyingQuery = query(collection(db, "Dying"));
    onSnapshot(dyingQuery, (querySnapshot) => {
      let dyingArray = [];
      querySnapshot.forEach((doc) => {
        dyingArray.push({ ...doc.data(), id: doc.id });
      });
      setdyinglist(dyingArray);
    });

    const qualityQuery = query(collection(db, "Quality"), orderBy("__name__"));
    onSnapshot(qualityQuery, (querySnapshot) => {
      let qualityArray = [];
      querySnapshot.forEach((doc) => {
        qualityArray.push({ ...doc.data(), name: doc.id });
      });
      setqualitylist(qualityArray);
    });

    const getValues = async () => {
      const allqualities = await getAllQualities();
      setqualitylist(allqualities);
    };

    getValues();
    getData();

  }, [type]);

  let dyinglistnames = dyinglist.map((item) => {
    return { value: item.name, label: item.name };
  });
  dyinglistnames.unshift({ label: "Select an option", value: "" });
  let qualitynames = qualitylist.map((item, i) => {
    return { value: item.name, label: item.name };
  });
  qualitynames.unshift({ label: "Select an option", value: "" });

  const columns =[
      {
        Header: "Challan No.",
        accessor: "challanNo",
        width: "3%",
      },
      {
        Header: "Date",
        accessor: "date",
        width: "8%",
        minWidth: '90px',
      },
      {
        Header: "Taka Quality",
        accessor: "taka_quality",
        width: "20%",
      },
      {
        Header: "Color",
        accessor: "color",
        canFilter: true,
        width: "2%",
      },
      {
        Header: "Design",
        accessor: "design",
        canFilter: true,
        width: "2%",
      },
      {
        Header: "Chartwise",
        accessor: "chartwise",
        canFilter: true,
        width: "2%",
      },
      {
        Header: "Num of Taka",
        accessor: "num_of_taka",
        width: "6%",
      }
    ]

    if(currentURL !== "https://yashharia.github.io" ) {
      columns.push({Header: "",accessor: "edit",width: "2%",})
      columns.push({Header: "",accessor: "delete",width: "2%",})
    }

    if(type !== "Dispatch") columns.splice(2,0,{Header: "Job worker",accessor: "dying",width: "10%",})

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
      if(valueArr.length > 0) valueArr.unshift({ label: "Select an option", value: "" });
      return valueArr;
    }
    return valueArr;
  };

  const handleDelete = (docid, indexValue) =>{
    if (window.confirm("Are you sure you want to delete this entry?") == true) {
      getDoc(doc(db, "Challan", docid)).then(docSnap =>{
        let dataList = docSnap.data().dataList;
        dataList.splice(indexValue, 1);
        if(dataList.length == 0) {
          if(window.confirm('This is the last entry in this challan, are you sure you want to delete it?') == true){
            deleteDoc(doc(db, "Challan", docid));
            alert('Entry deleted')
          }
        }
        else{
          updateDoc(doc(db, "Challan", docid), {dataList: dataList}).then(doc => {
            alert('Entry deleted')
          })
        }
        setdata(prevState => [...prevState.filter((item) => {
          if(item.name == docid && item.indexValue == indexValue) return false
          return true
        } ) ])
      })
    }
  }

  var filteredData = data;
  if(challanNo && challanNo !=="") filteredData = filteredData.filter((item) => item.challanNo === challanNo)
  if(name && name !=="") filteredData = filteredData.filter((item) => item.taka_quality === name)
  if(dying && dying !=="") filteredData = filteredData.filter((item) => item.dying === dying)
  if(dataValue && dataValue !=="") filteredData = filteredData.filter((item) => item.dataValue === dataValue)

  filteredData = filteredData.map(item => {
    return {...item, 
      edit : <Link to={(type== "Receipt")?`/edit/receipt/${item.name}`:`/edit/receipt/dispatch/${item.name}`}>
        <BsPencilFill size={12} className="m-auto"/>
        </Link>, 
      delete: <BsFillTrashFill size={12}  onClick={()=>handleDelete(item.name, item.indexValue)}/> 
    }
  });

  var totalqty = filteredData.reduce((result, item)=> {
    if(item.num_of_taka !== undefined) return result = result + item.num_of_taka
    return result;
  },0);
  filteredData = [...filteredData, {
    taka_quality: <b>TOTAL QTY</b>,
    num_of_taka: <b>{totalqty}</b>
  }]

  console.log(quickDates, 'quickdates')

  return (
    <>
    <Container className="pb-5 mt-0">
      <h5 className="text-center mb-4">{type} Report</h5>
      <Row className="d-print-none">
        <Col xs={6} className="my-2">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Today / Yesterday</Form.Label>
            <Form.Select value={quickDates} aria-label="Default select example" onChange={(e) => setQuickDates(e.target.value)}>
              <option value=''>Select option</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={6} className="my-2">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>From Date</Form.Label>
            <DatePicker dateFormat="dd/MM" disabled={(quickDates !== '' && quickDates != undefined) ? true : false} 
            selected={fromDate} preventOpenOnFocus={true} 
            onChange={(date) => {setfromDate(getFinalTime(date)); console.log(date, 'from date')}} 
              id="date-field" className="form-control"/>
          </Form.Group>
        </Col>
        <Col xs={6} className="my-2">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>To Date</Form.Label>
            <DatePicker dateFormat="dd/MM" disabled={(quickDates !== '' && quickDates != undefined) ? true : false} 
            selected={toDate} preventOpenOnFocus={true} 
            onChange={(date) => {settoDate(getFinalTime(date)); console.log(date, 'to date')}} 
            id="date-field" className="form-control"/>
          </Form.Group>
        </Col>
        <Col xs={6} className="my-2">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Challan No.</Form.Label>
            <Form.Control type="text" placeholder="Challan no." value={challanNo} 
              onChange={(e) => {setchallanNo(e.target.value.toUpperCase());}}/>
          </Form.Group>
        </Col>
        {type == "Receipt" && (
          <Col xs={6}  className="my-2">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Job Worker</Form.Label>
              <Select options={dyinglistnames} isSearchable={true} maxMenuHeight={100} onChange={(e) => {setdying(e.value);}}/>
            </Form.Group>
          </Col>
        )}
      </Row>
      <Row className="pt-3 d-print-none">
        <Col xs={12} md={1}><p>Quality</p></Col>
        <Col xs={6} className="my-2">
          <Select options={qualitynames} value={{ value: name, label: name }} maxMenuHeight={100} isSearchable={true} 
          onChange={(e) => {
            setname(e.value);setqualityType("");setdataValue("");
            const currentActiveInput = document.querySelector('input:focus');
            const nextActiveInput = currentActiveInput.nextElementSibling;
            nextActiveInput.focus();
          }}/>
        </Col>
        <Col xs={6} className="my-2">
          <Select maxMenuHeight={100}
            options={getListDetails(name, "color")}
            isSearchable={true} isDisabled={getListDetails(name, "color").length > 0 ? false : true}
            styles={disabledStyles} onChange={(e) => {setqualityType("color");setdataValue(e.value);}}/>
        </Col>
        <Col xs={6} className="my-2">
          <Select maxMenuHeight={100}
            options={getListDetails(name, "chartwise")}
            isSearchable={true} isDisabled={getListDetails(name, "chartwise").length > 0 ? false : true}
            styles={disabledStyles} onChange={(e) => {setqualityType("chartwise");setdataValue(e.value);}}/>
        </Col>
        <Col xs={6} className="my-2">
          <Select options={getListDetails(name, "design")} maxMenuHeight={100}
            isSearchable={true} classNamePrefix="react-select" 
            isDisabled={getListDetails(name, "design").length > 0 ? false : true} styles={disabledStyles}
            onChange={(e) => {setqualityType("design");setdataValue(e.value);}}/>
        </Col>
      </Row>
      <Row className="text-center mb-5 d-print-none">
        <Col className="mt-4">
          <Button onClick={getData}>Filter</Button><CloseBtn/><Button onClick={()=>window.print()}>Print</Button>
        </Col>
      </Row>
      <div className="mb-1">
        <b>Form date: {normalDateFormat(fromDate)}</b> <br/>  <b>To date: {normalDateFormat(toDate)}</b>
      </div>
      {data.length > 0 && <ReactTable columns={columns} data={filteredData} showEditDelete={true}/>}
      <br/>
      <div className="text-center d-print-none"><CloseBtn/></div>
    </Container>
    </>
  );
};

export default Report;
