/* =========================================================
   BOLETIM DIGITAL — 9º ANO
   ========================================================= */

// CONFIGURAÇÃO FIXA DO ALUNO
const CONFIG_ALUNO = {
  turma: "9C",
  numeroChamada: 11,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// PIN MANTIDO SOMENTE EM MEMÓRIA
let pinSessao = "";

// MODO DE EDIÇÃO
let modoEdicao = false;

/* ===== DADOS BRUTOS LOCAIS ===== */
let disciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

/* ===== FUNÇÃO: normalizarNota ===== */
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  let numero = typeof valor === "string" ? valor.replace(",", ".") : valor;
  numero = Number(numero);

  if (isNaN(numero)) {
    return null;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }
  return null;
}

/* ===== FUNÇÃO: calcularMedia ===== */
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);
  if (validas.length === 0) {
    return null;
  }
  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

/* ===== FUNÇÃO: definirSituacao ===== */
function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= 6.0) {
    return "Bom desempenho";
  }
  return "Atenção";
}

/* ===== FUNÇÃO: somarFaltas ===== */
function somarFaltas(faltas) {
  if (!Array.isArray(faltas)) return 0;
  return faltas.reduce((acc, n) => acc + (Number(n) || 0), 0);
}

/* ===== FUNÇÃO: formatarNota ===== */
function formatarNota(nota) {
  if (nota === null || nota === undefined) {
    return "—";
  }
  return Number(nota).toFixed(1).replace(".", ",");
}

/* ===== FUNÇÃO: classeSituacao ===== */
function classeSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-sem-nota";
}

/* ===== FUNÇÕES DE VALIDAÇÃO DE EDIÇÃO ===== */
function validarNotaEdicao(valor) {
  if (valor === null || valor === undefined || String(valor).trim() === "") {
    return { valido: true, valor: null };
  }
  const str = String(valor).replace(",", ".");
  const num = Number(str);
  if (isNaN(num) || num < 0 || num > 10) {
    return { valido: false, valor: null };
  }
  return { valido: true, valor: num };
}

function validarFaltaEdicao(valor) {
  if (valor === null || valor === undefined || String(valor).trim() === "") {
    return { valido: false, valor: null };
  }
  const num = Number(valor);
  if (!Number.isInteger(num) || num < 0) {
    return { valido: false, valor: null };
  }
  return { valido: true, valor: num };
}

/* ===== RENDERIZAÇÃO DA TABELA ===== */
function criarLinhaVisualizacao(item) {
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  const media = calcularMedia([n1, n2, n3]);
  const faltasTotal = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

  const tr = document.createElement("tr");

  const tdDisc = document.createElement("td");
  tdDisc.textContent = item.disciplina || "";
  tr.appendChild(tdDisc);

  const tdT1 = document.createElement("td");
  tdT1.className = n1 === null ? "nota-ausente" : "";
  tdT1.textContent = n1 === null ? "Ainda não lançada" : formatarNota(n1);
  tr.appendChild(tdT1);

  const tdT2 = document.createElement("td");
  tdT2.className = n2 === null ? "nota-ausente" : "";
  tdT2.textContent = n2 === null ? "Ainda não lançada" : formatarNota(n2);
  tr.appendChild(tdT2);

  const tdT3 = document.createElement("td");
  tdT3.className = n3 === null ? "nota-ausente" : "";
  tdT3.textContent = n3 === null ? "Ainda não lançada" : formatarNota(n3);
  tr.appendChild(tdT3);

  const tdMed = document.createElement("td");
  tdMed.textContent = media === null ? "—" : formatarNota(media);
  tr.appendChild(tdMed);

  const tdFaltas = document.createElement("td");
  tdFaltas.textContent = faltasTotal;
  tr.appendChild(tdFaltas);

  const tdSit = document.createElement("td");
  tdSit.className = classeSituacao(situacao);
  tdSit.textContent = situacao;
  tr.appendChild(tdSit);

  return tr;
}

