import Main from "@/components/Main";
import { AuthenticatedContextProvider } from "@/contexts/AuthenticatedContext";
import { SocketContextProvider } from "@/contexts/SocketContext";

export default function Page() {
  return (
    <AuthenticatedContextProvider clientId={process.env.DISCORD_CLIENT_ID}>
      <SocketContextProvider>
        <Main />
      </SocketContextProvider>
    </AuthenticatedContextProvider>
  );
}
