export class Person {
  constructor({ id, nombre, foto = null, area = null }) {
    this.id = id;
    this.mediaType = "person";
    this.nombre = nombre;
    this.foto = foto;
    this.area = area;
  }

  get fotoUrl() {
    if (!this.foto) return null;
    return `https://image.tmdb.org/t/p/w342${this.foto}`;
  }

  static desdeTMDB({ id, name, profile_path, known_for_department }) {
    return new Person({
      id,
      nombre: name,
      foto: profile_path ?? null,
      area: known_for_department ?? null,
    });
  }

  toCard() {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = this.id;
    card.dataset.tipo = this.mediaType;

    if (this.foto) {
      const img = document.createElement("img");
      img.src = this.fotoUrl;
      img.alt = `Foto de ${this.nombre}`;
      img.loading = "lazy";
      card.append(img);
    } else {
      const vacio = document.createElement("div");
      vacio.className = "sinPoster";
      vacio.textContent = "Sin imagen";
      card.append(vacio);
    }

    const nombre = document.createElement("h3");
    nombre.textContent = this.nombre;

    card.append(nombre);
    return card;
  }
}
