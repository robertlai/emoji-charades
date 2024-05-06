"use client";
import { initDiscordSdk } from "@/utils/discordSdk";
import { createContext, useContext, useEffect, useState } from "react";
import Loading from "@/components/Loading";

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
  guildImg: "",
});

export function AuthenticatedContextProvider({ clientId, children }) {
  const authenticatedContext = useAuthenticatedContextSetup(clientId);
  if (authenticatedContext == null) {
    return <Loading />;
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

function useAuthenticatedContextSetup(clientId) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    async function setupDiscordSdk() {
      const discordSdk = initDiscordSdk(clientId);
      await discordSdk.ready();
      console.log("Discord SDK is ready");

      // Authorize with Discord Client
      const { code } = await discordSdk.commands.authorize({
        client_id: clientId,
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

      console.log(access_token);

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

      // 1. From the HTTP API fetch a list of all of the user's guilds
      const guilds = await fetch(
        `https://discord.com/api/v10/users/@me/guilds`,
        {
          headers: {
            // NOTE: we're using the access_token provided by the "authenticate" command
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      ).then((response) => response.json());

      // 2. Find the current guild's info, including it's "icon"
      const currentGuild = guilds.find((g) => g.id === discordSdk.guildId);
      const guildImg = `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.webp?size=128`;

      setAuth({ ...newAuth, channelName, guildImg });
    }

    setupDiscordSdk().then(() => {
      console.log("Discord SDK is authenticated");

      // We can now make API calls within the scopes we requested in setupDiscordSDK()
      // Note: the access_token returned is a sensitive secret and should be treated as such
    });
  }, []);

  return auth;
}
