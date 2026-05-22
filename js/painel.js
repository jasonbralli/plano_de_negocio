// painel.js
// Popula os inputs do painel com os dados coletados no chat
// e recalcula as 4 métricas em tempo real.

function popularPainel(dados) {
  if (!dados) return;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== null && val !== undefined) el.value = val;
  };

  set('input-investimento',    dados.investimento_inicial);
  set('input-custo-fixo',      dados.custo_fixo_mensal);
  set('input-preco',           dados.preco_venda);
  set('input-custo-variavel',  dados.custo_variavel);
  set('input-volume',          dados.volume_mensal_estimado);

  calcularMetricas();
}

function calcularMetricas() {
  const investimento = parseFloat(document.getElementById('input-investimento').value)    || 0;
  const custoFixo    = parseFloat(document.getElementById('input-custo-fixo').value)      || 0;
  const preco        = parseFloat(document.getElementById('input-preco').value)            || 0;
  const custoVar     = parseFloat(document.getElementById('input-custo-variavel').value)   || 0;
  const volume       = parseFloat(document.getElementById('input-volume').value)           || 0;

  const margem = preco - custoVar;
  const lucro  = (margem * volume) - custoFixo;
  const pe     = margem > 0 ? custoFixo / margem : null;
  const payback = lucro > 0 ? investimento / lucro : null;

  const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  document.getElementById('result-margem').textContent  = fmt(margem);
  document.getElementById('result-lucro').textContent   = fmt(lucro);
  document.getElementById('result-pe').textContent      =
    pe !== null ? `${pe.toFixed(1)} unidades/mês` : '—';
  document.getElementById('result-payback').textContent =
    payback !== null
      ? `${payback.toFixed(1)} meses`
      : 'Negócio não atinge equilíbrio com esses números';
}

function iniciarPainel(dados) {
  popularPainel(dados);

  // Recalcula em tempo real ao editar qualquer campo
  ['input-investimento','input-custo-fixo','input-preco',
   'input-custo-variavel','input-volume'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcularMetricas);
  });
}
