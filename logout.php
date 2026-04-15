<?php
session_start();
session_destroy(); // ล้างข้อมูล SESSION (ฉีกบัตรผ่านทิ้ง)
header("Location: login.php"); // ส่งกลับไปหน้าล็อคอิน
exit();
?>