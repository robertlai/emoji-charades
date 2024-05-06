import { memo } from "react";
import twemoji from "twemoji";

const Twemoji = ({ emoji }) => (
  <span
    dangerouslySetInnerHTML={{
      __html: twemoji.parse(emoji, {
        base: "/",
        folder: "emojis",
        ext: ".svg",
      }),
    }}
  />
);

export default memo(Twemoji);
