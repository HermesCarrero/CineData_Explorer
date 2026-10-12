const CLAVE_FAVORITOS = "cinedata:favoritos";


function leerJSON(clave, porDefecto) {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? porDefecto;
  } catch {
    return porDefecto;
  }
}


export function leerFavoritos() {
  return leerJSON(CLAVE_FAVORITOS, []).map((obj) => new Pelicula(obj));
}

export function guardarFavoritos(favoritos) {
  localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
}