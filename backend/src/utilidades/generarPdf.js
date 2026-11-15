// Convierte un HTML en PDF con Puppeteer (como el ejemplo AppPuppeteers.js de clase); lo usa ventasControlador.js.
const puppeteer = require("puppeteer");

async function generarPdf(html) {
  const navegador = await puppeteer.launch();
  try {
    const pagina = await navegador.newPage();
    await pagina.setContent(html, { waitUntil: "load" });
    const pdf = await pagina.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", bottom: "18mm", left: "15mm", right: "15mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await navegador.close();
  }
}

module.exports = { generarPdf };