function criarLinhaEdicao(item, index) {
  const tr = document.createElement("tr");

  const tdDisc = document.createElement("td");
  tdDisc.textContent = item.disciplina || "";
  tr.appendChild(tdDisc);

  const valT1 = item.tri1 === null || item.tri1 === undefined ? "" : item.tri1;
  const valT2 = item.tri2 === null || item.tri2 === undefined ? "" : item.tri2;
  const valT3 = item.tri3 === null || item.tri3 === undefined ? "" : item.tri3;

  const f = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];

  const tdInputT1 = document.createElement("td");
  const inT1 = document.createElement("input");
  inT1.type = "text";
  inT1.className = "input-edicao input-n1";
  inT1.dataset.index = index;
  inT1.value = valT1;
  tdInputT1.appendChild(inT1);
  tr.appendChild(tdInputT1);

  const tdInputT2 = document.createElement("td");
  const inT2 = document.createElement("input");
  inT2.type = "text";
  inT2.className = "input-edicao input-n2";
  inT2.dataset.index = index;
  inT2.value = valT2;
  tdInputT2.appendChild(inT2);
  tr.appendChild(tdInputT2);

  const tdInputT3 = document.createElement("td");
  const inT3 = document.createElement("input");
  inT3.type = "text";
  inT3.className = "input-edicao input-n3";
  inT3.dataset.index = index;
  inT3.value = valT3;
  tdInputT3.appendChild(inT3);
  tr.appendChild(tdInputT3);

  const tdMedTracinho = document.createElement("td");
  tdMedTracinho.textContent = "—";
  tr.appendChild(tdMedTracinho);

  const tdFaltasGrupo = document.createElement("td");
  const divFaltas = document.createElement("div");
  divFaltas.className = "grupo-faltas-edicao";

  const inF1 = document.createElement("input");
  inF1.type = "text";
  inF1.className = "input-edicao input-f1";
  inF1.dataset.index = index;
  inF1.value = f[0] !== undefined ? f[0] : 0;

  const inF2 = document.createElement("input");
  inF2.type = "text";
  inF2.className = "input-edicao input-f2";
  inF2.dataset.index = index;
  inF2.value = f[1] !== undefined ? f[1] : 0;

  const inF3 = document.createElement("input");
  inF3.type = "text";
  inF3.className = "input-edicao input-f3";
  inF3.dataset.index = index;
  inF3.value = f[2] !== undefined ? f[2] : 0;

  divFaltas.appendChild(inF1);
  divFaltas.appendChild(inF2);
  divFaltas.appendChild(inF3);
  tdFaltasGrupo.appendChild(divFaltas);
  tr.appendChild(tdFaltasGrupo);

  const tdEdicaoMsg = document.createElement("td");
  tdEdicaoMsg.textContent = "Em edição";
  tr.appendChild(tdEdicaoMsg);

  return tr;
}

function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = "";

  disciplinas.forEach((item, index) => {
    if (modoEdicao) {
      corpo.appendChild(criarLinhaEdicao(item, index));
    } else {
      corpo.appendChild(criarLinhaVisualizacao(item));
    }
  });
}

function preencherCards() {
  const medias = [];
  let totalFaltas = 0;
  let totalBom = 0;
  let totalAtencao = 0;

  disciplinas.forEach((item) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);
    const media = calcularMedia([n1, n2, n3]);

    if (media !== null) {
      medias.push(media);
      if (media >= 6.0) totalBom++;
      else totalAtencao++;
    }

    totalFaltas += somarFaltas(item.faltas);
  });

  const mediaGeral = medias.length
    ? medias.reduce((a, b) => a + b, 0) / medias.length
    : null;

  document.getElementById("media-geral").textContent =
    mediaGeral === null ? "—" : formatarNota(mediaGeral);
  document.getElementById("total-faltas").textContent = totalFaltas;
  document.getElementById("total-bom").textContent = totalBom;
  document.getElementById("total-atencao").textContent = totalAtencao;

  document.getElementById("frequencia").textContent = "92%";
  document.getElementById("frequencia-texto").textContent = "Frequência adequada";
}

/* ===== REQUISIÇÕES DA API ===== */

async function fazerLogin() {
  const inputPin = document.getElementById("input-pin");
  const msgLogin = document.getElementById("msg-login");
  const pinDigitado = inputPin.value.trim();

  if (!pinDigitado) {
    msgLogin.textContent = "Digite o PIN.";
    msgLogin.style.color = "#e53935";
    return;
  }

  msgLogin.textContent = "Conectando...";
  msgLogin.style.color = "#b0b0b0";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      msgLogin.style.color = "#e53935";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      msgLogin.style.color = "#e53935";
      return;
    }

    if (!resposta.ok) {
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      msgLogin.style.color = "#e53935";
      return;
    }

    const