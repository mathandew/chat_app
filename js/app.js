const chatBox = document.getElementById('chat-box');
const form = document.getElementById('chat-form');
const msgInput = document.getElementById('message');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const message = msgInput.value.trim();
  if (message) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "messages.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
      if (this.responseText === "OK") {
        msgInput.value = "";
        loadMessages();
      }
    };
    xhr.send(`action=send&message=${encodeURIComponent(message)}`);
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

setInterval(loadMessages, 1000);
loadMessages();
