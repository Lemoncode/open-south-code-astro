# 02 Listado de cursos básico

Vamos a mostrar el listado de cursos que tenemos dispoinibles.

Aquí podríamos almacenar una lista de cursos en un fichero local, pero eso es un rollo, si después hay que editarlo, etc. ¿Por qué no usar un headless CMS?

Vamos a darle caña con Content Island.

Aquí tenemos el proyecto creado, tenemos un modelo de datos con cursos y lecciones, podemos interactuar con la API de Content Island y mostrar los cursos en una página.

Nos instalamos la librería de API Content Island.

```bash
npm install @content-island/api-client --save
```

También nos hace falta añadir como variable de entorno el API Key de nuestro proyecto en Content Island.

Para ello, nos vamos a content island, elegimos el proyecto en el que estamos trabajando y en la pestaña de "General" podemos copiar el API Key (campo Token).

Ahora creamos un fichero ".env" en el raíz del proyecto y añadimos la variable de entorno:

_./env_

```env
CONTENT_ISLAND_SECRET_TOKEN=API_KEY
```

Y desde Astro 5, podemos tipar las variables de entorno de esta manera:

./astro.config.mjs

```ts
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  env: {
    schema: {
      CONTENT_ISLAND_SECRET_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_TOKEN'
      })
    }
  }
});
```

Está variable se ejecutará en el servidor, cuando Astro generé el sitio web estático.

Vamos a iniciar ahora la librería de Content Island en nuestro proyecto e inyectarle la API Key.

./src/lib/client.ts

```ts
import { CONTENT_ISLAND_SECRET_TOKEN } from 'astro:env/server';
import { createClient } from '@content-island/api-client';

const client = createClient({
  accessToken: CONTENT_ISLAND_SECRET_TOKEN
});

export default client;
```

Y ya tenemos todo listo para empezar a trabajar con Content Island. :)

***
Y ahora vamos 


Aquí comentamos que el listado de cursos lo podríamos tener en un fichero local pero para después editarlo etc sería un rollo, ¿Por que no tirar de un headless cms?

Vamos a ello, setup de Content Island.

Mostramos Content Island estructura y datos.


Instalamos la api b2b

Definimos la variable de entorno.

Definimos el modelo de datos (ojo ver si se puede tirar de funcionalidad de copiar el ts desde content island).

Creamos la llamada a la API y el mapper.

Mostramos la lista a lo bruto en la página.



