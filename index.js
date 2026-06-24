const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const DISCORD_WEBHOOK = "https://discordapp.com/api/webhooks/1519338647344644126/wVbF-6UscBi_5Q91PpXbzU7RZUZLvIaHu5IB7E7g72c3u2fV3MeU24t3X0VIAebUZZQ8";

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
