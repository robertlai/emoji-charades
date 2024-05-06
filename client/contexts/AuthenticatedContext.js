"use client";
import { initDiscordSdk } from "@/utils/discordSdk";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const AuthenticatedContext = createContext({
  user: {
    id: "",
    username: "",
    discriminator: "",
    avatar: null,
    public_flags: 0,
  },
  access_token: "",
  scopes: [],
  expires: "",
  application: {
    rpc_origins: undefined,
    id: "",
    name: "",
    icon: null,
    description: "",
  },
  guildMember: null,
  client: undefined,
  room: undefined,
  channelName: "",
});

export function AuthenticatedContextProvider({ env, children }) {
  const authenticatedContext = useAuthenticatedContextSetup(env);
  if (authenticatedContext == null) {
    return <>loading</>;
  }
  return (
    <AuthenticatedContext.Provider value={authenticatedContext}>
      {children}
    </AuthenticatedContext.Provider>
  );
}

export function useAuthenticatedContext() {
  return useContext(AuthenticatedContext);
}

function useAuthenticatedContextSetup(env) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    async function setupDiscordSdk() {
      const discordSdk = initDiscordSdk(env);
      await discordSdk.ready();
      console.log("Discord SDK is ready");

      // Authorize with Discord Client
      const { code } = await discordSdk.commands.authorize({
        client_id: env.DISCORD_CLIENT_ID,
        response_type: "code",
        state: "",
        prompt: "none",
        scope: ["identify", "guilds"],
      });

      // Retrieve an access_token from your activity's server
      const response = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
        }),
      });
      const { access_token } = await response.json();

      // Authenticate with Discord client (using the access_token)
      let newAuth = await discordSdk.commands.authenticate({
        access_token,
      });

      if (newAuth == null) {
        throw new Error("Authenticate command failed");
      }

      let channelName = "Unknown";

      // Requesting the channel in GDMs (when the guild ID is null) requires
      // the dm_channels.read scope which requires Discord approval.
      if (discordSdk.channelId != null && discordSdk.guildId != null) {
        // Over RPC collect info about the channel
        const channel = await discordSdk.commands.getChannel({
          channel_id: discordSdk.channelId,
        });
        if (channel.name != null) {
          channelName = channel.name;
        }
      }

      setAuth({ ...newAuth, channelName });
    }

    setupDiscordSdk().then(() => {
      console.log("Discord SDK is authenticated");

      // We can now make API calls within the scopes we requested in setupDiscordSDK()
      // Note: the access_token returned is a sensitive secret and should be treated as such
    });
  }, []);

  return auth;
}
