"use client"; // This makes the component a Client Component

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from '../app/nav.module.css';

const notifyUser = (command) => {
  alert(`Command ${command} sent to the board successfully.`);
};

const updateLEDStatus = async (command, setStatus) => {
  try {
    const response = await fetch('/api/getControlCommand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    const data = await response.json();

    if (data.success) {
      setStatus(command !== 'OFF'); // Update the status based on the command
      notifyUser(command); // Notify the user of the successful command
    }
  } catch (error) {
    console.error('Error updating Command:', error);
    alert('Failed to send command to the board.');
  }
};

const fetchLEDStatus = async (setStatus) => {
  try {
    const response = await fetch('/api/getCurrentStatus', {
      method: 'GET',
    });

    const data = await response.json();

    if (data.success) {
      setStatus(data.isOn); // Assume the response has an `isOn` boolean property
    }
  } catch (error) {
    console.error('Error fetching current status:', error);
  }
};

const Navbar = () => {
  const [ledStatus, setLEDStatus] = useState(false);

  useEffect(() => {
    // Fetch the current LED status when the component loads
    fetchLEDStatus(setLEDStatus);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbarCustom}`}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" href="./">
          <Image
            src="/logo.png" // ใส่พาธรูปภาพที่คุณต้องการใช้แทนที่ "IohmRGB"
            alt="Logo"
            width={100} // กำหนดขนาดตามที่คุณต้องการ
            height={100}
          />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-4 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} href="./">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} href="/History">History</Link>
            </li>
          </ul>
          <button
            type="button"
            className="btn me-2"
              style={{
              background: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)',
              color: 'white',
              border: '2px solid white', // เพิ่มกรอบสีขาวให้ปุ่ม
              fontWeight: 'bold', // ทำให้ตัวหนังสือหนาขึ้น
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            }}
          onClick={() => updateLEDStatus('BUZZER_ON', setLEDStatus)}
>
              Buzzer
          </button>
          <button
            type="button"
              className="btn"
                style={{
                background: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)',
                color: 'white',
                border: '2px solid white', // เพิ่มกรอบสีขาวให้ปุ่ม
                fontWeight: 'bold', // ทำให้ตัวหนังสือหนาขึ้น
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            }}
          onClick={() => updateLEDStatus('OFF', setLEDStatus)}
>
              Off
          </button>

            <span className={`ms-3 ${ledStatus ? styles.statusOn : styles.statusOff}`}>
              {ledStatus ? 'LED is ON' : 'LED is OFF'}
            </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
