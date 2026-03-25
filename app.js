const SUPABASE_URL = "https://jcencfbhpljymgkatuea.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZW5jZmJocGxqeW1na2F0dWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNTU1NDgsImV4cCI6MjA4OTgzMTU0OH0.8G3Sd7p9L-akoPNoF_BUxRK-nlVf3FKXJpAR7BejheY";

// Function to load data from Supabase and show in the list
async function loadData() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/activation_requests?order=id.desc`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY
      }
    });

    if (!res.ok) throw new Error("Failed to fetch data");

    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

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
        Activation Key: ${item.status === "approved" ? item.hidden_key : "Pending"}<br>
        <button onclick="deleteRequest(${item.id})">Delete</button>
      `;
      list.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    document.getElementById("list").innerHTML = "<li>Error loading data</li>";
  }
}

// Delete function (calls serverless function)
async function deleteRequest(id) {
  if (!confirm("Are you sure you want to delete this request?")) return;

  try {
    const res = await fetch(`/.netlify/functions/deleteRequest?id=${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("Deleted successfully");
      loadData(); // Refresh the list
    } else {
      alert("Failed to delete");
    }
  } catch (err) {
    console.error(err);
    alert("Error deleting request");
  }
}

// Auto-refresh every 5 seconds
setInterval(loadData, 5000);
loadData();