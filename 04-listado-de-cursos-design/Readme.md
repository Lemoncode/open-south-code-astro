Vamos a dividir el problema, primero vamos a crear un componente card para mostrar un curso.

_./src/training/components/TrainingCard.component.astro_

```typescript
---
---
import type { Training } from "./trainings.model";

export interface Props {
  training: Training;
}

const { training } = Astro.props;
---

<a
  href={`/training/${training.slug}`}
  class="group block transform transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <div
    class="relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 max-w-sm w-full mx-auto border border-gray-100"
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
+ import TrainingCard from "./training/components/TrainingCard.component.astro";
import { getTrainings } from "./trainings";

const trainings = await getTrainings();
---
```

```diff
<Layout title="Listado de Cursos">
  <h1 class="text-2xl font-bold mb-4">Cursos Disponibles</h1>
-  <ul class="space-y-4">
+  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {
      trainings.map((training) => (
-        <li class="p-4 border rounded-lg">
-          <h2 class="text-xl font-semibold">{training.title}</h2>
-          <p>{training.overview}</p>
-        </li>
+       <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
+        {
+          trainings.map((training) => (
+            <TrainingCard training={training} />
+          ))
+        }
+       </div>
      ))
    }
+ </div>
-  </ul>
</Layout>
```
