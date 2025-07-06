<?php
$host ="localhost";
$user ="root";
$pass ="Plev2339";
$db ="finance_db";

$conn = new mysqli ($host, $user, $pass, $db);
if($conn->connect_error){
    die("connection failed :" . $conn->connect_error);
}
?>