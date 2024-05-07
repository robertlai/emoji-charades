"use client";
import { createContext, useEffect, useRef, useState } from "react";
import Loading from "@/components/Loading";
import { initDiscordSdk } from "@/utils/discordSdk";
import {
  getGuildMember,
  getUserAvatarUrl,
  getUserDisplayName,
} from "@/utils/user";

export const AuthState = {
  STARTED: 0,
  SUCCESS: 1,
  FAILED: 2,
};

const AuthenticatedContext = createContext();

export function AuthenticatedContextProvider({ clientId, children }) {
  const [state, setState] = useState(AuthState.STARTED);
  const [auth, setAuth] = useState(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;

    let discordSdk;

    async function setupDiscordSdk() {
      discordSdk = initDiscordSdk(clientId);

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
      return accessToken;
    }

    started.current = true;
    setupDiscordSdk().then(async (accessToken) => {
      console.log("Discord SDK is authenticated");

      // Authenticate with Discord client (using the access_token)
      let newAuth = await discordSdk.commands.authenticate({
        access_token: accessToken,
      });
      if (newAuth == null) {
        setState(AuthState.FAILED);
        return;
      }

      // Get user guild name and avatar
      const guildMember = await getGuildMember({
        guildId: discordSdk.guildId,
        accessToken,
      });
      const avatarUri = getUserAvatarUrl({ guildMember, user: newAuth.user });
      const name = getUserDisplayName({ guildMember, user: newAuth.user });

      setAuth({
        ...newAuth,
        display: {
          name,
          avatarUri,
        },
        guildId: discordSdk.guildId,
        channelId: discordSdk.channelId,
      });
      setState(AuthState.SUCCESS);
    });
  }, []);

  if (state == AuthState.STARTED)
    return <Loading message="Authenticating..." />;
  if (state == AuthState.FAILED)
    return <Loading message="Authentication failed." />;

  return (
    <AuthenticatedContext.Provider value={auth}>
      {children}
    </AuthenticatedContext.Provider>
  );
}

export default AuthenticatedContext;
