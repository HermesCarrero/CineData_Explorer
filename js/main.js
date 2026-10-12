import { crearHeader } from "./ui.js";

document.querySelector("main").prepend(crearHeader());

await import("./controles.js");

await import("./cartelera.js");
