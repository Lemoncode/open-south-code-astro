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
