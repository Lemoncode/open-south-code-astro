## 00 Creando el proyecto

¿Cómo nos arrancamos con Astro? Vamos a crear un proyecto en blanco y configurarlo para usar Tailwind CSS.

```bash
npm create astro@latest
```

Le damos como nombre al proyecto micampus

Elegimos la opción: basic, minimal starter

Elegimos en Install Dependencies Yes

Y En Initalize Git Repository, como quieras, en este caso Yes

Creamos el proyecto en blanco.

Ahora entramos en la carpeta del proyecto (lo idea es abrir carpeta nueva desde VSCode)

Arrancamos el proyecto y vemos que funciona

```bash
npm run dev
```

Abrimos en el navegador y navegamos a la ruta locahost:4321 y todo funciona correctamente.

> Para mejor experiencia mira que tengamos el plugin de Astro en VSCode instalado.

Antes de seguir, para que sea más fácil formatear el código, vamos a instalar prettier y la extensión para astro

```bash
npm install --save-dev prettier
```

```bash
npm install --save-dev prettier-plugin-astro
```

Y añadimos configuración para prettier en el archivo .prettierrc:

./.prettierrc

```json
{
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

Y ya que estamos vamos a instalar Tailwind CSS y configurarlo para que funcione con Astro.

```bash
npx astro add tailwind
```

Si le damos que si a todo nos crea el global.css y la configración de Tailwind CSS para Astro.

Y esto lo incluiremos en el layout principal de nuestro proyecto en el siguiente paso.
