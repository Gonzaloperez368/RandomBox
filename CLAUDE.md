# RandomBox — guía para Claude Code

## Qué es RandomBox

RandomBox es una caja de herramientas web para elegir al azar, organizar personas y tomar decisiones: generador de números, selector de nombres/palabras, generador de grupos, lanzamiento de moneda, mezclador de listas y torneos. El dueño del proyecto está aprendiendo JavaScript mientras lo construye, así que el "cómo" importa tanto como el "qué".

## Cómo trabajar acá (modo de enseñanza)

- Antes de cada cambio, explicar brevemente qué se va a construir y qué conceptos de JS están en juego.
- Después del cambio, explicar las partes importantes del código.
- Decir cómo probar lo que se acaba de hacer.
- Si algo falla, entender el error junto con el usuario antes de reescribir código a lo grande.
- De vez en cuando, dejar una tarea chica (5-10 líneas) para que el usuario la escriba él mismo.
- No convertir cada paso en una clase teórica — la prioridad es aprender mientras se construye.

## Reglas de arquitectura (no negociables por ahora)

- Solo HTML5, CSS3 y JavaScript vanilla. Nada de React, Vue, Angular, Svelte ni otros frameworks.
- Sin `package.json`, sin npm, sin build step. El proyecto se abre con doble clic en `index.html`.
- Estructura de archivos plana (sin subcarpetas) hasta que realmente haga falta.
- `<script>` clásico, nunca `type="module"`: los módulos ES no cargan bajo el protocolo `file://`, y el sitio tiene que poder abrirse sin servidor.
- Sin CDNs externos, sin fuentes o íconos remotos.
- Sin `fetch()` a archivos locales (también lo bloquea `file://`); los datos viven en arrays/objetos de JS.

## Las 6 herramientas

1. Generador de números
2. Selector de nombres/palabras (incluye el modo "ruleta" — **no** es una herramienta separada)
3. Generador de grupos
4. Lanzamiento de moneda
5. Mezclador
6. Torneos

## Roadmap

- [x] FASE 1 — Estructura básica
- [x] FASE 2 — Diseño general
- [x] FASE 3 — Generador de números (modo único: Ruleta)
- [x] FASE 4 — Selector de nombres + ruleta
- [x] FASE 5 — Generador de grupos
- [x] FASE 6 — Lanzamiento de moneda
- [x] FASE 7 — Mezclador
- [~] FASE 8 — Base de torneos (generar llave + marcar ganadores listo; falta editar nombres e intercambiar participantes)
- [ ] FASE 9 — Testing y correcciones
- [ ] FASE 10 — Mejoras visuales y responsive
- [ ] FASE 11 — Preparación para publicación

No construir varias fases a la vez, aunque el siguiente paso parezca obvio.

## Cuándo pedir permiso

- Cambios chicos y claramente necesarios: seguir sin preguntar.
- Cambios grandes (framework nuevo, rediseño completo, base de datos, autenticación, muchas dependencias nuevas, eliminar una funcionalidad, cambiar la estructura principal): explicar opciones y esperar confirmación.

## Convenciones de código

- Identificadores (funciones, variables) en inglés; comentarios y textos de la interfaz en español.
- Funciones chicas y con un solo propósito (`generarNumero()`, `mezclarLista()`, `crearGrupos()`, etc.).
- Comentarios solo cuando explican un "por qué" no obvio, no un "qué".
- Nombres de errores comprensibles para el usuario final — nunca mostrar `NaN`, `undefined` o `TypeError` en la interfaz.

## Git

- Commits pequeños y descriptivos.
- Usar Git como punto de control antes de cambios grandes.
- Nunca ejecutar comandos destructivos de Git sin explicar primero qué hacen.
- Nunca modificar la configuración global de Git (`git config --global`) sin permiso explícito.

## Privacidad

- Todo corre localmente en el navegador.
- Nunca enviar las listas o nombres que el usuario escribe a un servidor externo.
- Nunca incluir contraseñas, API keys ni tokens en el código.

## Testing

Para cada herramienta, cuando tenga lógica, probar: caso normal, caso límite, caso inválido, caso vacío y reglas de repetición (si aplica).

