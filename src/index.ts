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
  // client2.on('channelFollowed', data => {
  //     console.log(`New follower: ${data.follower.username}`);
  // });

  // client2.on('subscriptionNew', sub => {
  //     console.log(`New sub: ${sub.subscriber.username}`);
  // });

  // client2.on('subscriptionRenewal', renewal => {
  //     console.log(`Renewal: ${renewal.subscriber.username}`);
  // });

  // client2.on('subscriptionGifts', gifts => {
  //     console.log(`${gifts.gifter.username} gifted ${gifts.giftees.length} subs!`);
  // });

  // // Error handling
  // client2.on('error', error => {
  //     console.error('Subscription error:', error);
  // });
}

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Start the application
main().catch(console.error);
