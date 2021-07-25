/* eslint-disable no-undef */
import knex from "knex";
import fs from "fs";
import Runner from "./Runner.js";
import { testRunner } from "./Tester.js";

export const waitForIt = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const getServeOptions = async (database) => {
  const content = fs.readFileSync("./serve-options.json", "utf-8");
  const options = JSON.parse(content);
  return options[database];
};

export const executeScenario = async (serveOptions) => {
  const connection = knex({
    client: serveOptions.DB_CLIENT,
    connection: {
      host: serveOptions.DB_HOST,
      user: serveOptions.DB_USER,
      password: serveOptions.DB_PASSWORD,
      database: serveOptions.DB_DATABASE,
      port: serveOptions.DB_PORT,
      searchPath: [process.env.DB_USER, "public"],
    },
    migrations: {
      directory: `./scenarios/migrations`,
    },
  });
  process.stdout.write("Database is updating...");
  await connection.migrate.latest();
  process.stdout.write("SUCCESS!\n");

  // App
  const app = new Runner("");
  await waitForIt(2000);
  const response = await testRunner("");
  if (!response.results.success) {
    process.exit(1);
  }

  process.stdout.write("Database is downgrading...");
  await connection.migrate.down();
  process.stdout.write("SUCCESS!\n");

  app.kill();
};

export const setEnvFile = async (serveOption) => {
  console.log(`SERVER: ${serveOption._title}`);
  let content = "";
  for (const key of Object.keys(serveOption)) {
    if (key === "_title") {
      continue;
    }
    content += `${key}=${serveOption[key]}\n`;
  }
  await fs.writeFileSync("./.env", content);
};
