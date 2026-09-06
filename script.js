// FASE 3: primera herramienta con lógica real, el generador de números.
// Acá van a ir sumándose el resto de las herramientas (mezclarLista, crearGrupos, etc.)
// a medida que las construyamos fase por fase.

document.addEventListener("DOMContentLoaded", () => {
  console.log("RandomBox cargó correctamente.");
  configurarNavegacionHerramientas();
  configurarGeneradorDeNumeros();
  configurarSelectorDeNombres();
  configurarGeneradorDeGrupos();
});

// --- Navegación entre la pantalla de inicio y la pantalla de una herramienta ---
// Una sola función genérica: cada herramienta nueva solo necesita sumar una
// línea acá, en vez de repetir la misma lógica de mostrar/ocultar.
function configurarNavegacionHerramientas() {
  const pantallaInicio = document.getElementById("pantalla-inicio");
  const notaConstruccion = document.getElementById("nota-construccion");

  function abrirHerramienta(idPantalla) {
    pantallaInicio.hidden = true;
    notaConstruccion.hidden = true;
    document.getElementById(idPantalla).hidden = false;
  }

  function volverAlInicio(idPantalla) {
    document.getElementById(idPantalla).hidden = true;
    pantallaInicio.hidden = false;
    notaConstruccion.hidden = false;
  }

  function conectarHerramienta(idBoton, idPantalla, idBotonVolver) {
    document.getElementById(idBoton).addEventListener("click", () => abrirHerramienta(idPantalla));
    document.getElementById(idBotonVolver).addEventListener("click", () => volverAlInicio(idPantalla));
  }

  conectarHerramienta("btn-generador-numeros", "pantalla-generador-numeros", "btn-volver-numeros");
  conectarHerramienta("btn-selector-nombres", "pantalla-selector-nombres", "btn-volver-selector");
  conectarHerramienta("btn-generador-grupos", "pantalla-generador-grupos", "btn-volver-grupos");
}

// --- Utilidades compartidas entre herramientas ---

// Crea el <span> que muestra un elemento del resultado (un número, un nombre, etc.).
function crearCasillero(contenido) {
  const casillero = document.createElement("span");
  casillero.className = "resultado-slot";
  casillero.textContent = contenido;
  return casillero;
}

// El resultado "flota" sobre el formulario (que queda difuminado y no se
// puede tocar hasta volver). Lo usan las tres herramientas con resultado.
function mostrarOverlayDeResultado(formulario, overlay) {
  formulario.classList.add("difuminado");
  overlay.hidden = false;
}

function ocultarOverlayDeResultado(formulario, overlay) {
  overlay.hidden = true;
  formulario.classList.remove("difuminado");
}

// El botón "Volver" de abajo del resultado solo cierra el overlay: el
// formulario y lo que el usuario ya escribió quedan intactos.
function configurarBotonVolverDeResultado(idBoton, formulario, overlay) {
  document.getElementById(idBoton).addEventListener("click", () => {
    ocultarOverlayDeResultado(formulario, overlay);
  });
}

// --- Generador de números ---

// Un número entero al azar entre minimo y maximo, ambos incluidos.
function generarNumeroAleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

// "cantidad" números al azar entre minimo y maximo, sin repetir ninguno.
function generarNumerosSinRepetir(minimo, maximo, cantidad) {
  const disponibles = [];
  for (let numero = minimo; numero <= maximo; numero++) {
    disponibles.push(numero);
  }

  const numerosElegidos = [];
  for (let i = 0; i < cantidad; i++) {
    const indiceAleatorio = Math.floor(Math.random() * disponibles.length);
    numerosElegidos.push(disponibles[indiceAleatorio]);
    disponibles.splice(indiceAleatorio, 1); // lo saca para no volver a elegirlo
  }
  return numerosElegidos;
}

function generarNumeros(minimo, maximo, cantidad, permitirRepetidos) {
  if (permitirRepetidos) {
    const numeros = [];
    for (let i = 0; i < cantidad; i++) {
      numeros.push(generarNumeroAleatorio(minimo, maximo));
    }
    return numeros;
  }
  return generarNumerosSinRepetir(minimo, maximo, cantidad);
}

