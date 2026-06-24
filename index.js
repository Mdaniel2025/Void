const express = require("express");
const fetch = require("node-fetch");

const app = express();

// Handle raw octet-stream from Oracle
app.use(express.raw({ type: "application/octet-stream", limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.text({ type: "text/*", limit: "50mb" }));

const REPLIT_URL = "https://voidops-terminal.replit.app/api/ingest";
const REPLIT_TOKEN = "93db183deedd481e943cdfc88c75712ea739620329258a8d040db665f574fb0b";
const DISCORD_WEBHOOK = "https://discordapp.com/api/webhooks/1519338647344644126/wVbF-6UscBi_5Q91PpXbzU7RZUZLvIaHu5IB7E7g72c3u2fV3MeU24t3X0VIAebUZZQ8";

app.post("/webhook", async (req, res) => {
  try {
    console.log("✅ Request received from Oracle!");
    console.log("Content-Type:", req.headers["content-type"]);

    // Parse body regardless of how Oracle sends it
    let data;
    if (Buffer.isBuffer(req.body)) {
      const raw = req.body.toString("utf8");
      console.log("Raw body preview:", raw.substring(0, 200));
      data = JSON.parse(raw);
    } else if (typeof req.body === "string") {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }

    const records = Array.isArray(data) ? data : [data];
    console.log(`📦 ${records.length} records received`);

    // Forward to Replit as clean JSON
    const replitRes = await fetch(REPLIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${REPLIT_TOKEN}`
      },
      body: JSON.stringify(records)
    });

    console.log("📤 Replit response:", replitRes.status);

    // Build Discord message using correct Oracle field names
    const summary = records.map(r =>
      `• 📍 **${r.locationName}** | 👤 ${r.transactionEmployeeFirstName} ${r.transactionEmployeeLastName} | 🍗 ${r.menuItemName1} | 💰 $${r.lineTotal} | ❌ ${r.reasonCodeName} | 🧾 Check #${r.checkNum}`
    ).join("\n");

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📋 **Void Report — ${records.length} record(s)**\n📅 ${records[0]?.businessDate || ""}\n📍 ${records[0]?.locationName || ""}\n\n${summary}`
      })
    });

    console.log("✅ Forwarded to Replit + Discord!");
    res.status(200).send("OK");

  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).send("Error: " + err.message);
  }
});

app.get("/", (req, res) => res.send("Server is running!"));

app.listen(3000, () => console.log("Render server running"));
