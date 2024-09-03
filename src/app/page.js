"use client";
import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
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

  const pieChartData = lastData.length > 0 ? {
    labels: ["Temperature", "Distance"],
    datasets: [{
      data: [lastData[0].temp, lastData[0].distance],
      backgroundColor: [
        "rgba(255, 159, 64, 0.6)",
        "rgba(255, 99, 132, 0.6)",
      ],
    }],
  } : null;

  const barChartData = allData.length > 0 ? {
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
        text: "Temperature and Distance Data Visualization",
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
        text: "Temperature and Distance Trends Over Time",
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
        <div className="tab-pane fade show active" id="temp-distance" role="tabpanel" aria-labelledby="temp-distance-tab">
          {lastData.length > 0 && pieChartData ? (
            <div className={styles.chartContainer}>
              <h2>อุณหภูมิ และ การวัดระยะ</h2>
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          ) : (
            <p>No data available for Temperature and Distance chart</p>
          )}
        </div>
        <div className="tab-pane fade" id="trend-temp-distance" role="tabpanel" aria-labelledby="trend-temp-distance-tab">
          {allData.length > 0 && barChartData ? (
            <div className={styles.chartContainer}>
              <h2>Temperature and Distance Trends</h2>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          ) : (
            <p>No data available for the Temperature and Distance bar chart</p>
          )}
        </div>
      </div>
    </div>
  );
}
