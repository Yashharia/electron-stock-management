import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {collection,query,onSnapshot,limit,orderBy, where, updateDoc, getDocs, doc} from "firebase/firestore";
import { Row, Col, Alert } from "react-bootstrap";
import { getChallans, normalDateFormat } from "../../api/firebase-api";
import ReactTable from "../ReactTable/ReactTable";

export default function LastReceipt() {
  const [receiptArray, setreceiptArray] = useState([]);
  const [dispatchreceiptArray, setdispatchreceiptArray] = useState([]);
  useEffect(() => {
    const getLastReceipts = async() => {
      const receiptQuery = query(collection(db, "Challan"), orderBy("timestamp", "desc"), where("type", "==", "Receipt"),limit(1));
      const dispatchQuery = query(collection(db, "Challan"), orderBy("timestamp", "desc"),where("type", "==", "Dispatch"),limit(1));

      await getChallans(receiptQuery).then(
        filterArray => {setreceiptArray(filterArray);}
      )
      await getChallans(dispatchQuery).then(
        dispatchArr => {setdispatchreceiptArray(dispatchArr)}
      )
    };
    getLastReceipts();

  },[]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Taka Quality",
        accessor: "taka_quality",
        width: "18%",
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
        width: "10%",
      },
    ],
    []
  );

  return (
    <Row>
      <Col>
        {receiptArray.length > 0 && (
          <div className="alert alert-success">
            <h5>Last Receipt</h5>
            <Row className="pt-1 small-fonts">
              <Col md={3}><p><b>DATE: {normalDateFormat(receiptArray[0].challanDateTime)}</b></p></Col>
              <Col md={6}><p><b>DYING: {receiptArray[0].dying ?? ''}</b></p></Col>
              <Col md={3}><p><b>CHALLAN No.: {receiptArray[0].challanNo}</b></p></Col>
            </Row>
            <div>{receiptArray.length > 0 && <ReactTable columns={columns} data={receiptArray} newClassName="small-fonts"/>}</div>
          </div>
        )}
      </Col>
      <Col>
        {dispatchreceiptArray.length > 0 && (
          <div className="alert alert-danger">
            <h5>Last Dispatch Receipt</h5>
            <Row className="pt-1 small-fonts">
              <Col><p><b>Date: {normalDateFormat(dispatchreceiptArray[0].challanDateTime)}</b></p></Col>
              <Col><p><b>ChallanNo: {dispatchreceiptArray[0].challanNo}</b></p></Col>
            </Row>
            <div>{dispatchreceiptArray.length > 0 && <ReactTable columns={columns} data={dispatchreceiptArray} newClassName="small-fonts" />}</div>
          </div>
        )}
      </Col>
    </Row>
  );
}
