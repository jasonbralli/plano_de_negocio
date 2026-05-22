// parser.js
// Extrai o bloco ---META_JSON--- da resposta da IA e retorna
// o texto limpo para exibição + o objeto de dados coletados.

function parsearResposta(respostaRaw) {
  const delimitador = /---META_JSON---([\s\S]*?)---END_META---/;
  const match = respostaRaw.match(delimitador);

  let dadosColetados = null;
  let textoExibido = respostaRaw;

  if (match) {
    try {
      dadosColetados = JSON.parse(match[1].trim());
    } catch (e) {
      console.warn('[Parser] Falha ao parsear metadado JSON:', e);
    }
    textoExibido = respostaRaw.replace(delimitador, '').trim();
  }

  return { textoExibido, dadosColetados };
}
