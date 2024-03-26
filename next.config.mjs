/** @type {import('next').NextConfig} */
import { config as dotenvConfig } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenvConfig({ path: './dev.env' });
}

const nextConfig = {
  reactStrictMode: true,
  // Transpile Swagger UI React https://github.com/swagger-api/swagger-ui/issues/8245
  transpilePackages: [
    "react-syntax-highlighter",
    "swagger-client",
    "swagger-ui-react",
  ],
  experimental: {
    serverComponentsExternalPackages: ["couchbase"],
  },
}

export default nextConfig
