import { TikTokLiveConnection, WebcastEvent } from "tiktok-live-connector";
import dotenv from "dotenv";

dotenv.config();

// Canal a monitorear (sin @)
const targetUsername = "dzisabel__";

const sessions = [
  {
    name: "Sesión 1",
    sessionId: process.env.TT_SESSIONID_1,
    targetIdc: process.env.TT_TARGET_IDC_1,
  },
  {
    name: "Sesión 2",
    sessionId: process.env.TT_SESSIONID_2,
    targetIdc: process.env.TT_TARGET_IDC_2,
  },
  {
    name: "Sesión 3",
    sessionId: process.env.TT_SESSIONID_3,
    targetIdc: process.env.TT_TARGET_IDC_3,
  },
].filter((s) => s.sessionId);

function connectWithSession(sessionConfig) {
  console.log(
    `\n🔄 [${sessionConfig.name}] Conectando a @${targetUsername}...`
  );

  const conn = new TikTokLiveConnection(targetUsername, {
    sessionId: sessionConfig.sessionId,
    ttTargetIdc: sessionConfig.targetIdc,
  });

  conn.on(WebcastEvent.CONNECTED, (state) => {
    console.log(
      `✅ [${sessionConfig.name}] Conectado a la room: ${state.roomId}`
    );
  });

  conn.on(WebcastEvent.CHAT, (msg) => {
    const user = msg.user?.uniqueId || msg.user?.nickname || "usuario";
    console.log(`💬 [${sessionConfig.name}] ${user}: ${msg.comment}`);
  });

  conn.on(WebcastEvent.GIFT, (gift) => {
    const who = gift.user?.uniqueId || gift.user?.nickname || "alguien";
    const giftName = gift.gift?.name ?? gift.giftId;
    console.log(
      `🎁 [${sessionConfig.name}] ${who} envió ${giftName} x${gift.repeatCount}`
    );
  });

  conn.on(WebcastEvent.DISCONNECTED, () => {
    console.log(`❌ [${sessionConfig.name}] Desconectado del live`);
  });

  conn.on(WebcastEvent.ERROR, (err) => {
    console.error(`⚠️ [${sessionConfig.name}] Error:`, err?.message || err);
  });

  conn.connect().catch((e) => {
    console.error(
      `❌ [${sessionConfig.name}] No se pudo conectar:`,
      e?.message || e
    );
  });

  return conn;
}

if (sessions.length === 0) {
  console.error("⚠️ No se encontraron sesiones configuradas en el .env");
  console.log(
    "💡 Agrega TT_SESSIONID_1, TT_SESSIONID_2, etc. en tu archivo .env"
  );
} else {
  const connections = sessions.map((session) => connectWithSession(session));
  console.log(
    `\n📡 ${connections.length} sesiones conectadas a @${targetUsername}`
  );
}
