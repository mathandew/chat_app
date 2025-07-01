const chatBox = document.getElementById('chat-box');
const form = document.getElementById('chat-form');
const msgInput = document.getElementById('message');
const fileInput = document.getElementById('file');
const usernameColors = {};
let lastMessageCount = 0;
const newMsgSound = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');
const myUsername = username;
let typingTimeout;

// Typing indicator
const typingIndicator = document.getElementById('typing-indicator');

// Send message
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const message = msgInput.value.trim();
  const file = fileInput.files[0];

  if (message === "" && !file) {
    return;
  }

  const formData = new FormData();
  formData.append('action', 'send');
  formData.append('message', message);
  if (file) {
    formData.append('file', file);
  }

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "messages.php", true);
  xhr.onload = function () {
    console.log("Send response:", this.responseText);
    if (this.responseText.trim() === "OK") {
      msgInput.value = "";
      fileInput.value = "";
      loadMessages();
    }
  };
  xhr.send(formData);
});

// Handle typing
msgInput.addEventListener('input', function () {
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    sendTyping();
  }, 300);
});

function sendTyping() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "typing.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send();
}

// Load messages
function loadMessages() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "messages.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.responseText;
    const messages = tempDiv.querySelectorAll('p');

    if (messages.length > lastMessageCount) {
      if (lastMessageCount !== 0) {
        newMsgSound.play();
      }
      lastMessageCount = messages.length;
    }

    messages.forEach(p => {
      const strong = p.querySelector('strong');
      if (strong) {
        const name = strong.textContent.replace(':', '');
        const color = getColorForUser(name);
        strong.style.color = color;
      }
    });

    chatBox.innerHTML = '';
    messages.forEach(m => chatBox.appendChild(m));
    chatBox.scrollTop = chatBox.scrollHeight;

    loadTypingStatus();
  };
  xhr.send("action=load");
}

// Load typing status
function loadTypingStatus() {
  fetch('typing_status.json?_=' + new Date().getTime(), { cache: 'no-store' })
    .then(res => res.json())
    .then(data => {
      if (data && data.username && data.username !== myUsername) {
        const now = Math.floor(Date.now() / 1000);
        if (now - data.time < 3) {
          typingIndicator.textContent = `${data.username} is typing...`;
          return;
        }
      }
      typingIndicator.textContent = '';
    })
    .catch(err => {
      console.error("Typing status fetch error:", err);
      typingIndicator.textContent = '';
    });
}

function getColorForUser(name) {
  if (!usernameColors[name]) {
    usernameColors[name] = '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  return usernameColors[name];
}

setInterval(loadMessages, 1000);
loadMessages();
