<?php
$servername = "localhost";
$username = "root"; // ชื่อผู้ใช้เริ่มต้นของ XAMPP
$password = "";     // รหัสผ่านเริ่มต้นของ XAMPP คือค่าว่าง (ไม่ต้องใส่อะไร)
$dbname = "attendance_system"; // ชื่อฐานข้อมูลที่เราเพิ่งสร้างเมื่อกี้

// สร้างการเชื่อมต่อ
$conn = mysqli_connect($servername, $username, $password, $dbname);

// เช็คว่าเชื่อมต่อสำเร็จไหม
if (!$conn) {
    die("เชื่อมต่อฐานข้อมูลล้มเหลว: " . mysqli_connect_error());
}
?>