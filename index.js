import { TikTokLiveConnection, WebcastEvent } from "tiktok-live-connector";

const username = "eider_monsalve"; // el del link, sin @
const conn = new TikTokLiveConnection(username); // sin sessionId ni ttTargetIdc

conn.on(WebcastEvent.CONNECTED, (state) => {
  console.log("Conectado a la room:", state.roomId);
});

conn.on(WebcastEvent.CHAT, (msg) => {
  const user = msg.user?.uniqueId || msg.user?.nickname || "usuario";
  console.log(`${user}: ${msg.comment}`);
});

conn.on(WebcastEvent.GIFT, (gift) => {
  const who = gift.user?.uniqueId || gift.user?.nickname || "alguien";
  const giftName = gift.gift?.name ?? gift.giftId;
  console.log(`🎁 ${who} envió ${giftName} x${gift.repeatCount}`);
});

conn.on(WebcastEvent.DISCONNECTED, () => {
  console.log("Desconectado del live");
});

conn.on(WebcastEvent.ERROR, (err) => {
  console.error("Error:", err?.message || err);
});

conn.connect().catch((e) => {
  console.error(
    "No se pudo conectar (¿el canal está EN VIVO?):",
    e?.message || e
  );
});
