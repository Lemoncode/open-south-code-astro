# Añadiendo componentes React en cliente

Astro soporta integraciones de diferents librerías (React, PReact, Svelte, Vue, etc) y en este caso vamos a añadir un componente de React y ejecutarlo en cliente.

Para ello:

Instalamos la integración de React en Astro:

```bash
npm install @astrojs/react
```

Agregamos react a la configuración de Astro:

_./astro.config.mjs_

```diff
import { defineConfig, envField } from "astro/config";
+ import react from '@astrojs/react';

export default defineConfig({
+  integrations: [react()],
  env: {
    schema: {
      CONTENT_ISLAND_SECRET_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: false,
        default: "INFORM_VALID_TOKEN",
      }),
    },
  },
});
```

Vamos ahora a crear un componente de React, que muestro un botón con un pulgar para arriba y un contador de likes.

> Ojo esto es un componente tonto, estamos guardando un valor en local storage, es para ver que un componente de React se integra.

_./src/components/like-button.component.tsx_

```tsx
import { useState, useEffect } from "react";

export const Like: React.FC = () => {
  const [likes, setLikes] = useState<number>(0);

  useEffect(() => {
    // Cargar los likes desde localStorage al montar el componente
    const storedLikes = localStorage.getItem("likes");
    if (storedLikes) {
      setLikes(parseInt(storedLikes, 10));
    }
  }, []);

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    localStorage.setItem("likes", newLikes.toString());
  };

  return (
    <button
      onClick={handleLike}
      style={{
        fontSize: "1.5rem",
        border: "none",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      👍 {likes}
    </button>
  );
};
```

Y ahora vamos usarlo en las lecciones de los cursos:

_src/pages/training/[trainingSlug]/[lessonSlug]/index.astro_

```diff
---
import Layout from "@/layouts/Layout.astro";
import { getTrainings } from "@/api";
import VideoComponent from "@/components/training/video.astro";
import LessonsComponent from "@/components/training/lessons-list.astro";
import LessonContentComponent from "@/components/training/lesson-content.astro";
+ import {Like} from "@/components/like-button.component";
```

```diff
<Layout title={`${training.title} - ${currentLesson?.title}`}>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center">{training.title}</h1>

    <div class="grid md:grid-cols-12 gap-6">
      <div class="md:col-span-8">
        <VideoComponent
          videoUrl={currentLesson?.video ?? ""}
          title={currentLesson?.title ?? ""}
        />
+        <Like client:load />
      </div>

```

Ojo este like es un poco trampa, porque le da el mismo numero de likes a todos los posts, podríamos almacenar un diccionario de likes por post en localStorage.

Si depuramos en el navegador podemos ver como podemos poner un breakpoint en el código de React.
