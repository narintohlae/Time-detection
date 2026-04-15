<!DOCTYPE html>
<html>
<head>
    <title>เข้าสู่ระบบสำหรับ HR</title>
</head>
<body>
    <h2>🔒 เข้าสู่ระบบ (สำหรับผู้ดูแลระบบ)</h2>
    
    <form action="check_login.php" method="POST">
        <label>ชื่อผู้ใช้ (Username):</label>
        <input type="text" name="username" required>
        <br><br>
        <label>รหัสผ่าน (Password):</label>
        <input type="password" name="password" required>
        <br><br>
        <button type="submit">เข้าสู่ระบบ</button>
    </form>
    
    <br>
    <a href="index.php">⬅️ กลับไปหน้าพนักงานลงเวลา</a>
</body>
</html>