## Sistema de diseño (definido en FASE 2, revisado después)

Estilo actual: **identidad violeta/azul-violeta sobre neutros claros**, con acentos de color chicos y contenidos (no "arcoíris"). Reutilizar estas variables de `style.css` en vez de inventar colores nuevos:

- `--color-primary`, `--color-primary-hover`, `--color-background`, `--color-surface`, `--color-text`, `--color-text-secondary`, `--color-border`: paleta base.
- Un color de acento por herramienta (`--color-numeros`, `--color-nombres`, `--color-grupos`, `--color-moneda`, `--color-mezclador`, `--color-torneos`) más su variante `-bg` (versión suave): se usan solo como fondo de la placa detrás del ícono (`.herramienta-icono`), nunca pintando toda la tarjeta ni como único indicador (siempre acompañados de ícono y texto).
- Cada herramienta tiene un emoji como ícono decorativo (`aria-hidden="true"`) — se evaluó reemplazarlos por SVG inline pero se pospuso para no sumar complejidad de golpe; sigue siendo una mejora pendiente válida para el futuro.
- Las tarjetas (`.herramienta`) ahora sí tienen `cursor: pointer`, hover (elevación + sombra + borde) y `:focus-visible` preparado en el CSS — es una señal visual intencional de que van a ser clickeables, aunque la navegación real todavía no está conectada (son `<li>`, no `<a>`/`<button>`, así que no se les agregó `tabindex`: eso se resuelve solo cuando pasen a ser enlaces reales en una fase futura).
- Grid de la sección "Herramientas": mobile-first con breakpoints explícitos en `min-width: 640px` (2 columnas) y `min-width: 960px` (3 columnas), no `auto-fit`.

## Patrón de navegación entre pantallas

Una sola página (`index.html`), sin router ni módulos: cada herramienta es un `<section class="pantalla-herramienta" hidden>` que arranca oculto. La tarjeta de esa herramienta en `#pantalla-inicio` se convierte en un `<button>` (no un `<a>`, no queda historial/URL propia) que oculta `#pantalla-inicio` + `#nota-construccion` y muestra la pantalla de la herramienta; un botón "← Volver" hace lo inverso. Ver `configurarNavegacionHerramientas()` en `script.js`. Las próximas fases (4 a 8) deberían reutilizar este mismo patrón: convertir la `<li>` de esa herramienta en `<button>`, agregar su `<section hidden>` dentro de `<main>`, y sumar su propio par mostrar/ocultar.

## Resultado de herramientas: casillero compartido

`crearCasillero()` en `script.js` crea el `<span class="resultado-slot">` que usa cualquier herramienta para mostrar un elemento del resultado (número, nombre elegido, etc.). `.resultado-revelado` lo destaca al terminar, `.resultado-suspenso` lo hace "latir" mientras se espera (ver `mostrarConSuspenso`). No crear casilleros específicos por herramienta — reusar este.

## Resultado de herramientas: overlay flotante (patrón fijo para todas)

Pedido explícito del usuario, aplica a **todas** las herramientas con resultado, no solo a la que lo motivó: el resultado no aparece más abajo del formulario, aparece flotando **encima** de él, con el formulario difuminado y sin interacción detrás. Estructura que hay que repetir en cada herramienta nueva:

```html
<div class="zona-resultado">
  <form class="formulario-herramienta" ...>...</form>
  <div class="resultado-overlay" hidden>
    <!-- acá va el resultado de la herramienta -->
    <button type="button" class="boton-volver">← Volver</button>
  </div>
</div>
```

En JS: `mostrarOverlayDeResultado(formulario, overlay)` al generar un resultado con éxito, `configurarBotonVolverDeResultado(idBoton, formulario, overlay)` para conectar el botón "Volver" de abajo del resultado (cierra el overlay, el formulario y lo ya escrito quedan intactos — nunca se limpia nada). Los mensajes de error quedan **fuera** de `.zona-resultado`, no activan el overlay. Ver `configurarGeneradorDeNumeros`, `configurarSelectorDeNombres` y `configurarGeneradorDeGrupos` para ejemplos ya andando.

