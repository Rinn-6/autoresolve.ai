const input = document.getElementById("queryInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatbox");

sendBtn.addEventListener("click", submitQuery);

async function submitQuery() {
    const query = input.value.trim();
    if (!query) return;
    addMessage("user", query);
    input.value = "";

    const loadingMsg = addMessage("bot", "Thinking..");

    
    
    try {
        const res = await fetch("https://autoresolve-api.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({query})
        });

        const data = await res.json();
        loadingMsg.remove();
        addMessage("bot", data.reply);

        if (data.escalation) {
            addMessage("bot", "This query may require human support.");
        }
    } catch (err) {
        loadingMsg.remove();
        addMessage("bot", "Failed to fetch response.");
    }
}

function addMessage(role, text) {
    const msg = document.createElement("div");
    msg.className = `p-2 rounded max-w-[80%] ${
      role === "user"
        ? "bg-blue-100 self-end text-right"
        : "bg-gray-200 self-start"
    }`;
    msg.textContent = text;
    chatBox.appendChild(msg);
    if (chatBox.scrollHeight > chatBox.clientHeight + 20) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    return msg;
}