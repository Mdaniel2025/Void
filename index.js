const express = require("express");
const fetch = require("node-fetch");

const app = express();

// Handle raw binary/octet-stream
app.use(express.raw({ type: "application/octet-stream", limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN";

app.post("/webhook", async (req, res) => {
  try {
    // Convert binary buffer to string
    const content = req.body ? req.body.toString("utf8") : "Empty payload";

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "📦 **Oracle Export Received:**\n```json\n" + content + "\n```"
      })
    });

    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => console.log("Server running"));
