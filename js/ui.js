const SVG_NS = "http://www.w3.org/2000/svg";

function el(tag, { clase, texto, attrs = {} } = {}, ...hijos) {
  const nodo = document.createElement(tag);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  for (const [k, v] of Object.entries(attrs)) nodo.setAttribute(k, v);
  nodo.append(...hijos);
  return nodo;
}

function formatoDuracion(min) {
  if (!min) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h} h ${m} min` : `${m} min`;
}

function filaInfo(etiqueta, valores) {
  const lista = [].concat(valores).filter(Boolean);
  if (!lista.length) return null;
  return el(
    "p",
    { clase: "filaInfo" },
    el("b", { texto: `${etiqueta}: ` }),
    lista.join(", "),
  );
}

export function crearBotonVolver(texto = "Volver") {
  const btn = el("button", {
    clase: "btnVolver",
    attrs: { type: "button", "aria-label": texto },
  });

  btn.append(crearIcono("M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"), texto);
  return btn;
}

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
    "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5",
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

  // FAVORITOS
  const favButton = document.createElement("button");
  favButton.type = "button";
  favButton.classList.add("favButton");
  favButton.id = "favBtn";
  favButton.setAttribute("aria-label", "Favoritos");

  const favIcon = crearIcono(
    "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
  );

  const favCount = document.createElement("span");
  favCount.classList.add("badge");
  favCount.id = "favCount";
  favCount.textContent = "0";
  favCount.hidden = true;

  favButton.append(favIcon, favCount);

  const acciones = document.createElement("div");
  acciones.classList.add("acciones");
  acciones.append(favButton, temaWrap);

  header.append(icon, acciones, form);

  return header;
}

export function crearDetalle(info, { alVolver } = {}) {
  const {
    peli,
    eslogan,
    tituloOriginal,
    votos,
    director,
    guion,
    reparto,
    trailer,
    paises,
  } = info;
  const {
    titulo,
    year,
    nota,
    duracion,
    generos,
    posterUrl,
    bannerUrl,
    overview,
    mediaType,
    temporadas,
    episodios,
  } = peli;
  const esSerie = mediaType === "tv";

  const cont = document.querySelector("#detalle");
  cont.replaceChildren();
  cont.className = "detalle";

  const volver = crearBotonVolver("Volver");
  volver.addEventListener("click", () => alVolver?.());

  const anio = year === "----" ? "" : year;
  const medida = esSerie
    ? [
        temporadas && `${temporadas} temporadas${temporadas > 1 ? "s" : ""}`,
        episodios && `${episodios} episodios`,
      ]
        .filter(Boolean)
        .join(" . ")
    : formatoDuracion(duracion);
  const linea = [anio, medida].filter(Boolean).join(" . ");

  const cabecera = el(
    "div",
    { clase: "detalleCabecera" },
    el(
      "div",
      {},
      el("h2", { texto: titulo }),
      el("p", { clase: "detalleMeta", texto: linea }),
    ),
    el(
      "div",
      { clase: "detalleRating" },
      el("span", { clase: "estrella", texto: "★" }),
      el("b", { texto: nota ? nota.toFixed(1) : "-" }),
      el("small", {
        texto: votos ? `/10 . ${votos.toLocaleString("es-ES")} votos` : "",
      }),
    ),
  );

  const poster = el(
    "div",
    { clase: "detallePoster" },
    bannerUrl
      ? el("img", {
          attrs: {
            src: bannerUrl,
            alt: `Imagen de ${titulo}`,
          },
        })
      : null,
    cabecera,
  );

  const original =
    tituloOriginal && tituloOriginal !== titulo ? tituloOriginal : "";

  const columna = el(
    "div",
    { clase: "detalleInfo" },
    ...[
      generos.length
        ? el(
            "div",
            { clase: "generos" },
            ...generos.map((g) => el("span", { clase: "genero", texto: g })),
          )
        : null,
      eslogan
        ? el("p", { clase: "detalleEslogan", texto: `“${eslogan}”` })
        : null,
      el("p", {
        clase: "detalleSinopsis",
        texto: overview || "Sin sinopsis disponible.",
      }),
      filaInfo(esSerie ? "Creada por" : "Dirección", director),
      filaInfo("Guion", guion),
      filaInfo("Título original", original),
      filaInfo(
        "Países",
        paises.map((p) => p.nombre),
      ),
      trailer
        ? el("a", {
            clase: "btn",
            texto: "▶ Ver tráiler",
            attrs: {
              href: trailer,
              target: "_blank",
              rel: "noopener noreferrer",
            },
          })
        : null,
    ].filter(Boolean),
  );

  const seccionReparto = reparto.length
    ? el(
        "section",
        { clase: "detalleReparto" },
        el("h3", { texto: "Reparto principal" }),
        el(
          "ul",
          { clase: "repartoLista" },
          ...reparto.map(({ nombre, personaje, foto }) =>
            el(
              "li",
              { clase: "actor" },
              foto
                ? el("img", { attrs: { src: foto, alt: "", loading: "lazy" } })
                : el("div", { clase: "sinFoto", texto: "?" }),
              el("b", { texto: nombre }),
              el("span", { texto: personaje }),
            ),
          ),
        ),
      )
    : null;

  const seccionMapa = paises.length
    ? el(
        "section",
        { clase: "detalleMapa" },
        el("h3", { texto: "Países de producción" }),
        el("div", { clase: "mapa", attrs: { id: "mapaPeli" } }),
      )
    : null;

  cont.append(
    ...[
      volver,
      poster,
      el("div", { clase: "detalleCuerpo" }, columna),
      seccionReparto,
      seccionMapa,
    ].filter(Boolean),
  );
  return cont;
}
