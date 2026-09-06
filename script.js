// FASE 3: primera herramienta con lógica real, el generador de números.
// Acá van a ir sumándose el resto de las herramientas (mezclarLista, crearGrupos, etc.)
// a medida que las construyamos fase por fase.

document.addEventListener("DOMContentLoaded", () => {
  console.log("RandomBox cargó correctamente.");
  configurarNavegacionHerramientas();
  configurarGeneradorDeNumeros();
});

// --- Navegación entre la pantalla de inicio y la pantalla de una herramienta ---
// Por ahora solo el generador de números tiene su propia pantalla; el resto de
// las tarjetas se van a ir conectando de la misma forma en las próximas fases.
function configurarNavegacionHerramientas() {
  const botonNumeros = document.getElementById("btn-generador-numeros");
  const botonVolver = document.getElementById("btn-volver-numeros");
  const pantallaInicio = document.getElementById("pantalla-inicio");
  const notaConstruccion = document.getElementById("nota-construccion");
  const pantallaNumeros = document.getElementById("pantalla-generador-numeros");

  botonNumeros.addEventListener("click", () => {
    pantallaInicio.hidden = true;
    notaConstruccion.hidden = true;
    pantallaNumeros.hidden = false;
  });

  botonVolver.addEventListener("click", () => {
    pantallaNumeros.hidden = true;
    pantallaInicio.hidden = false;
    notaConstruccion.hidden = false;
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

// Crea el <span> que muestra un número dentro del resultado.
function crearCasilleroDeNumero(contenido) {
  const casillero = document.createElement("span");
  casillero.className = "numero-slot";
  casillero.textContent = contenido;
  return casillero;
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
    const casillero = crearCasilleroDeNumero("?");
    elementoResultado.appendChild(casillero);

    const intervaloDeGiro = setInterval(() => {
      casillero.textContent = generarNumeroAleatorio(minimo, maximo);
    }, velocidadDelGiro);

    const duracionDeEsteNumero = duracionDelPrimero + indice * demoraEntreNumeros;

    setTimeout(() => {
      clearInterval(intervaloDeGiro);
      casillero.textContent = numeroFinal;
      casillero.classList.add("numero-revelado");

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
