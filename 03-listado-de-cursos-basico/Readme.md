# 03 Listado de cursos básico

Vamos a mostrar el listado de cursos que tenemos dispoinibles.

Tiramos de los datos de Content Island, que es un headless CMS, y nos permite gestionar los contenidos de forma sencilla.

Lo primero vamos a definir el módelo de la página.

Para ello creamos un fichero donde se encuentra la página de cursos, y copiamos el modelo desde content Island.

_./src/traning/training.model.ts_

```typescript

```

Vamos ahora a definir la llamada a la API para obtener los cursos.

_./src/training/training.api.ts_

```typescript

```

Y lo exponemos con un barrel:

_./src/training/index.ts_

```typescript

```

Y vamos a mostrar los datos en la página, sin aplicar ningún estilado.

_./src/index.astro_

```typescript

```

Resultado, ... se ve, aunque muy feo :), ¿Le damos un poco de estilo?

