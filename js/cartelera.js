import { buscarTodo, obtenerDetalles } from "./api.js";
import { aplicarFiltros, DEFAULT_FILTROS, ordenar } from "./filtros.js";
import { destruirMapa, mostrarMapa } from "./mapa.js";
import { Movie } from "./modelos/movie.js";
import { Tv } from "./modelos/tv.js";
import { Seccion } from "./seccion.js";
import { guardarFavoritos, leerFavoritos } from "./storage.js";
import { crearBotonVolver, crearDetalle } from "./ui.js";

const HOME = [
  { clave: "peliculas-cartelera", titulo: "En cartelera" },
  { clave: "series-anime", titulo: "Anime" },
  { clave: "series-top", titulo: "Mejores series" },
  { clave: "peliculas-proximamente", titulo: "Proximas Peliculas" },
  { clave: "personas-populares", titulo: "Personas Populares" },
];

// ESTADO
let pelis = [];
let pagina = 0;
let totalPaginas = Infinity;
let busqueda = "";
let favoritos = leerFavoritos();
let cargando = false;
let ticket = 0;
let filtros = { ...DEFAULT_FILTROS };

// DOM
const rejilla = document.querySelector("#rejilla");
const inputBuscar = document.querySelector("#buscar");
const estado = document.querySelector("#estado");
const form = document.querySelector("#form-buscar");
const centinela = document.querySelector("#centinela");
const secciones = document.querySelector("#secciones");
const detalle = document.querySelector("#detalle");

const vistaFavoritos = document.querySelector("#favoritos");
const favTitulo = document.querySelector("#favTitulo");
const favRejilla = document.querySelector("#favRejilla");
const favBtn = document.querySelector("#favBtn");
const favCount = document.querySelector("#favCount");

const contFiltros = document.querySelector(".filtersOrder");

const volverBusqueda = crearBotonVolver("Inicio");
volverBusqueda.hidden = true;
estado.before(volverBusqueda);

// UTILS
function esFavorita(id, mediaType) {
  return favoritos.some((f) => f.id === id && f.mediaType === mediaType);
}

function mostrarError(texto) {
  estado.textContent = texto;
  estado.classList.add("error");
}

// VISTA
function pintarRejilla() {
  const visibles = ordenar(aplicarFiltros(pelis, filtros), filtros.orden);
  rejilla.replaceChildren();

  if (visibles.length === 0) {
    const aviso = document.createElement("p");
    aviso.className = "vacio";
    aviso.textContent =
      pelis.length === 0
        ? "Sin resultados"
        : "Ningún resultado con estos filtros";
    rejilla.append(aviso);
  } else {
    visibles.forEach((peli) =>
      rejilla.append(peli.toCard(esFavorita(peli.id, peli.mediaType))),
    );
  }

  if (busqueda) {
    estado.textContent =
      visibles.length === pelis.length
        ? `${pelis.length} resultados para "${busqueda}"`
        : `${visibles.length} de ${pelis.length} resultados para "${busqueda}"`;
  }
}

// BÚSQUEDA
async function cargarPagina() {
  if (!busqueda || cargando || pagina >= totalPaginas) return;
  cargando = true;
  const miTicket = ticket;
  let ok = false;

  estado.textContent = "Cargando";
  estado.classList.remove("error");
  try {
    const siguiente = pagina + 1;
    const { pelis: nuevas, totalPaginas: total } = await buscarTodo(
      busqueda,
      siguiente,
    );

    if (miTicket !== ticket) return;

    pelis = [...pelis, ...nuevas];
    pagina = siguiente;
    totalPaginas = Math.min(total, 25);
    pintarRejilla();
    estado.textContent = `${pelis.length} resultados para "${busqueda}"`;
    ok = true;
  } catch (error) {
    if (miTicket === ticket) mostrarError(error.message);
  } finally {
    if (miTicket === ticket) cargando = false;
  }
  if (ok && pagina < totalPaginas) {
    observador.unobserve(centinela);
    observador.observe(centinela);
  }
}

const observador = new IntersectionObserver(
  (entradas) => {
    if (entradas[0].isIntersecting) cargarPagina();
  },
  { rootMargin: "500px" },
);
observador.observe(centinela);
function reobservar() {
  if (pagina < totalPaginas) {
    observador.unobserve(centinela);
    observador.observe(centinela);
  }
}

document.addEventListener("filtros", (e) => {
  filtros = e.detail;
  if (!busqueda) return;
  pintarRejilla();
  reobservar();
});
function empezarDeCero(texto) {
  ticket++;
  cargando = false;
  busqueda = texto;
  pelis = [];
  pagina = 0;
  totalPaginas = Infinity;
  rejilla.replaceChildren();
  estado.textContent = "";
  estado.classList.remove("error");
  destruirMapa();
  detalle.replaceChildren();
  mostrarVista(texto !== "" ? "busqueda" : "home");

  if (texto !== "") cargarPagina();
}

