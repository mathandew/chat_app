const chatBox = document.getElementById('chat-box');
const form = document.getElementById('chat-form');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const message = document.getElementById('message').value.trim();
  
  if (username && message) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "messages.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
      if (this.responseText === "OK") {
        document.getElementById('message').value = "";
        loadMessages();
      }
    };
    xhr.send(`action=send&username=${encodeURIComponent(username)}&message=${encodeURIComponent(message)}`);
  }
});

function loadMessages() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "messages.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function() {
    chatBox.innerHTML = this.responseText;
    chatBox.scrollTop = chatBox.scrollHeight;
  };
  xhr.send("action=load");
}

// Auto-refresh chat every 1 second
setInterval(loadMessages, 1000);

// Initial load
loadMessages();
