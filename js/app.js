const chatBox = document.getElementById('chat-box');
const form = document.getElementById('chat-form');
const msgInput = document.getElementById('message');
const fileInput = document.getElementById('file');
const themeToggle = document.getElementById('theme-toggle');
const filePreview = document.getElementById('file-preview');
const usernameColors = {};
let lastMessageCount = 0;
const newMsgSound = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');
const myUsername = username;
let typingTimeout;

// 🌙 Dark mode toggle
themeToggle.addEventListener('click', () => {
  const body = document.getElementById('body');
  body.classList.toggle('bg-light');
  body.classList.toggle('bg-dark');
  body.classList.toggle('text-dark');
  body.classList.toggle('text-light');

  const chatBox = document.getElementById('chat-box');
  chatBox.classList.toggle('bg-white');
  chatBox.classList.toggle('bg-secondary');

  themeToggle.textContent = themeToggle.textContent.includes('Dark') 
    ? '☀️ Light Mode' 
    : '🌙 Dark Mode';
});

// File preview before send
fileInput.addEventListener('change', function() {
  filePreview.innerHTML = '';
  const file = this.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      filePreview.innerHTML = `<img src="${e.target.result}" style="max-height:100px;" class="me-2"> 
        <button class="btn btn-sm btn-outline-danger" onclick="removeFile()">❌ Remove</button>`;
    };
    reader.readAsDataURL(file);
  }
});

window.removeFile = function() {
  fileInput.value = '';
  filePreview.innerHTML = '';
};

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
  if (file) formData.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "messages.php", true);
  xhr.onload = function () {
    if (this.responseText.trim() === "OK") {
      msgInput.value = "";
      removeFile();
      loadMessages(true);
    }
  };
  xhr.send(formData);
});

// Typing
msgInput.addEventListener('input', function () {
  if (typingTimeout) clearTimeout(typingTimeout);
  sendTyping();
  typingTimeout = setTimeout(() => {
    // clear typing after timeout
  }, 3000);
});

// Load messages
function loadMessages(smooth) {
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

    chatBox.innerHTML = '';
    messages.forEach(m => {
      const strong = m.querySelector('strong');
      if (strong) {
        const name = strong.textContent.replace(':', '');
        const color = getColorForUser(name);
        strong.style.color = color;
        const avatar = document.createElement('span');
        avatar.textContent = getAvatar(name);
        avatar.style.marginRight = '5px';
        strong.prepend(avatar);
      }
      chatBox.appendChild(m);
    });

    if (smooth) {
      chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  };
  xhr.send("action=load");
}

function sendTyping() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "typing.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send();
}

function getColorForUser(name) {
  if (!usernameColors[name]) {
    usernameColors[name] = '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  return usernameColors[name];
}

function getAvatar(name) {
  // Could use emoji or initials
  const emojis = ['😎', '😊', '🤖', '👾', '🐱', '🐶'];
  return emojis[name.length % emojis.length];
}

setInterval(() => loadMessages(false), 1000);
loadMessages(false);
