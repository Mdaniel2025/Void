const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.raw({ type: "*/*", limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

const DISCORD_WEBHOOK = "https://discordapp.com/api/webhooks/1519338647344644126/wVbF-6UscBi_5Q91PpXbzU7RZUZLvIaHu5IB7E7g72c3u2fV3MeU24t3X0VIAebUZZQ8";

app.post("/webhook", async (req, res) => {
  try {
    console.log("✅ Request received!");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body length:", req.body ? req.body.length : "empty");

    const content = req.body ? req.body.toString("utf8") : "Empty payload";
    console.log("Body preview:", content.substring(0, 200));

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "📦 **Oracle Export Received:**\n```json\n" + content.substring(0, 1800) + "\n```"
      })
    });

    console.log("✅ Sent to Discord!");
    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Error");
  }
});

// Test route to confirm server is alive
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(3000, () => console.log("Server running"));
