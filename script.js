const QUESTIONS = [
  "Paano natin maipapakita ang tunay na pangangalaga sa kalikasan, at ano ang ating responsibilidad bilang tao sa pagpapanatili nito para sa susunod na henerasyon?",
  "Bakit mahalagang pangalagaan ang kultura at tradisyon ng mga T'boli, at paano nakatutulong ang mga ito sa pagpapanatili ng kanilang pagkakakilanlan?",
  "Paano natin mapapahalagahan ang mga paniniwala at tradisyon ng mga T'boli habang iginagalang ang pagbabago sa modernong lipunan?",
  "Ano ang ugnayan ng pangangalaga sa kalikasan at paggalang sa kultura ng mga katutubong pamayanan tulad ng mga T'boli?",
  "Paano natin masusukat ang tunay na malasakit ng tao sa kapwa, kalikasan, at kultura sa pamamagitan ng kanyang mga kilos at desisyon?"
];

const fields = QUESTIONS.map((_, i) => document.getElementById(`answer${i + 1}`));
const status = document.getElementById("status");
const STORAGE_KEY = "philosophy-sanctuary-answers-v1";

function loadAnswers() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    fields.forEach((field, i) => { if (typeof saved[i] === "string") field.value = saved[i]; });
  } catch (_) { /* Continue if storage is unavailable. */ }
}
function saveAnswers() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fields.map(f => f.value))); } catch (_) {}
}
fields.forEach(field => field.addEventListener("input", saveAnswers));
loadAnswers();

document.getElementById("clearAnswers").addEventListener("click", () => {
  if (!confirm("Clear all five answers saved on this device?")) return;
  fields.forEach(field => field.value = "");
  saveAnswers();
  status.textContent = "All answers cleared.";
});

function wrapText(doc, text, maxWidth) {
  return doc.splitTextToSize(text || "No answer provided.", maxWidth);
}
document.getElementById("downloadPdf").addEventListener("click", async () => {
  const button = document.getElementById("downloadPdf");
  if (!window.jspdf || !window.jspdf.jsPDF) {
    status.textContent = "The PDF tool did not load. Check your internet connection and try again.";
    return;
  }
  button.disabled = true;
  status.textContent = "Preparing your PDF…";
  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 18;
    const textWidth = pageWidth - margin * 2;
    let y = 20;

    pdf.setFillColor(48, 31, 17);
    pdf.rect(0, 0, pageWidth, 42, "F");
    pdf.setTextColor(232, 199, 128);
    pdf.setFont("times", "bold");
    pdf.setFontSize(19);
    pdf.text("PHILOSOPHY", margin, 18);
    pdf.setFontSize(11);
    pdf.setFont("times", "normal");
    pdf.text("THE SANCTUARY OF WISDOM", margin, 27);
    pdf.setTextColor(55, 43, 30);
    pdf.setFontSize(10);
    pdf.text("COMPILED ANSWERS", margin, 37);
    y = 54;

    QUESTIONS.forEach((question, i) => {
      const answer = fields[i].value.trim() || "No answer provided.";
      const qLines = wrapText(pdf, question, textWidth);
      const aLines = wrapText(pdf, answer, textWidth - 4);
      const blockHeight = 13 + qLines.length * 5.2 + 8 + aLines.length * 5.2 + 13;
      if (y + Math.min(blockHeight, 45) > pageHeight - 18) {
        pdf.addPage();
        y = 20;
      }

      pdf.setFillColor(242, 234, 214);
      pdf.setDrawColor(196, 164, 105);
      pdf.roundedRect(margin - 2, y - 5, textWidth + 4, 10, 2, 2, "FD");
      pdf.setTextColor(102, 70, 31);
      pdf.setFont("times", "bold");
      pdf.setFontSize(12);
      pdf.text(`QUESTION ${i + 1}`, margin + 2, y + 1);
      y += 13;

      pdf.setTextColor(48, 39, 29);
      pdf.setFont("times", "normal");
      pdf.setFontSize(11);
      for (const line of qLines) {
        if (y > pageHeight - 20) { pdf.addPage(); y = 20; }
        pdf.text(line, margin, y);
        y += 5.2;
      }
      y += 3;

      pdf.setTextColor(61, 117, 70);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.text("MY ANSWER", margin, y);
      y += 6;
      pdf.setTextColor(48, 39, 29);
      pdf.setFont("times", "normal");
      pdf.setFontSize(11);
      for (const line of aLines) {
        if (y > pageHeight - 18) { pdf.addPage(); y = 20; }
        pdf.text(line, margin, y);
        y += 5.2;
      }
      y += 12;
      if (i < QUESTIONS.length - 1 && y > pageHeight - 35) {
        pdf.addPage();
        y = 20;
      }
    });

    const totalPages = pdf.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      pdf.setPage(p);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(130, 116, 96);
      pdf.text("PHILOSOPHY • THE SANCTUARY OF WISDOM", margin, pageHeight - 8);
      pdf.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: "right" });
    }
    pdf.save("philosophy-quiz-answers.pdf");
    status.textContent = "Your PDF is ready. Check your downloads.";
  } catch (error) {
    status.textContent = "Something went wrong while creating the PDF. Please try again.";
  } finally {
    button.disabled = false;
  }
});
