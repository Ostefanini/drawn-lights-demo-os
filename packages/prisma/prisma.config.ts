import { config } from "dotenv";
import { existsSync } from "node:fs";
import { defineConfig, env } from "prisma/config";

// En dev : charge le .env depuis la racine du workspace
// En prod : utilise les variables d'environnement déjà injectées par l'orchestrateur
const envPath = new URL("../../.env", import.meta.url).pathname;
if (existsSync(envPath)) {
  config({ path: envPath });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
