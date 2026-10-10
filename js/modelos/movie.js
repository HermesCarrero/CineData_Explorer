export class Movie {
  /* constructor(id, title, year, rating, poster) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.rating = rating;
    this.poster = poster;
  } */
  constructor(id, year, rating, poster) {
    this.id = id;
    this.year = year;
    this.rating = rating;
    this.poster = poster;
  }

  get posterUrl() {
    if (!this.poster) return; //Añadir placeholder
    return `https://image.tmdb.org/t/p/w342${this.poster}`;
  }

  get titleName() {
    if (!this.title) return null;
    return "${this.name}";
  }

  static desdeTMDB({ id, title, release_date, vote_average, poster_path }) {
    const year = release_date ? release_date.slice(0, 4) : "- - - -";
    return new Movie(id, title, year, vote_average, poster_path);
  }

  toCard() {
    const card = document.createElement("article");
    card.className = "card";

    if (this.poster) {
      const img = document.createElement("img");
      img.src = this.posterUrl;
      img.alt = `Poster de ${this.titulo}`;
      card.append(img);
    }

    const titulo = document.createElement("h3");

    const info = document.createElement("p");
    info.textContent = `${this.year} ${this.rating.toFixed(1)}`;

    card.append(titulo, info);
    return card;
  }
}

class MovieDetail extends Movie {}
