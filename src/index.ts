import { KickApiClient } from "./kick-api-client";
import dotenv from "dotenv";

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
  try {
    console.log("Starting Kick API integration...");

    // Example 1: Get channel information
    console.log("\n--- Getting Channel Info ---");
    try {
      const channelInfo = await client.getChannel("mirtur"); // Replace with actual channel
      console.log("Channel Info:", {
        name: channelInfo.user.username,
        followers: channelInfo.followersCount,
        isLive: channelInfo.livestream?.is_live || false,
        viewers: channelInfo.livestream?.viewer_count || 0,
      });
    } catch (error: any) {
      console.log(
        "Channel info error (this is normal if not authenticated):",
        error.message
      );
    }

    // Example 2: Get live streams
    console.log("\n--- Getting Live Streams ---");
    try {
      const liveStreams = await client.getLiveStreams(1, 5);
      console.log("Live Streams Count:", liveStreams?.data?.length || 0);

      if (liveStreams?.data?.length > 0) {
        liveStreams.data.slice(0, 3).forEach((stream: any, index: number) => {
          console.log(
            `${index + 1}. ${stream.user?.username} - ${
              stream.session_title
            } (${stream.viewer_count} viewers)`
          );
        });
      }
    } catch (error: any) {
      console.log("Live streams error:", error.message);
    }

    // Example 3: Search channels
    console.log("\n--- Searching Channels ---");
    try {
      const searchResults = await client.searchChannels("gaming", 1);
      console.log("Search Results Count:", searchResults?.data?.length || 0);

      if (searchResults?.data?.length > 0) {
        searchResults.data
          .slice(0, 3)
          .forEach((channel: any, index: number) => {
            console.log(
              `${index + 1}. ${channel.user?.username} - ${
                channel.followersCount
              } followers`
            );
          });
      }
    } catch (error: any) {
      console.log("Search error:", error.message);
    }

    // Example 4: Get categories
    console.log("\n--- Getting Categories ---");
    try {
      const categories = await client.getCategories();
      console.log("Categories Count:", categories?.length || 0);

      if (categories?.length > 0) {
        categories.slice(0, 5).forEach((category: any, index: number) => {
          console.log(`${index + 1}. ${category.name} (ID: ${category.id})`);
        });
      }
    } catch (error: any) {
      console.log("Categories error:", error.message);
    }

    // Example 5: Monitor a specific stream
    console.log("\n--- Monitoring Stream ---");
    const channelToMonitor = "xqc"; // Replace with actual channel

    const monitorStream = async () => {
      try {
        const streamInfo = await client.getStreamInfo(channelToMonitor);

        if (streamInfo && streamInfo.is_live) {
          console.log(`📺 ${channelToMonitor} is LIVE!`);
          console.log(`   Title: ${streamInfo.session_title}`);
          console.log(`   Viewers: ${streamInfo.viewer_count}`);
          console.log(
            `   Duration: ${Math.floor(streamInfo.duration / 60)} minutes`
          );
        } else {
          console.log(`💤 ${channelToMonitor} is offline`);
        }
      } catch (error: any) {
        console.log(`Monitor error for ${channelToMonitor}:`, error.message);
      }
    };

    // Monitor once
    await monitorStream();

    // Optional: Set up periodic monitoring (uncomment to enable)
    /*
    console.log('\n--- Starting Periodic Monitoring (every 30 seconds) ---');
    setInterval(monitorStream, 30000);
    
    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\nShutting down...');
      process.exit(0);
    });
    */
  } catch (error) {
    console.error("Application error:", error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Start the application
main().catch(console.error);
