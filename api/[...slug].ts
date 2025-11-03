import { createServer } from "../server";

// Create the Express app once per function instance
const app = createServer();

// Vercel serverless function handler that proxies all /api/* requests to Express
export default function handler(req: any, res: any) {
  return app(req, res);
}
