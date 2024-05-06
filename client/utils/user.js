export async function getGuildMember({ guildId, accessToken }) {
  // Get guild specific nickname and avatar, and fallback to user name and avatar
  return await fetch(`/discord/api/users/@me/guilds/${guildId}/member`, {
    method: "get",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then((j) => j.json())
    .catch(() => null);
}

export function getUserAvatarUrl({
  guildMember,
  user,
  cdn = `https://cdn.discordapp.com`,
  size = 256,
}) {
  if (guildMember?.avatar != null && discordSdk.guildId != null) {
    return `${cdn}/guilds/${discordSdk.guildId}/users/${user.id}/avatars/${guildMember.avatar}.png?size=${size}`;
  }
  if (user.avatar != null) {
    return `${cdn}/avatars/${user.id}/${user.avatar}.png?size=${size}`;
  }

  const defaultAvatarIndex = Math.abs(Number(user.id) >> 22) % 6; //(BigInt(user.id) >> 22n)) % 6n;
  return `${cdn}/embed/avatars/${defaultAvatarIndex}.png?size=${size}`;
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
