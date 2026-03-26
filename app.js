const SUPABASE_URL = "https://jcencfbhpljymgkatuea.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZW5jZmJocGxqeW1na2F0dWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNTU1NDgsImV4cCI6MjA4OTgzMTU0OH0.8G3Sd7p9L-akoPNoF_BUxRK-nlVf3FKXJpAR7BejheY";

let lastCount = 0;

// Ask permission for notifications
if ('Notification' in window) {
  Notification.requestPermission().then(permission => {
    console.log("Notification permission:", permission);
  });
}

// Load data and detect new entries
async function loadData() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/activation_requests?order=id.desc`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY
      }
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    const list = document.getElementById("list");
    const badge = document.getElementById("badge");
    const sound = document.getElementById("notifySound");

    list.innerHTML = "";

    // Detect new entries
    if (lastCount !== 0 && data.length > lastCount) {
      const newCount = data.length - lastCount;

      badge.innerText = ` (New: ${newCount})`;

      // Sound for active page
      sound.play().catch(() => {});

      // Notification even if page is in background
      if (Notification.permission === "granted" && navigator.serviceWorker) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification("New Activation Request!", {
            body: `${newCount} new request(s) received.`,
            icon: "./icon.png",
            badge: "./icon.png",
            vibrate: [200, 100, 200],
            tag: "activation-notify"
          });
        });
      }
    } else {
      badge.innerText = "";
    }

    lastCount = data.length;

    // Populate list
    if (data.length === 0) {
      list.innerHTML = "<li>No requests found</li>";
      return;
    }

    data.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <b>${item.client_name}</b><br>
        Machine: ${item.machine_id}<br>
        Email: ${item.email || "-"}<br>
        WhatsApp: ${item.whatsapp || "-"}<br>
        Status: ${item.status}<br>
        Hidden Key: ${item.hidden_key || "-"}<br>
        <button onclick="deleteRequest(${item.id})">Delete</button>
      `;
      list.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    document.getElementById("list").innerHTML = "<li>Error loading data</li>";
  }
}

// Delete request
async function deleteRequest(id) {
  if (!confirm("Are you sure you want to delete this request?")) return;

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/deleterequest?id=${id}`, {
      method: "DELETE"
    });

    const text = await res.text();

    if (res.ok) {
      alert("Deleted successfully");
      loadData();
    } else {
      alert("Failed: " + text);
    }
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
}

// Auto-refresh every 5 seconds
setInterval(loadData, 5000);
loadData();