import React, { useState } from "react";
import { Row } from "react-bootstrap";
import { useTable, useSortBy } from "react-table";
export default function ReactTable({
  columns,
  data,
  initialState,
  getTrProps,
  newClassName = "",
  showEditDelete,
}) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState,
        getTrProps,
      },
      useSortBy
    );

  const [search, setSearch] = useState("");

  return (
    <>
      <table
        className={`w-100 react-report-table ${newClassName}`}
        {...getTableProps()}
        style={{ border: "solid 1px blue" }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    border: "solid 1px gray",
                    background: "aliceblue",
                    color: "black",
                    fontWeight: "bold",
                    width: column.width,
                    minWidth: column.minWidth,
                  }}
                >
                  {column.render("Header")}
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const rowColor = row.original.rowColor
            
            return (
              <tr
                {...row.getRowProps()}
                style={{
                  background: rowColor,
                  color: "black",
                }}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{ border: "solid 1px gray" }}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
