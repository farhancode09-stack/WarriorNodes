const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const webPath = path.join(__dirname, "../web");
app.use(express.static(webPath));

let servers = [
  {
    id: "warriorcraft-1",
    name: "WarriorCraft",
    status: "online",
    ram: "4 GB",
    software: "Paper",
    version: "26.2"
  }
];

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    name: "WarriorNodes",
    version: "0.1.0"
  });
});

app.get("/api/servers", (req, res) => {
  res.json(servers);
});

app.post("/api/servers", (req, res) => {
  const { name, ram, software, version } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Server name is required"
    });
  }

  const server = {
    id: Date.now().toString(),
    name,
    status: "offline",
    ram: ram || "4 GB",
    software: software || "Paper",
    version: version || "26.2"
  };

  servers.push(server);
  res.status(201).json(server);
});

app.post("/api/servers/:id/:action", (req, res) => {
  const server = servers.find(s => s.id === req.params.id);

  if (!server) {
    return res.status(404).json({
      error: "Server not found"
    });
  }

  const action = req.params.action;

  if (action === "start") server.status = "online";
  else if (action === "stop") server.status = "offline";
  else if (action === "restart") server.status = "online";
  else {
    return res.status(400).json({
      error: "Invalid action"
    });
  }

  res.json(server);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(webPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`WarriorNodes running on port ${PORT}`);
});
