// FASE 3: primera herramienta con lógica real, el generador de números.
// Acá van a ir sumándose el resto de las herramientas (mezclarLista, crearGrupos, etc.)
// a medida que las construyamos fase por fase.

document.addEventListener("DOMContentLoaded", () => {
  console.log("RandomBox cargó correctamente.");
  configurarNavegacionHerramientas();
  configurarGeneradorDeNumeros();
  configurarSelectorDeNombres();
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
}

// --- Utilidades compartidas entre herramientas ---

// Crea el <span> que muestra un elemento del resultado (un número, un nombre, etc.).
function crearCasillero(contenido) {
  const casillero = document.createElement("span");
  casillero.className = "resultado-slot";
  casillero.textContent = contenido;
  return casillero;
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
  const botonGenerar = formulario.querySelector(".boton-generar");
  const elementoError = document.getElementById("error-generador-numeros");
  const elementoResultado = document.getElementById("resultado-generador-numeros");
  const elementoAnuncio = document.getElementById("anuncio-resultado-numeros");

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
      elementoResultado.innerHTML = "";
      return;
    }

    elementoError.hidden = true;
    const numeros = generarNumeros(minimo, maximo, cantidad, permitirRepetidos);

    botonGenerar.disabled = true;
    mostrarResultadoRuleta(numeros, minimo, maximo, elementoResultado, elementoAnuncio, () => {
      botonGenerar.disabled = false;
    });
  });
}

// --- Selector de nombres/palabras ---

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
  const contenedor = document.getElementById("contenedor-opciones");
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
// Opción 3" nunca debería verse).
function renumerarCampos(contenedor) {
  const campos = contenedor.querySelectorAll(".campo-opcion");
  campos.forEach((campo, indice) => {
    const numero = indice + 1;
    campo.querySelector("label").setAttribute("for", `opcion-${numero}`);
    campo.querySelector("label").textContent = `Opción ${numero}`;
    campo.querySelector(".input-opcion").id = `opcion-${numero}`;
  });
}

// Un solo listener en el contenedor alcanza para todos los campos, incluso
// los que todavía no existen (esto se llama "delegación de eventos").
function configurarListaDeOpciones() {
  const contenedor = document.getElementById("contenedor-opciones");

  contenedor.addEventListener("input", (evento) => {
    if (evento.target.classList.contains("input-opcion")) {
      sincronizarListaDeOpciones(evento.target);
    }
  });
}

// El último campo (todavía vacío, esperando la próxima opción) queda afuera
// solo, porque un texto vacío no tiene ninguna letra.
function obtenerOpcionesValidas() {
  const inputs = document.querySelectorAll("#contenedor-opciones .input-opcion");
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

function configurarSelectorDeNombres() {
  configurarListaDeOpciones();

  const formulario = document.getElementById("form-selector-nombres");
  const botonElegir = formulario.querySelector(".boton-generar");
  const elementoError = document.getElementById("error-selector-nombres");
  const elementoResultado = document.getElementById("resultado-selector-nombres");
  const elementoAnuncio = document.getElementById("anuncio-resultado-selector");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const opciones = obtenerOpcionesValidas();
    const cantidad = Number(document.getElementById("selector-cantidad").value);
    const permitirRepetidos = document.getElementById("selector-repetidos").checked;

    const mensajeError = validarDatosSelector(opciones, cantidad, permitirRepetidos);

    if (mensajeError) {
      elementoError.textContent = mensajeError;
      elementoError.hidden = false;
      elementoResultado.innerHTML = "";
      return;
    }

    elementoError.hidden = true;
    const elegidos = elegirElementos(opciones, cantidad, permitirRepetidos);

    botonElegir.disabled = true;
    mostrarConSuspenso(elegidos, elementoResultado, elementoAnuncio, () => {
      botonElegir.disabled = false;
    });
  });
}
