# Server Islands

Hasta ahora hemos esta trabajando en modo SSG, y Astro nos permite trabajar de forma hibrida, es decir, podemos tener páginas que se prerenderizan y otras que se renderizan en el servidor usando Server Side Rendering (SSR).

Si estamos en este modo, cuando pedimos una página, por defecto ésta se genera en el servidor y se envía al usuario en un sólo paquete.

¿Qué pasa si tenemos una página rica que carga de diferentes fuentes de datos? Puede que uno de los fragmentos tarde más en llegar que otro, lo que puede hacer que la página tarde en cargarse, y muchas veces lo que nos interesa es poder servirle al usuario el contenido principal lo más rápido posible.

Pues, una cosa interesante de Astro es que soporta streaming de HTML y de una forma muy sencilla e intituitiva, tu defines una `server:island y ese contenido se renderiza de forma independiente al resto de la página.

## Manos a la obra

Vamos a crear dos páginas, una tirara de streaming de HTML y otra no, y vamos a decirles que se no prerendericen, para que podamos ver el efecto de streaming.

_./src/pages/facts/no-streaming.astro_

```astro
---
import Layout from "@/layouts/layout.astro";


// IMPORTANTE: Deshabilitamos el prerenderizado para ver el efecto de streaming
export const prerender = false;
---

<Layout title="No Streaming">
  <h1>No Streaming</h1>
</Layout>
```

_./src/pages/facts/streaming.astro_

```astro
---
import Layout from "@/layouts/layout.astro";

export const prerender = false;
---

<Layout title="Streaming">
  <h1>Streaming</h1>
</Layout>
```

Y vamos a añadir dos enlaces simples para acceder a estas páginas desde el header de nuestra web.

_./src/components/header.astro_

```diff
<header class="bg-white shadow-sm">
  <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-800">Online Campus</h1>
  </div>
+  <a
+    href="/facts/streaming"
+    class="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
+    >Streaming</a
+  >
+  <a
+    href="/facts/no-streaming"
+    class="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
+    >No Streaming</a
+  >
</header>
```

Probamos que podemos navegar entre las dos páginas.

Y Vamos al lio, creamos dos APIs simuladas, una que te de un datos sobre gatitos y otra sobre perritos, la de perritos le vamos a meter un delay de 5 segundos para simular que tarda más en llegar.

_./src/api/cat-fact.api.ts_

```ts
export async function getCatFact() {
  return "Cats sleep 70% of their lives. 🐱";
}
```

_./src/api/dog-fact.api.ts_

```ts
export async function getDogFact() {
  await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate 5s delay
  return "Dogs can learn more than 1000 words. 🐶";
}
```

Vamos a consumir esta API en nuestra página sin streaming:

_./src/pages/facts/NoStreaming.astro_

```diff
---
import Layout from "../../layouts/Layout.astro";
+ import { getCatFact } from "@/api/cat-fact.api";
+ import { getDogFact } from "@/api/dog-fact.api";
+
  export const prerender = false;
+
+ const catFact = await getCatFact();
+ const dogFact = await getDogFact();
---

<Layout>
  <h1>No Streaming</h1>
+  <h2>Cat Fact</h2>
+  <p>{catFact}</p>
+  <h2>Dog Fact</h2>
+  <p>{dogFact}</p>
</Layout>
```

Si probamos a navegar a esta página, veremos que tarda 5 segundos en cargar, ya que estamos esperando a que llegue el dato de los perritos.

Vamos a hacer lo mismo en la página de streaming:

Para ello vamos a romper en componentes la sección que muestra los datos de los gatitos y los perritos:

_./src/components/cat-fact.astro_

```astro
---
import { getCatFact } from "@/api/cat-fact.api";

const fact = await getCatFact();
---

<section>
  <h2>Cat Fact</h2>
  <p>{fact}</p>
</section>
```

_./src/components/dog-fact.astro_

```astro
---
import { getDogFact } from "@/api/dog-fact.api";

const fact = await getDogFact();
---

<section>
  <h2>Dog Fact</h2>
  <p>{fact}</p>
</section>
```

Y ahora lo usamos tal cual en la página de streaming, y vamos a pedirle que haga un `server:defer` del component DogFact.

_./src/pages/facts/Streaming.astro_

```diff
---
import Layout from "../../layouts/Layout.astro";
+ import CatFact from "@/components/cat-fact.astro";
+ import DogFact from "@/components/dog-fact.astro";


export const prerender = false;
---

<Layout>
  <h2>Streaming</h2>
+ <CatFact />
+ <DogFact server:defer/>
</Layout>
```

Lo probamos y podemos ver como la página se carga al instante, y los datos de los gatitos llegan antes que los de los perritos.

## BONUS

¿Y si queremos mostrar un loader de la sección que se está cargando?

Al usar _server islands_, sólo tenemos que pintar el componente con un `slot="fallback"` y este se mostrará mientras el componente se está cargando.

_./src/pages/facts/components/DogFact.astro_

```diff
<Layout>
  <h2>Streaming</h2>
  <CatFact />
-  <DogFact server:defer />
+  <DogFact server:defer>
+    <div slot="fallback">🐶 Loading dog fact...</div>
+  </DogFact>
</Layout>
```

Fijate que potencia y sencillez nos da Astro, por un lado podemos trabajar de forma híbrida, y decidir que páginas se prerenderizan y cuales no, y por otro lado, podemos hacer streaming de HTML de forma muy sencilla con las Server Islands,y poder hacer que nuestras página vayan como un cohete.
