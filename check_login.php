<?php
// คำสั่ง session_start() ต้องอยู่บรรทัดบนสุดเสมอ เพื่อเปิดใช้งานระบบบัตรผ่าน
session_start();
require 'db.php';

if(isset($_POST['username']) && isset($_POST['password'])) {
    $user = $_POST['username'];
    $pass = $_POST['password'];
    
    // ค้นหาว่ามี username และ password นี้ในฐานข้อมูลหรือไม่
    $sql = "SELECT * FROM admins WHERE username = '$user' AND password = '$pass'";
    $result = mysqli_query($conn, $sql);
    
    // ถ้าเจอข้อมูล (แปลว่ารหัสถูก)
    if (mysqli_num_rows($result) > 0) {
        // ออกบัตรผ่านประตูให้แอดมิน โดยสร้าง SESSION ขึ้นมาจำชื่อไว้
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $user;
        
        // ส่งแอดมินวาร์ปไปหน้า report.php ทันที
        header("Location: report.php");
        exit();
    } else {
        // ถ้ารหัสผิด
        echo "<h3>❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!</h3>";
        echo "<a href='login.php'>ลองใหม่อีกครั้ง</a>";
    }
}
?>