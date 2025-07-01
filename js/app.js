const chatBox = document.getElementById('chat-box');
const form = document.getElementById('chat-form');
const msgInput = document.getElementById('message');
const usernameColors = {};
let lastMessageCount = 0;
const newMsgSound = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');
const myUsername = username;
let typingTimeout;

// Typing indicator element
const typingIndicator = document.createElement('div');
typingIndicator.className = 'text-muted';
typingIndicator.style.fontStyle = 'italic';
typingIndicator.style.marginTop = '5px';
chatBox.parentNode.insertBefore(typingIndicator, chatBox.nextSibling);

// Send message
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const message = msgInput.value.trim();
  const fileInput = document.getElementById('file');
  const file = fileInput.files[0];

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


// Input typing event
msgInput.addEventListener('input', function () {
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    sendTyping();
  }, 300);
});

// Send typing status
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
      console.log("Typing data:", data);  // Debug: see what you get
      if (data && data.username && data.username !== myUsername) {
        const now = Math.floor(Date.now() / 1000);
        if (now - data.time < 3) {  // Allow a bit more time margin
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


// Assign random color
function getColorForUser(name) {
  if (!usernameColors[name]) {
    usernameColors[name] = '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  return usernameColors[name];
}

// Start interval
setInterval(loadMessages, 1000);
loadMessages();
