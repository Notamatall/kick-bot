import fetch from "node-fetch";

interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

interface KickApiConfig {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  publicAPIBaseUrl: string;
}

interface StreamInfo {
  id: number;
  slug: string;
  channel_id: number;
  created_at: string;
  session_title: string;
  is_live: boolean;
  risk_level_id: number;
  source: string | null;
  twitch_category: string | null;
  duration: number;
  language: string;
  is_mature: boolean;
  viewer_count: number;
  thumbnail: {
    url: string;
  } | null;
  viewers: number;
}

interface ChannelInfo {
  id: number;
  user_id: number;
  slug: string;
  is_banned: boolean;
  playback_url: string;
  vod_enabled: boolean;
  subscription_enabled: boolean;
  followersCount: number;
  subscriber_badges: any[];
  banner_image: {
    url: string;
  } | null;
  livestream: StreamInfo | null;
  role: string | null;
  muted: boolean;
  follower_badges: any[];
  offline_banner_image: {
    url: string;
  } | null;
  can_host: boolean;
  user: {
    id: number;
    username: string;
    agreed_to_terms: boolean;
    email_verified_at: string | null;
    bio: string;
    country: string;
    state: string;
    city: string;
    instagram: string;
    twitter: string;
    youtube: string;
    discord: string;
    tiktok: string;
    facebook: string;
    profile_pic: string;
  };
}

export class KickApiClient {
  private config: KickApiConfig;
  accessToken: string | null = null;

  constructor(config: KickApiConfig) {
    this.config = config;
  }

  async authenticate(): Promise<void> {
    try {
      const formData = new URLSearchParams();
      formData.append("grant_type", "client_credentials");
      formData.append("client_id", this.config.clientId);
      formData.append("client_secret", this.config.clientSecret);
      const response = await fetch(this.config.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(
          `Authentication failed: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as any;

      if (data.access_token || data.token) {
        this.accessToken = data.access_token || data.token;
        this.tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
        console.log("Authentication successful");
      } else {
        throw new Error("No access token received from authentication");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  }
}
