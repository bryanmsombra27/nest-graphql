<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## LEVANTAR EL PROYECTO

- Instalar dependencias

```bash
$ npm install
```

- Renonmbrar archivo `.env.template ` a `.env ` y completar las variables de entorno

- Levantar la BD de desarrollo (asegurarse de tener instalado docker desktop previamente)

```bash
  docker compose up -d
```

- Levantar proyecto de graphql

```bash
  npm run dev
```

- Servidor de graphql:
  [http:localhost:3000/graphql](http:localhost:3000/graphql)
