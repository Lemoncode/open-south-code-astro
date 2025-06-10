Vamos a dividir el problema, primero vamos a crear un componente card para mostrar un curso.

_./src/training/components/training-card.astro_

```typescript

```

Lo añadims al barrel:

_./src/training/index.ts_

```diff

```

Y vamos a mostrarlo en la página de cursos.

_./src/index.astro_

```diff

```

Y ya que estamos lo mostramos en un contenedor de tipo flex, para que se vean en una cuadrícula.

_./src/index.astro_

```diff

```
