function parsearResposta(respostaRaw) {
  const delimitador = /---META_JSON---([\s\S]*?)---END_META---/;
  const match = respostaRaw.match(delimitador);

  let dadosColetados = null;
  let textoExibido = respostaRaw;

  if (match) {
    try {
      dadosColetados = JSON.parse(match[1].trim());
    } catch (e) {
      console.warn("Falha ao parsear metadado:", e);
    }
    textoExibido = respostaRaw.replace(delimitador, "").trim();
  }

  return { textoExibido, dadosColetados };
}