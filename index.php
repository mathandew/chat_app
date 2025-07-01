<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Real-Time Chat App</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-light">

<div class="container mt-5">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h2>💬 Real-Time Chat</h2>
    <a href="logout.php" class="btn btn-sm btn-outline-danger">Logout</a>
  </div>
  
  <div class="card">
    <div class="card-body">
      <div id="chat-box" class="border rounded p-3 mb-3" style="height: 300px; overflow-y: auto; background: #f8f9fa;"></div>

      <form id="chat-form" class="d-flex">
        <input type="text" id="message" class="form-control me-2" placeholder="Type a message..." required>
        <button class="btn btn-primary">Send</button>
      </form>
    </div>
  </div>
</div>

<script src="js/app.js"></script>
<script>
const username = <?php echo json_encode($_SESSION['username']); ?>;
</script>

</body>
</html>
