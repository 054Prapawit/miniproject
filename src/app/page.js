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
      const res = await fetch("/api/lastestData"); // เรียก API ที่ให้ข้อมูลล่าสุด
      const data = await res.json();
      setLastData(data);
      console.log("Latest Data:", data);
    } catch (error) {
      console.error("Error fetching latest data:", error);
    }
  }

  async function fetchAllData() {
    try {
      const res = await fetch("/api/alldata"); // เรียก API ที่ให้ข้อมูลทั้งหมด
      const data = await res.json();
      setAllData(data);
      console.log("All Data:", data);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }

  const barChartDataVR = lastData.length > 0 ? {
    labels: ["VR"], // แสดงเฉพาะข้อมูล VR
    datasets: [{
      label: "VR",
      data: [lastData[0].vr], // แสดงข้อมูล VR ล่าสุด
      backgroundColor: "rgba(153, 102, 255, 0.6)",
    }],
  } : null;

  const barChartDataTemp = lastData.length > 0 ? {
    labels: ["Temperature"], // แสดงเฉพาะข้อมูลอุณหภูมิ
    datasets: [{
      label: "Temperature",
      data: [lastData[0].temp], // แสดงข้อมูลอุณหภูมิล่าสุด
      backgroundColor: "rgba(255, 159, 64, 0.6)",
    }],
  } : null;

  const barChartDataTrendsVR = allData.length > 0 ? {
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

  const barChartDataTrendsTemp = allData.length > 0 ? {
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
        text: "Data Visualization",
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
        text: "Data Trends Over Time",
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
          {lastData.length > 0 && barChartDataVR ? (
            <div className={styles.chartContainer}>
              <h2>VR</h2>
              <Bar data={barChartDataVR} options={chartOptions} />
            </div>
          ) : (
            <p>No data available for VR chart</p>
          )}
        </div>
        <div
          className="tab-pane fade"
          id="temperature"
          role="tabpanel"
          aria-labelledby="temperature-tab"
        >
          {lastData.length > 0 && barChartDataTemp ? (
            <div className={styles.chartContainer}>
              <h2>Temperature</h2>
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
          {allData.length > 0 && barChartDataTrendsVR ? (
            <div className={styles.chartContainer}>
              <h2>VR Trends</h2>
              <Bar data={barChartDataTrendsVR} options={barChartOptions} />
            </div>
          ) : (
            <p>No data available for the VR bar chart</p>
          )}
        </div>
        <div
          className="tab-pane fade"
          id="trend-temperature"
          role="tabpanel"
          aria-labelledby="trend-temperature-tab"
        >
          {allData.length > 0 && barChartDataTrendsTemp ? (
            <div className={styles.chartContainer}>
              <h2>Temperature Trends</h2>
              <Bar data={barChartDataTrendsTemp} options={barChartOptions} />
            </div>
          ) : (
            <p>No data available for the Temperature bar chart</p>
          )}
        </div>
      </div>
      
      <h2 className={`${styles.heading} text-center my-4`}>
        ข้อมูลล่าสุด
      </h2>
      <div className="table-responsive">
        <table
          className={`table table-striped table-bordered ${styles.table}`}
        >
          <tbody>
            {lastData.map((ldata) => (
              <tr key={ldata.id}>
                <td>{ldata.id}</td>
                <td>{ldata.vr}</td>
                <td>{ldata.temp}</td>
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
