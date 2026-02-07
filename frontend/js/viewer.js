document.addEventListener("contextmenu", (e) => e.preventDefault());

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

async function loadFile() {
  const res = await fetch(`/view/${token}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    document.body.innerHTML = "<h2>Link expired</h2>";
    return;
  }

  const blob = await res.blob();

  if (blob.type.startsWith("image/")) {
    renderImage(blob);
  } else {
    const arrayBuffer = await blob.arrayBuffer();
    renderPDF(arrayBuffer);
  }
}

function renderImage(blob) {
  const container = document.getElementById("imageContainer");

  const img = document.createElement("img");
  img.src = URL.createObjectURL(blob);
  img.style.maxWidth = "90%";
  img.style.marginTop = "20px";

  container.appendChild(img);

  img.onload = () => setTimeout(() => window.print(), 500);
}

async function renderPDF(data) {
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const page = await pdf.getPage(1);

  const canvas = document.getElementById("pdfCanvas");
  const context = canvas.getContext("2d");

  const viewport = page.getViewport({ scale: 1.2 });
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  setTimeout(() => window.print(), 600);
}

window.addEventListener("afterprint", () => {
  document.body.innerHTML = "<h2>Session finished</h2>";
});

loadFile();
