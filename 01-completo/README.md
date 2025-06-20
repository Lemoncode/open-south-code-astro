# Ejemplo completo

## 00 Presentando

Vamos a presentar el ejemplo con Quick Mock [Open South Code 2025] Material.

Vamos a presentar paso 0 que lleva el proyecto semilla.

Vamos a ponernos a implementarlo.

## 01 Definiendo el layout

Si abrimos la página `index.astro`, podemos ver que trae todo lo típico de una página HTML, con su `head`, `body`, etc.

Podríamos trabajar así, pero sabes que, .... que normalmente en todas las páginas vamos a usar una estructura similar, es más seguro que cabecera y footer van a ser iguales, ¿Porque no crearnos un layout?

_./src/layouts/layout.astro_

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
import Layout from "../layouts/layout.astro";
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

Ya que estamos, vamos a añdir un componente de cabecera, esto podría tener a futuro un menú y otras secciones.

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
+ import Header from "@/components/header.astro";

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

./src/pages/index.astro

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

_./src/components/trainings/training-card.astro_

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
+ import TrainingCard from "@/components/trainings/training-card.astro";
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

## Lecciones

### Listado de lecciones sin diseño

Ahora que tenemos el listado de cursos, vamos a ver cómo hacer una página para los cursos, de hecho vamos a hacer varias..., por temas de SEO nos interesa tener una página por cada lección de curso.

Así que vamos a crear la siguiente estructura de carpetas:

```
src
└── pages
    └── training
        └── [trainingSlug]
            └── [lessonSlug].astro
```

¿Qué es eso entre corchetes? Es una forma de definir rutas dinámicas en Astro, es decir, que el nombre del archivo se convierte en una variable que podemos usar dentro del componente.

Así lo que hacemos es crear todas las lecciones de un curso en una misma carpeta, y cada lección será una página diferente, al estar usando SSG (Static Site Generation) se generarán todas las páginas en el momento de la construcción del sitio.

_src/pages/training/[trainingSlug]/[lessonSlug]/index.astro_

```astro
---
---
```

Ahora nos hace falta hacer como Dr. Strange en infinity Wars y sacar todas las combinaciones posibles de lecciones y cursos.

Para hacer esto, Astro nos ofrece la función `getStaticPaths`, que nos permite generar todas las rutas posibles para una página dinámica.

_src/pages/training/[trainingSlug]/[lessonSlug]/index.astro_

```astro
---
import Layout from "@/layouts/layout.astro";
import { getTrainings } from "@/api";

export async function getStaticPaths() {
  const trainings = await getTrainings();
  return trainings.flatMap((training) =>
    training.lessons.map((lesson) => ({
      params: {
        trainingSlug: training.slug,
        lessonSlug: lesson.slug,
      },
      props: {
        training,
      },
    })),
  );
}
---
```

¿Qué hacemos aquí?

- Obtenemos todos los cursos con sus lecciones (ojo lecciones está en un array dentro de cada curso).

- Usamos `flatMap` para crear un array de objetos con las rutas posibles, donde cada objeto tiene los parámetros `trainingSlug` y `lessonSlug`.

¿Por qué `flatMap`? Porque queremos aplanar el array de lecciones de cada curso en un único array de rutas.

Ok, ya tenems generados todas las rutas posibles, ahora vamos a ir montando cada página:

_src/pages/training/[trainingSlug]/[lessonSlug]/index.astro_

```diff
}

+ const { training } = Astro.props;
+ const currentLesson = training.lessons.find(
+  (lesson) => lesson.slug === Astro.params.lessonSlug
+ );
---
```

Vamos ahora a mostrar los datos de la lección, de momento sin diseño.

> Poner esto despes de las "rejas" (_fences_)

_src/pages/training/[trainingSlug]/[lessonSlug]/index.astro_

```astro
<Layout title={training.title}>
  <div class="container mx-auto px-4">
    <h1 class="text-2xl font-bold mb-4">{currentLesson?.title}</h1>
    <p>{currentLesson?.content}</p>
  </div>
</Layout>
```

### Listado de lecciones con diseño

Ahora que tenemos los datos, vamos a darle un poco de diseño a la página de lecciones.

