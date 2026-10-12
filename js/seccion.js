import { cargarSeccion } from "./api.js";

export class Seccion {
  constructor({ clave, titulo, esFavorita = () => false }) {
    this.clave = clave;
    this.esFavorita = esFavorita;
    this.pagina = 0;
    this.totalPaginas = Infinity;
    this.cargando = false;

    this.el = document.createElement("section");
    this.el.className = "seccion";

    const h2 = document.createElement("h2");
    h2.textContent = titulo;

    this.fila = document.createElement("div");
    this.fila.className = "fila";

    this.centinela = document.createElement("div");
    this.centinela.className = "centinelaFila";
    this.fila.append(this.centinela);

    this.el.append(h2, this.fila);

    this.activarArrastre(); // ← nuevo

    this.observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0].isIntersecting) this.cargarMas();
      },
      { root: this.fila, rootMargin: "0px 300px 0px 0px" },
    );

    this.fila.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.fila.scrollLeft += e.deltaY;
      },
      { passive: false },
    );
    this.observador.observe(this.centinela);
  }

  async cargarMas() {
    if (this.cargando || this.pagina >= this.totalPaginas) return;
    this.cargando = true;
    let ok = false;

    try {
      const siguiente = this.pagina + 1;
      const { pelis, totalPaginas } = await cargarSeccion(
        this.clave,
        siguiente,
      );

      this.pagina = siguiente;
      this.totalPaginas = totalPaginas;
      pelis.forEach((p) =>
        this.centinela.before(p.toCard(this.esFavorita(p.id))),
      );
      ok = true;
    } catch (error) {
      this.mostrarError(error.message);
    } finally {
      this.cargando = false;
    }
    if (!ok) return;

    if (this.pagina >= this.totalPaginas) {
      this.observador.disconnect();
    } else {
      this.observador.unobserve(this.centinela);
      this.observador.observe(this.centinela);
    }
  }

  activarArrastre() {
    let inicioX = 0;
    let inicioScroll = 0;
    let arrastrado = false;

    const mover = (e) => {
      const dx = e.clientX - inicioX;
      if (Math.abs(dx) > 5) {
        arrastrado = true;
        this.fila.classList.add("arrastrando");
      }
      this.fila.scrollLeft = inicioScroll - dx;
    };

    const soltar = () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
      this.fila.classList.remove("arrastrando");
    };

    this.fila.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      arrastrado = false;
      inicioX = e.clientX;
      inicioScroll = this.fila.scrollLeft;
      window.addEventListener("pointermove", mover);
      window.addEventListener("pointerup", soltar);
    });

    // Si has arrastrado, el clic que sigue no debe abrir la tarjeta
    this.fila.addEventListener(
      "click",
      (e) => {
        if (arrastrado) {
          e.preventDefault();
          e.stopPropagation();
          arrastrado = false;
        }
      },
      true,
    );

    // Evita que el navegador arrastre la imagen del póster en lugar de la fila
    this.fila.addEventListener("dragstart", (e) => e.preventDefault());
  }

  mostrarError(texto) {
    const aviso = document.createElement("p");
    aviso.className = "error";
    aviso.textContent = `No se pudo cargar: ${texto}`;
    this.el.append(aviso);
  }
}
