/* =========================================================
   BOLETIM DIGITAL — 9º ANO
   Dados fictícios para demonstração.
   ========================================================= */

/* ===== DADOS BRUTOS ===== */
// Array de objetos: cada objeto é uma disciplina.
// As notas podem vir como número (78), string com vírgula ("8,2") ou null.
// As faltas vêm como array de 3 valores (um por trimestre).
const disciplinas = [
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
// Converte qualquer formato de nota para a escala 0 a 10.
// Regras:
//  - vazio, null ou undefined  -> null (nota ainda não lançada)
//  - entre 0 e 10              -> mantém
//  - maior que 10 até 100      -> divide por 10
//  - aceita ponto ou vírgula
//  - valor inválido            -> null
function normalizarNota(valor) {
  // Nota ausente
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for string, troca vírgula por ponto
  let numero = typeof valor === "string" ? valor.replace(",", ".") : valor;
  numero = Number(numero);

  // Se não for número válido, retorna null
  if (isNaN(numero)) {
    return null;
  }

  // Regras de conversão
  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras -> inválido
  return null;
}

/* ===== FUNÇÃO: calcularMedia ===== */
// Recebe um array de notas já normalizadas (0–10) e calcula a média.
// Ignora valores null (notas ausentes). Se não houver nenhuma nota, retorna null.
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);
  if (validas.length === 0) {
    return null;
  }
  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

/* ===== FUNÇÃO: definirSituacao ===== */
// Retorna a situação com base na média (referência: 6,0).
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
// Soma os valores de um array de faltas.
function somarFaltas(faltas) {
  return faltas.reduce((acc, n) => acc + n, 0);
}

/* ===== FUNÇÃO: formatarNota ===== */
// Mostra a nota com 1 casa decimal, usando vírgula.
// Se for null, mostra "—".
function formatarNota(nota) {
  if (nota === null) {
    return "—";
  }
  return nota.toFixed(1).replace(".", ",");
}

/* ===== FUNÇÃO: classeSituacao ===== */
// Retorna a classe CSS correspondente à situação.
function classeSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-sem-nota";
}

/* ===== FUNÇÃO: criarLinha ===== */
// Cria uma linha (<tr>) da tabela para uma disciplina.
function criarLinha(item) {
  // Normaliza as três notas
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  // Calcula média (ignorando ausentes) e soma das faltas
  const media = calcularMedia([n1, n2, n3]);
  const faltas = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

  // Cria o elemento <tr>
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.disciplina}</td>
    <td class="${n1 === null ? "nota-ausente" : ""}">${n1 === null ? "Ainda não lançada" : formatarNota(n1)}</td>
    <td class="${n2 === null ? "nota-ausente" : ""}">${n2 === null ? "Ainda não lançada" : formatarNota(n2)}</td>
    <td class="${n3 === null ? "nota-ausente" : ""}">${n3 === null ? "Ainda não lançada" : formatarNota(n3)}</td>
    <td>${media === null ? "—" : formatarNota(media)}</td>
    <td>${faltas}</td>
    <td class="${classeSituacao(situacao)}">${situacao}</td>
  `;

  return tr;
}

/* ===== FUNÇÃO: preencherTabela ===== */
// Percorre o array de disciplinas e adiciona uma linha por disciplina.
function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = ""; // limpa antes de preencher

  disciplinas.forEach((item) => {
    corpo.appendChild(criarLinha(item));
  });
}

/* ===== FUNÇÃO: preencherCards ===== */
// Calcula e exibe os valores dos cards de resumo.
function preencherCards() {
  // Arrays auxiliares
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

  // Média geral (só entre disciplinas com alguma nota válida)
  const mediaGeral = medias.length
    ? medias.reduce((a, b) => a + b, 0) / medias.length
    : null;

  // Preenche os cards
  document.getElementById("media-geral").textContent =
    mediaGeral === null ? "—" : formatarNota(mediaGeral);

  document.getElementById("total-faltas").textContent = totalFaltas;

  document.getElementById("total-bom").textContent = totalBom;

  document.getElementById("total-atencao").textContent = totalAtencao;

  // Frequência FICTÍCIA / DEMONSTRATIVA
  // Este valor NÃO é calculado a partir das faltas.
  // No futuro, a frequência será tratada de outra forma (dados reais da escola).
  document.getElementById("frequencia").textContent = "92%";
  document.getElementById("frequencia-texto").textContent = "Frequência adequada";
}

/* ===== INICIALIZAÇÃO ===== */
// Quando a página terminar de carregar, preenche tudo.
window.addEventListener("DOMContentLoaded", () => {
  preencherTabela();
  preencherCards();
});