Primer componentizamos, ¿Qué queremos mostar?

- El video de la lección
- El listado de lecciones
- El contenido de la lección

Así que manos a la obra:

_./src/components/training/video.astro_

```astro
---
export interface Props {
  videoUrl: string;
  title: string;
}

const { videoUrl, title } = Astro.props;
---

<div
  class="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200"
>
  <iframe
    id="videoFrame"
    src={videoUrl}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    class="w-full h-full"></iframe>
</div>
<h2 id="lessonTitle" class="mt-4 text-2xl font-semibold">{title}</h2>
```

El listado de lecciones:

_./src/components/training/lessons-list.astro_

```astro
---
import type { Lesson } from "@/api";

export interface Props {
  lessons: Lesson[];
  trainingSlug: string;
  currentLessonSlug?: string;
}

const { lessons, trainingSlug, currentLessonSlug } = Astro.props;
---

<div
  class="bg-white rounded-2xl shadow-md p-4 space-y-2 border border-gray-200"
>
  <h3 class="text-lg font-medium mb-2 text-gray-800">Lessons</h3>
  {
    lessons.map((lesson) => (
      <a
        href={`/training/${trainingSlug}/${lesson.slug}`}
        class={`block w-full text-left px-4 py-2 rounded-lg transition text-sm border ${
          lesson.slug === currentLessonSlug
            ? "bg-gray-100 text-blue-600 font-semibold"
            : "text-gray-700 hover:bg-gray-100 hover:border-gray-300"
        }`}
      >
        {lesson.title}
      </a>
    ))
  }
</div>
```

Y el contenido en markdown sobre la lección:

> Ojo de momento lo mostramos en plano

_./src/components/training/lesson-content.astro_

```astro
---
export interface Props {
  content: string;
}

const { content } = Astro.props;
---

<h3 class="text-xl font-bold mb-4 text-gray-800">Contenido de la Lección</h3>
<p id="lessonContent" class="text-gray-700 leading-relaxed text-base">
  {content}
</p>
```

Y ahora vamos a montar la página de lecciones, eliminamos el HTML que teníamos y lo sustituimos por nuestros componentes.

_./src/pages/training/[trainingSlug]/[lessonSlug]/index.astro_

```diff
---
import Layout from "@/layouts/Layout.astro";
import { getTrainings } from "@/api";
+ import VideoComponent from "@/components/training/video.astro";
+ import LessonsComponent from "@/components/training/lessons-list.astro";
+ import LessonContentComponent from "@/components/training/lesson-content.astro";
```

```astro
<Layout title={`${training.title} - ${currentLesson?.title}`}>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center">{training.title}</h1>

    <div class="grid md:grid-cols-12 gap-6">
      <div class="md:col-span-8">
        <VideoComponent
          videoUrl={currentLesson?.video ?? ""}
          title={currentLesson?.title ?? ""}
        />
      </div>

      <div class="md:col-span-4">
        <LessonsComponent
          lessons={training.lessons}
          trainingSlug={training?.slug}
          currentLessonSlug={currentLesson?.slug}
        />
      </div>
    </div>

    <div
      class="mt-10 bg-white p-6 rounded-2xl shadow-md border border-gray-200"
    >
      <LessonContentComponent content={currentLesson?.content ?? ""} />
    </div>
  </div>
</Layout>
```

Si hacemos un `npm run build`, podemos ver que se han generado todas las páginas de cursos y lecciones.

```bash
npm run build
```

_./dist/training/..._

## Navegación fluida

Vale esto está muy bien, pero si pinchamos en un curso y luego en una lección, la página se recarga, ¿No sería mejor que no se recargara y que tuvieramos un experiencia más tipo SPA con transiciones suaves entre páginas?

Para ello vamos a usar la navegación fluida de Astro, que nos permite navegar entre páginas sin recargar la página completa.

Queremos hacerlo a nivel de sitio, así que vamos a modificar nuestro layout para que use la navegación fluida.

_./src/layouts/Layout.astro_

```diff
---
+ import { ClientRouter } from "astro:transitions";
// Let's import tailwind's global styles
import "../styles/global.css";
import Header from "../components/header.astro";
```

```diff
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
+    <ClientRouter />
  </head>
```
