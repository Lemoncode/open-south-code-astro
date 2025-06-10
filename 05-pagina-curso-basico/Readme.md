# 05 Página curso basico

Ahora que tenemos el listado de cursos, vamos a ver cómo hacer una página para cada curso.

En esta página vamos a mostrar el listado de lecciones, la lección actual en video y una desipcrción del la lección en concreto.

> Se podría haber hecho una págia por cada lección para mejor SEO.

Cómo estamos en SSG necesitamos crear una página HTML por cada curso, ¿Cómo hacemos esto? Aquí te puedes sentir como el Dr. Strange y ver todas las posibilidades.

¿Cómo hacemos esto? Por un lado le pedimos a la API el listado de cursos, y con getStaticPaths generamos una página por cada curso.

¿Cómo se hace esto?

Vamos crearnos una carpeta de `pages/training/` y dentro de esta carpeta creamos un fichero llamado `[slug].astro`.

Vamos a traernos el modelo (en este caso repito los dos por ser estanco pero se podría haber ocmpartido)

_./src/pages/training/training.model.ts_

```ts

```

Y ahora la API

_./src/pages/training/training.api.ts_

```ts

```

Y vamos a crear el fichero de la página, generamos una página por cada curso.

_./src/pages/training/[slug].astro_

```astro

```

Si probamos ahora podemos ver que al pinchar en cada curso no lleva a una página que muestra el curso en concreto, pero muy feote :), además nos falta el listado de lecciones.

> Hacer aquí un npm run build

Vamos a cargar esa informacion.

_./src/pages/training/[slug].astro_

```astro

```

