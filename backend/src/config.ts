const dotEnvConfig = require("dotenv").config();

if (dotEnvConfig.error) {
  console.error('Unable to load ".env" file');
  process.exit(-1);
}

if (!process.env.MONGODB_URL) {
  console.error(
    '".env" file loaded but MONGODB_URL=<url> key-value pair was not found'
  );
  process.exit(-1);
}

if (!process.env.SERVER_PORT) {
  console.error(
    '".env" file loaded but SERVER_PORT=<port> key-value pair was not found'
  );
  process.exit(-1);
}

if (!process.env.JWT_SECRET) {
  console.error(
    '".env" file loaded but JWT_SECRET=<secret> key-value pair was not found'
  );
  process.exit(-1);
}
