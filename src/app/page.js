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
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
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
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();
      setAllData(data);
      console.log("All Data:", data);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }

  // สร้างข้อมูลกราฟสำหรับข้อมูลล่าสุด
  const barChartData = lastData.length > 0 ? {
    labels: ["Distance"],
    datasets: [{
      label: "Distance",
      data: [lastData[0]?.distance ?? 0], // ป้องกันกรณีที่ข้อมูลว่าง
      backgroundColor: "rgba(255, 99, 132, 0.6)",
    }],
  } : null;

  // สร้างข้อมูลกราฟสำหรับข้อมูลแนวโน้มทั้งหมด
  const barChartTrendData = allData.length > 0 ? {
    labels: allData.map((dataPoint) =>
      new Date(dataPoint.date).toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        dateStyle: "short",
        timeStyle: "short",
      })
    ),
    datasets: [
      {
        label: "Distance",
        data: allData.map((dataPoint) => dataPoint.distance),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
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
        text: "Distance Data Visualization",
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
        text: "Distance Trends Over Time",
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
        <div className="tab-pane fade show active" id="distance" role="tabpanel" aria-labelledby="distance-tab">
          {barChartData ? (
            <div className={styles.chartContainer}>
              <h2>Latest Distance Data</h2>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          ) : (
            <p>No data available for Distance chart</p>
          )}
        </div>
        <div className="tab-pane fade" id="trend-distance" role="tabpanel" aria-labelledby="trend-distance-tab">
          {barChartTrendData ? (
            <div className={styles.chartContainer}>
              <h2>Distance Trends</h2>
              <Bar data={barChartTrendData} options={barChartOptions} />
            </div>
          ) : (
            <p>No data available for Distance trends chart</p>
          )}
        </div>
      </div>
    </div>
  );
}
