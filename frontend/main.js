document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.addEventListener("click", submitQuery);
});

async function submitQuery() {
    const query = document.getElementById("queryInput").value;
    const responseArea = document.getElementById("responseArea");
    const replyText = document.getElementById("replyText");
    const escalationText = document.getElementById("escalationText");
    const submitBtn = document.getElementById("submitBtn");

    if (!query) return alert("Please enter your query");
    
    submitBtn.disabled = true;
    submitBtn.textContent = "...";
    submitBtn.classList.add("opacity-50", "cursor-not-allowed");

    try {
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
    } catch (err) {
        replyText.textContent = "Something went wrong. Try again later.";
        escalationText.textContent = "";
        responseArea.classList.remove("hidden");
        console.error(err);
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
    submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
}   

