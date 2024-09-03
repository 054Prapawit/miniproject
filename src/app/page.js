"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [lastData, setLastData] = useState([]);
  const [allData, setAllData] = useState([]);

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

  // ข้อมูลกราฟสำหรับ VR
  const barChartDataVR = lastData.length > 0 ? {
    labels: ["VR"],
    datasets: [{
      label: "VR",
      data: [lastData[0].vr],
      backgroundColor: "rgba(153, 102, 255, 0.6)",
    }],
  } : null;

  // ข้อมูลกราฟสำหรับอุณหภูมิ
  const barChartDataTemp = lastData.length > 0 ? {
    labels: ["Temperature"],
    datasets: [{
      label: "Temperature",
      data: [lastData[0].temp],
      backgroundColor: "rgba(255, 159, 64, 0.6)",
    }],
  } : null;

  const barChartTrendDataVR = allData.length > 0 ? {
    labels: allData.map((dataPoint) =>
      new Date(dataPoint.date).toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        dateStyle: "short",
        timeStyle: "short",
      })
    ),
    datasets: [
      {
        label: "VR",
        data: allData.map((dataPoint) => dataPoint.vr),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  } : null;

  const barChartTrendDataTemp = allData.length > 0 ? {
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
        text: "Sensor Data Visualization",
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

  useEffect(() => {
    fetchLastData();
    fetchAllData();

    const intervalId = setInterval(() => {
      fetchLastData();
      fetchAllData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`${styles.dashboard} container`}>
      <h1 className={`${styles.heading} text-center my-4`}>
        Dashboard
      </h1>
      <div className="tab-content" id="chartTabsContent">
        <div
          className="tab-pane fade show active"
          id="vr"
          role="tabpanel"
          aria-labelledby="vr-tab"
        >
          {barChartDataVR ? (
            <div className={styles.chartContainer}>
              <h2>Latest VR Data</h2>
              <Bar data={barChartDataVR} options={chartOptions} />
            </div>
          ) : (
            <p>No data available for VR chart</p>
          )}
        </div>
        <div
          className="tab-pane fade"
          id="temp"
          role="tabpanel"
          aria-labelledby="temp-tab"
        >
          {barChartDataTemp ? (
            <div className={styles.chartContainer}>
              <h2>Latest Temperature Data</h2>
              <Bar data={barChartDataTemp} options={chartOptions} />
            </div>
          ) : (
            <p>No data available for Temperature chart</p>
          )}
        </div>
        <div
          className="tab-pane fade"
          id="trend-vr"
          role="tabpanel"
          aria-labelledby="trend-vr-tab"
        >
          {barChartTrendDataVR ? (
            <div className={styles.chartContainer}>
              <h2>VR Trends</h2>
              <Bar data={barChartTrendDataVR} options={barChartOptions} />
            </div>
          ) : (
            <p>No data available for VR trends chart</p>
          )}
        </div>
        <div
          className="tab-pane fade"
          id="trend-temp"
          role="tabpanel"
          aria-labelledby="trend-temp-tab"
        >
          {barChartTrendDataTemp ? (
            <div className={styles.chartContainer}>
              <h2>Temperature Trends</h2>
              <Bar data={barChartTrendDataTemp} options={barChartOptions} />
            </div>
          ) : (
            <p>No data available for Temperature trends chart</p>
          )}
        </div>
      </div>
    </div>
  );
}
