import { API_KEY } from "./config.js";
import { Movie } from "./modelos/movie.js";
import { Person } from "./modelos/person.js";
import { Tv } from "./modelos/tv.js";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/";

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
  "series-anime": {
    ruta: "/discover/tv",
    clase: Tv,
    params: {
      with_genres: "16",
      with_original_language: "ja",
      sort_by: "popularity.desc",
      "vote_count.gte": 50,
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

export async function obtenerDetalles(id, tipo = "movie") {
  const datos = await pedirTMDB(`/${tipo}/${id}`, {
    append_to_response: "credits,videos",
    include_video_language: "es,en",
  });

  const { credits, videos } = datos;
  const esSerie = tipo === "tv";

  const director = esSerie
    ? (datos.created_by ?? []).map((p) => p.name)
    : credits.crew.filter((p) => p.job === "Director").map((p) => p.name);

  const guion = esSerie
    ? []
    : [
        ...new Set(
          credits.crew
            .filter((p) => ["Screenplay", "Writer", "Story"].includes(p.job))
            .map((p) => p.name),
        ),
      ].slice(0, 3);

  const trailer = videos.results.find(
    (v) => v.site === "Youtube" && v.type === "Trailer",
  );

  return {
    peli: esSerie ? Tv.desdeTMDB(datos) : Movie.desdeTMDB(datos),
    eslogan: datos.tagline || "",
    tituloOriginal: datos.original_title ?? datos.original_name ?? "",
    votos: datos.vote_count ?? 0,
    director,
    guion,
    reparto: credits.cast.slice(0, 12).map((c) => ({
      nombre: c.name,
      personaje: c.character,
      foto: c.profile_path ? `${IMG}w185${c.profile_path}` : null,
    })),
    trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
    paises: (datos.production_countries ?? []).map((c) => ({
      codigo: c.iso_3166_1,
      nombre: c.name,
    })),
  };
}
