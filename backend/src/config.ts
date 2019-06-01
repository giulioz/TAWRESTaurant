import dotEnv from "dotenv";
const dotEnvConfig = dotEnv.config();

function checkVariable(name: string) {
  if (!process.env[name]) {
    console.error(`No ${name} environment variable found. Exiting.`);
    process.exit(-1);
  }
}

if (dotEnvConfig.error) {
  console.warn('Unable to load ".env" file, using defaults from environment.');
}

checkVariable("MONGODB_URL");
checkVariable("SERVER_PORT");
checkVariable("JWT_SECRET");
