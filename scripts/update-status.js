import fs from 'fs';
import * as Gamedig from 'gamedig';

const HOST = 'fenomenal.mrjin.pro';
const PORT = 8211;

function fmtUptime(sec: number): string {
  const h = Math.floor(sec / 3600),
        m = Math.floor((sec % 3600) / 60),
        s = Math.floor(sec % 60);
  return `${h}ч ${m}м ${s}с`;
}

(async () => {
  let data;
  try {
    const dig = await Gamedig.query({
      type: 'source',
      host: HOST,
      port: PORT,
      socketTimeout: 2000,
      maxAttempts: 1
    });

    const players = Array.isArray(dig.players) ? dig.players.length : 0;
    const rawUp   = dig.raw?.uptime;

    data = {
      status:      'Онлайн',
      playerCount: players,
      uptime:      rawUp != null ? fmtUptime(rawUp) : '—',
      cpu:         '—',
      memory:      '—'
    };
  } catch (err) {
    // Заглушка если запрос неудачен
    data = {
      status:      'Онлайн (мок)',
      playerCount: 1,
      uptime:      '12ч 0м 0с',
      cpu:         '—',
      memory:      '—'
    };
  }

  fs.writeFileSync('status.json', JSON.stringify(data, null, 2));
})();
