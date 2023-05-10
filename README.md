# Media Shop Node API

A Node Api for Media Shop, sale and rent movies, series and books.

## Requiments

- Node 18 or later
- Docker & DockerCompose


## 🚀 Demo

Docs: [https://media-shop-node-api-qn22m5e5tq-uc.a.run.app/docs](https://media-shop-node-api-qn22m5e5tq-uc.a.run.app/docs)

## 🧐 Features

Here're some of the project's best features:

- Search media
- Customers
- Media and Units
- Genres
- Negotiations (Sale or Rent)

## 🛠️ Installation Steps:

1. Install dependencies
```
yarn or npm install
```

2. Conect to database

```
docker-compose up db
```

3. Migrate and seed database

```
yarn seed
```

4. Run project

```
yarn dev
```

## 💻 Built with

Technologies used in the project:
- Express
- Typescript
- Database migrate and seed (Prisma)
- Git Hooks
- Code styling (Eslint + Prettier)
- OpenApi Docs path (\`/docs\`)
- Integration tests and 100% coverage
