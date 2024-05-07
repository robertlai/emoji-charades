const CDN = `https://cdn.discordapp.com`;
const SIZE = 256;

export async function getGuildMember({ guildId, accessToken }) {
  return await fetch(`/discord/api/users/@me/guilds/${guildId}/member`, {
    method: "get",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then((j) => j.json())
    .catch(() => null);
}

export function getUserAvatarUrl({ guildMember, user }) {
  if (guildMember?.avatar != null && discordSdk.guildId != null)
    return `${CDN}/guilds/${discordSdk.guildId}/users/${user.id}/avatars/${guildMember.avatar}.png?size=${SIZE}`;

  if (user.avatar != null)
    return `${CDN}/avatars/${user.id}/${user.avatar}.png?size=${SIZE}`;

  const defaultAvatarIndex = Math.abs(Number(user.id) >> 22) % 6; // (BigInt(user.id) >> 22n) % 6n;
  return `${CDN}/embed/avatars/${defaultAvatarIndex}.png?size=${SIZE}`;
}

export function getUserDisplayName({ guildMember, user }) {
  if (guildMember?.nick != null && guildMember.nick !== "")
    return guildMember.nick;

  if (user.discriminator !== "0")
    return `${user.username}#${user.discriminator}`;

  if (user.global_name != null && user.global_name !== "")
    return user.global_name;

  return user.username;
}
