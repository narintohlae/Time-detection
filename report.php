<?php
session_start();
// ตรวจสอบว่าไม่มีบัตรผ่านใช่ไหม? (ยังไม่ได้ล็อกอิน)
if (!isset($_SESSION['admin_logged_in'])) {
    // เตะกลับไปหน้า login ทันที!
    header("Location: login.php");
    exit();
}
?>
<?php
require 'db.php';
// ... (โค้ดดึงข้อมูลตารางที่เหลือ)
require 'db.php';
$sql = "SELECT * FROM records ORDER BY time_in DESC";
$result = mysqli_query($conn, $sql);
?>
<!DOCTYPE html>
<html>
<head>
    <title>รายงานการเข้างาน</title>
</head>
<body>
    <h2>📋 รายงานประวัติการลงเวลา</h2>
    
    <table border="1" cellpadding="10" cellspacing="0">
        <tr bgcolor="#f2f2f2">
            <th>ID</th>
            <th>ชื่อพนักงาน</th>
            <th>เวลาเข้างาน</th>
            <th>เวลาออกงาน</th>
        </tr>

        <?php
        if (mysqli_num_rows($result) > 0) {
            while($row = mysqli_fetch_assoc($result)) {
                echo "<tr>";
                echo "<td>" . $row['id'] . "</td>";
                echo "<td>" . $row['emp_name'] . "</td>";
                echo "<td>" . $row['time_in'] . "</td>";
                
                // เช็คว่ามีเวลาออกงานหรือยัง 
                if ($row['time_out'] == NULL) {
                    echo "<td>- กำลังทำงาน -</td>";
                } else {
                    echo "<td>" . $row['time_out'] . "</td>";
                }
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='4' align='center'>ยังไม่มีประวัติ</td></tr>";
        }
        ?>
    </table>
    <br>
    <a href="index.php">⬅️ กลับไปหน้าลงเวลา</a>
</body>
</html>