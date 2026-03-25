const SUPABASE_URL = "https://jcencfbhpljymgkatuea.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZW5jZmJocGxqeW1na2F0dWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNTU1NDgsImV4cCI6MjA4OTgzMTU0OH0.8G3Sd7p9L-akoPNoF_BUxRK-nlVf3FKXJpAR7BejheY";

async function loadData() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/activation_requests?order=id.desc`, {
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": "Bearer " + SUPABASE_KEY
        }
    });

    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

    data.forEach(item => {
        const li = document.createElement("li");

        li.innerHTML = `
            <b>${item.client_name}</b><br>
            Machine: ${item.machine_id}<br>
            Email: ${item.email}<br>
            WhatsApp: ${item.whatsapp}<br>
            Activation Key: ${item.hidden_key}<br>
            Status: ${item.status}
        `;

        list.appendChild(li);
    });
}

// Auto refresh every 5 seconds
setInterval(loadData, 5000);

// First load
loadData();
