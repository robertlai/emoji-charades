import Lobby from "@/components/Lobby";
import { AuthenticatedContextProvider } from "@/contexts/AuthenticatedContext";

export default function LobbyPage() {
  return (
    <AuthenticatedContextProvider clientId={process.env.DISCORD_CLIENT_ID}>
      <Lobby />
    </AuthenticatedContextProvider>
  );
}
