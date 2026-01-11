const bots = {
  beta: {
    name: "VizKaBeta — Thought Bot",
    desc: "Deep thinking and structured responses"
  },
  potha: {
    name: "VizKaPotha — Vacant × Thought",
    desc: "Abstract and experimental reasoning"
  },
  parpotha: {
    name: "VizKaParPotha — VKP × JohnBot",
    desc: "Casual, witty and creative responses"
  }
};

let activeBot = "beta";

const buttons = document.querySelectorAll(".bot-btn");
const title = document.getElementById("bot-title");
const desc = document.getElementById("bot-desc");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");

/* ===== Bot Switching ===== */

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    activeBot = btn.dataset.bot;
    title.textContent = bots[activeBot].name;
    desc.textContent = bots[activeBot].desc;

    messages.innerHTML = "";
  });
});

/* ===== Send Message ===== */

sendBtn.onclick = () => {
  if (!input.value.trim()) return;
  addMsg("user", input.value);

  setTimeout(() => {
    addMsg("bot", `[${bots[activeBot].name}] is thinking...`);
  }, 400);

  input.value = "";
};

function addMsg(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  messages.appendChild(div);
  div.scrollIntoView({ behavior: "smooth" });
}
