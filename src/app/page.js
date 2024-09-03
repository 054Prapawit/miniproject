"use client";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Dashboard.module.css";

export const dynamic = "force-dynamic";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [lastData, setLastData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [attackCount, setAttackCount] = useState(null);

  async function fetchLastData() {
    try {
      const res = await fetch("/api/lastestData");
      const data = await res.json();
      setLastData(data);
      console.log("Latest Data:", data);
    } catch (error) {
      console.error("Error fetching latest data:", error);
    }
  }

  async function fetchAllData() {
    try {
      const res = await fetch("/api/alldata");
      const data = await res.json();
      setAllData(data);
      console.log("All Data:", data);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }

  async function fetchAttackCount() {
    try {
      const res = await fetch("/api/attackCount");
      const data = await res.json();
      setAttackCount(data.att);
      console.log("Attack Count:", data.att);
    } catch (error) {
      console.error("Error fetching attack count:", error);
    }
  }

  const pieChartData1 = lastData.length > 0 ? {
    labels: ["LDR", "VR"],
    datasets: [{
      label: 'Sensor Data',
      data: [lastData[0].ldr, lastData[0].vr], // ใช้ข้อมูลล่าสุดหรือตามที่ต้องการ
      backgroundColor: [
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
      ],
    }],
  } : null;

  const pieChartData2 = lastData.length > 0 ? {
    labels: ["Temperature", "Distance"],
    datasets: [{
      label: 'Sensor Data',
      data: [lastData[0].temp, lastData[0].distance], // ใช้ข้อมูลล่าสุดหรือตามที่ต้องการ
      backgroundColor: [
        "rgba(255, 159, 64, 0.6)",
        "rgba(255, 99, 132, 0.6)",
      ],
    }],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Latest Sensor Data Visualization",
      },
    },
  };

  function downloadCSV(data, filename) {
    const csvData = data.map((row) =>
      Object.values(row).join(",")
    );
    const csvContent =
      "data:text/csv;charset=utf-8," + csvData.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    fetchLastData();
    fetchAllData();
    fetchAttackCount();

    const intervalId = setInterval(() => {
      fetchLastData();
      fetchAllData();
      fetchAttackCount();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`${styles.dashboard} container`}>
      <h1 className={`${styles.heading} text-center my-4`}>
        Dashboard
      </h1>
      <ul className="nav nav-tabs" id="chartTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="ldr-vr-tab"
            data-bs-toggle="tab"
            data-bs-target="#ldr-vr"
            type="button"
            role="tab"
            aria-controls="ldr-vr"
            aria-selected="true"
          >
            LDR and VR
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="temp-distance-tab"
            data-bs-toggle="tab"
            data-bs-target="#temp-distance"
            type="button"
            role="tab"
            aria-controls="temp-distance"
            aria-selected="false"
          >
            Temperature and Distance
          </button>
        </li>
        {/* อื่น ๆ */}
      </ul>
      <div className="tab-content" id="chartTabsContent">
        <div
          className="tab-pane fade show active"
          id="ldr-vr"
          role="tabpanel"
          aria-labelledby="ldr-vr-tab"
        >
          {lastData.length > 0 && pieChartData1 ? (
            <div className={styles.chartContainer}>
              <h2>LDR and VR</h2>
              <Pie data={pieChartData1} options={chartOptions} />
            </div>
          ) : (
            <p>No data available for LDR and VR chart</p>
          )}
        </div>
        <div
          className="tab-pane fade"
          id="temp-distance"
          role="tabpanel"
          aria-labelledby="temp-distance-tab"
        >
          {lastData.length > 0 && pieChartData2 ? (
            <div className={styles.chartContainer}>
              <h2>Temperature and Distance</h2>
              <Pie data={pieChartData2} options={chartOptions} />
            </div>
          ) : (
            <p>No data available for Temperature and Distance chart</p>
          )}
        </div>
        {/* อื่น ๆ */}
      </div>

      <div className={`${styles.attackCountContainer} my-4`}>
        <h2 className="text-center">Number of Attacks</h2>
        {attackCount !== null ? (
          <p className={`${styles.attackCount} text-center`}>{attackCount}</p>
        ) : (
          <p>Loading attack data...</p>
        )}
      </div>

      <div className="text-center">
        <button
          className="btn btn-primary"
          onClick={() => downloadCSV(lastData, "latest_data.csv")}
        >
          Download Latest Data as CSV
        </button>
      </div>

      <h2 className={`${styles.heading} text-center my-4`}>
        Latest Data
      </h2>
      <div className="table-responsive">
        <table
          className={`table table-striped table-bordered ${styles.table}`}
        >
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>LDR</th>
              <th>VR</th>
              <th>Temperature</th>
              <th>Distance</th>
              <th>Create At</th>
            </tr>
          </thead>
          <tbody>
            {lastData.map((ldata) => (
              <tr key={ldata.id}>
                <td>{ldata.id}</td>
                <td>{ldata.ldr}</td>
                <td>{ldata.vr}</td>
                <td>{ldata.temp}</td>
                <td>{ldata.distance}</td>
                <td>
                  {new Date(ldata.date).toLocaleString("th-TH", {
                    timeZone: "Asia/Bangkok",
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
