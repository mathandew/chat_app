<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
include 'db.php';

if (!isset($_SESSION['username'])) {
    exit("Not logged in");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'send') {
        $message = trim($_POST['message']);
        if ($message !== "") {
            $stmt = $pdo->prepare("INSERT INTO messages (username, message) VALUES (?, ?)");
            $stmt->execute([$_SESSION['username'], $message]);
            echo "OK";
        } else {
            echo "Empty";
        }
    }

    if ($_POST['action'] === 'load') {
        $stmt = $pdo->query("SELECT * FROM messages ORDER BY created_at ASC");
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($messages as $msg) {
            $time = date('H:i:s', strtotime($msg['created_at']));
            echo "<p><strong>" . htmlspecialchars($msg['username']) . ":</strong> "
                . htmlspecialchars($msg['message'])
                . " <span class='text-muted' style='font-size: 0.8em;'>[$time]</span></p>";
        }
    }
}
?>