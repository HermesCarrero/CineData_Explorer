import { Content } from "./content.js";

export class Movie extends Content {
  constructor({ duracion = null, ...resto }) {
    super(resto);
    this.mediaType = "movie";
    this.duracion = duracion;
  }

  static desdeTMDB({
    id,
    title,
    release_date,
    vote_average,
    poster_path,
    overview,
    runtime,
    genres,
  }) {
    return new Movie({
      id,
      titulo: title,
      year: Content.yearFrom(release_date),
      nota: vote_average || 0,
      poster: poster_path ?? null,
      sinopsis: overview,
      duracion: runtime ?? null,
      generos: Content.generosFrom(genres),
    });
  }
}
