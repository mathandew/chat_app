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
        $filePath = '';

        // Handle file upload if file exists
        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
            $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            if (in_array(strtolower($ext), $allowed)) {
                // Ensure uploads folder exists
                if (!is_dir('uploads')) {
                    mkdir('uploads', 0777, true);
                }

                $target = 'uploads/' . time() . '_' . basename($_FILES['file']['name']);
                if (move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
                    $filePath = $target;
                }
            }
        }

        if ($message !== "" || $filePath !== '') {
            // Replace emoji shortcuts
            $safeMessage = htmlspecialchars($message);
            $safeMessage = str_replace(':)', '😊', $safeMessage);
            $safeMessage = str_replace(':(', '😢', $safeMessage);
            $safeMessage = str_replace(':D', '😃', $safeMessage);
            $safeMessage = str_replace('<3', '❤️', $safeMessage);

            if ($filePath !== '') {
                $safeMessage .= '<br><img src="' . htmlspecialchars($filePath) . '" style="max-width:200px;">';
            }

            $stmt = $pdo->prepare("INSERT INTO messages (username, message) VALUES (?, ?)");
            $stmt->execute([$_SESSION['username'], $safeMessage]);
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
                . $msg['message']
                . " <span class='text-muted' style='font-size: 0.8em;'>[$time]</span></p>";
        }
    }
}
?>
