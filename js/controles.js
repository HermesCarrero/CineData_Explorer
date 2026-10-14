import { DEFAULT_FILTROS, contarActivos } from "./filtros.js";

function el(tag, { clase, texto, attrs = {} } = {}, ...hijos) {
  const nodo = document.createElement(tag);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  for (const [k, v] of Object.entries(attrs)) nodo.setAttribute(k, v);
  nodo.append(...hijos);
  return nodo;
}

function crearSelect(id, opciones) {
  const select = el("select", { attrs: { id } });
  opciones.forEach(([valor, texto]) => select.append(new Option(texto, valor)));
  return select;
}

function crearCampo(etiqueta, control) {
  return el(
    "label",
    { clase: "field" },
    el("span", { clase: "label", texto: etiqueta }),
    control,
  );
}

const TIPOS = [
  ["todos", "Todo"],
  ["movie", "Películas"],
  ["tv", "Series"],
  ["person", "Personas"],
];

const NOTAS = [
  ["0", "Todas"],
  ["5", "5+"],
  ["7", "7+"],
  ["8", "8+"],
];

const ORDENES = [
  ["relevancia", "Relevancia"],
  ["nota", "Nota"],
  ["anio", "Año"],
  ["titulo", "Título"],
];

function opcionesAños() {
  const actual = new Date().getFullYear();
  const lista = [["", "Todos"]];
  for (let a = actual; a >= 1900; a--) lista.push([String(a), String(a)]);
  return lista;
}

function crearPanelFiltros() {
  const panel = el("section", { clase: "panel", attrs: { id: "filterPanel" } });
  panel.hidden = true;

  const chips = el("div", { clase: "chips", attrs: { id: "tipoChips" } });
  TIPOS.forEach(([valor, texto], i) => {
    chips.append(
      el("button", {
        clase: "chip",
        texto,
        attrs: {
          type: "button",
          "data-tipo": valor,
          "aria-pressed": String(i === 0),
        },
      }),
    );
  });

  const campoTipo = el(
    "div",
    { clase: "field" },
    el("span", { clase: "label", texto: "Tipo" }),
    chips,
  );
  const campoNota = crearCampo("Nota mínima", crearSelect("notaSelect", NOTAS));
  const campoOrden = crearCampo(
    "Ordenar por",
    crearSelect("sortSelect", ORDENES),
  );

  const acciones = el(
    "div",
    { clase: "actions" },
    el("button", {
      clase: "btn ghost",
      texto: "Limpiar",
      attrs: { type: "button", id: "clearBtn" },
    }),
    el("button", {
      clase: "btn",
      texto: "Listo",
      attrs: { type: "button", id: "closeBtn" },
    }),
  );

  panel.append(campoTipo, campoNota, campoOrden, acciones);
  return panel;
}

const filterPanel = crearPanelFiltros();
document.querySelector("header").after(filterPanel);

const filterBtn = document.getElementById("filterBtn");
// const filterPanel = document.getElementById("filterPanel");
const themeBtn = document.getElementById("themeBtn");
const temasPanel = document.getElementById("temasPanel");
const temas = ["claro", "oscuro", "cine", "bosque"];
const themeOpts = temasPanel.querySelectorAll(".temaOpt");

function toggleThemes(open) {
  temasPanel.hidden = !open;
  themeBtn.setAttribute("aria-expanded", String(open));
  themeBtn.classList.toggle("open", open);
}

function togglePanel(open) {
  filterPanel.hidden = !open;
  filterBtn.setAttribute("aria-expanded", String(open));
  filterBtn.classList.toggle("open", open);
}

function setTheme(name) {
  if (!temas.includes(name)) name = "claro";
  document.documentElement.dataset.theme = name;
  themeOpts.forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.theme === name)),
  );
  try {
    localStorage.setItem("theme", name);
  } catch {}
}

// ── Filtros ──
const tipoChips = document.getElementById("tipoChips");
const notaSelect = document.getElementById("notaSelect");
const sortSelect = document.getElementById("sortSelect");

let filtros = { ...DEFAULT_FILTROS };

// Contador sobre el botón de filtros
const filtroBadge = document.createElement("span");
filtroBadge.className = "badge";
filtroBadge.hidden = true;
filterBtn.append(filtroBadge);

function emitirFiltros() {
  const n = contarActivos(filtros);
  filtroBadge.textContent = n;
  filtroBadge.hidden = n === 0;
  document.dispatchEvent(
    new CustomEvent("filtros", { detail: { ...filtros } }),
  );
}

tipoChips.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  tipoChips
    .querySelectorAll(".chip")
    .forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
  filtros.tipo = chip.dataset.tipo;
  emitirFiltros();
});

notaSelect.addEventListener("change", (e) => {
  filtros.notaMin = Number(e.target.value);
  emitirFiltros();
});

sortSelect.addEventListener("change", (e) => {
  filtros.orden = e.target.value;
  emitirFiltros();
});

document.getElementById("clearBtn").addEventListener("click", () => {
  filtros = { ...DEFAULT_FILTROS };
  tipoChips
    .querySelectorAll(".chip")
    .forEach((c, i) => c.setAttribute("aria-pressed", String(i === 0)));
  notaSelect.value = "0";
  sortSelect.value = "relevancia";
  emitirFiltros();
});

document
  .getElementById("closeBtn")
  .addEventListener("click", () => togglePanel(false));
document.addEventListener("cerrar-filtros", () => togglePanel(false));

temasPanel.addEventListener("click", (e) => {
  const opt = e.target.closest(".temaOpt");
  if (!opt) return;
  setTheme(opt.dataset.theme);
  toggleThemes(false);
});

filterBtn.addEventListener("click", () => {
  togglePanel(filterPanel.hidden);
});

themeBtn.addEventListener("click", () => {
  toggleThemes(temasPanel.hidden);
});

let saved = null;
try {
  saved = localStorage.getItem("theme");
} catch {}
setTheme(saved);