// Devuelve un mensaje de error legible si los datos no son válidos,
// o null si todo está bien.
function validarDatosGenerador(minimo, maximo, cantidad, permitirRepetidos) {
  if (!Number.isInteger(minimo) || !Number.isInteger(maximo) || !Number.isInteger(cantidad)) {
    return "Los valores deben ser números enteros.";
  }
  if (minimo > maximo) {
    return "El mínimo no puede ser mayor que el máximo.";
  }
  if (cantidad < 1) {
    return "La cantidad debe ser al menos 1.";
  }
  if (!permitirRepetidos) {
    const cantidadDeNumerosPosibles = maximo - minimo + 1;
    if (cantidad > cantidadDeNumerosPosibles) {
      return `No se pueden generar ${cantidad} números distintos entre ${minimo} y ${maximo}: solo hay ${cantidadDeNumerosPosibles} números posibles.`;
    }
  }
  return null;
}

// Cada número "gira" mostrando valores al azar por un momento y se frena en
// su valor final (el mismo que ya calculó generarNumeros: esto es solo la
// animación, no cambia qué números salen).
function mostrarResultadoRuleta(numeros, minimo, maximo, elementoResultado, elementoAnuncio, alTerminar) {
  elementoResultado.innerHTML = "";

  const duracionDelPrimero = 700;
  const demoraEntreNumeros = 200;
  const velocidadDelGiro = 60;
  let numerosPendientes = numeros.length;

  numeros.forEach((numeroFinal, indice) => {
    const casillero = crearCasillero("?");
    elementoResultado.appendChild(casillero);

    const intervaloDeGiro = setInterval(() => {
      casillero.textContent = generarNumeroAleatorio(minimo, maximo);
    }, velocidadDelGiro);

    const duracionDeEsteNumero = duracionDelPrimero + indice * demoraEntreNumeros;

    setTimeout(() => {
      clearInterval(intervaloDeGiro);
      casillero.textContent = numeroFinal;
      casillero.classList.add("resultado-revelado");

      numerosPendientes--;
      if (numerosPendientes === 0) {
        elementoAnuncio.textContent = `Resultado: ${numeros.join(", ")}`;
        alTerminar();
      }
    }, duracionDeEsteNumero);
  });
}

function configurarGeneradorDeNumeros() {
  const formulario = document.getElementById("form-generador-numeros");
  const overlay = document.getElementById("overlay-generador-numeros");
  const botonGenerar = formulario.querySelector(".boton-generar");
  const elementoError = document.getElementById("error-generador-numeros");
  const elementoResultado = document.getElementById("resultado-generador-numeros");
  const elementoAnuncio = document.getElementById("anuncio-resultado-numeros");

  configurarBotonVolverDeResultado("btn-volver-resultado-numeros", formulario, overlay);

  // Si quedó un resultado abierto de una visita anterior, arrancamos de cero
  // cada vez que se vuelve a entrar a la herramienta desde el inicio.
  document.getElementById("btn-generador-numeros").addEventListener("click", () => {
    ocultarOverlayDeResultado(formulario, overlay);
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault(); // evita que la página se recargue

    const minimo = Number(document.getElementById("numero-minimo").value);
    const maximo = Number(document.getElementById("numero-maximo").value);
    const cantidad = Number(document.getElementById("numero-cantidad").value);
    const permitirRepetidos = document.getElementById("numero-repetidos").checked;

    const mensajeError = validarDatosGenerador(minimo, maximo, cantidad, permitirRepetidos);

    if (mensajeError) {
      elementoError.textContent = mensajeError;
      elementoError.hidden = false;
      return;
    }

    elementoError.hidden = true;
    const numeros = generarNumeros(minimo, maximo, cantidad, permitirRepetidos);

    mostrarOverlayDeResultado(formulario, overlay);
    botonGenerar.disabled = true;
    mostrarResultadoRuleta(numeros, minimo, maximo, elementoResultado, elementoAnuncio, () => {
      botonGenerar.disabled = false;
    });
  });
}

// --- Lista dinámica de opciones ("Opción 1", "Opción 2"...) ---
// La usan el selector de nombres/palabras y el generador de grupos (y
// probablemente el mezclador y los torneos, más adelante): cada una arma su
// propio contenedor en el HTML con la clase .contenedor-opciones, y le puede
// dar su propio texto de etiqueta con data-etiqueta ("Opción", "Participante").

