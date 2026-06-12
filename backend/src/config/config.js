import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_LOCAL;
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "30d";

export {PORT, MONGO_URI, JWT_SECRET, SALT_ROUNDS, JWT_EXPIRES}