# Ejemplo completo

## 01 Definiendo el layout

Si abrimos la página `index.astro`, podemos ver que trae todo lo típico de una página HTML, con su `head`, `body`, etc.

Podríamos trabajar así, pero sabes que, .... que normalmente en todas las páginas vamos a usar una estructura simiar, es más seguro que cabecera y footer van a ser iguales, ¿Porque no crearnos un layout?

_./src/layouts/Layout.astro_

```astro
---
// Let's import tailwind's global styles
import "../styles/global.css";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

Y nuestro `index.astro` quedaría así:

_./src/pages/index.astro_

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout>
  <h1>Astro</h1>
</Layout>
```

> Cuando invocamos a Layout podríamos pasarle propiedades, como si fuera un componente, tales como el título de la página, etc.

Vamos a ver que esto sigue funcionando.

```bash
npm run dev
```

Hay una cosa que te puede chirriar y es que _title_ siempre es Astro, ¿No estaría bien poder alimentarle por una prop el título? Vamos a ello:

_./src/Layout.astro_

```diff
---
// IMPORTANTE Mencionar esto !!
import "../styles/global.css";

+ interface Props {
+  title: string;
+ }
+
+ const { title } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
-    <title>Astro</title>
+    <title>{title}</title>
```

Y en Index.astro:
_./src/pages/index.astro_

```diff
- <Layout>
+ <Layout title="Campus">
-  <h1>Astro</h1>
+  <h1>Listado de Cursos</h1>
 </Layout>
```

Ya que estamos, vamos a añdir un componente de cabecera, que nos muestre el título de la página y un menú de navegación.

_./src/components/header.astro_

```astro
---

---

<header class="bg-white shadow-sm">
  <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-800">Online Campus</h1>
  </div>
</header>
```

Y lo usamos en nuestro layout:

_./src/layouts/Layout.astro_

```diff
---
// IMPORTANTE Mencionar esto !!
import "../styles/global.css";
+ import Header from "../components/header.astro";

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<html lang="en">
// (...)
  <body>
+   <Header />
    <slot />
  </body>
</html>
```

## Lista de cursos

### Mostrando lista de cursos básico

Vamos a sacar la lista de cursos pero sin aplicar ningún diseño.

./src/index.astro

```diff
---
import Layout from "../layouts/Layout.astro";
+ import { getTrainings } from "@/api";

+ const trainings = await getTrainings();
---
```

Y vamos a mostrar los datos sin diseño:

```astro
<Layout title="Listado de Cursos">
  <h1 class="text-2xl font-bold mb-4">Cursos Disponibles</h1>
  <ul class="space-y-4">
    {
      trainings.map((training) => (
        <li class="p-4 border rounded-lg">
          <h2 class="text-xl font-semibold">{training.title}</h2>
          <p>{training.overview}</p>
        </li>
      ))
    }
  </ul>
</Layout>
```

### Añadiendo diseño con Tailwind

Vamos a organizar uun poco el código y a aplicar un poco de diseño con Tailwind.

Lo primero componenntizar la lista de cursos, vamos a crear un componente card que nos sirva para mostrar cada curso.

OJO este componente no lo podemos colocarl debajo de pages porque lo tomaría como una página, así que lo colocamos en `src/components`.

_./src/components/training/training-card.astro_

```astro
---
import type { TrainingWithLessons } from "@/api";

export interface Props {
  training: TrainingWithLessons;
}

const { training } = Astro.props;
---

<a
  href={`/training/${training.slug}/${training.lessons[0].slug}`}
  class="group block transform transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <div
    class="relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 w-full border border-gray-100"
  >
    <div class="overflow-hidden relative">
      <img
        src={training.thumbnail.url}
        alt={training.title}
        class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
      </div>
    </div>

    <div class="p-5">
      <h2 class="text-xl font-bold text-gray-900 leading-snug line-clamp-2">
        {training.title}
      </h2>
    </div>
  </div>
</a>
```

Y vamos a mostrarlo en la página de cursos.

_./src/index.astro_

```diff
---
import Layout from "../layouts/Layout.astro";
+ import TrainingCard from "@/components/training/training-card.component.astro";
import { getTrainings } from "./trainings";

const trainings = await getTrainings();
---
```

Y sustituimos todo el HTML

```astro
<Layout title="Listado de Cursos">
  <div class="container mx-auto px-4">
    <h1 class="text-2xl font-bold mb-4">Cursos Disponibles</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {trainings.map((training) => <TrainingCard training={training} />)}
    </div>
  </div>
</Layout>
```

Ya lo tenemos, pero si pinchamos en un curso nos da un 404, vamos a por la lista de lecciones.
