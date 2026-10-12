// ── Helpers ──
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
  return el("label", { clase: "field" }, el("span", { clase: "label", texto: etiqueta }), control);
}

// ── Datos del panel ──
const GENEROS = [
  ["", "Todos"],
  ["18", "Drama"],
  ["28", "Acción"],
  ["35", "Comedia"],
  ["27", "Terror"],
];

const RATINGS = [
  ["0", "Todos"],
  ["5", "5+"],
  ["7", "7+"],
  ["9", "9+"],
];

const ORDENES = [
  ["popularity", "Popularidad"],
  ["rating", "Rating"],
  ["year", "Año"],
  ["title", "Título"],
];

function opcionesAños() {
  const actual = new Date().getFullYear();
  const lista = [["", "Todos"]];
  for (let a = actual; a >= 1900; a--) lista.push([String(a), String(a)]);
  return lista;
}

// ── Panel de filtros ──
function crearPanelFiltros() {
  const panel = el("section", { clase: "panel", attrs: { id: "filterPanel" } });
  panel.hidden = true;

  // Género (chips)
  const chips = el("div", { clase: "chips", attrs: { id: "genreChips" } });
  GENEROS.forEach(([id, nombre], i) => {
    chips.append(
      el("button", {
        clase: "chip",
        texto: nombre,
        attrs: { type: "button", "data-genre": id, "aria-pressed": String(i === 0) },
      })
    );
  });
  const campoGenero = el("div", { clase: "field" },
    el("span", { clase: "label", texto: "Género" }),
    chips
  );

  // Selects
  const campoAño = crearCampo("Año", crearSelect("yearSelect", opcionesAños()));
  const campoRating = crearCampo("Rating mínimo", crearSelect("ratingSelect", RATINGS));
  const campoOrden = crearCampo("Ordenar por", crearSelect("sortSelect", ORDENES));

  // Acciones
  const acciones = el("div", { clase: "actions" },
    el("button", { clase: "btn ghost", texto: "Limpiar", attrs: { type: "button", id: "clearBtn" } }),
    el("button", { clase: "btn", texto: "Ver resultados", attrs: { type: "button", id: "closeBtn" } })
  );

  panel.append(campoGenero, campoAño, campoRating, campoOrden, acciones);
  return panel;
}

// ── Montaje: justo debajo del header ──
// Tiene que ocurrir ANTES de leer los elementos con getElementById
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