// Una opción es válida si tiene al menos una letra (puede tener números
// mezclados, ej. "Equipo 1", pero "123" solo no alcanza).
function contieneAlMenosUnaLetra(texto) {
  return /\p{L}/u.test(texto);
}

// Mantiene la lista sincronizada con lo que hay escrito, a partir del campo
// que se acaba de editar: siempre debe haber exactamente un campo vacío al
// final para la próxima opción. Si el campo editado queda inválido (vacío,
// o sin ninguna letra) y no es el último, se interpreta como "se borró esa
// opción": el contenido de los campos siguientes sube un lugar para tapar
// el hueco, y sobra un campo al final que se elimina.
function sincronizarListaDeOpciones(campoEditado) {
  const contenedor = campoEditado.closest(".contenedor-opciones");
  const inputs = Array.from(contenedor.querySelectorAll(".input-opcion"));
  const indiceEditado = inputs.indexOf(campoEditado);
  const esUltimo = indiceEditado === inputs.length - 1;
  const esValido = contieneAlMenosUnaLetra(campoEditado.value.trim());

  if (!esValido && !esUltimo) {
    for (let i = indiceEditado; i < inputs.length - 1; i++) {
      inputs[i].value = inputs[i + 1].value;
    }
    contenedor.lastElementChild.remove();
  } else if (esValido && esUltimo) {
    agregarCampoDeOpcion(contenedor);
  }

  renumerarCampos(contenedor);
}

function agregarCampoDeOpcion(contenedor) {
  const campo = document.createElement("div");
  campo.className = "campo campo-opcion";

  const etiqueta = document.createElement("label");
  const input = document.createElement("input");
  input.type = "text";
  input.className = "input-opcion";

  campo.appendChild(etiqueta);
  campo.appendChild(input);
  contenedor.appendChild(campo);
}

// El número de cada campo ("Opción 1", "Opción 2"...) es siempre su posición
// actual en la lista, no un contador que solo sube: así, si se borra un campo
// del medio, los que quedan se renumeran para no dejar huecos (ej. "Opción 1,
// Opción 3" nunca debería verse). El texto de la etiqueta ("Opción", "Participante")
// sale de data-etiqueta en el propio contenedor, para poder reusar todo esto
// en varias herramientas sin repetir código.
function renumerarCampos(contenedor) {
  const etiquetaTexto = contenedor.dataset.etiqueta || "Opción";
  const campos = contenedor.querySelectorAll(".campo-opcion");
  campos.forEach((campo, indice) => {
    const numero = indice + 1;
    const id = `${contenedor.id}-${numero}`;
    campo.querySelector("label").setAttribute("for", id);
    campo.querySelector("label").textContent = `${etiquetaTexto} ${numero}`;
    campo.querySelector(".input-opcion").id = id;
  });
}

// Un solo listener en el contenedor alcanza para todos los campos, incluso
// los que todavía no existen (esto se llama "delegación de eventos").
function configurarListaDeOpciones(idContenedor) {
  const contenedor = document.getElementById(idContenedor);

  contenedor.addEventListener("input", (evento) => {
    if (evento.target.classList.contains("input-opcion")) {
      sincronizarListaDeOpciones(evento.target);
    }
  });
}

// El último campo (todavía vacío, esperando la próxima opción) queda afuera
// solo, porque un texto vacío no tiene ninguna letra.
function obtenerOpcionesValidas(contenedor) {
  const inputs = contenedor.querySelectorAll(".input-opcion");
  const opciones = [];
  inputs.forEach((input) => {
    const texto = input.value.trim();
    if (contieneAlMenosUnaLetra(texto)) {
      opciones.push(texto);
    }
  });
  return opciones;
}

function elegirElementoAleatorio(lista) {
  const indice = Math.floor(Math.random() * lista.length);
  return lista[indice];
}

function elegirElementosSinRepetir(lista, cantidad) {
  const disponibles = [...lista]; // copia: no queremos tocar la lista original
  const elegidos = [];
  for (let i = 0; i < cantidad; i++) {
    const indice = Math.floor(Math.random() * disponibles.length);
    elegidos.push(disponibles[indice]);
    disponibles.splice(indice, 1);
  }
  return elegidos;
}

