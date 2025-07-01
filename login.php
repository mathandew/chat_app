<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = trim($_POST['username']);
  if ($username !== "") {
    $_SESSION['username'] = htmlspecialchars($username);
    header("Location: index.php");
    exit;
  } else {
    $error = "Please enter a username.";
  }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login - Chat App</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
  <div class="container mt-5">
    <div class="card">
      <div class="card-body">
        <h3 class="mb-3">Enter your username</h3>
        <?php if (isset($error)) echo "<div class='alert alert-danger'>$error</div>"; ?>
        <form method="POST">
          <input type="text" name="username" class="form-control mb-2" placeholder="Your name" required>
          <button class="btn btn-primary">Join Chat</button>
        </form>
      </div>
    </div>
  </div>
</body>
</html>
