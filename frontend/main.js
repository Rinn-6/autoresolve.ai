async function submitQuery() {
    const query = document.getElementById("queryInput").value;
    const responseArea = document.getElementById("responseArea");
    const replyText = document.getElementById("replyText");
    const escalationText = document.getElementById("escalationText");

    if (!query) return alert("Please enter your query");

    const res = await fetch("https://autoresolve-api.onrender.com/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({query})
    });

    const data = await res.json();
    replyText.textContent = data.reply || "No reply received.";
    escalationText.textContent = data.escalation
      ? "This requires human attention."
      : "";
    responseArea.classList.remove("hidden");

}