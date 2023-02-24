import { Button, Form, Row, Col } from "react-bootstrap";
import { db } from "../../firebase";
import {
  collection,
  query,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  where,
} from "firebase/firestore";
import React, { useState, useCallback, useEffect } from "react";
import SingleRow from "./SingleRow";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { normalDateFormat } from "../../api/firebase-api";

function AddQuality({ history }) {
  var { editname } = useParams();
  var qualityDataKeys = ["color", "chartwise", "design"];
  var defaultObj = { name: "", quantity: 0 }
  const [name, setname] = useState("")
  const [oldName, setOldName] = useState("")
  const [type, setType] = useState("")
  const [total, setTotal] = useState(0)
  const [qualityData, setqualityData] = useState({
    color: [{ name: "", quantity: 0 }],
    design: [{ name: "", quantity: 0 }],
    chartwise: [{ name: "", quantity: 0 }],
  });


  const handleSubmit = (e) => {
    e.preventDefault();

    if (name !== "") {
      //adding data in firebase in eaiser accessible way of objects and keys
      var completeData = {};
      qualityDataKeys.forEach((item) => {
        let dataObj = {};
        qualityData[item].forEach((item) => {
          if (item.name == "") return;
          dataObj[item.name] = { name: item.name, quantity: item.quantity };
        });
        completeData[item] = dataObj;
      });

      //adding data end
      console.log(editname,'editname')
      if (editname == "" || editname == undefined) {
        completeData.name = name
        completeData.type = type
        setDoc(doc(db, "Quality", name), completeData); //create new quality
      } else {
        updateDoc(doc(db, "Quality", editname), {
          type: type, name: name,
          color: completeData["color"],
          design: completeData["design"],
          chartwise: completeData["chartwise"],
        });
        
        if(oldName != name){
          const q = query(collection(db, "Challan"), where("qualities", "array-contains", oldName));
          getDocs(q).then(docs =>{
            docs.forEach(async(item) =>{
              console.log(item,'item')
              var id = item.id;
              var data = item.data();
              var qualities = data.qualities.map(function(value) {
                return (value === oldName) ? name : value;
              });
              var dataList = data.dataList.map(function(obj) {
                return obj.name === oldName ? {...obj, name: name} : obj;
              });
              
              const queryRef = doc(db, "Challan", id);
              await updateDoc(queryRef, {"qualities": qualities, "dataList": dataList})
            })
          })
        }
      }

      (editname)? alert("Quality updated"): alert("Quality added successfully")

      var link = document.getElementById("close-btn");
      for (var i = 0; i < 50; i++) link.click();
    }
  };

  const setData = useCallback(
    (arrayName, i, key, value) => {
      var changeObj = { ...qualityData }; // duplicate the obj
      var changedArr = changeObj[arrayName]; // goes in specific array
      changedArr[i][key] = value; // changes the value
      if (changedArr[changedArr.length - 1].name != "")
        changedArr.push({ name: "", quantity: 0 }); // adds empty obj
      if (changedArr[i].name == "" && changedArr[i].quantity == "")
        changedArr.splice(i, 1); // remove empty values
      setqualityData(changeObj);
      setTotal(changeObj[type].reduce((result,item)=> result + item.quantity,0))
    },
    [qualityData]
  );

  useEffect(() => {
    if (editname) {
      var arrayTemplate = {
        color: [defaultObj],
        design: [defaultObj],
        chartwise: [defaultObj],
      };
      const fetchData = async () => {
        const querySnapshot = await getDoc(doc(db, "Quality", editname));
        if (querySnapshot.exists()) {
          let obj = querySnapshot.data();
          Object.entries(obj).map(([key, value]) => {
            if (Object.keys(obj[key]).length > 0) {
              arrayTemplate[key] = [];
              Object.entries(obj[key]).map(([internalKey, internalVal]) => {
                arrayTemplate[key].push(internalVal);
              });
            }
          });
          var keys = Object.keys(obj);
          keys.forEach((element) => {
            if (Object.keys(obj[element]).length > 0) {
              arrayTemplate[element].push({ name: "", quantity: 0.0 });
            }
          });
        
          
          function sortArrayByName(array) {
            if(typeof(array) == "undefined" ) return
            return array.sort((a, b) => {
              if (a.name.padStart(2, '0') < b.name.padStart(2, '0')) return -1;
              if (a.name.padStart(2, '0') > b.name.padStart(2, '0')) return 1;
              return 0;
            });
          }
  
          if(arrayTemplate.chartwise){arrayTemplate.chartwise = sortArrayByName(arrayTemplate.chartwise);console.log(arrayTemplate.chartwise,'arrayTemplate.chart');}
          if(arrayTemplate.color){arrayTemplate.color = sortArrayByName(arrayTemplate.color); console.log(arrayTemplate.color,'arrayTemplate.color');}
          if(arrayTemplate.design){arrayTemplate.design = sortArrayByName(arrayTemplate.design);}

          setqualityData(arrayTemplate);
          var currname = (obj.name != undefined)? obj.name : querySnapshot.id
          setname(currname);
          setOldName(currname);
          setType(obj.type);
          var total = arrayTemplate[obj.type].reduce((result, item)=>{
            if(item.quantity != undefined) return result = result + item.quantity
            return result
          }, 0)
          setTotal(total)
        }
      };
      fetchData();
    }
  }, [editname]);
  var todaysDate = new Date();
  return (
    <>
      <Form
        onSubmit={handleSubmit} onKeyPress={(event) => {if (event.key === "Enter") event.preventDefault();}}>
        <h3 className="mb-4">{editname ? `Edit Quality ${editname}` : "Add Quality"}</h3>
        <Row className="d-print-none">
          <Col>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control required type="text" placeholder="NAME" value={name} onChange={(e) => setname(e.target.value.toUpperCase())}/>
            </Form.Group>
          </Col>
          <Col sm={2} className="d-flex align-items-center justify-content-center">
          <h4><strong>Total: {total}</strong></h4>
          </Col>

          <Col>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Type</Form.Label>
              <Form.Select value={type} required onChange={(e) => {setType(e.target.value)}}>
                <option>Select type</option>
                <option value="color">Color</option>
                <option value="chartwise">Chartwise</option>
                <option value="design">Design</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <div className="pb-2"><h6>Date: {normalDateFormat(todaysDate)} <span className="px-2">  </span> Time: {todaysDate.getHours()}:{todaysDate.getMinutes()}</h6></div>
        <Row>

        {(type == 'color') &&
          <Col>
            Color
            {qualityData["color"].sort(function(a, b) {return Number(a.age) - Number(b.age);}).map((data, i) => {
              return (<SingleRow key={i} arrayName="color" i={i} name={data.name} quantity={data.quantity} onChange={setData}/>);
            })}
          </Col>
        }
        {(type == 'chartwise') &&
          <Col>
            Chartwise & Design
            {qualityData["chartwise"].map((data, i) => {
              return ( <SingleRow key={i} arrayName="chartwise" i={i} name={data.name} quantity={data.quantity} onChange={setData}/>);
            })}
          </Col>
        }
        {(type == 'design') &&
          <Col>
            Only Design
            {qualityData["design"].map((data, i) => {
              return (<SingleRow key={i} arrayName="design" i={i} name={data.name} quantity={data.quantity} onChange={setData}/>);
            })}
          </Col>
        }
        </Row>
        <div className="mt-4 d-print-none">
          <Button variant="primary" type="submit">SAVE</Button>
          <LinkContainer to="/master/quality">
            <Button id="close-btn" variant="danger" className="mx-2" type="button">CLOSE</Button>
          </LinkContainer>
          <Button variant="primary" type="button" onClick={()=>window.print()}>Print</Button>
        </div>
      </Form>
    </>
  );
}

export default AddQuality;
