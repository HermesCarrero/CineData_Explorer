import { Content } from "./js/modelos/content.js";

export class Tv extends Content {
  constructor({ temporadas = null, episodios = null, ...resto }) {
    super(resto);
    this.mediaType = "tv";
    this.temporadas = temporadas;
    this.episodios = episodios;
  }

  static desdeTMDB({
    id,
    name,
    first_air_date,
    vote_average,
    poster_path,
    overview,
    number_of_seasons,
    number_of_episodes,
    genres,
  }) {
    return new Tv({
      id,
      titulo: name,
      year: Content.yearFrom(first_air_date),
      nota: vote_average || 0,
      poster: poster_path ?? null,
      overview,
      temporadas: number_of_seasons ?? null,
      episodios: number_of_episodes ?? null,
      generos: Content.generosFrom(genres),
    });
  }
}
