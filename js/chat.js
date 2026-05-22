// chat.js
// Gerencia a renderização das mensagens e a comunicação com a API.

// ── Configuração ──────────────────────────────────────────────
// ⚠️ NÃO commitar a chave aqui. Insira sua chave localmente para testes.
// Em produção (Vercel), configure como variável de ambiente OPENROUTER_API_KEY.
const OPENROUTER_API_KEY = '';

// Lista de modelos gratuitos em ordem de preferência (atualizada Mai/2026).
// Se o primeiro falhar (429/404/400), tenta o próximo automaticamente.
const MODELOS = [
  'deepseek/deepseek-v4-flash:free',       // #1 qualidade, 1M contexto
  'nvidia/nemotron-3-super-120b-a12b:free', // 120B, 1M contexto, #12 popularidade
  'google/gemma-4-31b-it:free',            // Google, 262K contexto
  'meta-llama/llama-3.3-70b-instruct:free', // Meta 70B, fallback sólido
  'openai/gpt-oss-20b:free',               // OpenAI OSS, último recurso
];

const TIMEOUT_MS = 30000; // 30s por tentativa, igual ao PHP

// Histórico de mensagens enviado à API a cada turno
let historico = [];

// Último estado de dados coletados (atualizado a cada resposta da IA)
let dadosColetados = null;

// ── Chamada à API com fallback de modelos ─────────────────────
async function chamarAPI(mensagens) {
  const ERROS_FATAIS = [400, 429, 404];

  for (const modelo of MODELOS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const resposta = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.href,
        },
        body: JSON.stringify({
          model: modelo,
          messages: mensagens,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await resposta.json();

      // Se retornou erro conhecido, tenta próximo modelo
      if (json.error && ERROS_FATAIS.includes(json.error.code)) {
        console.warn(`[API] Modelo ${modelo} retornou erro ${json.error.code}. Tentando próximo...`);
        continue;
      }

      // Sucesso
      console.log(`[API] Respondido pelo modelo: ${modelo}`);
      return json;

    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        console.warn(`[API] Timeout no modelo ${modelo}. Tentando próximo...`);
      } else {
        console.warn(`[API] Erro no modelo ${modelo}:`, err);
      }
      // Continua para o próximo modelo
    }
  }

  // Todos os modelos falharam
  throw new Error('Todos os modelos disponíveis falharam. Tente novamente.');
}

// ── Renderização ──────────────────────────────────────────────
function adicionarMensagem(texto, origem) {
  const container = document.getElementById('chat-mensagens');
  const div = document.createElement('div');
  div.classList.add('msg', origem === 'ia' ? 'msg-ia' : 'msg-usuario');
  div.textContent = texto;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function exibirDigitando() {
  const container = document.getElementById('chat-mensagens');
  const div = document.createElement('div');
  div.classList.add('msg', 'msg-ia');
  div.id = 'msg-digitando';
  div.textContent = '...';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removerDigitando() {
  const el = document.getElementById('msg-digitando');
  if (el) el.remove();
}

// ── Envio de mensagem ─────────────────────────────────────────
async function enviarMensagem(textoUsuario) {
  if (!textoUsuario.trim()) return;

  adicionarMensagem(textoUsuario, 'usuario');
  historico.push({ role: 'user', content: textoUsuario });

  document.getElementById('input-usuario').value = '';
  document.getElementById('btn-enviar').disabled = true;
  exibirDigitando();

  try {
    const mensagens = [
      { role: 'system', content: window.SYSTEM_PROMPT },
      ...historico,
    ];

    const json = await chamarAPI(mensagens);
    const respostaRaw = json.choices?.[0]?.message?.content || '';

    // Extrai metadado e texto limpo
    const { textoExibido, dadosColetados: novosDados } = parsearResposta(respostaRaw);

    if (novosDados) dadosColetados = novosDados;

    historico.push({ role: 'assistant', content: respostaRaw });

    removerDigitando();
    adicionarMensagem(textoExibido, 'ia');

    // Verifica se chegou ao fechamento
    if (novosDados?.status === 'concluido') {
      setTimeout(() => abrirPainel(dadosColetados?.dados), 2000);
    }

  } catch (err) {
    removerDigitando();
    adicionarMensagem(err.message || 'Erro ao conectar com a IA. Tente novamente.', 'ia');
    console.error('[Chat] Erro na chamada à API:', err);
  } finally {
    document.getElementById('btn-enviar').disabled = false;
  }
}

// ── Event Listeners ───────────────────────────────────────────
document.getElementById('btn-enviar').addEventListener('click', () => {
  enviarMensagem(document.getElementById('input-usuario').value);
});

document.getElementById('input-usuario').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') enviarMensagem(e.target.value);
});
