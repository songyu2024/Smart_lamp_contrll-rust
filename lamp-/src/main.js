const { invoke } = window.__TAURI__.core;

let greetInputEl;
let greetMsgEl;

async function greet() {
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}
const img = document.getElementById("moe-img");

// 设置图片源为 API 输出
img.src = "https://t.alcy.cc/moe?" + Date.now(); // 加时间戳防止缓存
document.getElementById("moe-img").src = "https://t.alcy.cc/moe?" + Date.now();

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});
