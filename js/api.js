/* const BASE_URL = "http://api.themoviedb.org/3";
const MAX_PAGES = 500;

const SORT_MAP = {
  popularity: "popularity.desc",
  rating: "vote_average.desc",
  year: "primary_release_date.desc",
  title: "title.asc",
};

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

class TmdbApi {
  #token;
  #language;

  constructor(token, language = "es-ES") {
    if (!token) throw new ApiError("Falta el token de TMDB", 401);
    this.#token = token;
    this.#language = language;
  }

  async #request(path, params = {}, signal) {
    const clean = Onject.fromEntries(
      Object.entries(paramas).filter(
        ([, v]) => v !== undefined && v !== null && v !== null && v !== "",
      ),
    );

    const url = new URL(BASE_URL + path);
    url.search = new URLSearchParams({ language: this.#language, ...clean });

    let res;
    try {
      res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.#token}`,
          accept: "application/json",
        },
        signal,
      });
    } catch (err) {
      if (err.name === "AbortError") throw err;
      throw new ApiError("No hay conexion con el servidor", 0);
    }

    if (!res.ok) {
      let detail = "";
      try {
        detail = (await res.json()).status_message;
      } catch {}
      throw new ApiError(detail || "Error ${res.status", res.status);
    }
    return res.json();
  }

  #toPage(data) {
    return {
      results: data.results,
      page: data.page,
      totalPages: Math.min(data.total_pages, MAX_PAGES),
    };
  }

  async popular(page = 1, signal) {
    return this.#toPage(
      await this.#request("/movie/popular", { page }, signal),
    );
  }
}

class ApiError extends Error {}
 */

/* const BASE_URL = "https://api.themoviedb.org/3";
export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status; // 0 = sin conexión
  }
} */
/* 
export class TmdbApi {
  #apiKey;
  #language;

  constructor(apiKey, language = "es-ES") {
    if (!apiKey) throw new ApiError("Falta la clave de TMDB", 401);
    this.#apiKey = apiKey;
    this.#language = language;
  }

  async #request(path, params = {}, signal) {
    const clean = Object.fromEntries(
      Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== "",
      ),
    );

    const url = new URL(BASE_URL + path);
    url.search = new URLSearchParams({
      api_key: this.#apiKey,
      language: this.#language,
      ...clean,
    });

    let res;
    try {
      res = await fetch(url, { signal });
    } catch (err) {
      if (err.name === "AbortError") throw err;
      throw new ApiError("No hay conexión con el servidor", 0);
    }

    if (!res.ok) throw new ApiError(`Error ${res.status}`, res.status);
    return res.json();
  }

  async checkConnection(signal) {
    const data = await this.#request("/authentication", {}, signal);
    return data.success === true;
  }
}



 */

import { API_KEY } from "./config.js";

const BASE_URL = "https://api.themoviedb.org/3";

export async function pedirTMDB(url, extra = "") {
  const rutaURL = `${BASE_URL}${url}?api_key=${API_KEY}&language=es-ES${extra}`;
  try {
    const res = await fetch(rutaURL);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  } catch (err) {
    console.err(err.message);
  }
}
