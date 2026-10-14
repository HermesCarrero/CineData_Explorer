export const DEFAULT_FILTROS = {
  tipo: "todos",
  notaMin: 0,
  orden: "relevancia",
};

// Cuántos ajustes difieren del valor por defecto (para el contador del botón)
export function contarActivos(f) {
  return [f.tipo !== "todos", f.notaMin > 0, f.orden !== "relevancia"].filter(
    Boolean,
  ).length;
}

export function aplicarFiltros(lista, { tipo, notaMin }) {
  return lista.filter(
    (x) =>
      (tipo === "todos" || x.mediaType === tipo) && (x.nota ?? 0) >= notaMin, // las personas no tienen nota: quedan fuera si notaMin > 0
  );
}

const nombre = (x) => x.titulo ?? x.nombre ?? "";
const anio = (x) => Number(x.year) || 0; // "----" pasa a 0 y se va al final

const COMPARADORES = {
  nota: (a, b) => (b.nota ?? 0) - (a.nota ?? 0),
  anio: (a, b) => anio(b) - anio(a),
  titulo: (a, b) => nombre(a).localeCompare(nombre(b), "es"),
};

export function ordenar(lista, orden) {
  const cmp = COMPARADORES[orden];
  return cmp ? [...lista].sort(cmp) : lista; // "relevancia": se deja como llega
}
