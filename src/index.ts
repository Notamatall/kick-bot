import { KickApiClient } from "./kick-api-client";
import dotenv from "dotenv";
import "./webhook.server";
import { KickWebhookServer } from "./webhook.server";
dotenv.config();

async function main() {
  const client = new KickApiClient({
    clientId: process.env.KICK_CLIENT_ID || "your-client-id",
    clientSecret: process.env.KICK_CLIENT_SECRET || "your-client-secret",
    tokenUrl:
      process.env.KICK_APP_ACCESS_TOKEN_ENDPOINT ||
      "https://id.kick.com/oauth/token",
    publicAPIBaseUrl:
      process.env.KICK_PUBLIC_API_BASE_URL || "https://id.kick.com",
  });
  await client.authenticate();
  const webhookServer = new KickWebhookServer({
    port: 3000,
    broadcasterUserId: 62748268,
    events: [{ name: "chat.message.sent", version: "1" }],
    webhookUrl: "https://vocal-lacewing-fully.ngrok-free.app/webhook",
  });
  await webhookServer.start(client.accessToken!);
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

main().catch(console.error);
