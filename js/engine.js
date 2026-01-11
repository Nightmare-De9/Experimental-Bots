const KEY = "PUT_OPENROUTER_KEY";
const MODEL = "mistralai/mistral-small-3.1-24b-instruct:free";

const chat = document.getElementById("chat");
const input = document.getElementById("msg");
const send = document.getElementById("send");
const typing = document.getElementById("typing");

let memoryKey = "vizchat_" + botKey;
let history = JSON.parse(localStorage.getItem(memoryKey)||"[]");

/* ================= MEMORY ================= */

function save(){
  localStorage.setItem(memoryKey, JSON.stringify(history));
}

history.forEach(m=>add(m.role,m.text));

/* ================= UI ================= */

function add(role,text){
  const d = document.createElement("div");
  d.className = "msg " + role;
  d.textContent = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

function showThinking(v){
  typing.classList.toggle("hidden",!v);
}

/* ================= TYPING STREAM ================= */

async function typeBot(text){
  let out="";
  add("bot","");
  const node = chat.lastChild;

  for(const c of text){
    out+=c;
    node.textContent=out;
    await new Promise(r=>setTimeout(r,15));
  }
}

/* ================= OPENROUTER ================= */

async function ask(msg){

  const messages=[
    {role:"system",content:BOT.system()},
    ...history.map(m=>({role:m.role,content:m.text})),
    {role:"user",content:BOT.user(msg,{})}
  ];

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions",{
    method:"POST",
    headers:{
      Authorization:`Bearer ${KEY}`,
      "Content-Type":"application/json",
      "HTTP-Referer":location.origin,
      "X-Title":"VizBots"
    },
    body:JSON.stringify({model:MODEL,messages})
  });

  const data = await res.json();
  return data.choices[0].message.content;
}

/* ================= SEND ================= */

send.onclick = async ()=>{
  const txt=input.value.trim();
  if(!txt) return;

  add("user",txt);
  history.push({role:"user",text:txt});
  input.value="";

  showThinking(true);

  const reply = await ask(txt);

  showThinking(false);

  await typeBot(reply);

  history.push({role:"assistant",text:reply});
  history = history.slice(-40);
  save();
};

input.addEventListener("keydown",e=>{
  if(e.key==="Enter") send.click();
});
