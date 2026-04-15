<!DOCTYPE html>
<html>
<head>
    <title>ระบบลงเวลาเข้างาน</title>
</head>
<body>
    <h2>บันทึกเวลาเข้า-ออกงาน</h2>
    
    <form action="save.php" method="POST">
        <label>กรอกชื่อพนักงาน:</label>
        <input type="text" name="emp_name" required>
        <br><br>
        <button type="submit" name="action" value="in" style="background-color: #4CAF50; color: white; padding: 10px;">🟢 เข้างาน</button>
        <button type="submit" name="action" value="out" style="background-color: #f44336; color: white; padding: 10px;">🔴 ออกงาน</button>
    </form>
    <br>
    <a href="report.php">ดูรายงาน</a>
</body>
</html>