function elegirElementos(lista, cantidad, permitirRepetidos) {
  if (permitirRepetidos) {
    const elegidos = [];
    for (let i = 0; i < cantidad; i++) {
      elegidos.push(elegirElementoAleatorio(lista));
    }
    return elegidos;
  }
  return elegirElementosSinRepetir(lista, cantidad);
}

function validarDatosSelector(opciones, cantidad, permitirRepetidos) {
  if (opciones.length === 0) {
    return "Agregá al menos una opción antes de elegir.";
  }
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return "La cantidad a elegir debe ser al menos 1.";
  }
  if (!permitirRepetidos && cantidad > opciones.length) {
    return `No se pueden elegir ${cantidad} opciones distintas: solo cargaste ${opciones.length}.`;
  }
  return null;
}

// --- Redoble de tambores, generado con la Web Audio API ---
// El proyecto no permite archivos externos ni dependencias, así que el sonido
// se sintetiza con código: ruido filtrado en golpes cortos y seguidos.

let contextoDeAudio = null;

function obtenerContextoDeAudio() {
  if (!contextoDeAudio) {
    const AudioContextDisponible = window.AudioContext || window.webkitAudioContext;
    contextoDeAudio = new AudioContextDisponible();
  }
  return contextoDeAudio;
}

function reproducirGolpeDeTambor(contexto, tiempoDeInicio) {
  const duracionDelGolpe = 0.05; // 50 ms

  // Ruido blanco: un valor al azar entre -1 y 1 en cada "muestra" de audio.
  const buffer = contexto.createBuffer(1, contexto.sampleRate * duracionDelGolpe, contexto.sampleRate);
  const datos = buffer.getChannelData(0);
  for (let i = 0; i < datos.length; i++) {
    datos[i] = Math.random() * 2 - 1;
  }

  const fuente = contexto.createBufferSource();
  fuente.buffer = buffer;

  // Filtramos el ruido para que suene a golpe de tambor y no a estática de radio.
  const filtro = contexto.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.frequency.value = 200;

  // El volumen arranca fuerte y baja rápido, como un golpe seco.
  const ganancia = contexto.createGain();
  ganancia.gain.setValueAtTime(0.5, tiempoDeInicio);
  ganancia.gain.exponentialRampToValueAtTime(0.01, tiempoDeInicio + duracionDelGolpe);

  fuente.connect(filtro);
  filtro.connect(ganancia);
  ganancia.connect(contexto.destination);

  fuente.start(tiempoDeInicio);
  fuente.stop(tiempoDeInicio + duracionDelGolpe);
}

function reproducirRedobleDeTambores(duracionTotalMs) {
  const contexto = obtenerContextoDeAudio();
  const duracionTotalSeg = duracionTotalMs / 1000;
  const intervaloBase = 0.09;

  let tiempo = contexto.currentTime;
  const tiempoFinal = tiempo + duracionTotalSeg;

  while (tiempo < tiempoFinal) {
    reproducirGolpeDeTambor(contexto, tiempo);
    const progreso = 1 - (tiempoFinal - tiempo) / duracionTotalSeg;
    tiempo += intervaloBase * (1 - progreso * 0.5); // se acelera un poco hacia el final
  }
}

// Modo Revelación con suspenso: espera unos segundos (con redoble de tambores
// sonando) y recién ahí muestra el resultado final.
function mostrarConSuspenso(elegidos, elementoResultado, elementoAnuncio, alTerminar) {
  const duracionMs = 3000;

  elementoResultado.innerHTML = "";
  const casilleroDeSuspenso = crearCasillero("…");
  casilleroDeSuspenso.classList.add("resultado-suspenso");
  elementoResultado.appendChild(casilleroDeSuspenso);

  reproducirRedobleDeTambores(duracionMs);

  setTimeout(() => {
    elementoResultado.innerHTML = "";
    elegidos.forEach((elegido) => {
      const casillero = crearCasillero(elegido);
      casillero.classList.add("resultado-revelado");
      elementoResultado.appendChild(casillero);
    });
    elementoAnuncio.textContent = `Resultado: ${elegidos.join(", ")}`;
    alTerminar();
  }, duracionMs);
}

