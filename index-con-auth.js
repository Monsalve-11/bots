import { TikTokLiveConnection, WebcastEvent } from "tiktok-live-connector";
import dotenv from "dotenv";

dotenv.config();

// Lista de usuarios a monitorear con sus configuraciones
const usersConfig = [
  {
    username: "eider_monsalve",
    sessionId: process.env.TT_SESSIONID,
    targetIdc: process.env.TT_TARGET_IDC,
  },
  {
    username: "usuario2",
    sessionId: process.env.TT_SESSIONID_2, // Segunda sesión
    targetIdc: process.env.TT_TARGET_IDC_2,
  },
  // Agrega más usuarios con sus respectivas sesiones
];

// Función para crear y configurar una conexión para un usuario
function connectToUser(config) {
  console.log(`\n🔄 Iniciando conexión para: @${config.username}`);

  // Crear conexión con o sin autenticación según disponibilidad
  const conn = new TikTokLiveConnection(config.username, {
    sessionId: config.sessionId,
    ttTargetIdc: config.targetIdc,
  });

  conn.on(WebcastEvent.CONNECTED, (state) => {
    console.log(
      `✅ [@${config.username}] Conectado a la room: ${state.roomId}`
    );
  });

  conn.on(WebcastEvent.CHAT, (msg) => {
    const user = msg.user?.uniqueId || msg.user?.nickname || "usuario";
    console.log(`💬 [@${config.username}] ${user}: ${msg.comment}`);
  });

  conn.on(WebcastEvent.GIFT, (gift) => {
    const who = gift.user?.uniqueId || gift.user?.nickname || "alguien";
    const giftName = gift.gift?.name ?? gift.giftId;
    console.log(
      `🎁 [@${config.username}] ${who} envió ${giftName} x${gift.repeatCount}`
    );
  });

  conn.on(WebcastEvent.DISCONNECTED, () => {
    console.log(`❌ [@${config.username}] Desconectado del live`);
  });

  conn.on(WebcastEvent.ERROR, (err) => {
    console.error(`⚠️ [@${config.username}] Error:`, err?.message || err);
  });

  // Conectar
  conn.connect().catch((e) => {
    console.error(
      `❌ [@${config.username}] No se pudo conectar (¿el canal está EN VIVO?):`,
      e?.message || e
    );
  });

  return conn;
}

// Conectar a todos los usuarios
const connections = usersConfig.map((config) => connectToUser(config));

console.log(
  `\n📡 Monitoreando ${connections.length} canales simultáneamente...`
);
