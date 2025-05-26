import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

type KickEvent = {
  name: string;
  version: string;
};

interface KickWebhookServerOptions {
  port?: number;
  broadcasterUserId: number;
  webhookUrl: string;
  events: KickEvent[];
}

export class KickWebhookServer {
  private app = express();
  private port: number;
  private broadcasterUserId: number;
  private webhookUrl: string;
  private events: KickEvent[];

  constructor(options: KickWebhookServerOptions) {
    this.port = options.port || 3000;
    this.broadcasterUserId = options.broadcasterUserId;
    this.webhookUrl = options.webhookUrl;
    this.events = options.events;

    this.setupRoutes();
  }

  private setupRoutes() {
    this.app.use(bodyParser.json());

    this.app.get("/health", (_req: Request, res: Response) => {
      res.status(200).send({ status: "ok" });
    });

    this.app.post("/webhook", (req: Request, res: Response) => {
      console.log("🔔 Webhook received:", req.body.content);
      res.status(200).send("Webhook received");
    });
  }

  private async subscribeToKickEvents(token: string) {
    try {
      const res = await fetch(
        "https://api.kick.com/public/v1/events/subscriptions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            broadcaster_user_id: 62748268,
            events: [
              "chat.message.sent",
              "channel.followed",
              "channel.subscription.new",
              "channel.subscription.renewal",
              "channel.subscription.gifts",
            ].map((event) => ({
              name: event,
              version: 1,
            })),
            method: "webhook",
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ Failed to subscribe (${res.status}):`, errorText);
      } else {
        const data = await res.json();
        console.log("✅ Successfully subscribed to Kick events:", data);
      }
    } catch (err) {
      console.error("❌ Subscription error:", err);
    }
  }

  public async start(accessToken: string) {
    this.app.listen(this.port, () => {
      console.log(`🚀 KickWebhookServer running on port ${this.port}`);
    });

    await this.subscribeToKickEvents(accessToken);
  }
}