// --- Ruleta visual (selector de nombres/palabras) ---
// Se dibuja con SVG generado por código: nada de imágenes ni librerías.

const coloresDeRuleta = ["#5b3df5", "#3b6fd6", "#2f9e6e", "#c08a1f", "#d97a3f", "#c94f4f", "#7c4fd8"];
const ESPACIO_SVG = "http://www.w3.org/2000/svg";

// Un punto sobre un círculo, dado un ángulo en grados. Restamos 90° para que
// el ángulo 0 apunte "hacia arriba" (donde está la flecha) en vez de "a la derecha",
// que es la convención matemática habitual.
function coordenadaEnCirculo(centro, radio, anguloGrados) {
  const anguloRad = ((anguloGrados - 90) * Math.PI) / 180;
  return {
    x: centro + radio * Math.cos(anguloRad),
    y: centro + radio * Math.sin(anguloRad),
  };
}

// El "path" SVG de una porción de torta, del ángulo de inicio al de fin.
function crearPathDeSegmento(centro, radio, anguloInicio, anguloFin) {
  const inicio = coordenadaEnCirculo(centro, radio, anguloInicio);
  const fin = coordenadaEnCirculo(centro, radio, anguloFin);
  const esArcoGrande = anguloFin - anguloInicio > 180 ? 1 : 0;
  return `M ${centro} ${centro} L ${inicio.x} ${inicio.y} A ${radio} ${radio} 0 ${esArcoGrande} 1 ${fin.x} ${fin.y} Z`;
}

function acortarTexto(texto) {
  const maximo = 12;
  return texto.length > maximo ? `${texto.slice(0, maximo - 1)}…` : texto;
}

// Redibuja la rueda completa según la lista de opciones actual (se llama de
// nuevo entre giros si "sin repetición" saca una opción del medio).
function dibujarRuedaDeNombres(contenedorRuleta, opciones) {
  const svg = contenedorRuleta.querySelector(".ruleta-svg");
  svg.innerHTML = "";
  svg.style.transition = "none";
  svg.style.transform = "rotate(0deg)";

  const centro = 150;
  const radio = 145;

  // Un segmento de 360° no se puede dibujar como arco SVG: el punto de inicio
  // y el de fin coinciden, y el navegador lo trata como "nada que dibujar".
  // Cuando queda una sola opción (último giro sin repetición), dibujamos
  // directamente un círculo completo en vez de un arco.
  if (opciones.length === 1) {
    const circulo = document.createElementNS(ESPACIO_SVG, "circle");
    circulo.setAttribute("cx", centro);
    circulo.setAttribute("cy", centro);
    circulo.setAttribute("r", radio);
    circulo.setAttribute("fill", coloresDeRuleta[0]);
    circulo.setAttribute("class", "ruleta-segmento");
    svg.appendChild(circulo);

    const etiqueta = document.createElementNS(ESPACIO_SVG, "text");
    etiqueta.setAttribute("x", centro);
    etiqueta.setAttribute("y", centro);
    etiqueta.setAttribute("text-anchor", "middle");
    etiqueta.setAttribute("dominant-baseline", "middle");
    etiqueta.setAttribute("class", "ruleta-etiqueta");
    etiqueta.textContent = acortarTexto(opciones[0]);
    svg.appendChild(etiqueta);
    return;
  }

  const anguloPorSegmento = 360 / opciones.length;

  opciones.forEach((texto, indice) => {
    const anguloInicio = indice * anguloPorSegmento;
    const anguloFin = anguloInicio + anguloPorSegmento;

    const segmento = document.createElementNS(ESPACIO_SVG, "path");
    segmento.setAttribute("d", crearPathDeSegmento(centro, radio, anguloInicio, anguloFin));
    segmento.setAttribute("fill", coloresDeRuleta[indice % coloresDeRuleta.length]);
    segmento.setAttribute("class", "ruleta-segmento");
    svg.appendChild(segmento);

    const puntoEtiqueta = coordenadaEnCirculo(centro, radio * 0.62, anguloInicio + anguloPorSegmento / 2);
    const etiqueta = document.createElementNS(ESPACIO_SVG, "text");
    etiqueta.setAttribute("x", puntoEtiqueta.x);
    etiqueta.setAttribute("y", puntoEtiqueta.y);
    etiqueta.setAttribute("text-anchor", "middle");
    etiqueta.setAttribute("dominant-baseline", "middle");
    etiqueta.setAttribute("transform", `rotate(${anguloInicio + anguloPorSegmento / 2}, ${puntoEtiqueta.x}, ${puntoEtiqueta.y})`);
    etiqueta.setAttribute("class", "ruleta-etiqueta");
    etiqueta.textContent = acortarTexto(texto);
    svg.appendChild(etiqueta);
  });
}

