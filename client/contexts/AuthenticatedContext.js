"use client";
// import { Client } from "colyseus.js";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import Loading from "@/components/Loading";
import { initDiscordSdk } from "@/utils/discordSdk";
import {
  getGuildMember,
  getUserAvatarUrl,
  getUserDisplayName,
} from "@/utils/user";
import { io } from "socket.io-client";

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
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;

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

      const accessToken = (await response.json()).access_token;

      // Authenticate with Discord client (using the access_token)
      let newAuth = await discordSdk.commands.authenticate({
        access_token: accessToken,
      });

      if (newAuth == null) {
        throw new Error("Authenticate command failed");
      }

      let roomName = "Channel";
      // Requesting the channel in GDMs (when the guild ID is null) requires
      // the dm_channels.read scope which requires Discord approval.
      if (discordSdk.channelId != null && discordSdk.guildId != null) {
        // Over RPC collect info about the channel
        const channel = await discordSdk.commands.getChannel({
          channel_id: discordSdk.channelId,
        });
        if (channel.name != null) {
          roomName = channel.name;
        }
      }

      const guildMember = await getGuildMember({
        guildId: discordSdk.guildId,
        accessToken,
      });
      const avatarUri = getUserAvatarUrl({ guildMember, user: newAuth.user });
      const name = getUserDisplayName({ guildMember, user: newAuth.user });

      const socket = io();
      socket.on("connect", () => {
        console.log("connected");
      });

      setAuth({
        ...newAuth,
        guildMember,
      });
    }

    started.current = true;
    setupDiscordSdk().then(() => {
      console.log("Discord SDK is authenticated");

      // We can now make API calls within the scopes we requested in setupDiscordSDK()
      // Note: the access_token returned is a sensitive secret and should be treated as such
    });
  }, []);

  return auth;
}
