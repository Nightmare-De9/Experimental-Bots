const params = new URLSearchParams(location.search);
const botKey = params.get("bot") || "beta";
const BOT = Bots[botKey];

document.getElementById("botTitle").innerText = BOT.name;
