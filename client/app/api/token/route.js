import { fetchAndRetry } from "@/utils/fetchAndRetry";

export async function POST(request) {
  const { code } = await request.json();

  const response = await fetchAndRetry(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
    }),
  });

  const { access_token } = await response.json();
  return Response.json({ access_token });
}
