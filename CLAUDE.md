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
- [ ] FASE 5 — Generador de grupos
- [ ] FASE 6 — Lanzamiento de moneda
- [ ] FASE 7 — Mezclador
- [ ] FASE 8 — Base de torneos
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

## Estado actual

FASE 3 completada: generador de números con validación, siempre en modo Ruleta. Se probó primero con un selector Revelación/Ruleta, pero el usuario prefirió sacarlo: no quiere elegir un modo cada vez que genera, prefiere una única forma fija de mostrar el resultado.

FASE 4 completada: para el selector de nombres/palabras, el usuario SÍ quiere elegir entre Revelación y Ruleta cada vez (a diferencia de números) — no asumir que la preferencia de FASE 3 aplica a todas las herramientas, se pregunta de nuevo en cada fase.

Construido:
- Lista dinámica de opciones (`configurarListaDeOpciones`/`sincronizarListaDeOpciones` en `script.js`): "Opción N+1" aparece sola al completar "Opción N" con algo que tenga al menos una letra; si se borra una opción del medio, el contenido de las siguientes sube un lugar (no se borran todas, se corren). Layout con flexbox centrado (`.contenedor-opciones`) que acomoda 1 opción centrada, 2 lado a lado, 3 como 2+1, etc., solo.
- Modo **Revelación**: ahora significa "~3 segundos de suspenso con un redoble de tambores sintetizado (Web Audio API, sin archivos externos) y después se revela el resultado" — no la revelación instantánea que tenía el generador de números antes de sacarla. El sonido es un prototipo: el usuario planea revisar los efectos de sonido de todo el proyecto más adelante, no tocar esto sin que lo pida.
- Modo **Ruleta**: rueda SVG de verdad, dibujada por código (`dibujarRuedaDeNombres`), que gira con una transición CSS controlada desde JS (`girarRuedaHasta`) y se frena exactamente en la porción ganadora (ángulo calculado, no aproximado). Si se pide más de un elemento, gira una vez por cada uno; sin repetición, la porción ganadora se saca de la rueda antes del siguiente giro.
- **Elección de modo**: no es un `<fieldset>` de radio buttons — al entrar a la herramienta aparecen primero dos botones grandes (reusando la clase `.herramienta`, igual que las tarjetas del inicio) para elegir Revelación o Ruleta, y recién después se muestra el formulario con las opciones. El modo elegido se guarda en `formulario.dataset.modo`. Este patrón (elegir modo con botones grandes tipo tarjeta, antes de cargar datos) puede servir de referencia para otras herramientas que necesiten varios modos en el futuro.

Próximo paso: FASE 5 — Generador de grupos (no avanzar sin que el usuario lo pida).