// Gira la rueda hasta frenarse exactamente en el ángulo indicado.
// El "reset" a 0° sin transición, seguido de requestAnimationFrame, es la forma
// estándar de reiniciar una animación CSS que ya se había usado antes.
function girarRuedaHasta(svg, anguloFinal, duracionSeg, alTerminar) {
  svg.style.transition = "none";
  svg.style.transform = "rotate(0deg)";
  svg.getBoundingClientRect(); // fuerza al navegador a aplicar el reset ya mismo

  requestAnimationFrame(() => {
    svg.style.transition = `transform ${duracionSeg}s cubic-bezier(0.12, 0.85, 0.28, 1)`;
    svg.style.transform = `rotate(${anguloFinal}deg)`;
  });

  svg.addEventListener("transitionend", alTerminar, { once: true });
}

// Hace tantos giros como "cantidad" se haya pedido. Cada giro elige un índice
// al azar de las opciones todavía disponibles (misma idea que elegirElementosSinRepetir,
// pero de a un elemento por vez, para poder animarlo). Si no se permiten repetidos,
// la opción ganadora se saca de la rueda antes del siguiente giro.
function realizarRuletaDeNombres(opciones, cantidad, permitirRepetidos, contenedorRuleta, elementoResultado, elementoAnuncio, alTerminar) {
  const disponibles = [...opciones];
  const elegidos = [];
  const svg = contenedorRuleta.querySelector(".ruleta-svg");

  dibujarRuedaDeNombres(contenedorRuleta, disponibles);

  function girarSiguiente() {
    const anguloPorSegmento = 360 / disponibles.length;
    const indiceGanador = Math.floor(Math.random() * disponibles.length);
    const centroGanador = indiceGanador * anguloPorSegmento + anguloPorSegmento / 2;
    const vueltasCompletas = 5;
    const anguloFinal = vueltasCompletas * 360 + ((360 - centroGanador) % 360);

    girarRuedaHasta(svg, anguloFinal, 3, () => {
      const ganador = disponibles[indiceGanador];
      elegidos.push(ganador);

      const casillero = crearCasillero(ganador);
      casillero.classList.add("resultado-revelado");
      elementoResultado.appendChild(casillero);

      if (!permitirRepetidos) {
        disponibles.splice(indiceGanador, 1);
      }

      if (elegidos.length < cantidad) {
        if (!permitirRepetidos) {
          dibujarRuedaDeNombres(contenedorRuleta, disponibles);
        }
        setTimeout(girarSiguiente, 500);
      } else {
        elementoAnuncio.textContent = `Resultado: ${elegidos.join(", ")}`;
        alTerminar();
      }
    });
  }

  girarSiguiente();
}

