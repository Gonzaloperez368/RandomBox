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
- [ ] FASE 2 — Diseño general
- [ ] FASE 3 — Generador de números
- [ ] FASE 4 — Selector de nombres + ruleta
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

## Estado actual

FASE 1 completada: estructura básica de archivos creada (`index.html`, `style.css`, `script.js`, `README.md`, `.gitignore`) y repo Git inicializado. Próximo paso: FASE 2 — diseño general (no empezar sin que el usuario lo pida).
