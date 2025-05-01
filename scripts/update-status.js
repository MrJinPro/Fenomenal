import fs from 'fs';
import * as Gamedig from 'gamedig';

const HOST = 'fenomenal.mrjin.pro';
const PORT = 8211;

function fmtUptime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
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
    const rawUp = dig.raw?.uptime;

    data = {
      status: 'Онлайн',
      playerCount: players,
      uptime: rawUp != null ? fmtUptime(rawUp) : '—',
      cpu: '—',
      memory: '—'
    };
  } catch (err) {
    data = {
      status: 'Офлайн',
      playerCount: 0,
      uptime: '—',
      cpu: '—',
      memory: '—'
    };
  }

  fs.writeFileSync('status.json', JSON.stringify(data, null, 2));
})();
