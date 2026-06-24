const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN";

app.post("/webhook", async (req, res) => {
  const data = req.body;

  await fetch(DISCORD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: "```json\n" + JSON.stringify(data, null, 2) + "\n```"
    })
  });

  res.status(200).send("OK");
});

app.listen(3000, () => console.log("Server running"));
