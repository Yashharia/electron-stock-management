import { Button, Table, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { db } from "../../firebase";
import {
  collection,
  query,
  onSnapshot,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  dateFormat,
  getAllQualities,
  getFinalTime,
  getValueFormatDate,
} from "../../api/firebase-api";
import { disabledStyles } from "../../dropdown/disabledStyles";
import CloseBtn from "../CloseBtn/CloseBtn";
import DatePicker from "react-datepicker";

function AddReceipt({ type, history }) {
  const navigate = useNavigate();
  const { editid } = useParams();

  const [date, setdate] = useState("");
  const [challanDateTime,setchallanDateTime] = useState("");
  const [dying, setdying] = useState("");
  const [dyinglist, setdyinglist] = useState([]);
  const [qualitylist, setqualitylist] = useState([]);
  const [challanNo, setchallanNo] = useState("");

  const [dataList, setdataList] = useState([{ name: "" }]);
  const[totalTaka, setTotalTaka] =useState(0);

  const [disableSubmit, setdisableSubmit] = useState(false);

  const[timestamp, setTimestamp]= useState(getFinalTime(new Date()));

  const handleSubmit = async (e) => {
    setdisableSubmit(true);
    e.preventDefault();

    if(date == "" || date == undefined){
      console.log('throw error')
      alert('use proper date form dd/mm')
      setdisableSubmit(false);
      return
    } 
    if (challanNo !== "" && date !== "") {
      console.log(date, 'get date')
      var id = getValueFormatDate(date) + "-" + challanNo + "-" + type;
      const docSnap = await getDoc(doc(db, "Challan", id));
      if (docSnap.exists() && !editid) {
        alert("Receipt with Chall No: " +challanNo +" and data: " +date +" already exist");
        setdisableSubmit(false);
      } else {        
        let qualities = [...new Set(dataList.map(item => item.name))]
        .filter((name) => {return name != ""}); //unique qualities
        let qualitiesValues = [...new Set(dataList.map(item => item.value))]
        .filter((name) => {return name !== undefined}); // unique internal values

        var dataListVal = dataList.filter(item => {
          if(item.value == undefined || item.value =='') return false
          return true 
        })

        var convertedDate = getFinalTime(challanDateTime);
        if(editid){
          setDoc(doc(db, "Challan", editid), 
          {id: editid,challanDateTime: convertedDate,challanNo,dying,dataList: dataListVal, qualities,qualitiesValues, type, totalTaka,timestamp})
          .then(doc => (type == "Receipt")? navigate("/report") : navigate("/dispact-report/"))
        }else{
          setDoc(doc(db, "Challan", id), 
          {id,challanDateTime: convertedDate,challanNo,dying,dataList: dataListVal, qualities,qualitiesValues, type, totalTaka, timestamp})
          .then(message => {setchallanNo("");setdying("");setdataList([{ name: "", num: 0 }]);setdisableSubmit(false);setTotalTaka(0); window.location.reload(true)})       
        }
      }
    }
  };

  useEffect(() => {
    const dyingQuery = query(collection(db, "Dying"));
    onSnapshot(dyingQuery, (querySnapshot) => {
      let dyingArray = [];
      querySnapshot.forEach((doc) => {
        dyingArray.push({ ...doc.data(), id: doc.id });
      });
      setdyinglist(dyingArray);
    });

    const getQualities = async () => {
      const allqualities = await getAllQualities();
      setqualitylist(allqualities);
    };
    getQualities();

    if(editid){
      getDoc(doc(db, "Challan", editid)).then(
        docSnap => {
          var data = docSnap.data()
          setdate(new Date(data.challanDateTime));
          setchallanDateTime(data.challanDateTime);
          setchallanNo(data.challanNo);
          setdying(data.dying);
          setdataList(data.dataList);
          setTotalTaka(data.totalTaka)
          setTimestamp(data.timestamp)
        }
      )
    }else{
      setdate(''); setchallanDateTime('');setchallanNo('');setdying('');setdataList([{ name: "", num: 0 }]);setTotalTaka(0)
    }

    if(type == "Receipt"){
      document.getElementById('date-field').focus();
    }else{
      var challanNumField = document.getElementById('challan-no');
      challanNumField.focus();
    }

    return;
  }, [editid, type]);

  

  const addData = (i, value) => {
    // add new row
    var newData = [...dataList];
    newData[i] = {...newData[i],...value};
    
    if (newData[newData.length - 1].name != "" && newData[newData.length - 1].value != undefined ) { // previous condition had type === "Dispatch"
      var indexVal =newData.length - 1 ;
      if(indexVal < 0) indexVal = 0
      newData.push({ name: newData[indexVal].name });
    }
    setdataList(newData);
    
    var total = newData.reduce((result, item) => {
      console.log(item.num , 'item num')
      if(item.num!= undefined && !isNaN(item.num)) return result + item.num 
      return result
    },0)

    setTotalTaka(total)

    const currentActiveInput = document.querySelector('input:focus');
    const nextActiveInput = currentActiveInput.nextElementSibling;
    nextActiveInput.focus();
  };

  const moveTwoSteps = (i) => {
    const currentRows = document.querySelectorAll('#receiptData tr');
    const inputTags = currentRows[i+2].querySelector('input');
    inputTags.focus();
    console.log(inputTags, 'Inputtags')
    // nextActiveInput.focus();
  }

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

  var widthHeading = { width: "20%" };
  let qualitynames = qualitylist.map((item) => {
    return { value: item.name, label: item.name };
  });
  let dyinglistnames = dyinglist.map((item) => {
    return { value: item.name, label: item.name };
  });

  qualitynames.unshift({ value: "", label: "Select option" })

  return (
    <>
      <h3 className="mt-3 text-center">
        {editid ? "Edit" : ""} {type}
      </h3>
      <Form className="py-4" onSubmit={handleSubmit}  onKeyPress={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
          }
        }}>

        {(type === "Receipt") ? 
        <Row>
          <Form.Group className="mb-3 col" controlId="formBasicEmail">
            <Form.Label>Date (dd/mm) receipt</Form.Label>
            <DatePicker required dateFormat="dd/MM" selected={date} preventOpenOnFocus={true} onChange={(date) => {setdate(date); setchallanDateTime(dateFormat(date));}} id="date-field" className="form-control"/>
          </Form.Group>

          <Form.Group className="mb-3 col" controlId="formBasicEmail">
            <Form.Label>Job Worker</Form.Label>
            <Select options={dyinglistnames} isSearchable={true} onChange={(e) => {setdying(e.value);}}
              value={dyinglistnames.filter((dyingname) => dying === dyingname.value)}/>
          </Form.Group>
          
          <Form.Group className="mb-3 col" controlId="formBasicEmail" id="challan-form-group">
            <Form.Label>Challan No</Form.Label>
            <Form.Control required type="text" placeholder="Challan No." value={challanNo} id="challan-no"
              onChange={(e) => setchallanNo(e.target.value.toUpperCase())} />
          </Form.Group>

        </Row>:
        <Row>
          
          <Form.Group className="mb-3 col" controlId="formBasicEmail" id="challan-form-group">
            <Form.Label>Challan No</Form.Label>
            <Form.Control required type="text" placeholder="Challan No." value={challanNo} id="challan-no"
            onChange={(e) => setchallanNo(e.target.value.toUpperCase())}/>
          </Form.Group>

          <Form.Group className="mb-3 col" controlId="formBasicEmail">
            <Form.Label>Date (dd/mm)</Form.Label>
            <DatePicker dateFormat="dd/MM" selected={date} preventOpenOnFocus={true} onChange={(date) => {setdate(date); setchallanDateTime(dateFormat(date));}} id="date-field" className="form-control"/>
          </Form.Group>
      </Row>
        }


        <Table striped bordered hover size="sm" className="mt-2" id="receiptData">
          <thead>
            <tr>
              <th style={widthHeading}>Quality</th>
              <th style={widthHeading}>Color</th>
              <th style={widthHeading}>Chartwise</th>
              <th style={widthHeading}>Design</th>
              <th style={{ width: "15%" }}>No. of taka</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item, i) => {
              var qualityType, selectvalue;
              if (typeof item.data != undefined) {
                try {qualityType = item.type;} catch {}
                try {selectvalue = item.value;} catch {}
              }
              return (
                <tr key={i}>
                  <td>
                    <Select
                      options={qualitynames}
                      isSearchable={true}
                      menuPortalTarget={document.body}
                      menuShouldBlockScroll={true}
                      maxMenuHeight={100}
                      onChange={(e) => {addData(i, {"name": e.value});}}
                      value={dataList[i].name ? { value: dataList[i].name, label: dataList[i].name }: null}
                    />
                  </td>
                  <td>
                    <Select
                      options={getListDetails(dataList[i].name, "color")}
                      isSearchable={true}
                      onChange={(e) => {addData(i, {"value": e.value, "type": "color"})}}
                      menuPortalTarget={document.body}
                      menuShouldBlockScroll={true}
                      maxMenuHeight={100}
                      isDisabled={getListDetails(dataList[i].name, "color").length > 0? false: true}
                      styles={disabledStyles}
                      value={qualityType == "color"? { value: selectvalue, label: selectvalue }: null}
                    />
                  </td>
                  <td>
                    <Select
                      options={getListDetails(dataList[i].name, "chartwise")}
                      isSearchable={true}
                      onChange={(e) => {addData(i, {"type": "chartwise", "value": e.value});}}
                      menuPortalTarget={document.body}
                      menuShouldBlockScroll={true}
                      maxMenuHeight={100}
                      isDisabled={getListDetails(dataList[i].name, "chartwise").length > 0? false: true}
                      styles={disabledStyles}
                      value={qualityType == "chartwise"? { value: selectvalue, label: selectvalue }: null}
                    />
                  </td>
                  <td>
                    <Select
                      options={getListDetails(dataList[i].name, "design")}
                      isSearchable={true} classNamePrefix="react-select"
                      onChange={(e) => {addData(i, {"type": "design", "value": e.value})}}
                      menuPortalTarget={document.body}
                      menuShouldBlockScroll={true}
                      maxMenuHeight={100}
                      isDisabled={getListDetails(dataList[i].name , "design").length > 0 ? false : true}
                      styles={disabledStyles} 
                      value={qualityType == "design" ? { value: selectvalue, label: selectvalue } : null}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number" step="any" placeholder="Num of taka" value={dataList[i].num}
                      onChange={(e) => {console.log(e, 'data ee'); addData(i, {"num": parseFloat(e.target.value)}); }}
                      onKeyDown={(e) => (e.key === "Tab")? moveTwoSteps(i) : ''}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="text-center mt-3">
          <h5>Total Taka : <strong>{totalTaka}</strong></h5>
        </div>

        <div className="mt-4 text-center">

          <Button variant="primary" type="submit" 
            disabled={disableSubmit}
            >
              {(editid)? `Save edit` : `Save`}
          </Button>
          <CloseBtn />
        </div>
      </Form>
    </>
  );
}

export default AddReceipt;