function configurarSelectorDeNombres() {
  configurarListaDeOpciones("contenedor-opciones");

  const formulario = document.getElementById("form-selector-nombres");
  const overlay = document.getElementById("overlay-selector-nombres");
  const seccionEleccionModo = document.getElementById("selector-eleccion-modo");
  const botonVolverSelector = document.getElementById("btn-volver-selector");
  const botonElegir = formulario.querySelector(".boton-generar");
  const elementoError = document.getElementById("error-selector-nombres");
  const elementoResultado = document.getElementById("resultado-selector-nombres");
  const elementoAnuncio = document.getElementById("anuncio-resultado-selector");
  const contenedorRuleta = document.getElementById("ruleta-nombres");
  const contenedorOpciones = document.getElementById("contenedor-opciones");

  configurarBotonVolverDeResultado("btn-volver-resultado-selector", formulario, overlay);

  // El modo elegido se guarda en el propio <form> (data-modo), así no hace
  // falta ningún radio button: el formulario "recuerda" con qué modo trabajar.
  // "Volver" (al inicio) solo se ve en la elección de modo; con el formulario
  // abierto, la única salida es "Cambiar modo" — para llegar al inicio hay
  // que pasar por ahí primero.
  function mostrarEleccionDeModo() {
    formulario.hidden = true;
    elementoError.hidden = true;
    ocultarOverlayDeResultado(formulario, overlay);
    contenedorRuleta.hidden = true;
    elementoResultado.innerHTML = "";
    seccionEleccionModo.hidden = false;
    botonVolverSelector.hidden = false;
  }

  function elegirModo(modo) {
    formulario.dataset.modo = modo;
    seccionEleccionModo.hidden = true;
    formulario.hidden = false;
    botonVolverSelector.hidden = true;
  }

  seccionEleccionModo.querySelectorAll(".herramienta").forEach((boton) => {
    boton.addEventListener("click", () => elegirModo(boton.dataset.modo));
  });

  document.getElementById("btn-cambiar-modo").addEventListener("click", mostrarEleccionDeModo);

  // Cada vez que se entra a esta herramienta desde el inicio, arrancamos
  // siempre por la elección de modo (no se recuerda la vez anterior).
  document.getElementById("btn-selector-nombres").addEventListener("click", mostrarEleccionDeModo);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const opciones = obtenerOpcionesValidas(contenedorOpciones);
    const cantidad = Number(document.getElementById("selector-cantidad").value);
    const permitirRepetidos = document.getElementById("selector-repetidos").checked;
    const modoElegido = formulario.dataset.modo;

    const mensajeError = validarDatosSelector(opciones, cantidad, permitirRepetidos);

    if (mensajeError) {
      elementoError.textContent = mensajeError;
      elementoError.hidden = false;
      elementoResultado.innerHTML = "";
      contenedorRuleta.hidden = true;
      return;
    }

    elementoError.hidden = true;
    elementoResultado.innerHTML = "";
    mostrarOverlayDeResultado(formulario, overlay);
    botonElegir.disabled = true;

    if (modoElegido === "ruleta") {
      contenedorRuleta.hidden = false;
      realizarRuletaDeNombres(opciones, cantidad, permitirRepetidos, contenedorRuleta, elementoResultado, elementoAnuncio, () => {
        botonElegir.disabled = false;
      });
    } else {
      contenedorRuleta.hidden = true;
      const elegidos = elegirElementos(opciones, cantidad, permitirRepetidos);
      mostrarConSuspenso(elegidos, elementoResultado, elementoAnuncio, () => {
        botonElegir.disabled = false;
      });
    }
  });
}

// --- Generador de grupos ---

// Reordena una lista al azar (algoritmo de Fisher-Yates). No modifica la
// lista original — devuelve una copia mezclada. Función genérica: cuando
// construyamos el Mezclador (FASE 7), va a reusar esta misma función.
function mezclarLista(lista) {
  const mezclada = [...lista];
  for (let i = mezclada.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mezclada[i], mezclada[j]] = [mezclada[j], mezclada[i]];
  }
  return mezclada;
}

// Reparte "totalParticipantes" en "cantidadDeGrupos" grupos lo más parejos
// posible: la diferencia entre el grupo más grande y el más chico nunca es
// mayor a 1. Ejemplo: 21 personas en 4 grupos -> tamaños [6, 5, 5, 5].
function calcularTamanosDeGrupos(totalParticipantes, cantidadDeGrupos) {
  const tamanoBase = Math.floor(totalParticipantes / cantidadDeGrupos);
  const sobrantes = totalParticipantes % cantidadDeGrupos;

  const tamanos = [];
  for (let i = 0; i < cantidadDeGrupos; i++) {
    tamanos.push(tamanoBase + (i < sobrantes ? 1 : 0));
  }
  return tamanos;
}

