import { buscarTodo, obtenerDetalles } from "./api.js";
import { leerFavoritos } from "./storage.js";
import { Seccion } from "./seccion.js";
import { crearDetalle } from "./ui.js";

const HOME = [
  { clave: "peliculas-cartelera", titulo: "En cartelera" },
  { clave: "series-hoy", titulo: "Series actuales" },
  { clave: "series-top", titulo: "Mejores series" },
  { clave: "personas-populares", titulo: "Personas Populares" },
];

// ESTADO (solo de la búsqueda)
let pelis = [];
let pagina = 0;
let totalPaginas = Infinity;
let busqueda = "";
let favoritos = leerFavoritos();
let cargando = false;
let ticket = 0;

// DOM
const rejilla = document.querySelector("#rejilla");
const inputBuscar = document.querySelector("#buscar");
const estado = document.querySelector("#estado");
const form = document.querySelector("#form-buscar");
const centinela = document.querySelector("#centinela");
const secciones = document.querySelector("#secciones");

// UTILS
function esFavorita(id) {
  return favoritos.some((f) => f.id === id);
}

function mostrarError(texto) {
  estado.textContent = texto;
  estado.classList.add("error");
}

// VISTA
function pintarRejilla() {
  rejilla.innerHTML = "";
  if (pelis.length === 0) {
    rejilla.textContent = "Sin resultados";
    return;
  }
  pelis.forEach((peli) => rejilla.append(peli.toCard(esFavorita(peli.id))));
}

// BÚSQUEDA
async function cargarPagina() {
  if (!busqueda || cargando || pagina >= totalPaginas) return; // sin texto no hay nada que cargar
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

    if (miTicket !== ticket) return; // empezó otra búsqueda: descarta esta respuesta

    pelis = [...pelis, ...nuevas];
    pagina = siguiente;
    totalPaginas = total;
    pintarRejilla();
    estado.textContent = `${pelis.length} resultados para "${busqueda}"`;
    ok = true;
  } catch (error) {
    if (miTicket === ticket) mostrarError(error.message);
  } finally {
    if (miTicket === ticket) cargando = false;
  }

  // Si el centinela sigue a la vista tras pintar, fuerza otra comprobación
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

  const buscando = texto !== "";
  secciones.hidden = buscando;
  rejilla.hidden = !buscando;
  centinela.hidden = !buscando;

  if (buscando) cargarPagina();
}

// EVENTOS
rejilla.addEventListener("click", async (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const id = Number(card.dataset.id);
  const tipo = card.dataset.tipo;
  const params = new URLSearchParams({ id, tipo });

  try {
    console.log(`Id: ${id} Tipo: ${tipo}`);
  } catch (error) {
    console.error(error.message);
  }
  // window.location.href = `detalle.html${params}`;
});

secciones.addEventListener("click", async (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const id = Number(card.dataset.id);
  const tipo = card.dataset.tipo;
  const params = new URLSearchParams({ id, tipo });
  secciones.hidden = true;

  try {
    const info = await obtenerDetalles(id);
    await crearDetalle(info);
  } catch (error) {
    console.error(error.message);
  }
  // window.location.href = `detalle.html${params}`;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  empezarDeCero(inputBuscar.value.trim());
});

inputBuscar.addEventListener("input", () => {
  if (inputBuscar.value.trim() === "" && busqueda !== "") empezarDeCero("");
});

HOME.forEach((cfg) => secciones.append(new Seccion({ ...cfg, esFavorita }).el));
