// Usuário clica em "Modo Organizador" ou "Modo Provocador" na tela inicial

const modo = "MODO ORGANIZADOR"; // ou "MODO PROVOCADOR"

const systemPrompt = BASE_PROMPT.replace(
  "[MODO_PLACEHOLDER]",
  `[${modo}]`
);

// systemPrompt é enviado no campo "system" da primeira chamada à API.
// A variável `modo` fica em memória — sem localStorage, sem backend.