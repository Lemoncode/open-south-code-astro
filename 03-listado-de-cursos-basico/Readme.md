# 03 Listado de cursos básico

Vamos a mostrar el listado de cursos que tenemos disponibles.

Tiramos de los datos de Content Island, que es un headless CMS, y nos permite gestionar los contenidos de forma sencilla.

Lo primero vamos a definir el módelo de la página.

Para ello creamos un fichero donde se encuentra la página de cursos, y copiamos el modelo desde content Island.

_./src/tranings/training.model.ts_

```typescript
import type { Media } from "@content-island/api-client";

export interface Training {
  id: string;
  title: string;
  overview: string;
  slug: string;
  thumbnail: Media;
  lessons: string[];
}
```

Vamos ahora a definir la llamada a la API para obtener los cursos.

_./src/trainings/trainings.api.ts_

```typescript
import { mapContentToModel } from "@content-island/api-client";
import client from "../../lib/client";
import type { Training } from "./trainings.model";

export async function getTrainings(): Promise<Training[]> {
  const response = await client.getContentList({ contentType: "training" });

  const trainings = response.map((content) =>
    mapContentToModel<Training>(content)
  );

  return trainings;
}
```

Y lo exponemos con un barrel:

_./src/trainings/index.ts_

```typescript
export * from "./trainings.api";
export * from "./trainings.model";
```

Y vamos a mostrar los datos en la página, sin aplicar ningún estilado.

_./src/index.astro_

```diff
---
import Layout from "../layouts/Layout.astro";
+ import { getTrainings } from "./trainings";

+ const trainings = await getTrainings();
---
```

Y vamos a mostrar los datos sin diseño:

```astro
<Layout title="Listado de Cursos">
  <h1 class="text-2xl font-bold mb-4">Cursos Disponibles</h1>
  <ul class="space-y-4">
    {trainings.map((training) => (
      <li class="p-4 border rounded-lg">
        <h2 class="text-xl font-semibold">{training.title}</h2>
        <p>{training.overview}</p>
      </li>
    ))}
  </ul>
</Layout>
```

Resultado, ... se ve, aunque muy feo :), ¿Le damos un poco de estilo?
