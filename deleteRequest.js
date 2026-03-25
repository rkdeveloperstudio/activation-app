import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jcencfbhpljymgkatuea.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZW5jZmJocGxqeW1na2F0dWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNTU1NDgsImV4cCI6MjA4OTgzMTU0OH0.8G3Sd7p9L-akoPNoF_BUxRK-nlVf3FKXJpAR7BejheY";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function handler(event, context) {
  const id = event.queryStringParameters.id;

  const { error } = await supabase
    .from("activation_requests")
    .delete()
    .eq("id", id);

  if (error) return { statusCode: 400, body: JSON.stringify(error) };

  return { statusCode: 200, body: JSON.stringify({ message: "Deleted" }) };
}