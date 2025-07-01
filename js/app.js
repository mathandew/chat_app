const chatBox = document.getElementById('chat-box');
const form = document.getElementById('chat-form');
const msgInput = document.getElementById('message');
const usernameColors = {};
let lastMessageCount = 0;
const newMsgSound = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const message = msgInput.value.trim();
  if (message !== "") {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "messages.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
      console.log("Send response:", this.responseText);
      if (this.responseText.trim() === "OK") {
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
  };
  xhr.send("action=load");
}

function getColorForUser(name) {
  if (!usernameColors[name]) {
    usernameColors[name] = '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  return usernameColors[name];
}

setInterval(loadMessages, 1000);
loadMessages();
