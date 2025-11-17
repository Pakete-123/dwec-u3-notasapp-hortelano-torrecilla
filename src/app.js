// DWEC U3 — Plantilla mínima NotasApp

/** @typedef {{ id:string, texto:string, fecha:string, prioridad:number, completada?:boolean }} Nota */

const ESTADO = {
  notas: /** @type {Nota[]} */ ([]),
  filtro: obtenerFiltroDesdeHash(),
};

const DATOS_GUARDADOS = localStorage.getItem("notasApp:data");
if (DATOS_GUARDADOS) {
  try {
    ESTADO.notas = JSON.parse(DATOS_GUARDADOS);

    ESTADO.notas.forEach((n) => {
      n.completada = n.completada === true;
    });
  } catch (err) {
    console.log("Error al leer datos: ", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("nav [data-hash]").forEach((btn) => {
    btn.addEventListener("click", () => {
      location.hash = btn.getAttribute("data-hash");
    });
  });
  //Llamadas a las funciones mediante la recolección de la ID y llamándolas con EventListener
  document.getElementById("formNota").addEventListener("submit", onSubmitNota);
  document
    .getElementById("btnPanelDiario")
    .addEventListener("click", abrirPanelDiario);
  document.getElementById("listaNotas").addEventListener("click", onAccionNota);
  document
    .getElementById("btnRestaurar")
    .addEventListener("click", restaurarSnapshot);

  actualizarSelectHistorial();
  render();
});

window.addEventListener("hashchange", () => {
  ESTADO.filtro = obtenerFiltroDesdeHash();
  render();
});

// Funciones principales
function crearNota(texto, fecha, prioridad) {
  const T = String(texto).trim();
  const P = Math.max(1, Math.min(3, Number(prioridad) || 1));
  const F = new Date(fecha);
  const HOY = new Date();
  HOY.setHours(0, 0, 0, 0);

  // Bloque de condicionales para validar las entradas con throw new Error();
  if (!T) throw new Error("Datos de nota inválidos");
  if (T.length > 200)
    throw new Error("El texto no puede superear los 200 carácteres");
  if (Number.isNaN(F.getTime())) throw new Error("Fecha inválida");
  if (F < HOY) throw new Error("La fecha no puede ser anterior a hoy");

  return {
    id: "n" + Math.random().toString(36).slice(2),
    texto: T,
    fecha: F.toISOString().slice(0, 10),
    prioridad: P,
  };
}

function obtenerFiltroDesdeHash() {
  const H = (location.hash || "#todas").toLowerCase();
  return ["#hoy", "#semana", "#todas"].includes(H) ? H : "#todas";
}

function filtrarNotas(notas) {
  const HOY = new Date();
  const YMD = HOY.toISOString().slice(0, 10);
  if (ESTADO.filtro === "#hoy") return notas.filter((n) => n.fecha === YMD);
  if (ESTADO.filtro === "#semana") {
    const fin = new Date(HOY);
    fin.setDate(HOY.getDate() + 7);
    return notas.filter(
      (n) => new Date(n.fecha) >= HOY && new Date(n.fecha) <= fin
    );
  }
  return notas;
}

function ordenarNotas(notas) {
  return [...notas].sort(
    (a, b) =>
      b.prioridad - a.prioridad ||
      new Date(a.fecha) - new Date(b.fecha) ||
      a.texto.localeCompare(b.texto)
  );
}

function render() {
  const CONT = document.getElementById("listaNotas");
  CONT.innerHTML = "";
  const VISIBLES = ordenarNotas(filtrarNotas(ESTADO.notas));
  const FRAGMENTO = document.createDocumentFragment();
  const TPL = document.getElementById("tplNota");

  for (const N of VISIBLES) {
    const NODE = TPL.content.firstElementChild.cloneNode(true);
    NODE.dataset.id = N.id;
    const HEADER = NODE.querySelector("header");
    const FOOTER = NODE.querySelector("footer");
    const TEXTO = NODE.querySelector(".texto");
    const FECHA = NODE.querySelector(".fecha");

    TEXTO.textContent = N.texto;
    FECHA.textContent = formatearFecha(N.fecha);
    FECHA.dateTime = N.fecha;

    const COMPLETADA = N.completada === true;

    HEADER.classList.toggle("notaCompletada", COMPLETADA);
    FOOTER.classList.toggle("notaCompletada", COMPLETADA);

    NODE.querySelector("[data-acc=completar]").textContent = N.completada
      ? "Desmarcar"
      : "Completar";

    FRAGMENTO.appendChild(NODE);
  }

  CONT.appendChild(FRAGMENTO);
}

function formatearFecha(ymd) {
  const D = new Date(ymd);
  return new Intl.DateTimeFormat(navigator.language || "es-ES", {
    dateStyle: "medium",
  }).format(D);
}

function guardarNota() {
  localStorage.setItem("notasApp:data", JSON.stringify(ESTADO.notas));
}

function guardarSnapshot() {
  const CLAVE = "notasApp:historial";
  const COPIANOTAS = JSON.parse(JSON.stringify(ESTADO.notas));
  const HISTORIAL = JSON.parse(localStorage.getItem(CLAVE)) || [];
  HISTORIAL.unshift({
    fecha: new Date().toISOString(),
    notas: COPIANOTAS,
  });
  localStorage.setItem(CLAVE, JSON.stringify(HISTORIAL.slice(0, 5)));
  actualizarSelectHistorial();
}

function actualizarSelectHistorial() {
  const SELECCIONAR = document.getElementById("selectHistorial");
  if (!SELECCIONAR) return;
  const HISTORIAL =
    JSON.parse(localStorage.getItem("notasApp:historial")) || [];
  SELECCIONAR.innerHTML = "";

  HISTORIAL.forEach((snap, index) => {
    const OPCION = document.createElement("option");
    OPCION.value = index;
    OPCION.textContent = `Version ${index + 1} - ${new Date(
      snap.fecha
    ).toLocaleString()}`;
    SELECCIONAR.appendChild(OPCION);
  });
}

function restaurarSnapshot() {
  const SELECCIONAR = document.getElementById("selectHistorial");
  const INDEX = Number(SELECCIONAR.value);
  const HISTORIAL = JSON.parse(
    localStorage.getItem("notasApp:historial") || []
  );
  if (!HISTORIAL[INDEX]) return alert("Versión no disponible");
  if (!confirm("¿Seguro que quieres restaurar esta versión?")) return;
  ESTADO.notas = HISTORIAL[INDEX].notas;
  guardarNota();
  render();
  alert("Versión restaurada");
}

function onSubmitNota(e) {
  e.preventDefault();
  const TEXTO = document.getElementById("txtTexto").value;
  const FECHA = document.getElementById("txtFecha").value;
  const PRIORIDAD = document.getElementById("selPrioridad").value;
  try {
    const NOTA = crearNota(TEXTO, FECHA, PRIORIDAD);
    ESTADO.notas.push(NOTA);
    guardarNota();
    guardarSnapshot();
    e.target.reset();
    alert("Nota creada");
    render();
  } catch (err) {
    alert(err.message);
  }
}

// Delegación de eventos: borrar, completar, editar
function onAccionNota(e) {
  const BTN = e.target.closest("button[data-acc]");
  if (!BTN) return;
  const ACC = BTN.dataset.acc;
  const ID = BTN.closest("[data-id]").dataset.id;
  const NOTA = ESTADO.notas.find((n) => n.id === ID);
  if (!NOTA) return;

  if (ACC === "borrar" && confirm("¿Segur@ que quiere borrar esta nota?")) {
    ESTADO.notas = ESTADO.notas.filter((n) => n.id !== ID);
    guardarNota();
    guardarSnapshot();
    render();
  }

  if (ACC === "completar") {
    NOTA.completada = !NOTA.completada;
    guardarNota();
    render();
  }

  if (ACC === "editar") {
    editarNotaInline(NOTA);
  }
}

function editarNotaInline(nota) {
  const CARD = document.querySelector(`[data-id="${nota.id}"]`);
  if (!CARD) return;

  const TEXTO = CARD.querySelector(".texto");
  const FECHA = CARD.querySelector(".fecha");
  const FOOTER = CARD.querySelector("footer");

  const INPUTTEXTO = document.createElement("input");
  INPUTTEXTO.type = "text";
  INPUTTEXTO.value = nota.texto;
  INPUTTEXTO.required = true;
  INPUTTEXTO.maxLength = 200;

  const INPUTFECHA = document.createElement("input");
  INPUTFECHA.type = "date";
  INPUTFECHA.value = nota.fecha;
  INPUTFECHA.required = true;
  INPUTFECHA.min = new Date().toISOString().slice(0, 10);

  TEXTO.replaceWith(INPUTTEXTO);
  FECHA.replaceWith(INPUTFECHA);

  FOOTER.innerHTML = `
    <button data-acc="guardar">Guardar</button>
    <button data-acc="cancelar">Cancelar</button>
  `;

  FOOTER.querySelector("[data-acc='guardar']").addEventListener("click", () => {
    INPUTTEXTO.setCustomValidity("");
    INPUTFECHA.setCustomValidity("");

    if (!INPUTTEXTO.checkValidity()) {
      INPUTTEXTO.setCustomValidity(
        "El texto es obligatorio y debe tener un máximo de 200 carácteres"
      );
      INPUTTEXTO.reportValidity();
      return;
    }

    if (new Date(INPUTFECHA.value) < new Date()) {
      INPUTFECHA.setCustomValidity("La fecha no puede ser anterior a hoy");
      INPUTFECHA.reportValidity();
      return;
    }

    nota.texto = INPUTTEXTO.value.trim();
    nota.fecha = INPUTFECHA.value;

    guardarSnapshot();
    guardarNota();
    render();
  });

  FOOTER.querySelector("[data-acc='cancelar']").addEventListener(
    "click",
    () => {
      render();
    }
  );
}

function abrirPanelDiario() {
  const REF = window.open("panel.html", "PanelDiario", "width=420,height=560");
  if (!REF) {
    alert("Pop-up bloqueado. Permita ventanas emergentes.");
    return;
  }
  const SNAPSHOT = { tipo: "SNAPSHOT", notas: filtrarNotas(ESTADO.notas) };
  setTimeout(() => {
    try {
      REF.postMessage(SNAPSHOT, "*");
    } catch {}
  }, 400);
}

window.addEventListener("message", (ev) => {
  if (!ev.data || typeof ev.data !== "object") return;
  if (ev.data.tipo === "BORRADO") {
    const ID = ev.data.id;
    ESTADO.notas = ESTADO.notas.filter((n) => n.id !== ID);
    guardarNota();
    render();
  }
});
