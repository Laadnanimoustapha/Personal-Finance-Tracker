<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include '../db.php';

$data = json_decode(file_get_contents("php://input"));

$type = $data->type ?? '';
$category = $data->category ?? '';
$amount = $data->amount ?? 0;
$date = $data->date ?? '';
$note = $data->note ?? '';

$stmt = $conn->prepare("INSERT INTO transactions (type, category, amount, date, note) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssdss", $type, $category, $amount, $date, $note);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}
?>