// EVENTOS

let vistaActual = "home";
let vistaAnterior = "home";
let scrollAnterior = 0;

const VISTAS = {
  home: [secciones],
  busqueda: [rejilla, centinela, volverBusqueda, contFiltros],
  detalle: [detalle],
  favoritos: [vistaFavoritos, volverBusqueda],
};
const TODOS = [
  secciones,
  rejilla,
  centinela,
  volverBusqueda,
  detalle,
  vistaFavoritos,
  contFiltros,
];

function mostrarVista(nombre) {
  TODOS.forEach((el) => (el.hidden = !VISTAS[nombre].includes(el)));
  vistaActual = nombre;
  if (nombre !== "busqueda")
    document.dispatchEvent(new CustomEvent("cerrar-filtros"));
}

async function abrirDetalle(id, tipo) {
  if (tipo === "person") return; // el detalle de personas llegará más adelante

  try {
    const info = await obtenerDetalles(id, tipo);

    vistaAnterior = vistaActual;
    scrollAnterior = window.scrollY;

    crearDetalle(info, { alVolver: cerrarDetalle });
    mostrarVista("detalle");
    destruirMapa();
    crearDetalle(info, { alVolver: cerrarDetalle });
    mostrarVista("detalle");

    const contMapa = document.querySelector("#mapaPeli");
    if (contMapa && !mostrarMapa(contMapa, info.paises)) {
      contMapa.closest(".detalleMapa").hidden = true;
    }
    window.scrollTo(0, 0);
    window.scrollTo(0, 0);
  } catch (error) {
    mostrarError(error.message);
  }
}

function cerrarDetalle() {
  detalle.replaceChildren();
  mostrarVista(vistaAnterior);
  window.scrollTo(0, scrollAnterior);
}

function alPulsarCard(e) {
  if (e.target.closest(".btn-fav")) return;
  const card = e.target.closest(".card");
  if (!card) return;
  abrirDetalle(Number(card.dataset.id), card.dataset.tipo);
}

rejilla.addEventListener("click", alPulsarCard);
secciones.addEventListener("click", alPulsarCard);

volverBusqueda.addEventListener("click", () => {
  inputBuscar.value = "";
  empezarDeCero("");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  empezarDeCero(inputBuscar.value.trim());
});

inputBuscar.addEventListener("input", () => {
  if (inputBuscar.value.trim() === "" && busqueda !== "") empezarDeCero("");
});

function alternarFavoritos(item) {
  const ya = esFavorita(item.id, item.mediaType);

  favoritos = ya
    ? favoritos.filter(
        (f) => !(f.id === item.id && f.mediaType === item.mediaType),
      )
    : [...favoritos, item];

  guardarFavoritos(favoritos);
  pintarBotonesFavorito(item.id, item.mediaType, !ya);
  actualizarContador();
}

function actualizarContador() {
  const n = favoritos.length;
  favCount.textContent = n;
  favCount.hidden = n === 0;
}

function pintarFavoritos() {
  favRejilla.replaceChildren();
  favTitulo.textContent = `Mis favoritos (${favoritos.length})`;

  if (favoritos.length === 0) {
    favRejilla.textContent = "Aún no has añadido nada a favoritos.";
    return;
  }

  favoritos.forEach((f) => {
    const item = f.mediaType === "tv" ? new Tv(f) : new Movie(f);
    favRejilla.append(item.toCard(true));
  });
}

function abrirFavoritos() {
  inputBuscar.value = "";
  empezarDeCero("");
  pintarFavoritos();
  mostrarVista("favoritos");
  window.scrollTo(0, 0);
}

vistaFavoritos.addEventListener("click", alPulsarCard);
favBtn.addEventListener("click", abrirFavoritos);

function pintarBotonesFavorito(id, mediaType, activo) {
  document
    .querySelectorAll(
      `.card[data-id="${id}"][data-tipo="${mediaType}"] .btn-fav`,
    )
    .forEach((btn) => {
      btn.textContent = activo ? "★" : "☆";
      btn.title = activo ? "Quitar de favoritos" : "Añadir a favoritos";
      btn.setAttribute("aria-label", btn.title);
      btn.setAttribute("aria-pressed", String(activo));
    });
}

document.addEventListener("favorito", (e) => alternarFavoritos(e.detail));
mostrarVista("home");
actualizarContador();
HOME.forEach((cfg) => secciones.append(new Seccion({ ...cfg, esFavorita }).el));
