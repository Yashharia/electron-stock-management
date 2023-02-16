import { Button, Container, Table, Form } from "react-bootstrap";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import CloseBtn from "../CloseBtn/CloseBtn";


function Dying() {
  const [name, setname] = useState("");
  const [isEdit, setisEdit] = useState(false);
  const [prevName, setPrevName] = useState("");
  const [editValue, seteditValue] = useState("");
  const [Dying, setDying] = useState([]);

  const handleSubmit = (e) => { //Runs on form submit
    e.preventDefault();
    if (name !== "") {
      if(isEdit){ // Edit value
        const q = query(collection(db, "Challan"), where("dying", "==", prevName));
        getDocs(q).then(docs => {
          docs.forEach(item => {
            var id = item.id;
            updateDoc(doc(db, "Challan", id), {dying: name})
          })
        })
        updateDoc(doc(db, "Dying", editValue), {name});
        setisEdit(false); seteditValue('');
        alert('Value updated')
      }else{ // Add value
        addDoc(collection(db, "Dying"), {name,});
        setname("");
      }
    }
  };

  React.useEffect(() => {
    console.log('useeffect')
    const q = query(collection(db, "Dying"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let dyingArray = [];
      querySnapshot.forEach((doc) => {
        dyingArray.push({ ...doc.data(), id: doc.id });
      });
      setDying(dyingArray);
      console.log('dying',dyingArray)
    });
    return () => unsub();
  }, []);

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <h3 className="mb-4 text-center">Add Job Worker</h3>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>NAME</Form.Label>
          <Form.Control required type="text" placeholder="NAME" value={name} onChange={(e) => setname((e.target.value).toUpperCase())}/>
        </Form.Group>
        <div className="mb-4">
          {(isEdit && editValue)? 
            <>
              <Button variant="success" type="submit">SAVE</Button> 
              <Button variant="danger" className="mx-2" onClick={()=>{setisEdit(false); seteditValue(''); setname('')}}>CANCEL</Button>
            </>:
            <Button variant="primary" type="submit">ADD</Button> 
          }
            <CloseBtn/>
        </div>
      </Form>

      {Dying.length > 0 && (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th style={{width: '8%'}}>#</th>
              <th style={{width: '70%'}}>Name</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Dying.map((data, i) => (
              <tr key={i}>
                <td>{i}</td>
                <td>{data.name}</td>
                <td className="text-center"><Button variant="success" onClick={()=>{setisEdit(true); seteditValue(data.id); setname(data.name); setPrevName(data.name) }}>Edit</Button></td>
                <td className="text-center"><Button variant="danger"
                onClick={()=>{
                  if (window.confirm("Are you sure you want to delete?") == true)
                    deleteDoc(doc(db, "Dying", data.id)); 
                }}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default Dying;
