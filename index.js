const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.raw({ type: "*/*", limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

const REPLIT_URL = "https://voidops-terminal.replit.app/api/ingest";
const REPLIT_TOKEN = "93db183deedd481e943cdfc88c75712ea739620329258a8d040db665f574fb0b";
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN";

app.post("/webhook", async (req, res) => {
  try {
    console.log("✅ Request received from Oracle!");

    // Convert raw body to string then parse as JSON
    const raw = req.body ? req.body.toString("utf8") : "[]";
    const data = JSON.parse(raw);

    console.log(`📦 ${Array.isArray(data) ? data.length : 1} records received`);

    // Forward to Replit
    const replitRes = await fetch(REPLIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${REPLIT_TOKEN}`
      },
      body: JSON.stringify(data)
    });

    console.log("📤 Replit response:", replitRes.status);

    // Notify Discord
    const summary = Array.isArray(data)
      ? data.map(r => `• **${r.location_name}** — ${r.menu_item_name} ($${r.line_total}) — ${r.reason_code_name}`).join("\n")
      : JSON.stringify(data, null, 2);

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📋 **Void Report Received** — ${Array.isArray(data) ? data.length : 1} record(s)\n${summary}`
      })
    });

    console.log("✅ Forwarded to Replit + Discord!");
    res.status(200).send("OK");

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Error");
  }
});

app.get("/", (req, res) => res.send("Server is running!"));

app.listen(3000, () => console.log("Render server running"));
