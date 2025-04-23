// scripts/update-status.js
import fs   from 'fs';
import os   from 'os';
import Gamedig from 'gamedig';

const HOST = 'fenomenal.mrjin.pro';
const PORT = 8211;

function fmtUptime(sec) {
  const h = Math.floor(sec/3600),
        m = Math.floor((sec%3600)/60),
        s = Math.floor(sec%60);
  return `${h}ч ${m}м ${s}с`;
}

(async () => {
  let data;
  try {
    const dig = await Gamedig.query({ type:'steam3', host:HOST, port:PORT });
    data = {
      status:      'Онлайн',
      playerCount: dig.players.length,
      uptime:      fmtUptime(os.uptime()),
      cpu:         os.loadavg()[0].toFixed(2),
      memory:      `${Math.round((os.totalmem()-os.freemem())/1024/1024)} MB`
    };
  } catch {
    data = {
      status:      'Офлайн',
      playerCount: 0,
      uptime:      '—',
      cpu:         '—',
      memory:      '—'
    };
  }
  // записываем прямо в корень
  fs.writeFileSync('status.json', JSON.stringify(data, null, 2));
})();
