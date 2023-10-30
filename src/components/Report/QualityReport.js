import React, { useEffect, useState } from "react";
import {Button,Form,Row,Col,Container,} from "react-bootstrap";
import { db } from "../../firebase";
import {collection,} from "firebase/firestore";
import Select from "react-select";
import { getAllQualities, getChallans, normalDateFormat } from "../../api/firebase-api";
import CloseBtn from "../CloseBtn/CloseBtn";
import ReactTable from "../ReactTable/ReactTable";

const QualityReport = () => {
  var currentURL = window.location.origin;

  const [minVal, setminVal] = useState(0);
  const [qualitylist, setqualitylist] = useState([]);
  const [data, setdata] = useState([]);
  const [filterList, setfilterList] = useState([]);
  const [qualityNames, setqualityNames] = useState([]);
  const [challanQualities, setChallanQualities] = useState([]);
  const [isRefresh, setIsRefresh] = useState(true)

  const [zeroArr, setZeroArr] = useState([]);
  const [searchArr, setSearchArr] = useState([]);
  console.log(searchArr);

  var types = ["color", "chartwise", "design"];
  var [challans, setChallans] = useState([]);

  const getChallanData = () => {
    setIsRefresh(true)
    getAllQualities().then(allqualities => {
      setdata(allqualities);

      var setQualities = [];
      allqualities.forEach(item => {
        var type = item.type;
        var internalObj = item[type]
        var qualityObj = {};
        qualityObj.name = item.name;
        var qualityData=[]
        for (const key in internalObj){
            qualityData.push(internalObj[key]);
        }
        qualityObj.data=qualityData;
        setQualities.push(qualityObj);

      });
      setqualitylist(setQualities);
    })

    getChallans(collection(db, "Challan")).then(docs=> {setChallans(docs); console.log(docs,'docs')})

    setTimeout(()=>setIsRefresh(false),500)
  }
  
  useEffect(() => {
    getChallanData();
   setIsRefresh(false)
  }, []);

  useEffect(() => {
  var challanQualities = [];
  challans.forEach(item => {
      var qualityObj = {}
      qualityObj.challanNo = item.challanNo
      qualityObj.name = item.taka_quality
      qualityObj.value = item.dataValue
      qualityObj.num_of_taka =item.num_of_taka
      qualityObj.type =  item.type
      challanQualities.push(qualityObj)
  });
 
  setChallanQualities(challanQualities)

  let qualitynames = qualitylist.map((item, i) => {
    var name = item.name
    var totalValue = item.data.reduce((result, item) => {return result + item.quantity},0)
    var challanValues = challanQualities.reduce((result, item)=>{
      if(item.name == name && item.type == "Receipt" && item.num_of_taka != undefined) return result + item.num_of_taka
      if(item.name == name && item.type == "Dispatch" && item.num_of_taka != undefined) return result - item.num_of_taka
      return result
    },totalValue)
    return {
      value: name,
      label: name + ' ('+challanValues+')',
      qualityTotal : challanValues
    };
  });
  setqualityNames(qualitynames); // set dropdown values

},[challans])


const addToZeroArr = (singleQualityName, e) => {
  if(e){
    setZeroArr([...zeroArr,singleQualityName])
  }else{
    const removeFromZeroArr = zeroArr.filter(item => item !== singleQualityName);
    setZeroArr(removeFromZeroArr);
  }
}

const addToSearchArr = (singleQualityName, searchVal) => {
  const exisitingSearchArr = searchArr.find(row => row.name === singleQualityName)
  if(exisitingSearchArr){
    var newSearchArr = searchArr.map((row)=>{
      return (row.name == singleQualityName)? {...row, searchVal: searchVal} : row
    })
    setSearchArr(newSearchArr);
  }else{
    setSearchArr([...searchArr,{name: singleQualityName, searchVal: searchVal}])
  }
}

var result = qualitylist
 if (filterList.length > 0) result = qualitylist.filter((item) => filterList.some((filterItem) => filterItem.value === item.name));
  var totalSum = qualityNames.reduce((result, item)=> {return result + item.qualityTotal}, 0);
  var todaysDate = new Date();
  return (
    isRefresh ? <h2 className="text-center">Refreshing</h2> :
    <Container fluid>
      <div className="d-print-none">
        <h4 className="text-center">Taka Stock Report</h4>
        <div className="text-center">
          <CloseBtn />
          <Button variant="primary" type="button" className="mx-2" onClick={()=>window.print()}>Print</Button>
          <Button variant="primary" type="button" className="mx-2" onClick={()=>window.location.reload(true)}>Refresh</Button>
        </div>
        
        <Row className="pt-3">
          <Col>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Quality</Form.Label>
              <Select isMulti options={qualityNames} value={filterList} isSearchable={true} onChange={(e) => {setfilterList(e); console.log(e)}} maxMenuHeight={100}/>
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex justify-content-center align-items-end pb-2">
            <strong>Total taka: {totalSum}</strong>
          </Col>
          <Col>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Minimum value</Form.Label>
              <Form.Control type="number" placeholder="Minimum Value" value={minVal} onChange={(e) => {setminVal(e.target.value);}}/>
            </Form.Group>
          </Col>
        </Row>
      </div>
      <Row className="pt-5 quality-report">
        <div><h6>Date: {normalDateFormat(todaysDate)}<br/> Time: {todaysDate.getHours()}:{todaysDate.getMinutes()}</h6></div>
          {result?.map((item, i) => {
            var singleQualityName = item.name;
            const columns = [
              {
                Header: "Name",
                accessor: "name",
              },
              {
                Header: "QTY",
                accessor: "quantity",
              },
            ];
            const initialState = {
              sortBy: [
                {
                  id: "name",
                  desc: false,
                },
              ],
            };
            var totalNum = qualityNames.find((quality) => quality.value === item.name)
            var qualityDataList = item.data.map(item => {
              var currentQuantity = item.quantity;
              var value = item.name
              var finalStock = challanQualities.reduce((result, item)=>{
                var num_of_taka = (!isNaN(item.num_of_taka))? item.num_of_taka : 0
                if(item.name == singleQualityName && item.value == value && item.type == "Receipt") return result + num_of_taka
                if(item.name == singleQualityName && item.value == value && item.type == "Dispatch") return result - num_of_taka
                return result
              },currentQuantity)
            

              return{
                name: value,
                quantity : finalStock,
                rowColor: (finalStock < minVal)? "#fda09b" : "papayawhip" 
              }
            })

            //remove zero quantity rows
            if(zeroArr.includes(singleQualityName)) {
              qualityDataList = qualityDataList.filter((row) => {
                return row.quantity !== 0
              });
            }

            const checkSearchValExist = searchArr.find((row) => row.name === singleQualityName)
            if(checkSearchValExist) {
              const searchVal = checkSearchValExist.searchVal.toLowerCase()
              if(searchVal){
                qualityDataList = qualityDataList.map((row) => {
                  const name = row.name.toLowerCase();
                  return name.includes(searchVal)? {...row, rowColor: "lightgreen"} : row
                });
              }
            }

            const newArr = [...qualityDataList];
            const middleIndex = Math.ceil(newArr.length / 2);

            const firstHalf = newArr.splice(0, middleIndex);   
            const secondHalf = newArr.splice(-middleIndex);
            return (
              <Col className="mb-4 single-quality" xs={12} sm={6} md={4} xl={2} key={i}>
                <div className="alert alert-success">
                  <Row>
                    <Col xs={6} md={9}><p><strong>{singleQualityName} </strong></p></Col>
                    <Col xs={6} md={2}><div style={{ textAlign: "right" }}> <strong>{totalNum?.qualityTotal}</strong></div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={3}><strong><input type="checkbox" onChange={(e)=>addToZeroArr(singleQualityName, e.target.checked)}/>0</strong></Col>
                    <Col xs={6} md={9}><input type="text" className="form-control" placeholder="search" onChange={(e)=>addToSearchArr(singleQualityName, e.target.value)}/></Col>
                  </Row>
                  <br/>

                  {(currentURL === "https://yashharia.github.io" )?
                        <Row>
                          <Col> 
                            <ReactTable columns={columns} data={firstHalf} initialState={initialState} newClassName='mobile-text'
                            getTrProps={(state, rowInfo) => {
                              if (rowInfo) return {style: {background: rowInfo.row.quantity < minVal ? 'red' : ''}};
                              return {};
                            }}/>
                          </Col>

                          {secondHalf.length > 0 &&
                            <Col>
                              <ReactTable columns={columns} data={secondHalf} initialState={initialState} newClassName='mobile-text'
                              getTrProps={(state, rowInfo) => {
                                if (rowInfo) return {style: {background: rowInfo.row.quantity < minVal ? 'red' : ''}};
                                return {};
                              }}/>
                            </Col>
                          }
                        </Row> : 
                          <ReactTable columns={columns} data={qualityDataList} initialState={initialState}
                          getTrProps={(state, rowInfo) => {
                            if (rowInfo) return {style: {background: rowInfo.row.quantity < minVal ? 'red' : ''}};
                            return {};
                          }} />
                  }
                </div>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};

export default QualityReport;
