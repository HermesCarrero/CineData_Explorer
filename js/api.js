import { API_KEY } from "./config.js";
import { Movie } from "./modelos/movie.js";
import { Tv } from "./modelos/tv.js";
import { Person } from "./modelos/person.js";

const BASE_URL = "https://api.themoviedb.org/3";

const SECCIONES = {
  "peliculas-cartelera": {
    ruta: "/discover/movie",
    clase: Movie,
    params: () => {
      const hoy = new Date();
      const inicio = new Date();
      inicio.setDate(hoy.getDate() - 6);
      return {
        region: "ES",
        with_release_type: "3",
        sort_by: "popularity.desc",
      };
    },
  },
  "peliculas-populares": { ruta: "/movie/popular", clase: Movie },

  "peliculas-proximamente": { ruta: "/movie/upcoming", clase: Movie },
  "peliculas-top": { ruta: "/movie/top_rated", clase: Movie },
  "series-populares": { ruta: "/tv/popular", clase: Tv },
  "series-hoy": { ruta: "/tv/airing_today", clase: Tv },
  "series-top": { ruta: "/tv/top_rated", clase: Tv },
  "personas-populares": { ruta: "/person/popular", clase: Person },
  tendencias: { ruta: "/trending/all/week", clase: null }, // mixta
};

export async function cargarSeccion(clave, pagina = 1) {
  const { ruta, clase, params = {} } = SECCIONES[clave];
  const extra = typeof params === "function" ? params() : params;
  const { results, total_pages } = await pedirTMDB(ruta, {
    ...extra,
    page: pagina,
  });
  return {
    pelis: results.map((r) => clase.desdeTMDB(r)),
    totalPaginas: total_pages,
  };
}

function contentDesdeTMDB(item) {
  switch (item.media_type) {
    case "movie":
      return Movie.desdeTMDB(item);
    case "tv":
      return Tv.desdeTMDB(item);
    case "person":
      return Person.desdeTMDB(item);
    default:
      return null;
  }
}

export async function pedirTMDB(ruta, params = {}) {
  const url = new URL(`${BASE_URL}${ruta}`);
  url.search = new URLSearchParams({
    api_key: API_KEY,
    language: "es-ES",
    ...params,
  }).toString();
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

export async function buscarTodo(text, pagina = 1) {
  console.log("buscarTodo");
  const { results, total_pages } = await pedirTMDB("/search/multi", {
    query: text,
    page: pagina,
  });
  return {
    pelis: results.map(contentDesdeTMDB).filter(Boolean),
    totalPaginas: total_pages,
  };
}

export async function buscarPeliculas(text, pagina = 1) {
  const { results, total_pages } = await pedirTMDB("/search/movie", {
    query: text,
    page: pagina,
  });
  return {
    pelis: results.map((json) => Movie.desdeTMDB(json)),
    totalPaginas: total_pages,
  };
}

export async function obtenerPopulares(pagina = 1) {
  const { results, total_pages } = await pedirTMDB("/movie/popular", {
    page: pagina,
  });
  return {
    pelis: results.map((json) => Movie.desdeTMDB(json)),
    totalPaginas: total_pages,
  };
}

export async function obtenerDetalles(id) {
  const [detalle, creditos] = await Promise.all([
    pedirTMDB(`/movie/${id}`),
    pedirTMDB(`/movie/${id}/credits`),
  ]);

  return {
    peli: Movie.desdeTMDB(detalle),
    director:
      creditos.crew.find((p) => p.job === "Director")?.name ?? "Desconocido",
    reparto: creditos.cast
      .slice(0, 5)
      .map(({ name, character }) => `${name} (${character})`),
  };
}