## Botón "Limpiar" (patrón fijo para todas)

Las 5 herramientas con formulario tienen un botón `<button type="reset" class="boton-limpiar">Limpiar</button>` junto al botón principal, dentro de un `<div class="acciones-formulario">`. Es un `type="reset"` real: el navegador solo, sin JS, devuelve los campos simples (números, checkboxes) a los valores que tienen escritos en el HTML (`value="..."`, `checked`). Lo que el navegador NO sabe resetear es la lista dinámica de opciones (los campos que se agregaron con JS) — para eso, cada herramienta con lista escucha el evento `reset` del formulario y llama a `reiniciarListaDeOpciones(contenedor)`, que la deja en un solo campo vacío. "Limpiar" **no** cambia el modo elegido (Revelación/Ruleta, cantidad de grupos/personas por grupo) — solo los datos cargados. Herramienta nueva con formulario → agregar el mismo botón y, si tiene lista dinámica, el mismo listener de `reset`.

## Estado actual

FASE 3 completada: generador de números con validación, siempre en modo Ruleta. Se probó primero con un selector Revelación/Ruleta, pero el usuario prefirió sacarlo: no quiere elegir un modo cada vez que genera, prefiere una única forma fija de mostrar el resultado.

FASE 4 completada: para el selector de nombres/palabras, el usuario SÍ quiere elegir entre Revelación y Ruleta cada vez (a diferencia de números) — no asumir que la preferencia de FASE 3 aplica a todas las herramientas, se pregunta de nuevo en cada fase.

Construido:
- Lista dinámica de opciones (`configurarListaDeOpciones`/`sincronizarListaDeOpciones` en `script.js`): "Opción N+1" aparece sola al completar "Opción N" con algo que tenga al menos una letra; si se borra una opción del medio, el contenido de las siguientes sube un lugar (no se borran todas, se corren). Layout con flexbox centrado (`.contenedor-opciones`) que acomoda 1 opción centrada, 2 lado a lado, 3 como 2+1, etc., solo.
- Modo **Revelación**: ahora significa "~3 segundos de suspenso con un redoble de tambores sintetizado (Web Audio API, sin archivos externos) y después se revela el resultado" — no la revelación instantánea que tenía el generador de números antes de sacarla. El sonido es un prototipo: el usuario planea revisar los efectos de sonido de todo el proyecto más adelante, no tocar esto sin que lo pida.
- Modo **Ruleta**: rueda SVG de verdad, dibujada por código (`dibujarRuedaDeNombres`), que gira con una transición CSS controlada desde JS (`girarRuedaHasta`) y se frena exactamente en la porción ganadora (ángulo calculado, no aproximado). Si se pide más de un elemento, gira una vez por cada uno; sin repetición, la porción ganadora se saca de la rueda antes del siguiente giro.
- **Elección de modo**: no es un `<fieldset>` de radio buttons — al entrar a la herramienta aparecen primero dos botones grandes (reusando la clase `.herramienta`, igual que las tarjetas del inicio) para elegir Revelación o Ruleta, y recién después se muestra el formulario con las opciones. El modo elegido se guarda en `formulario.dataset.modo`. Este patrón (elegir modo con botones grandes tipo tarjeta, antes de cargar datos) puede servir de referencia para otras herramientas que necesiten varios modos en el futuro.

FASE 5 completada: generador de grupos. Reusa la lista dinámica de opciones (ahora generalizada: `configurarListaDeOpciones(idContenedor)` y `obtenerOpcionesValidas(contenedor)` reciben el contenedor en vez de tener el id fijo — así el selector de nombres y el generador de grupos comparten el mismo código sin duplicarlo). Reparto balanceado en `calcularTamanosDeGrupos` (la diferencia entre el grupo más grande y el más chico nunca supera 1) y `mezclarLista` (Fisher-Yates genérico, pensado para reusarse también en el Mezclador de FASE 7). Elección de modo con el mismo patrón de botones grandes que en FASE 4 ("por cantidad de grupos" vs. "por personas por grupo").

