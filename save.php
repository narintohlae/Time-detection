<?php
require 'db.php';
date_default_timezone_set('Asia/Bangkok');

if(isset($_POST['emp_name']) && isset($_POST['action'])) {
    $name = $_POST['emp_name'];
    $action = $_POST['action']; // รับค่าว่ากด in หรือ out
    $current_time = date('Y-m-d H:i:s');
    
    if ($action == 'in') {
        // กดเข้างาน: สร้างแถวใหม่ (INSERT)
        $sql = "INSERT INTO records (emp_name, time_in) VALUES ('$name', '$current_time')";
        $message = "🟢 บันทึกเวลาเข้างานสำเร็จ!";
    } 
    else if ($action == 'out') {
        // กดออกงาน: อัปเดตแถวเดิมที่ช่อง time_out ยังว่างอยู่ (UPDATE)
        $sql = "UPDATE records SET time_out = '$current_time' WHERE emp_name = '$name' AND time_out IS NULL";
        $message = "🔴 บันทึกเวลาออกงานสำเร็จ!";
    }

    if (mysqli_query($conn, $sql)) {
        // เช็คว่ามีข้อมูลถูกอัปเดตจริงไหม
        if (mysqli_affected_rows($conn) > 0) {
            echo "<h3>" . $message . "</h3>";
            echo "พนักงาน: " . $name . "<br>";
            echo "เวลาที่บันทึก: " . $current_time . "<br>";
        } else {
            echo "<h3>❌ ไม่สามารถบันทึกได้!</h3>";
            echo "ไม่พบประวัติการเข้างานของคุณ หรือคุณลงเวลาออกงานไปแล้ว<br>";
        }
    } else {
        echo "เกิดข้อผิดพลาด: " . mysqli_error($conn);
    }
    
    echo "<br><br><a href='index.php'>กลับไปหน้าแรก</a>";
}
?>