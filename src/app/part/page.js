"use client"; // 클라이언트 컴포넌트로 선언

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PartPage() {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/api/part/test") // 실제 API 주소 맞게 수정
      .then((res) => {
        if (res.data?.parts) {
          setParts(res.data.parts);
        }
      })
      .catch((err) => {
        console.error("파트 데이터 불러오기 실패:", err);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🧩 Part 리스트</h1>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Site ID</th>
            <th className="border p-2">Part ID</th>
            <th className="border p-2">Part Type</th>
            <th className="border p-2">Part Name</th>
            <th className="border p-2">UOM</th>
            <th className="border p-2">Create Date</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part, idx) => (
            <tr key={idx}>
              <td className="border p-2">{part.partId.siteId}</td>
              <td className="border p-2">{part.partId.partId}</td>
              <td className="border p-2">{part.partId.partType}</td>
              <td className="border p-2">{part.partName}</td>
              <td className="border p-2">{part.uom}</td>
              <td className="border p-2">{part.createDatetime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
