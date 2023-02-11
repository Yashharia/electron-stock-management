import { Button, Table, Form, Row, Col, Alert, Container } from "react-bootstrap";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  setDoc,
  doc,
  FieldValue,
  updateDoc,
  increment,
  getDoc,
  limit,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import React, { useState } from "react";
import { normalDateFormat } from "../api/firebase-api";
import LastReceipt from "./LastReceipts/LastReceipt";

function Home() {
  const [receiptArray, setreceiptArray] = useState([]);
  const [dispatchreceiptArray, setdispatchreceiptArray] = useState([]);
  React.useEffect(() => {
    const getLastReceipts = () => {
      const getData = query(
        collection(db, "Receipt"),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      onSnapshot(getData, (querySnapshot) => {
        let receiptArray = [];
        querySnapshot.forEach((doc) => {
          receiptArray.push({ ...doc.data(), name: doc.id });
        });
        setreceiptArray(receiptArray);
      });
      const getdisptachData = query(
        collection(db, "Dispatch"),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      onSnapshot(getdisptachData, (querySnapshot) => {
        let disptachreceiptArray = [];
        querySnapshot.forEach((doc) => {
          disptachreceiptArray.push({ ...doc.data(), name: doc.id });
        });
        setdispatchreceiptArray(disptachreceiptArray);
      });
    };
    getLastReceipts();
  }, []);
  return (
    <>
      <Container className="d-flex flex-column justify-content-center pt-5">
        <h1 className="text-center mb-5">TAKA STOCK MANAGEMENT</h1>
        <LastReceipt/>
      </Container>
    </>
  );
}

export default Home;
