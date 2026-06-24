const express = require("express");
const fetch = require("node-fetch");
const multer = require("multer");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DISCORD_WEBHOOK = "https://discordapp.com/api/webhooks/1519338647344644126/wVbF-6UscBi_5Q91PpXbzU7RZUZLvIaHu5IB7E7g72c3u2fV3MeU24t3X0VIAebUZZQ8";

// Handle file upload
app.post("/webhook", upload.any(), async (req, res) => {
  try {
    let content = "";

    // If a file was uploaded
    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      const fileContent = file.buffer.toString("utf8");
      content = "📦 **File received:** `" + file.originalname + "`\n```json\n" + fileContent + "\n```";
    } 
    // If raw JSON body
    else if (req.body) {
      content = "📦 **Data received:**\n```json\n" + JSON.stringify(req.body, null, 2) + "\n```";
    }

    // Send to Discord
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });

    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