// Mezcla a los participantes y los corta en la cantidad de grupos pedida,
// con los tamaños balanceados de calcularTamanosDeGrupos.
function crearGrupos(participantes, cantidadDeGrupos) {
  const participantesMezclados = mezclarLista(participantes);
  const tamanos = calcularTamanosDeGrupos(participantes.length, cantidadDeGrupos);

  const grupos = [];
  let indice = 0;
  tamanos.forEach((tamano) => {
    grupos.push(participantesMezclados.slice(indice, indice + tamano));
    indice += tamano;
  });
  return grupos;
}

function validarDatosDeGrupos(participantes, numero, modo) {
  if (participantes.length === 0) {
    return "Agregá al menos un participante antes de generar grupos.";
  }
  if (!Number.isInteger(numero) || numero < 1) {
    return "Ese número tiene que ser al menos 1.";
  }
  if (modo === "cantidad-grupos" && numero > participantes.length) {
    return `No se pueden armar ${numero} grupos con solo ${participantes.length} participantes.`;
  }
  return null;
}

function mostrarGrupos(grupos, elementoResultado) {
  elementoResultado.innerHTML = "";

  grupos.forEach((grupo, indice) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "grupo-tarjeta";

    const titulo = document.createElement("h3");
    titulo.textContent = `Grupo ${indice + 1}`;
    tarjeta.appendChild(titulo);

    const lista = document.createElement("ul");
    grupo.forEach((persona) => {
      const item = document.createElement("li");
      item.textContent = persona;
      lista.appendChild(item);
    });
    tarjeta.appendChild(lista);

    elementoResultado.appendChild(tarjeta);
  });
}

function configurarGeneradorDeGrupos() {
  configurarListaDeOpciones("contenedor-participantes");

  const formulario = document.getElementById("form-generador-grupos");
  const overlay = document.getElementById("overlay-generador-grupos");
  const seccionEleccionModo = document.getElementById("grupos-eleccion-modo");
  const botonVolver = document.getElementById("btn-volver-grupos");
  const elementoError = document.getElementById("error-generador-grupos");
  const elementoResultado = document.getElementById("resultado-generador-grupos");
  const etiquetaNumero = document.getElementById("grupos-numero-etiqueta");
  const contenedorParticipantes = document.getElementById("contenedor-participantes");

  configurarBotonVolverDeResultado("btn-volver-resultado-grupos", formulario, overlay);

  // Mismo patrón que en el selector de nombres: primero se elige el modo
  // (acá, "por cantidad de grupos" o "por personas por grupo"), y recién
  // después aparece el formulario para cargar participantes.
  function mostrarEleccionDeModo() {
    formulario.hidden = true;
    elementoError.hidden = true;
    ocultarOverlayDeResultado(formulario, overlay);
    elementoResultado.innerHTML = "";
    seccionEleccionModo.hidden = false;
    botonVolver.hidden = false;
  }

  function elegirModo(modo) {
    formulario.dataset.modo = modo;
    etiquetaNumero.textContent = modo === "cantidad-grupos" ? "Cantidad de grupos" : "Personas por grupo";
    seccionEleccionModo.hidden = true;
    formulario.hidden = false;
    botonVolver.hidden = true;
  }

  seccionEleccionModo.querySelectorAll(".herramienta").forEach((boton) => {
    boton.addEventListener("click", () => elegirModo(boton.dataset.modo));
  });

  document.getElementById("btn-cambiar-modo-grupos").addEventListener("click", mostrarEleccionDeModo);
  document.getElementById("btn-generador-grupos").addEventListener("click", mostrarEleccionDeModo);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const participantes = obtenerOpcionesValidas(contenedorParticipantes);
    const numero = Number(document.getElementById("grupos-numero").value);
    const modo = formulario.dataset.modo;

    const mensajeError = validarDatosDeGrupos(participantes, numero, modo);

    if (mensajeError) {
      elementoError.textContent = mensajeError;
      elementoError.hidden = false;
      elementoResultado.innerHTML = "";
      return;
    }

    elementoError.hidden = true;

    const cantidadDeGrupos = modo === "cantidad-grupos"
      ? numero
      : Math.ceil(participantes.length / numero);

    const grupos = crearGrupos(participantes, cantidadDeGrupos);
    mostrarGrupos(grupos, elementoResultado);
    mostrarOverlayDeResultado(formulario, overlay);
  });
}
