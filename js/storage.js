const CLAVE_FAVORITOS = "cinedata:favoritos";

function leerJSON(clave, porDefecto) {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? porDefecto;
  } catch {
    return porDefecto;
  }
}

export function leerFavoritos() {
  const lista = leerJSON(CLAVE_FAVORITOS, []);
  return Array.isArray(lista) ? lista : [];
}

export function guardarFavoritos(favoritos) {
  localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
}