**Edición manual de grupos**: cada persona tiene un `<select>` ("mover a: Grupo N") en vez de drag-and-drop — mucho más simple de implementar bien y funciona igual de bien en celular. El estado real de los grupos vive en `gruposActuales` (variable dentro de `configurarGeneradorDeGrupos`, no solo en el HTML): mover a alguien es `splice` en el grupo de origen + `push` en el destino, y se vuelve a dibujar todo con `mostrarGrupos`. Un grupo puede quedar vacío después de mover gente — es un resultado válido, se muestra como tarjeta con el texto "Vacío".

FASE 6 completada: lanzamiento de moneda. Sin animación de giro (el spec permite que sea opcional, y con hasta 100+ lanzamientos de una vez animar cada uno sería lento) — reusa el mismo patrón de resultado flotante. Atajos 1/10/100 son botones que solo rellenan el campo de cantidad, no un modo aparte. `MAXIMO_LANZAMIENTOS = 10000` es un tope defensivo propio (no pedido por el spec) para evitar que un error de tipeo cuelgue el navegador dibujando demasiados casilleros — mismo criterio a aplicar si alguna herramienta futura permite cantidades sin límite explícito.

FASE 7 completada: mezclador. Reusa la lista dinámica de opciones y `mezclarLista()` (la que ya existía desde FASE 5) sin cambiarle una línea — justo el reuso que se había anticipado al construirla. El resultado tiene dos acciones: "Volver a mezclar" (adentro del overlay, remezcla la misma lista sin volver al formulario) y "← Volver" (cierra el overlay). Las dos usan la misma función `mezclarYMostrar()` para no duplicar lógica.

FASE 8 en curso: base de torneos. Un solo formato (eliminación directa) — el spec pide explícitamente no implementar todos los formatos de entrada. **La cantidad de jugadores se elige primero** en una pantalla de botones grandes (4, 8, 16 o 32 — mismo patrón que Revelación/Ruleta o cantidad de grupos/personas por grupo), y recién ahí aparece el formulario con esa cantidad exacta de campos (no es la lista dinámica que crece sola de las otras herramientas: `generarCamposDeParticipantesTorneo()` los dibuja todos de una vez). Como el tamaño elegido siempre es potencia de 2, `generarLlaveDeTorneo(participantes, tamanoDeLlave)` recibe ese tamaño directo en vez de calcularlo. Quién gana cada partido lo elige el usuario haciendo clic (no se randomiza, son partidos reales). `elegirGanador()`/`avanzarGanador()`/`deshacerAvanceDeGanador()` manejan tanto avanzar un ganador a la ronda siguiente como deshacer la cascada completa si se corrige un partido ya decidido (para no dejar un ganador "fantasma" en una ronda futura basado en una elección vieja). Convención de datos: en cada partido, `jugadorA`/`jugadorB` es un nombre, `null` (bye, solo en ronda 1) o `undefined` (todavía no definido, esperando la ronda anterior) — no confundir los dos.

**Nombres de ronda** (`nombreDeRonda()`): se cuentan para atrás desde la final, no hacia adelante desde la ronda 1 — la última ronda siempre es "Final", la anterior "Semifinal", la anterior a esa "Cuartos de final", la anterior a esa "Octavos de final". Con 32 jugadores sobra una ronda antes de Octavos que no tiene nombre propio: se llama "Ronda 1". Si en el futuro se agregan tamaños más grandes (64+), extender este mismo patrón (ej. "Dieciseisavos de final") en vez de dejar todo como "Ronda N".

Esta pantalla usa `.pantalla-herramienta--ancha` (1400px) porque la llave necesita mucho más lugar que el resto de las herramientas (480px). A diferencia de las otras 5 herramientas, Torneos **no usa el overlay flotante compartido** (`mostrarOverlayDeResultado`/etc.) — el bracket es contenido normal de la página, separado de `.torneo-configuracion` (angosta, 480px) por una línea divisoria (`.torneo-resultado-zona`). El scroll horizontal vive en `#resultado-torneo` (`overflow-x:auto`, sin `justify-content`) — **nunca pongas `justify-content:center` en el mismo elemento que tiene el `overflow-x:auto`**: si el contenido centrado desborda, la mitad que se sale por la izquierda queda con un `scrollLeft` negativo inalcanzable. El centrado vive en el hijo `.torneo-llave-doble` (`width:max-content; min-width:100%`), que es un elemento distinto. Al generar un torneo grande, se mueve `scrollLeft` por JS para arrancar con la Final centrada.

