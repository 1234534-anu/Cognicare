
  const supabaseClient = window.supabase.createClient(
    "https://uhtjtzivpcumaarkjuss.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVodGp0eml2cGN1bWFhcmtqdXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NzE5NjUsImV4cCI6MjA4NjA0Nzk2NX0.JD2yw-qn3HmmsUR3VkMIZIMr76EQ60HAQ7Cjk3whDdQ"
  );

  async function requireAuth() {
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      alert("Please login to access this game");
      window.location.href = "/login.html";
      return null;
    }

    return user;
  }
