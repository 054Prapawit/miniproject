"use client";
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Dashboard.module.css";

export const dynamic = "force-dynamic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
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
      data: [lastData[0].ldr, lastData[0].vr],
      backgroundColor: [
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
      ],
    }],
  } : null;

  const pieChartData2 = lastData.length > 0 ? {
    labels: ["Temperature", "Distance"],
    datasets: [{
      data: [lastData[0].temp, lastData[0].distance],
      backgroundColor: [
        "rgba(255, 159, 64, 0.6)",
        "rgba(255, 99, 132, 0.6)",
      ],
    }],
  } : null;

  const barChartData1 = allData.length > 0 ? {
    labels: allData.map((dataPoint) =>
      new Date(dataPoint.date).toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        dateStyle: "short",
        timeStyle: "short",
      })
    ),
    datasets: [
      {
        label: "LDR",
        data: allData.map((dataPoint) => dataPoint.ldr),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "VR",
        data: allData.map((dataPoint) => dataPoint.vr),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  } : null;

  const barChartData2 = allData.length > 0 ? {
    labels: allData.map((dataPoint) =>
      new Date(dataPoint.date).toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        dateStyle: "short",
        timeStyle: "short",
      })
    ),
    datasets: [
      {
        label: "Temperature",
        data: allData.map((dataPoint) => dataPoint.temp),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
      {
        label: "Distance",
        data: allData.map((dataPoint) => dataPoint.distance),
        backgroundColor: "rgb(255, 99, 132, 0.6)",
      },
    ],
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

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sensor Data Trends Over Time",
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
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="trend-ldr-vr-tab"
            data-bs-toggle="tab"
            data-bs-target="#trend-ldr-vr"
            type="button"
            role="tab"
            aria-controls="trend-ldr-vr"
            aria-selected="false"
          >
            LDR and VR Trends
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="trend-temp-distance-tab"
            data-bs-toggle="tab"
            data-bs-target="#trend-temp-distance"
            type="button"
            role="tab"
            aria-controls="trend-temp-distance"
            aria-selected="false"
          >
            Temperature and Distance Trends
          </button>
        </li>
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
        <div
          className="tab-pane fade"
          id="trend-ldr-vr"
          role="tabpanel"
          aria-labelledby="trend-ldr-vr-tab"
        >
          {allData.length > 0 && barChartData1 ? (
            <div className={styles.chartContainer}>
              <h2>LDR and VR Trends</h2>
              <Bar data={barChartData1} options={barChartOptions} />
            </div>
          ) : (
            <p>No data available for the LDR and VR bar chart</p>
          )}
        </div>
        <div
          className="tab-pane fade"
          id="trend-temp-distance"
          role="tabpanel"
          aria-labelledby="trend-temp-distance-tab"
        >
          {allData.length > 0 && barChartData2 ? (
            <div className={styles.chartContainer}>
              <h2>Temperature and Distance Trends</h2>
              <Bar data={barChartData2} options={barChartOptions} />
            </div>
          ) : (
            <p>No data available for the Temperature and Distance bar chart</p>
          )}
        </div>
      </div>
      
      <h2 className={`${styles.heading} text-center my-4`}>
        Latest Data
      </h2>
      <div className="table-responsive">
        <table
          className={`table table-striped table-bordered ${styles.table}`}
        >
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
