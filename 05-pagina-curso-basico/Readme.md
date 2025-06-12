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
import type { Media } from "@content-island/api-client";

export interface Training {
  id: string;
  language: string;
  title: string;
  slug: string;
  thumbnail: Media;
  overview: string;
  lessons: string[]; // Stores the ID of the related entity
}

export interface Lesson {
  id: string;
  language: string;
  title: string;
  slug: string;
  content: string;
  video: string;
}

export interface TrainingVm {
  id: string;
  language: string;
  title: string;
  slug: string;
  thumbnail: Media;
  overview: string;
  lessons: Lesson[];
}
```

Y ahora la API

_./src/pages/training/training.api.ts_

```ts
import { mapContentToModel } from "@content-island/api-client";
import client from "../../lib/client";
import type { Training, Lesson } from "./training.model";

export async function getTrainings(): Promise<Training[]> {
  const response = await client.getContentList({ contentType: "training" });

  const trainings = response.map((content) =>
    mapContentToModel<Training>(content)
  );

  return trainings;
}

export async function getLessons(ids: string[]): Promise<Lesson[]> {
  const response = await client.getContentList({
    contentType: "Lesson",
    id: { in: ids },
  });

  const lessons = response.map((content) => mapContentToModel<Lesson>(content));

  return lessons;
}
```

Y vamos a crear el fichero de la página, generamos una página por cada curso.

_./src/pages/training/[slug].astro_

```astro
---
import { getLessons, getTrainings } from "./training.api";
import type { Training, Lesson } from "./training.model";
import Layout from "../../layouts/Layout.astro";

export async function getStaticPaths() {
  const trainings: Training[] = await getTrainings();

  return trainings.map((training) => ({
    params: { slug: training.slug },
    props: {
      training,
    },
  }));
}
---
```

Y ahora vamos a generar cada página:

```diff
export async function getStaticPaths() {
  const trainings: Training[] = await getTrainings();

  return trainings.map((training) => ({
    params: { slug: training.slug },
    props: {
      training,
    },
  }));
}

+ const { training } = Astro.props;
+
+ const lessons: Lesson[] = await getLessons(training.lessons);
+
+ const trainingVm = {
+  ...training,
+  lessons,
+ };
```

Y ahora mostramos algo temporal:

```diff
---

+ <Layout title={trainingVm.title}>
+  <h1 class="text-2xl font-bold mb-4">{trainingVm.title}</h1>
+  <p class="mb-4">{trainingVm.overview}</p>
+
+  <h2 class="text-xl font-semibold mb-2">Lecciones</h2>
+  <ul class="list-disc pl-5">
+    {trainingVm.lessons.map((lesson) => <li class="mb-2">{lesson.title}</li>)}
+  </ul>
+ </Layout>
```

Si probamos ahora podemos ver que al pinchar en cada curso no lleva a una página que muestra el curso en concreto, pero muy feote :),

```bash
npm run dev
```

Y vamos a ver que pasa si hacemos un build:

```bash
npm run build
```

Debajo de la carpeta `dist` se ha creado una carpeta `training` con un fichero por cada curso `dist/training/[slug].html`.
