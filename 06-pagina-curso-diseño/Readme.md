# 05 Pagina curso diseño

Para completar nuestro portal de cursos, vamos a darle diseño a la página de un curso específico.

Queremos algo así como (ver mock)

A nivel de layout sería:

Armazón

```astro
<Layout title={trainingVm.title}>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center">Lecciones del Curso</h1>

    <!-- Contenedor principal: video + lecciones -->
    <div class="grid md:grid-cols-12 gap-6">
      <!-- Video (col-span-8 en pantallas md+) -->
      <div class="md:col-span-8">
        <h2>Aqui el video</h2>
      </div>

      <!-- Lista de lecciones -->
      <div class="md:col-span-4">
        <h2>Aquí van las lecciones</h2>
      </div>
    </div>

    <!-- Contenido debajo del video -->
    <div
      class="mt-10 bg-white p-6 rounded-2xl shadow-md border border-gray-200"
    >
      <h2>Aqui el contenido de texto</h2>
    </div>
  </div>
</Layout>
```

Vamos a por el componente de video

_./src/pages/training/video.component.astro_

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

Y lo vamos a usar, de momento harcodeando el primero título y lección.

_./src/pages/[slug].astro_

```diff
---
import { getLessons, getTrainings } from "./training.api";
import type { Training, Lesson } from "./training.model";
import Layout from "../../layouts/Layout.astro";
+ import VideoComponent from "./video.component.astro";

// ...
```

---

```diff
    <!-- Contenedor principal: video + lecciones -->
    <div class="grid md:grid-cols-12 gap-6">
      <!-- Video (col-span-8 en pantallas md+) -->
      <div class="md:col-span-8">
-        <h2>Aqui el video</h2>
+       <VideoComponent
+         videoUrl={lessons[0].video}
+         title={lessons[0].title}
+       />
      </div>

```

Vamos a por el listado de lecciones:

_./src/pages/training/lessons.component.astro_

```astro
---
import type { Lesson } from "./training.model";
export interface Props {
  lessons: Lesson[];
}

const { lessons } = Astro.props;
---

<div class="bg-white rounded-2xl shadow-md p-4 space-y-2 border border-gray-200">
  <h3 class="text-lg font-medium mb-2 text-gray-800">Lecciones</h3>
  {lessons.map((lesson) => (
    <button
      class="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm text-gray-700 border border-transparent hover:border-gray-300"
      data-video={lesson.video}
      data-title={lesson.title}
      data-content={lesson.content}
    >
      {lesson.title}
    </button>
  ))}
</div>
```

Vamos a usarlo en la página del curso:

_./src/pages/[slug].astro_

```diff
---
import { getLessons, getTrainings } from "./training.api";
import type { Training, Lesson } from "./training.model";
import Layout from "../../layouts/Layout.astro";
import VideoComponent from "./video.component.astro";
+ import LessonsComponent from "./lessons.component.astro";
```

```diff
      <!-- Lista de lecciones -->
      <div class="md:col-span-4">
-        <h2>Aquí van las lecciones</h2>
+        <LessonsComponent lessons={lessons} />
      </div>
```

Vamos ahora a por el contenido de la lección.

_./src/pages/training/lesson-content.component.astro_

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

_./src/pages/[slug].astro_

```diff
---
import { getLessons, getTrainings } from "./training.api";
import type { Training, Lesson } from "./training.model";
import Layout from "../../layouts/Layout.astro";
import VideoComponent from "./video.component.astro";
import LessonsComponent from "./lessons.component.astro";
+ import LessonContentComponent from "./lesson-content.component.astro";
```

```diff
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center">Lecciones del Curso</h1>

    <!-- Contenedor principal: video + lecciones -->
    <div class="grid md:grid-cols-12 gap-6">
      <!-- Video (col-span-8 en pantallas md+) -->
      <div class="md:col-span-8">
        <VideoComponent
          videoUrl={lessons[0].video}
          title={lessons[0].title}
        />
      </div>

      <!-- Lista de lecciones -->
      <div class="md:col-span-4">
        <LessonsComponent lessons={lessons} />
      </div>
    </div>
```

```diff
    <!-- Contenido debajo del video -->
    <div
      class="mt-10 bg-white p-6 rounded-2xl shadow-md border border-gray-200"
    >
-      <h2>Aqui el contenido de texto</h2>
+     <LessonContentComponent content={lessons[0].content} />
    </div>
  </div>
```

Y nos queda una cosa, que cuando cambiemos de lección, se actualice el vídeo y el contenido.

Aquí podemos resolverlo aplicando Vanilla JS y jugando con el DOM, no es una solución limpia, pero si la página no va a tener más complejidad, puede ser una solución rápida.

> Añadir esto al final

_./src/[slug].astro_
```ts
  <script type="module">
    document.querySelectorAll('button[data-video]').forEach(button => {
      button.addEventListener('click', () => {
        const video = button.getAttribute('data-video');
        const title = button.getAttribute('data-title');
        const content = button.getAttribute('data-content');

        const videoFrame = document.getElementById('videoFrame');
        const lessonTitle = document.getElementById('lessonTitle');
        const lessonContent = document.getElementById('lessonContent');

        if (videoFrame) videoFrame.setAttribute('src', video);
        if (lessonTitle) lessonTitle.textContent = title;
        if (lessonContent) lessonContent.textContent = content;
      });
    });
  </script>
```

Esta solución no es muy elegante, ya que asumimos que los componentes de vídeo y contenido están en el DOM al momento de hacer clic y con la estructura que esperamos, si la página se va a quedar en este complejidad puede ser una solución rápida y efectiva.

En caso de que queraos algo más elaborado tenemos varias opciones:
  1. **Usar un framework de JavaScript**: Como React, Vue o Svelte, que te permitirán manejar el estado de la aplicación de forma más limpia y reactiva, si queremos seguir con SSG, podemos decirlo que lo use como client:only para que se ejecute en el cliente, pero perdemos el SEO.

  2. **Utilizar content island en Astro**: Pasamos a modo híbrido y la isla de contenido dinámico la hacemos con un framework como React, Vue o Svelte, que nos permitirá manejar el estado de la aplicación de forma más limpia y reactiva, lo malo de aquí es que ya no podemos trabajar con SSG.

  3. 
