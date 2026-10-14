import { COORDENADAS } from "./paises.js";

let mapa = null;

export function destruirMapa() {
  if (mapa) {
    mapa.remove();
    mapa = null;
  }
}

export function mostrarMapa(contenedor, paises) {
  destruirMapa();

  const puntos = paises
    .map((p) => ({ ...p, coords: COORDENADAS[p.codigo] }))
    .filter((p) => {
      if (!p.coords)
        console.warn(`Sin coordenadas para ${p.codigo} (${p.nombre})`);
      return p.coords;
    });

  if (puntos.length === 0) return false;

  mapa = L.map(contenedor, { scrollWheelZoom: false }).setView(
    puntos[0].coords,
    3,
  );

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mapa);

  const marcadores = L.featureGroup(
    puntos.map((p) => L.marker(p.coords).bindPopup(p.nombre)),
  ).addTo(mapa);

  mapa.fitBounds(marcadores.getBounds().pad(0.3), { maxZoom: 5 });
  return true;
}
