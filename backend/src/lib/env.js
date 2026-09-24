import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const ENV = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  SUPER_ADMIN_EMAIL: (process.env.SUPER_ADMIN_EMAIL || "sahurishabh5765@gmail.com").toLowerCase(),
};

const REQUIRED_PRODUCTION_ENV = [
  "DB_URL",
  "CLIENT_URL",
  "GOOGLE_CLIENT_ID",
  "JWT_SECRET",
  "STREAM_API_KEY",
  "STREAM_API_SECRET",
];

export function validateEnv() {
  if (ENV.NODE_ENV !== "production") return;

  const missingKeys = REQUIRED_PRODUCTION_ENV.filter((key) => !ENV[key]);

  if (missingKeys.length > 0) {
    throw new Error(`Missing required production environment variables: ${missingKeys.join(", ")}`);
  }
}
