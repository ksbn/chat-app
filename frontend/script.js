const API_URL = "http://localhost:3000";

// Load and display messages
async function loadMessages() {
  try {
    const res = await fetch(`${API_URL}/messages`);
    const messages = await res.json();
    renderMessages(messages);
  } catch (err) {
    console.error("Failed to load messages:", err);
  }
}

function renderMessages(messages) {
  const container = document.getElementById("messages");
  container.innerHTML = "";

  if (messages.length === 0) {
    container.innerHTML = '<p class="empty">No messages yet. Say hello! 👋</p>';
    return;
  }

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `
      <span class="username">${msg.username}</span>
      <span class="text">${msg.text}</span>
      <span class="time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
      <div class="reactions">
        <button onclick="react(${msg.id}, 'like')">👍 ${msg.likes}</button>
        <button onclick="react(${msg.id}, 'dislike')">👎 ${msg.dislikes}</button>
      </div>
    `
    container.appendChild(div);
  });
}

// Send a message
document.getElementById("message-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const text = document.getElementById("message-input").value.trim();
  const feedback = document.getElementById("feedback");

  if (!username) {
    feedback.textContent = "❌ Please enter your name.";
    feedback.style.color = "red";
    return;
  }

  if (!text) {
    feedback.textContent = "❌ Message cannot be empty.";
    feedback.style.color = "red";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, username })
    });

    if (res.ok) {
      document.getElementById("message-input").value = "";
      feedback.textContent = "";
      loadMessages();
    } else {
      const err = await res.text();
      feedback.textContent = `❌ ${err}`;
      feedback.style.color = "red";
    }
  } catch (err) {
    feedback.textContent = "❌ Could not connect to server.";
    feedback.style.color = "red";
  }
});

// Like or dislike
async function react(id, type) {
  await fetch(`${API_URL}/messages/${id}/${type}`, { method: "POST" });
  loadMessages();
}

// Auto-refresh every 3 seconds
loadMessages();
setInterval(loadMessages, 3000);