<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'send') {
        $username = htmlspecialchars($_POST['username']);
        $message = htmlspecialchars($_POST['message']);
        
        $stmt = $pdo->prepare("INSERT INTO messages (username, message) VALUES (?, ?)");
        $stmt->execute([$username, $message]);
        
        echo "OK";
        
    } elseif ($_POST['action'] === 'load') {
        $stmt = $pdo->query("SELECT * FROM messages ORDER BY created_at ASC");
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($messages as $msg) {
            echo "<p><strong>" . htmlspecialchars($msg['username']) . ":</strong> " . htmlspecialchars($msg['message']) . "</p>";
        }
    }
}
?>
