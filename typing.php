<?php
session_start();
if (!isset($_SESSION['username'])) exit;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'username' => $_SESSION['username'],
        'time' => time()
    ];
    file_put_contents('typing_status.json', json_encode($data));
    echo "OK";
}
?>
