// scripts/update-status.js
import fs     from 'fs';
import { query } from 'gamedig';

const HOST = 'fenomenal.mrjin.pro';
const PORT = 8211;

// Форматирует секунды в "Xч Ym Zс"
function fmtUptime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${h}ч ${m}м ${s}с`;
}

(async () => {
  let data;

  try {
    const dig = await query({
      type: 'source',
      host: HOST,
      port: PORT
    });

    // Количество игроков
    const players = Array.isArray(dig.players) ? dig.players.length : 0;
    // Uptime отдаёт raw.uptime (в секундах) или undefined
    const rawUp = dig.raw?.uptime;

    data = {
      status:      'Онлайн',
      playerCount: players,
      uptime:      rawUp != null ? fmtUptime(rawUp) : '—',
      cpu:         '—',
      memory:      '—'
    };
  } catch (err) {
    data = {
      status:      'Офлайн',
      playerCount: 0,
      uptime:      '—',
      cpu:         '—',
      memory:      '—'
    };
  }

  // Записываем в корень репо
  fs.writeFileSync('status.json', JSON.stringify(data, null, 2));
})();
