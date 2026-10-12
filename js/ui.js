import { obtenerDetalles } from "./api.js";
import { Movie } from "./modelos/movie.js";

const SVG_NS = "http://www.w3.org/2000/svg";

// Crea un elemento SVG con su trazado.
function crearIcono(d, viewBox = "0 0 24 24") {
  const svg = document.createElementNS(SVG_NS, "svg");

  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.5");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.classList.add("size-6");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", d);
  svg.appendChild(path);

  return svg;
}

export function crearHeader() {
  const header = document.createElement("header");

  // LOGOTIPO
  const icon = document.createElement("div");
  icon.classList.add("icon");

  const logoIcon = crearIcono(
    "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 18.996 6 18.375 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125M20.625 4.5H3.375",
  );

  const logoText = document.createElement("div");
  logoText.textContent = "CineData";

  icon.append(logoIcon, logoText);

  // SELECTOR DE TEMAS
  const temaWrap = document.createElement("div");
  temaWrap.classList.add("temaWrap");

  const themeButton = document.createElement("button");
  themeButton.type = "button";
  themeButton.classList.add("themeButton");
  themeButton.id = "themeBtn";
  themeButton.setAttribute("aria-label", "Temas");
  themeButton.setAttribute("aria-expanded", "false");
  themeButton.setAttribute("aria-controls", "temasPanel");

  const swatch = document.createElement("span");
  swatch.classList.add("swatch");
  swatch.setAttribute("aria-hidden", "true");

  themeButton.appendChild(swatch);

  const temasPanel = document.createElement("div");
  temasPanel.classList.add("temas");
  temasPanel.id = "temasPanel";
  temasPanel.hidden = true;

  const temas = [
    { id: "claro", nombre: "Claro", fondo: "#f7f7f5", acento: "#2f6fed" },
    { id: "oscuro", nombre: "Oscuro", fondo: "#14161a", acento: "#5b9dff" },
    { id: "cine", nombre: "Cine", fondo: "#1a1214", acento: "#e0b04a" },
    { id: "bosque", nombre: "Bosque", fondo: "#eef6f6", acento: "#0b7a7a" },
  ];

  temas.forEach((tema, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("temaOpt");
    button.dataset.theme = tema.id;
    button.setAttribute("aria-pressed", String(index === 0));

    const muestra = document.createElement("span");
    muestra.classList.add("swatch");
    muestra.style.setProperty("--s-bg", tema.fondo);
    muestra.style.setProperty("--s-ac", tema.acento);
    muestra.setAttribute("aria-hidden", "true");

    const nombre = document.createElement("span");
    nombre.classList.add("temaName");
    nombre.textContent = tema.nombre;

    const check = crearIcono("M5 12l5 5L20 7");
    check.classList.add("check");
    check.setAttribute("stroke-width", "2.5");

    button.append(muestra, nombre, check);
    temasPanel.appendChild(button);
  });

  temaWrap.append(themeButton, temasPanel);

  const form = document.createElement("form");
  form.id = "form-buscar";
  form.classList.add("searchFilter");

  const searchGroup = document.createElement("div");
  searchGroup.classList.add("searchGroup");

  const searchBar = document.createElement("input");
  searchBar.id = "buscar";
  searchBar.classList.add("searchBar");
  searchBar.type = "search";
  searchBar.placeholder = "Busca una película...";

  const btnBuscar = document.createElement("button");
  btnBuscar.classList.add("btnBuscar");
  btnBuscar.type = "submit";
  btnBuscar.textContent = "Buscar";

  searchGroup.append(searchBar, btnBuscar);

  const filtersOrder = document.createElement("div");
  filtersOrder.classList.add("filtersOrder");

  const filterButton = document.createElement("button");
  filterButton.type = "button";
  filterButton.classList.add("filterButton");
  filterButton.id = "filterBtn";
  filterButton.setAttribute("aria-label", "Filtros");
  filterButton.setAttribute("aria-expanded", "false");
  filterButton.setAttribute("aria-controls", "filterPanel");

  const filterIcon = crearIcono(
    "M10.5 6h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75",
  );

  filterButton.appendChild(filterIcon);
  filtersOrder.appendChild(filterButton);

  form.append(searchGroup, filtersOrder);

  header.append(icon, temaWrap, form);

  return header;
}

export async function crearDetalle({ peli, director, reparto }) {
  const { titulo, year, nota, duracion, generos, posterUrl, sinopsis } = peli;
  console.log(peli);
  const contenedorDetalle = document.querySelector("#detalle");

  contenedorDetalle.replaceChildren();

  const name = document.createElement("h2");
  name.textContent = `${titulo}  (${year})`;

  const overview = document.createElement("p");
  overview.textContent = sinopsis || "Sin sinopsis disponible";

  const img = document.createElement("img");
  img.src = posterUrl;
  img.alt = `Poster de ${titulo}`;
  contenedorDetalle.classList.add("detalle");
  contenedorDetalle.append(img);

  const productionInfo = document.createElement("div");
  productionInfo.classList.add("productionInfo");

  contenedorDetalle.append(img, name, sinopsis);

  // contenedorDetalle.textContent = `Pelicula: ${movie} obtenerDetalles(id): ${obtenerDetalles(id)}`;
  document.body.append(contenedorDetalle);

  return contenedorDetalle;
}
