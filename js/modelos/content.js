export class Content {
  constructor({
    id,
    titulo,
    year,
    nota,
    poster = null,
    generos = [],
    overview,
  }) {
    if (new.target === Content) {
      throw new Error("Content es una clase abstracta, usa Movie o Tv");
    }
    this.id = id;
    this.titulo = titulo;
    this.year = year;
    this.nota = nota;
    this.poster = poster;
    this.generos = generos;
    this.overview = overview;
  }

  get posterUrl() {
    if (!this.poster) return null;
    return `https://image.tmdb.org/t/p/w342${this.poster}`;
  }

  static yearFrom(date) {
    return date?.slice(0, 4) || "----";
  }

  static generosFrom(genres) {
    return genres?.map((g) => g.name) ?? [];
  }

  toCard() {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = this.id;
    card.dataset.tipo = this.tipo;

    if (this.poster) {
      const img = document.createElement("img");
      img.src = this.posterUrl;
      img.alt = `Poster de ${this.titulo}`;
      img.loading = "lazy";
      card.append(img);
    } else {
      const vacio = document.createElement("div");
      vacio.className = "sinPoster";
      vacio.textContent = "Sin imagen";
      card.append(vacio);
    }

    const titulo = document.createElement("h3");
    titulo.textContent = this.titulo;
    const info = document.createElement("p");
    info.textContent = `${this.year} · ⭐ ${this.nota.toFixed(1)}`;

    card.append(titulo, info);
    return card;
  }
}
