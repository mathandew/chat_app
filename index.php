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
  <title>💬 Real-Time Chat App</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-light">

<div class="container py-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3 class="fw-bold text-success">💬 Chat App</h3>
    <a href="logout.php" class="btn btn-sm btn-outline-success">Logout</a>
  </div>

  <div class="card shadow-sm">
    <div class="card-body">
      <div id="chat-box" class="border rounded p-3 mb-3 bg-white" style="height: 350px; overflow-y: auto;"></div>

      <form id="chat-form" class="d-flex flex-wrap gap-2" enctype="multipart/form-data">
        <input type="text" id="message" class="form-control flex-grow-1 text-success" placeholder="Type a message...">
        <input type="file" id="file" class="form-control" style="max-width: 180px;">
        <button type="submit" class="btn btn-success">Send</button>
      </form>

      <div id="typing-indicator" class="text-muted mt-2 fst-italic" style="min-height: 1.5em;"></div>
    </div>
  </div>
</div>

<script>
  const username = <?php echo json_encode($_SESSION['username']); ?>;
</script>
<script src="js/app.js"></script>
</body>
</html>
