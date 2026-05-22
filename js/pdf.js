// pdf.js
// Geração do PDF do plano de negócios client-side via window.print().
// Sem dependências externas no MVP.

function gerarPDF() {
  // TODO: formatar uma view de impressão com os dados do plano
  // e acionar window.print() ou uma lib como jsPDF futuramente.
  window.print();
}

document.getElementById('btn-gerar-pdf').addEventListener('click', gerarPDF);
