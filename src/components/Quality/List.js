import { Button, Container, Table, Form } from "react-bootstrap";
import { db } from "../../firebase";
import {doc,deleteDoc,getDocs, where, collection, query} from "firebase/firestore";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CloseBtn from "../CloseBtn/CloseBtn";
import { LinkContainer } from "react-router-bootstrap";
import { getAllQualities } from "../../api/firebase-api";

function QualityList() {
  const [Quality, setQuality] = useState([]);
  const [search, setSearch] = useState("");

  React.useEffect(() => {
    const getQualities = async () => {
      const allqualities = await getAllQualities();
      console.log(allqualities,'allqualities')
      setQuality(allqualities);
    };
    getQualities();
  }, []);

  var result = Quality;
  if(search && search !="") result = result.filter((item) => item.name.includes(search) )

  const deleteQuality = async(id) => {
    console.log(id,'id')
    const q = query(collection(db, "Challan"), where("qualities", "array-contains", id));
    getDocs(q).then(docs =>{
      if (docs.size > 0) {
        alert('Challans exist for this quality, you cannot delete it')
      }else{
        if (window.confirm("Are you sure you want to delete?") == true) {
          deleteDoc(doc(db, "Quality", id))
        }
      }
    })
  }

  return (
    <>
      <h1 className="text-center">Quality</h1>
      <div className="text-center pt-2 mb-3">
        <LinkContainer to="/master/add/quality"><Button type="button">Add Quality</Button></LinkContainer>
        <CloseBtn />
      </div>

      <div className="mb-2">
        <Form.Control type="text" value={search} placeholder="Search" onChange={(e) => setSearch(e.target.value.toUpperCase())}/>
      </div>

      {Quality.length > 0 && (
        <Table striped bordered hover size="sm">
          <thead>
            <tr><th>Name</th><th></th><th></th></tr>
          </thead>
          <tbody>
            {result.map((data, i) => {
              let totalQuantity = 0;
              if(data.type != undefined){
                let obj = data[data.type];
                for (const item in obj) {
                  totalQuantity += obj[item].quantity;
                }
              }
              return(
              <tr key={i}>
                <td className="td-name p-2">{data.name} ({totalQuantity})</td>
                <td className="text-center">
                  <Link to={`/master/edit/quality/${data.id}`}>
                    <Button variant="success">Edit</Button>
                  </Link>
                </td>
                <td className="text-center">
                  <Button variant="danger"
                    onClick={() => { deleteQuality(data.id) }}>Delete</Button>
                </td>
              </tr>
            )}
            )}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default QualityList;
