import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import ReactTable from "../../ReactTable/ReactTable";

const SingleQualityTable = ({
  newArr,
  singleQualityName,
  totalNum,
  minVal,
  qualityDataList,
}) => {
  const [showZero, setShowZero] = useState(false);
  const [search, setSearch] = useState("");
  if (!showZero) {
    qualityDataList = qualityDataList.filter((row) => {
      return row.quantity !== 0;
    });
  }

  if (search) {
    qualityDataList = qualityDataList.map((row) => {
      const name = row.name.toLowerCase();
      return name.includes(search) ? { ...row, rowColor: "lightgreen" } : row;
    });
  }
  const numOfLine = qualityDataList.reduce((acc, ele) => acc + 1, 0);
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
  var currentURL = window.location.origin;

  const middleIndex = Math.ceil(newArr.length / 2);
  const firstHalf = newArr.splice(0, middleIndex);
  const secondHalf = newArr.splice(-middleIndex);

  return (
    <Col className="mb-4 single-quality" xs={12} sm={6} md={4} xl={2}>
      <div className="alert alert-success">
        <Row>
          <Col xs={6} md={9}>
            <p>
              <strong>
                {singleQualityName} ({numOfLine})
              </strong>
            </p>
          </Col>
          <Col xs={6} md={2}>
            <div style={{ textAlign: "right" }}>
              {" "}
              <strong>{totalNum?.qualityTotal}</strong>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={6} md={3}>
            <strong>
              <input type="checkbox" onChange={(e) => setShowZero(!showZero)} />
              0
            </strong>
          </Col>
          <Col xs={6} md={9}>
            <input
              type="text"
              className="form-control"
              placeholder="search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
        </Row>
        <br />

        {currentURL === "https://yashharia.github.io" ? (
          <Row>
            <Col>
              <ReactTable
                columns={columns}
                data={firstHalf}
                initialState={initialState}
                newClassName="mobile-text"
                getTrProps={(state, rowInfo) => {
                  if (rowInfo)
                    return {
                      style: {
                        background: rowInfo.row.quantity < minVal ? "red" : "",
                      },
                    };
                  return {};
                }}
              />
            </Col>

            {secondHalf.length > 0 && (
              <Col>
                <ReactTable
                  columns={columns}
                  data={secondHalf}
                  initialState={initialState}
                  newClassName="mobile-text"
                  getTrProps={(state, rowInfo) => {
                    if (rowInfo)
                      return {
                        style: {
                          background:
                            rowInfo.row.quantity < minVal ? "red" : "",
                        },
                      };
                    return {};
                  }}
                />
              </Col>
            )}
          </Row>
        ) : (
          <ReactTable
            columns={columns}
            data={qualityDataList}
            initialState={initialState}
            getTrProps={(state, rowInfo) => {
              if (rowInfo)
                return {
                  style: {
                    background: rowInfo.row.quantity < minVal ? "red" : "",
                  },
                };
              return {};
            }}
          />
        )}
      </div>
    </Col>
  );
};

export default SingleQualityTable;
