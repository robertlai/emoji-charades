import LobbyPage from "@/components/LobbyPage";
import { AuthenticatedContextProvider } from "@/contexts/AuthenticatedContext";
const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } = process.env;

export default function HomeWrapped() {
  return (
    <AuthenticatedContextProvider
      env={{ DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET }}
    >
      <LobbyPage />
    </AuthenticatedContextProvider>
  );
}
