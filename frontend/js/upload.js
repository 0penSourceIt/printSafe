const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const result = document.getElementById("result");

const EXPIRY_SECONDS = 300;

function getFileIcon(name) {
  if (name.endsWith(".pdf")) return "📄";
  if (name.match(/\.(jpg|jpeg|png)$/i)) return "🖼️";
  return "📁";
}

function startTimer(element, linkEl) {
  let remaining = EXPIRY_SECONDS;

  const interval = setInterval(() => {
    const min = Math.floor(remaining / 60);
    const sec = remaining % 60;

    element.textContent = `Auto-Expiring in ${min}:${sec.toString().padStart(2, "0")}`;

    remaining--;

    if (remaining < 0) {
      clearInterval(interval);
      element.textContent = "Link Expired";
      linkEl.style.pointerEvents = "none";
      linkEl.style.opacity = "0.5";
    }
  }, 1000);
}

uploadBtn.addEventListener("click", async () => {
  const files = fileInput.files;

  if (!files.length) {
    alert("Select files");
    return;
  }

  result.innerHTML = "";

  for (let file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    const container = document.createElement("div");
    container.className = "fileRow";

    const icon = getFileIcon(file.name);

    container.innerHTML = `
      <div class="fileName">
          <strong>${icon} ${file.name}</strong>
        </div>

        <div class="linkRow">
          <a href="viewer.html?token=${data.token}" target="_blank">
            Open Print Link
          </a>

        <span class="timerText"></span>
      </div>
    `;

    result.appendChild(container);

    const timerEl = container.querySelector(".timerText");
    const linkEl = container.querySelector("a");

    startTimer(timerEl, linkEl);
  }
});
