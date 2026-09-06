// FASE 3: primera herramienta con lógica real, el generador de números.
// Acá van a ir sumándose el resto de las herramientas (mezclarLista, crearGrupos, etc.)
// a medida que las construyamos fase por fase.

document.addEventListener("DOMContentLoaded", () => {
  console.log("RandomBox cargó correctamente.");
  configurarNavegacionHerramientas();
  configurarGeneradorDeNumeros();
  configurarSelectorDeNombres();
  configurarGeneradorDeGrupos();
  configurarLanzamientoDeMoneda();
  configurarMezclador();
  configurarTorneo();
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
  conectarHerramienta("btn-lanzamiento-moneda", "pantalla-lanzamiento-moneda", "btn-volver-moneda");
  conectarHerramienta("btn-mezclador", "pantalla-mezclador", "btn-volver-mezclador");
  conectarHerramienta("btn-torneo", "pantalla-torneo", "btn-volver-torneo");
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

  // El botón "Limpiar" es type="reset": el navegador ya se encarga de volver
  // mínimo/máximo/cantidad/repetidos a los valores originales del HTML. Acá
  // solo ocultamos el mensaje de error, que el navegador no toca solo.
  formulario.addEventListener("reset", () => {
    elementoError.hidden = true;
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

// Deja la lista como al principio: un solo campo vacío. La usa el botón
// "Limpiar" de cada herramienta que tenga una lista dinámica.
function reiniciarListaDeOpciones(contenedor) {
  const campos = contenedor.querySelectorAll(".campo-opcion");
  campos.forEach((campo, indice) => {
    if (indice === 0) {
      campo.querySelector(".input-opcion").value = "";
    } else {
      campo.remove();
    }
  });
  renumerarCampos(contenedor);
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

  // "Limpiar" resetea cantidad/repetidos solo (lo hace el navegador, por ser
  // type="reset"), y acá además vaciamos la lista de opciones a un campo.
  formulario.addEventListener("reset", () => {
    reiniciarListaDeOpciones(contenedorOpciones);
    elementoError.hidden = true;
  });

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

// Dibuja las tarjetas de grupos. Cada persona tiene un <select> para
// moverla a otro grupo — al elegir uno distinto, se llama a alMoverPersona
// con el grupo de origen, la posición de la persona ahí, y el grupo destino.
function mostrarGrupos(grupos, elementoResultado, alMoverPersona) {
  elementoResultado.innerHTML = "";

  grupos.forEach((grupo, indiceGrupo) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "grupo-tarjeta";

    const titulo = document.createElement("h3");
    titulo.textContent = `Grupo ${indiceGrupo + 1}`;
    tarjeta.appendChild(titulo);

    if (grupo.length === 0) {
      const vacio = document.createElement("p");
      vacio.className = "grupo-vacio";
      vacio.textContent = "Vacío";
      tarjeta.appendChild(vacio);
      elementoResultado.appendChild(tarjeta);
      return;
    }

    const lista = document.createElement("ul");
    grupo.forEach((persona, indicePersona) => {
      const item = document.createElement("li");

      const nombre = document.createElement("span");
      nombre.className = "persona-nombre";
      nombre.textContent = persona;
      item.appendChild(nombre);

      const selector = document.createElement("select");
      selector.className = "persona-mover";
      selector.setAttribute("aria-label", `Mover a ${persona} a otro grupo`);

      grupos.forEach((_, indiceOpcion) => {
        const opcion = document.createElement("option");
        opcion.value = indiceOpcion;
        opcion.textContent = `Grupo ${indiceOpcion + 1}`;
        opcion.selected = indiceOpcion === indiceGrupo;
        selector.appendChild(opcion);
      });

      selector.addEventListener("change", () => {
        alMoverPersona(indiceGrupo, indicePersona, Number(selector.value));
      });

      item.appendChild(selector);
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
  const elementoAnuncio = document.getElementById("anuncio-generador-grupos");
  const etiquetaNumero = document.getElementById("grupos-numero-etiqueta");
  const contenedorParticipantes = document.getElementById("contenedor-participantes");

  // Los grupos generados quedan guardados acá (no solo en el HTML) para poder
  // editarlos: mover a alguien es sacarlo de un grupo y agregarlo a otro en
  // este array, y volver a dibujar todo.
  let gruposActuales = [];

  function moverPersona(indiceGrupoOrigen, indicePersona, indiceGrupoDestino) {
    if (indiceGrupoOrigen !== indiceGrupoDestino) {
      const persona = gruposActuales[indiceGrupoOrigen][indicePersona];
      gruposActuales[indiceGrupoOrigen].splice(indicePersona, 1);
      gruposActuales[indiceGrupoDestino].push(persona);
      elementoAnuncio.textContent = `${persona} se movió al Grupo ${indiceGrupoDestino + 1}.`;
    }
    mostrarGrupos(gruposActuales, elementoResultado, moverPersona);
  }

  configurarBotonVolverDeResultado("btn-volver-resultado-grupos", formulario, overlay);

  formulario.addEventListener("reset", () => {
    reiniciarListaDeOpciones(contenedorParticipantes);
    elementoError.hidden = true;
  });

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

    gruposActuales = crearGrupos(participantes, cantidadDeGrupos);
    mostrarGrupos(gruposActuales, elementoResultado, moverPersona);
    elementoAnuncio.textContent = `Se generaron ${gruposActuales.length} grupos.`;
    mostrarOverlayDeResultado(formulario, overlay);
  });
}

// --- Lanzamiento de moneda ---

function lanzarMoneda() {
  return Math.random() < 0.5 ? "Cara" : "Cruz";
}

function lanzarMonedas(cantidad) {
  const resultados = [];
  for (let i = 0; i < cantidad; i++) {
    resultados.push(lanzarMoneda());
  }
  return resultados;
}

function contarCarasYCruces(resultados) {
  let caras = 0;
  let cruces = 0;
  resultados.forEach((resultado) => {
    if (resultado === "Cara") {
      caras++;
    } else {
      cruces++;
    }
  });
  return { caras, cruces };
}

// Tope defensivo: nada en el spec pide un límite, pero sin uno un error de
// tipeo (ej. un cero de más) podría pedirle al navegador dibujar cientos de
// miles de casilleros y trabar la página.
const MAXIMO_LANZAMIENTOS = 10000;

function validarDatosMoneda(cantidad) {
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return "La cantidad de lanzamientos debe ser al menos 1.";
  }
  if (cantidad > MAXIMO_LANZAMIENTOS) {
    return `Como máximo, ${MAXIMO_LANZAMIENTOS.toLocaleString("es-AR")} lanzamientos por vez.`;
  }
  return null;
}

function mostrarResultadoMoneda(resultados, elementoResumen, elementoResultado) {
  const { caras, cruces } = contarCarasYCruces(resultados);
  elementoResumen.textContent = `Caras: ${caras} — Cruces: ${cruces}`;

  elementoResultado.innerHTML = "";
  resultados.forEach((resultado) => {
    elementoResultado.appendChild(crearCasillero(resultado));
  });
}

function configurarLanzamientoDeMoneda() {
  const formulario = document.getElementById("form-lanzamiento-moneda");
  const overlay = document.getElementById("overlay-lanzamiento-moneda");
  const elementoError = document.getElementById("error-lanzamiento-moneda");
  const elementoResumen = document.getElementById("resumen-moneda");
  const elementoResultado = document.getElementById("resultado-lanzamiento-moneda");
  const elementoAnuncio = document.getElementById("anuncio-lanzamiento-moneda");
  const campoCantidad = document.getElementById("moneda-cantidad");

  configurarBotonVolverDeResultado("btn-volver-resultado-moneda", formulario, overlay);

  document.getElementById("btn-lanzamiento-moneda").addEventListener("click", () => {
    ocultarOverlayDeResultado(formulario, overlay);
  });

  formulario.addEventListener("reset", () => {
    elementoError.hidden = true;
  });

  formulario.querySelectorAll(".boton-atajo").forEach((boton) => {
    boton.addEventListener("click", () => {
      campoCantidad.value = boton.dataset.cantidad;
    });
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const cantidad = Number(campoCantidad.value);
    const mensajeError = validarDatosMoneda(cantidad);

    if (mensajeError) {
      elementoError.textContent = mensajeError;
      elementoError.hidden = false;
      return;
    }

    elementoError.hidden = true;
    const resultados = lanzarMonedas(cantidad);
    mostrarResultadoMoneda(resultados, elementoResumen, elementoResultado);
    elementoAnuncio.textContent = `${elementoResumen.textContent}.`;
    mostrarOverlayDeResultado(formulario, overlay);
  });
}

// --- Mezclador ---

function validarDatosMezclador(elementos) {
  if (elementos.length < 2) {
    return "Agregá al menos 2 elementos para mezclar.";
  }
  return null;
}

function configurarMezclador() {
  configurarListaDeOpciones("contenedor-mezclador");

  const formulario = document.getElementById("form-mezclador");
  const overlay = document.getElementById("overlay-mezclador");
  const elementoError = document.getElementById("error-mezclador");
  const elementoResultado = document.getElementById("resultado-mezclador");
  const elementoAnuncio = document.getElementById("anuncio-mezclador");
  const contenedorElementos = document.getElementById("contenedor-mezclador");

  configurarBotonVolverDeResultado("btn-volver-resultado-mezclador", formulario, overlay);

  document.getElementById("btn-mezclador").addEventListener("click", () => {
    ocultarOverlayDeResultado(formulario, overlay);
  });

  formulario.addEventListener("reset", () => {
    reiniciarListaDeOpciones(contenedorElementos);
    elementoError.hidden = true;
  });

  // La usan tanto el botón "Mezclar" del formulario como "Volver a mezclar"
  // de adentro del resultado, así no se repite la misma lógica dos veces.
  function mezclarYMostrar() {
    const elementos = obtenerOpcionesValidas(contenedorElementos);
    const mensajeError = validarDatosMezclador(elementos);

    if (mensajeError) {
      elementoError.textContent = mensajeError;
      elementoError.hidden = false;
      return;
    }

    elementoError.hidden = true;
    const mezclados = mezclarLista(elementos);

    elementoResultado.innerHTML = "";
    mezclados.forEach((elemento) => {
      elementoResultado.appendChild(crearCasillero(elemento));
    });

    elementoAnuncio.textContent = `Orden mezclado: ${mezclados.join(", ")}.`;
    mostrarOverlayDeResultado(formulario, overlay);
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mezclarYMostrar();
  });

  document.getElementById("btn-volver-a-mezclar").addEventListener("click", mezclarYMostrar);
}

// --- Torneos (base: eliminación directa) ---
// Una "ronda" es un array de partidos: { jugadorA, jugadorB, ganador }.
// jugadorA/jugadorB puede ser: un nombre (string), null (bye: no juega nadie
// ahí, solo tiene sentido en la ronda 1), o undefined (todavía no se sabe
// quién llega ahí, esperando el resultado de la ronda anterior).
//
// El tamaño de la llave (4, 8, 16 o 32) se elige antes de cargar nombres,
// como en el selector de nombres o el generador de grupos — por eso siempre
// es una potencia de 2 y no hace falta calcularla a partir de la lista.

// Nombre de cada ronda contando "para atrás" desde la final: la final siempre
// se llama Final, la anterior Semifinal, la anterior a esa Cuartos de final,
// la anterior a esa Octavos de final. Lo que sobra (solo pasa con 32
// jugadores) se llama "Ronda" a secas.
function nombreDeRonda(cantidadDeRondas, indiceRonda) {
  const rondasHastaLaFinal = cantidadDeRondas - 1 - indiceRonda;
  switch (rondasHastaLaFinal) {
    case 0:
      return "Final";
    case 1:
      return "Semifinal";
    case 2:
      return "Cuartos de final";
    case 3:
      return "Octavos de final";
    default:
      return `Ronda ${indiceRonda + 1}`;
  }
}

function generarLlaveDeTorneo(participantes, tamanoDeLlave) {
  const cantidadDeByes = tamanoDeLlave - participantes.length;

  const casilleros = mezclarLista(participantes);
  for (let i = 0; i < cantidadDeByes; i++) {
    casilleros.push(null); // bye
  }
  const casillerosMezclados = mezclarLista(casilleros);

  const primeraRonda = [];
  for (let i = 0; i < casillerosMezclados.length; i += 2) {
    const jugadorA = casillerosMezclados[i];
    const jugadorB = casillerosMezclados[i + 1];
    let ganador = null;
    if (jugadorA === null) ganador = jugadorB;
    else if (jugadorB === null) ganador = jugadorA;
    primeraRonda.push({ jugadorA, jugadorB, ganador });
  }

  const rondas = [primeraRonda];
  let cantidadDePartidosSiguiente = primeraRonda.length / 2;
  while (cantidadDePartidosSiguiente >= 1) {
    const ronda = [];
    for (let i = 0; i < cantidadDePartidosSiguiente; i++) {
      ronda.push({ jugadorA: undefined, jugadorB: undefined, ganador: null });
    }
    rondas.push(ronda);
    cantidadDePartidosSiguiente /= 2;
  }

  // Los "bye" de la ronda 1 ya tienen ganador: los hacemos avanzar de una vez.
  primeraRonda.forEach((partido, indice) => {
    if (partido.ganador !== null) {
      avanzarGanador(rondas, 0, indice, partido.ganador);
    }
  });

  return rondas;
}

// Pone al ganador de un partido en el casillero que le corresponde en la
// ronda siguiente (si la hay: la final no tiene ronda siguiente).
function avanzarGanador(rondas, indiceRonda, indicePartido, ganador) {
  const siguienteRonda = rondas[indiceRonda + 1];
  if (!siguienteRonda) return;

  const indicePartidoSiguiente = Math.floor(indicePartido / 2);
  const partidoSiguiente = siguienteRonda[indicePartidoSiguiente];

  if (indicePartido % 2 === 0) {
    partidoSiguiente.jugadorA = ganador;
  } else {
    partidoSiguiente.jugadorB = ganador;
  }
}

// Deshace lo que un ganador ya haya provocado más adelante en la llave.
// Necesario para poder corregir un partido: si no se deshiciera, quedaría
// un ganador "fantasma" en una ronda futura basado en una elección vieja.
// También deshace el partido por el tercer puesto si lo que se está
// corrigiendo es justo la semifinal de la que salió ese perdedor.
function deshacerAvanceDeGanador(rondas, partidoPorTercerPuesto, indiceRonda, indicePartido) {
  const siguienteRonda = rondas[indiceRonda + 1];
  if (!siguienteRonda) return;

  const indicePartidoSiguiente = Math.floor(indicePartido / 2);
  const partidoSiguiente = siguienteRonda[indicePartidoSiguiente];

  if (indicePartido % 2 === 0) {
    partidoSiguiente.jugadorA = undefined;
  } else {
    partidoSiguiente.jugadorB = undefined;
  }

  if (partidoSiguiente.ganador !== null) {
    const partidoSiguienteEraSemifinal = indiceRonda + 1 === rondas.length - 2;
    if (partidoSiguienteEraSemifinal) {
      limpiarCasilleroDeTercerPuesto(partidoPorTercerPuesto, indicePartidoSiguiente);
    }
    deshacerAvanceDeGanador(rondas, partidoPorTercerPuesto, indiceRonda + 1, indicePartidoSiguiente);
    partidoSiguiente.ganador = null;
  }
}

function limpiarCasilleroDeTercerPuesto(partidoPorTercerPuesto, indiceDeSemifinal) {
  if (indiceDeSemifinal === 0) {
    partidoPorTercerPuesto.jugadorA = undefined;
  } else {
    partidoPorTercerPuesto.jugadorB = undefined;
  }
  partidoPorTercerPuesto.ganador = null;
}

function elegirGanador(rondas, partidoPorTercerPuesto, indiceRonda, indicePartido, ganador) {
  const partido = rondas[indiceRonda][indicePartido];
  if (partido.ganador === ganador) return; // ya estaba elegido este mismo

  if (partido.ganador !== null) {
    deshacerAvanceDeGanador(rondas, partidoPorTercerPuesto, indiceRonda, indicePartido);
  }

  partido.ganador = ganador;
  avanzarGanador(rondas, indiceRonda, indicePartido, ganador);

  // El perdedor de una semifinal juega el partido por el tercer puesto.
  const esSemifinal = indiceRonda === rondas.length - 2;
  if (esSemifinal) {
    const perdedor = partido.jugadorA === ganador ? partido.jugadorB : partido.jugadorA;
    if (indicePartido === 0) {
      partidoPorTercerPuesto.jugadorA = perdedor;
    } else {
      partidoPorTercerPuesto.jugadorB = perdedor;
    }
    partidoPorTercerPuesto.ganador = null; // por si ya se había decidido con el perdedor anterior
  }
}

function elegirGanadorDeTercerPuesto(partidoPorTercerPuesto, ganador) {
  partidoPorTercerPuesto.ganador = ganador;
}

// Solo para mostrarlo en pantalla: si el partido ya tiene ganador y quedó
// en la posición B, devuelve una copia con las posiciones invertidas para
// que el ganador se dibuje siempre primero. No toca el partido real —
// hacer clic en cualquiera de los dos nombres sigue eligiendo ese nombre,
// la posición no cambia qué se elige.
function ponerGanadorPrimero(partido) {
  if (!partido.ganador || partido.jugadorA === partido.ganador) {
    return partido;
  }
  return { jugadorA: partido.jugadorB, jugadorB: partido.jugadorA, ganador: partido.ganador };
}

function validarDatosTorneo(participantes) {
  if (participantes.length < 2) {
    return "Agregá al menos 2 participantes para armar un torneo.";
  }
  return null;
}

// A diferencia de la lista dinámica de otras herramientas, acá la cantidad
// de campos es fija (la eligió el usuario en el menú de tamaño): se dibujan
// todos de una, no van apareciendo de a uno.
function generarCamposDeParticipantesTorneo(contenedor, cantidad) {
  contenedor.innerHTML = "";
  for (let numero = 1; numero <= cantidad; numero++) {
    const campo = document.createElement("div");
    campo.className = "campo campo-opcion";

    const etiqueta = document.createElement("label");
    etiqueta.setAttribute("for", `torneo-participante-${numero}`);
    etiqueta.textContent = `Participante ${numero}`;

    const input = document.createElement("input");
    input.type = "text";
    input.id = `torneo-participante-${numero}`;

    campo.appendChild(etiqueta);
    campo.appendChild(input);
    contenedor.appendChild(campo);
  }
}

// Los campos vacíos no cuentan como participante (van a ser "bye" en la
// llave). No hace falta un tope: la cantidad de campos ya es el tamaño elegido.
function obtenerParticipantesDeTorneo(contenedor) {
  const inputs = contenedor.querySelectorAll("input[type='text']");
  const participantes = [];
  inputs.forEach((input) => {
    const texto = input.value.trim();
    if (contieneAlMenosUnaLetra(texto)) {
      participantes.push(texto);
    }
  });
  return participantes;
}

function crearElementoDePartido(partido, alElegir) {
  const contenedor = document.createElement("div");
  contenedor.className = "torneo-partido";

  function crearBotonJugador(jugador) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "torneo-jugador";
    if (jugador === partido.ganador) {
      boton.classList.add("torneo-jugador--ganador");
    }
    boton.textContent = jugador;
    boton.addEventListener("click", () => alElegir(jugador));
    return boton;
  }

  function crearMarcadorPorDefinir() {
    const marcador = document.createElement("span");
    marcador.className = "torneo-jugador--tbd";
    marcador.textContent = "Por definir";
    return marcador;
  }

  const esBye = partido.jugadorA === null || partido.jugadorB === null;

  if (esBye) {
    const ganadorPorBye = partido.jugadorA === null ? partido.jugadorB : partido.jugadorA;
    contenedor.appendChild(crearBotonJugador(ganadorPorBye));
    const etiquetaBye = document.createElement("span");
    etiquetaBye.className = "torneo-bye-etiqueta";
    etiquetaBye.textContent = "(pasa libre)";
    contenedor.appendChild(etiquetaBye);
    return contenedor;
  }

  contenedor.appendChild(
    partido.jugadorA === undefined ? crearMarcadorPorDefinir() : crearBotonJugador(partido.jugadorA)
  );

  const separador = document.createElement("span");
  separador.className = "torneo-vs";
  separador.textContent = "vs";
  contenedor.appendChild(separador);

  contenedor.appendChild(
    partido.jugadorB === undefined ? crearMarcadorPorDefinir() : crearBotonJugador(partido.jugadorB)
  );

  return contenedor;
}

// Arma las columnas de UNA mitad de la llave (todas las rondas salvo la
// final, que va sola en el centro). Cada columna se queda con la mitad de
// los partidos de esa ronda que le toca a este lado, pero recordando el
// índice real de cada partido dentro de su ronda completa (se necesita para
// avisar bien de cuál partido se hizo clic).
function armarColumnasDeMitad(rondas, esLadoDerecho) {
  const columnas = [];

  for (let indiceRonda = 0; indiceRonda < rondas.length - 1; indiceRonda++) {
    const ronda = rondas[indiceRonda];
    const mitad = ronda.length / 2;
    const indiceInicial = esLadoDerecho ? mitad : 0;

    const partidos = ronda.slice(indiceInicial, indiceInicial + mitad).map((partido, posicion) => ({
      partido,
      indicePartido: indiceInicial + posicion,
    }));

    columnas.push({ indiceRonda, partidos });
  }

  // El lado derecho se dibuja "al revés": la columna más cercana al centro
  // es la que tiene un solo partido (la que alimenta la final).
  if (esLadoDerecho) {
    columnas.reverse();
  }

  return columnas;
}

// El nombre de la etapa ("Semifinal", "Cuartos de final"...) no es un título
// fijo arriba de la columna: es hijo del primer partido/pareja, posicionado
// con CSS justo encima de él. Así sigue a ese elemento adonde termine
// quedando verticalmente.
function crearTituloDeEtapa(texto) {
  const titulo = document.createElement("h3");
  titulo.className = "torneo-titulo-etapa";
  titulo.textContent = texto;
  return titulo;
}

// "Reloj de arena": el espacio entre partidos se duplica en cada ronda hacia
// el centro. Es la única forma de que el partido de la ronda siguiente caiga
// exactamente en el punto medio de los dos que lo alimentan: si dos
// partidos están separados una distancia S (de centro a centro), el punto
// medio entre ellos y el punto medio del próximo par quedan separados 2×S.
// Como consecuencia, cada columna termina midiendo menos que la anterior.
const ALTURA_PARTIDO_TORNEO_REM = 4.4; // debe coincidir con .torneo-partido
const GAP_BASE_TORNEO_REM = 1; // separación entre partidos en la primera ronda

function calcularGapDeRonda(indiceRonda) {
  const espaciadoCentroACentro =
    (ALTURA_PARTIDO_TORNEO_REM + GAP_BASE_TORNEO_REM) * Math.pow(2, indiceRonda);
  return espaciadoCentroACentro - ALTURA_PARTIDO_TORNEO_REM;
}

// Una columna con más de un partido se dibuja en pares (para poder trazar la
// línea conectora en forma de "codo" entre cada dos partidos y el siguiente).
// La columna con un solo partido (la última antes de la final) lleva una
// línea recta simple en vez de un codo.
function crearColumnaDeTorneo(columnaInfo, cantidadDeRondas, esLadoDerecho, alElegirGanador) {
  const columna = document.createElement("div");
  columna.className = "torneo-columna";

  const contenedorPartidos = document.createElement("div");
  contenedorPartidos.className = "torneo-columna-partidos";

  const gapDeEstaRonda = calcularGapDeRonda(columnaInfo.indiceRonda);
  contenedorPartidos.style.gap = `${gapDeEstaRonda}rem`;

  const ladoTexto = esLadoDerecho ? "derecha" : "izquierda";
  const esColumnaDeUnSoloPartido = columnaInfo.partidos.length === 1;
  const nombreDeEstaEtapa = nombreDeRonda(cantidadDeRondas, columnaInfo.indiceRonda);
  let esElPrimerElementoDeLaColumna = true;

  for (let i = 0; i < columnaInfo.partidos.length; i += esColumnaDeUnSoloPartido ? 1 : 2) {
    const item = columnaInfo.partidos[i];
    const elementoPartido = crearElementoDePartido(item.partido, (jugador) => {
      alElegirGanador(columnaInfo.indiceRonda, item.indicePartido, jugador);
    });

    if (esColumnaDeUnSoloPartido) {
      elementoPartido.classList.add(`torneo-partido--conector-${ladoTexto}`);
      if (esElPrimerElementoDeLaColumna) {
        elementoPartido.appendChild(crearTituloDeEtapa(nombreDeEstaEtapa));
        esElPrimerElementoDeLaColumna = false;
      }
      contenedorPartidos.appendChild(elementoPartido);
      continue;
    }

    const itemPareja = columnaInfo.partidos[i + 1];
    const elementoPareja = crearElementoDePartido(itemPareja.partido, (jugador) => {
      alElegirGanador(columnaInfo.indiceRonda, itemPareja.indicePartido, jugador);
    });

    const par = document.createElement("div");
    par.className = `torneo-par torneo-par--${ladoTexto}`;
    par.style.gap = `${gapDeEstaRonda}rem`;
    par.appendChild(elementoPartido);
    par.appendChild(elementoPareja);

    if (esElPrimerElementoDeLaColumna) {
      par.appendChild(crearTituloDeEtapa(nombreDeEstaEtapa));
      esElPrimerElementoDeLaColumna = false;
    }

    contenedorPartidos.appendChild(par);
  }

  columna.appendChild(contenedorPartidos);
  return columna;
}

function mostrarLlaveDeTorneo(rondas, partidoPorTercerPuesto, elementoResultado, alElegirGanador, alElegirGanadorTercerPuestoUI) {
  elementoResultado.innerHTML = "";

  const llaveDoble = document.createElement("div");
  llaveDoble.className = "torneo-llave-doble";

  const mitadIzquierda = document.createElement("div");
  mitadIzquierda.className = "torneo-mitad torneo-mitad--izquierda";
  armarColumnasDeMitad(rondas, false).forEach((columnaInfo) => {
    mitadIzquierda.appendChild(crearColumnaDeTorneo(columnaInfo, rondas.length, false, alElegirGanador));
  });

  const mitadDerecha = document.createElement("div");
  mitadDerecha.className = "torneo-mitad torneo-mitad--derecha";
  armarColumnasDeMitad(rondas, true).forEach((columnaInfo) => {
    mitadDerecha.appendChild(crearColumnaDeTorneo(columnaInfo, rondas.length, true, alElegirGanador));
  });

  const centro = document.createElement("div");
  centro.className = "torneo-centro";

  const partidoFinal = rondas[rondas.length - 1][0];

  if (partidoFinal.ganador) {
    const banner = document.createElement("p");
    banner.className = "torneo-campeon";
    banner.textContent = `🏆 Campeón: ${partidoFinal.ganador}`;
    centro.appendChild(banner);
  }

  const tituloFinal = document.createElement("h3");
  tituloFinal.className = "torneo-titulo-final";
  tituloFinal.textContent = "Final";
  centro.appendChild(tituloFinal);

  const elementoFinal = crearElementoDePartido(partidoFinal, (jugador) =>
    alElegirGanador(rondas.length - 1, 0, jugador)
  );
  elementoFinal.classList.add("torneo-partido--final", "torneo-partido--horizontal");
  centro.appendChild(elementoFinal);

  const tituloTercerPuesto = document.createElement("h3");
  tituloTercerPuesto.className = "torneo-tercer-puesto-titulo";
  tituloTercerPuesto.textContent = "Tercer puesto";
  centro.appendChild(tituloTercerPuesto);

  // Solo para mostrarlo: si ya hay un ganador, lo ponemos primero (no
  // modifica partidoPorTercerPuesto, es una copia nada más para dibujar).
  const vistaDeTercerPuesto = ponerGanadorPrimero(partidoPorTercerPuesto);
  const elementoTercerPuesto = crearElementoDePartido(vistaDeTercerPuesto, alElegirGanadorTercerPuestoUI);
  elementoTercerPuesto.classList.add("torneo-partido--horizontal");
  centro.appendChild(elementoTercerPuesto);

  llaveDoble.appendChild(mitadIzquierda);
  llaveDoble.appendChild(centro);
  llaveDoble.appendChild(mitadDerecha);

  elementoResultado.appendChild(llaveDoble);
}

function configurarTorneo() {
  const formulario = document.getElementById("form-torneo");
  const zonaResultado = document.getElementById("torneo-resultado-zona");
  const seccionEleccionTamano = document.getElementById("torneo-eleccion-tamano");
  const botonVolver = document.getElementById("btn-volver-torneo");
  const elementoError = document.getElementById("error-torneo");
  const elementoResultado = document.getElementById("resultado-torneo");
  const elementoAnuncio = document.getElementById("anuncio-torneo");
  const contenedorParticipantes = document.getElementById("contenedor-participantes-torneo");

  let rondasActuales = [];
  let partidoPorTercerPuestoActual = { jugadorA: undefined, jugadorB: undefined, ganador: null };
  let tamanoElegido = 0;

  // El bracket necesita todo el ancho de la página, así que a diferencia de
  // las otras herramientas no usa el overlay flotante: acá "mostrar el
  // resultado" es simplemente destapar esta zona de la página, sin difuminar
  // nada ni superponer una tarjeta encima del formulario.
  function mostrarResultado() {
    formulario.hidden = true;
    zonaResultado.hidden = false;
  }

  function ocultarResultado() {
    zonaResultado.hidden = true;
    elementoResultado.innerHTML = "";
  }

  // Mismo patrón que en el selector de nombres y en grupos: primero se elige
  // una opción en una pantalla aparte (acá, cuántos jugadores), y recién
  // después aparece el formulario — ya con la cantidad de campos correcta.
  function mostrarEleccionDeTamano() {
    formulario.hidden = true;
    elementoError.hidden = true;
    ocultarResultado();
    seccionEleccionTamano.hidden = false;
    botonVolver.hidden = false;
  }

  function elegirTamano(tamano) {
    tamanoElegido = tamano;
    generarCamposDeParticipantesTorneo(contenedorParticipantes, tamano);
    seccionEleccionTamano.hidden = true;
    formulario.hidden = false;
    botonVolver.hidden = true;
  }

  seccionEleccionTamano.querySelectorAll(".herramienta").forEach((boton) => {
    boton.addEventListener("click", () => elegirTamano(Number(boton.dataset.tamano)));
  });

  document.getElementById("btn-cambiar-tamano-torneo").addEventListener("click", mostrarEleccionDeTamano);
  document.getElementById("btn-torneo").addEventListener("click", mostrarEleccionDeTamano);

  document.getElementById("btn-volver-resultado-torneo").addEventListener("click", () => {
    zonaResultado.hidden = true;
    formulario.hidden = false;
  });

  function redibujar() {
    mostrarLlaveDeTorneo(rondasActuales, partidoPorTercerPuestoActual, elementoResultado, alElegirGanador, alElegirGanadorTercerPuesto);
  }

  function alElegirGanador(indiceRonda, indicePartido, jugador) {
    elegirGanador(rondasActuales, partidoPorTercerPuestoActual, indiceRonda, indicePartido, jugador);
    redibujar();

    const rondaFinal = rondasActuales[rondasActuales.length - 1];
    if (rondaFinal[0].ganador) {
      elementoAnuncio.textContent = `Campeón: ${rondaFinal[0].ganador}.`;
    } else {
      elementoAnuncio.textContent = `${jugador} avanza de ronda.`;
    }
  }

  function alElegirGanadorTercerPuesto(jugador) {
    elegirGanadorDeTercerPuesto(partidoPorTercerPuestoActual, jugador);
    redibujar();
    elementoAnuncio.textContent = `Tercer puesto: ${jugador}.`;
  }

  formulario.addEventListener("reset", () => {
    generarCamposDeParticipantesTorneo(contenedorParticipantes, tamanoElegido);
    elementoError.hidden = true;
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const participantes = obtenerParticipantesDeTorneo(contenedorParticipantes);
    const mensajeError = validarDatosTorneo(participantes);

    if (mensajeError) {
      elementoError.textContent = mensajeError;
      elementoError.hidden = false;
      return;
    }

    elementoError.hidden = true;
    rondasActuales = generarLlaveDeTorneo(participantes, tamanoElegido);
    partidoPorTercerPuestoActual = { jugadorA: undefined, jugadorB: undefined, ganador: null };
    redibujar();
    elementoAnuncio.textContent = "Llave del torneo generada.";
    mostrarResultado();

    // Recién ahora que la zona de resultado dejó de estar hidden, scrollWidth
    // y clientWidth reflejan el tamaño real ya renderizado. Movemos el
    // scroll (no el CSS) para arrancar con la Final centrada en pantalla en
    // vez del extremo izquierdo — sin esto, seguimos viendo Ronda 1 primero.
    elementoResultado.scrollLeft = (elementoResultado.scrollWidth - elementoResultado.clientWidth) / 2;
  });
}
