"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BomPage() {
  const [boms, setBoms] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/api/bom/test")
      .then((res) => {
        if (res.data && res.data.boms) {
          setBoms(res.data.boms);
        }
      })
      .catch((err) => {
        console.error("BOM 불러오기 실패:", err);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📦 BOM 리스트</h1>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">From Part</th>
            <th className="border p-2">To Part</th>
            <th className="border p-2">수량</th>
            <th className="border p-2">단위</th>
            <th className="border p-2">버전</th>
          </tr>
        </thead>
        <tbody>
          {boms.map((bom, idx) => (
            <tr key={idx}>
              <td className="border p-2">{bom.fromPartName}</td>
              <td className="border p-2">{bom.toPartName}</td>
              <td className="border p-2">{bom.inQty}</td>
              <td className="border p-2">{bom.inUom}</td>
              <td className="border p-2">{bom.bomVersion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
