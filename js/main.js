const filterBtn = document.getElementById("filterBtn");
const filterPanel = document.getElementById("filterPanel");
const themeBtn = document.getElementById("themeBtn");
const temasPanel = document.getElementById("temasPanel");
const temas = ["claro", "oscuro", "cine", "bosque"];
const themeOpts = temasPanel.querySelectorAll(".temaOpt");

function toggleThemes(open) {
  temasPanel.hidden = !open;
  themeBtn.setAttribute("aria-expanded", String(open));
  themeBtn.classList.toggle("open", open);
}

function togglePanel(open) {
  filterPanel.hidden = !open;
  filterBtn.setAttribute("aria-expanded", String(open));
  filterBtn.classList.toggle("open", open);
}
function setTheme(name) {
  if (!temas.includes(name)) name = "claro";
  document.documentElement.dataset.theme = name;
  themeOpts.forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.theme === name)),
  );
  try {
    localStorage.setItem("theme", name);
  } catch {}
}

temasPanel.addEventListener("click", (e) => {
  const opt = e.target.closest(".temaOpt");
  if (!opt) return;
  setTheme(opt.dataset.theme);
  toggleThemes(false);
});

filterBtn.addEventListener("click", () => {
  togglePanel(filterPanel.hidden);
});

themeBtn.addEventListener("click", () => {
  toggleThemes(temasPanel.hidden);
});

let saved = null;
try {
  saved = localStorage.getItem("theme");
} catch {}
setTheme(saved);

/////////////////////////////////////////////////

import { pedirTMDB } from "./api.js";
import { Movie } from "./modelos/movie.js";

async function iniciar() {
  const rejilla = document.querySelector("#rejilla");

  try {
    const datos = await pedirTMDB("/trending/all/day");
    console.log(datos);
    const movies = datos.results.map((json) => Movie.desdeTMDB(json));
    movies.forEach((movie) => {
      rejilla.append(movie.toCard());
    });
  } catch (err) {
    console.log(`Error: ${err.message}`);
    rejilla.textContent = `No hay na ${err.message}`;
  }
}

iniciar();
