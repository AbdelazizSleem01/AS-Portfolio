"use client";
import { useEffect, useState } from "react";

export default function VisitCount() {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    async function fetchVisitors() {
      const res = await fetch("/api/visit");
      const data = await res.json();
      setVisitors(data);
    }

    fetchVisitors();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Recent Visitors</h1>
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">IP</th>
            <th className="border border-gray-300 p-2">Country</th>
            <th className="border border-gray-300 p-2">City</th>
            <th className="border border-gray-300 p-2">Visited At</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor, index) => (
            <tr key={index} className="text-center border border-gray-300">
              <td className="border border-gray-300 p-2">{visitor.email}</td>
              <td className="border border-gray-300 p-2">{visitor.ip}</td>
              <td className="border border-gray-300 p-2">{visitor.country}</td>
              <td className="border border-gray-300 p-2">{visitor.city}</td>
              <td className="border border-gray-300 p-2">{visitor.visitedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