**Formato de llave con dos mitades + tercer puesto**: por pedido explícito del usuario (mandó una captura de referencia), la llave no es una fila simple de columnas — son dos mitades que convergen a un centro compartido (Final arriba, Tercer puesto abajo, bien separado), con líneas conectoras entre cada par de partidos y el siguiente. `armarColumnasDeMitad(rondas, esLadoDerecho)` parte cada ronda al medio (mitad de los partidos para cada lado) y, para el lado derecho, invierte el orden de las columnas (la que tiene un solo partido queda más cerca del centro). El truco de alineación es puramente CSS: `.torneo-mitad` con `align-items: stretch` hace que todas las columnas de una mitad midan lo mismo de alto, y cada `.torneo-columna-partidos` usa `flex:1; justify-content: space-around`, así una columna con la mitad de partidos que la anterior queda centrada exactamente al punto medio entre cada dos partidos que la alimentan — sin cálculos manuales de posición. Las líneas conectoras (`.torneo-par`/`.torneo-partido--conector-*`) asumen una altura fija de partido (`min-height: 4.4rem` en `.torneo-partido`, con `top: 2.2rem`/`bottom: 2.2rem` en los conectores) — si en algún momento se cambia el tamaño de las tarjetas de partido normales, hay que actualizar esos valores en sincronía o las líneas quedan desalineadas.

**Distancia entre rondas responsive**: `--torneo-gap-ronda: clamp(1rem, 2.5vw, 3rem)` controla el gap horizontal entre columnas (`.torneo-mitad`, `.torneo-llave-doble`) y el largo de los conectores que dependen de esa distancia (`.torneo-par--*`, `.torneo-partido--conector-*`) — todos usan la misma variable para no desalinearse entre sí. El tamaño de las tarjetas normales NO depende de esta variable a propósito (el usuario pidió explícitamente no tocarlo).

**Nombre de etapa pegado al primer partido**: `.torneo-titulo-etapa` ya no es un título fijo arriba de toda la columna — es hijo del primer partido/pareja (`position: absolute; top: -1.6rem`), así que sigue a ese elemento adonde el truco de `space-around` lo termine centrando (antes, "Semifinal" quedaba separado de su único partido). `.torneo-columna-partidos` tiene `padding-top: 1.8rem` para dejarle lugar arriba.

**Final y Tercer puesto en horizontal**: `.torneo-partido--horizontal` cambia `flex-direction` de columna a fila — reusa el mismo HTML de cualquier partido (jugador/vs/jugador), no hace falta una plantilla nueva. `.torneo-partido--final` sigue siendo el borde violeta + un poco más de padding/tamaño de fuente. El tercer puesto muestra siempre al ganador primero mediante `ponerGanadorPrimero()` — es puramente de presentación (una copia para dibujar), no reordena ni modifica `partidoPorTercerPuesto`.

**Tercer puesto**: el perdedor de cada semifinal pasa automáticamente a `partidoPorTercerPuesto` (variable de estado aparte, no vive dentro de `rondas` porque no es parte del árbol de eliminación). `elegirGanador()` lo llena al decidir una semifinal; `deshacerAvanceDeGanador()` también lo limpia si se deshace una semifinal en cascada (por ejemplo, al corregir un cuartos de final que ya había producido un resultado de semifinal y de tercer puesto). `elegirGanadorDeTercerPuesto()` es independiente y simple: no hay nada que propagar después, es un partido sin descendencia en la llave.

Falta (para más adelante, no construir sin que el usuario lo pida): editar el nombre de un participante ya cargado en la llave, e intercambiar participantes de posición ("modificar posiciones", "cambiar participantes" del spec original).

Próximo paso: terminar FASE 8 con esas ediciones, o pasar a FASE 9 (testing) si el usuario prefiere dejarlas para después — preguntar, no asumir.
