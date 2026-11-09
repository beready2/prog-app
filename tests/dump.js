// Rend chaque séance dans Chromium à une date et un mode donnés, et écrit le texte affiché.
// Usage : node tests/dump.js <index.html> <AAAA-MM-JJ> <maison|lyon> <sortie.txt>
const { chromium } = require('playwright'); const fs = require('fs');
const [file, dateISO, mode, outp] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({viewport:{width:420,height:900}})).newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.clock.setFixedTime(new Date(dateISO + 'T10:00:00'));
  await p.addInitScript((md) => { if (!localStorage.getItem('moteur_state')) localStorage.setItem('moteur_state', JSON.stringify(md === 'lyon'
    ? {mode:'deplacement', equipDeplacement:['trx','elastiques','poids_du_corps'], windowStart:'2026-11-09', vagueOffsetJours:7}
    : {windowStart:'2026-11-09', vagueOffsetJours:7})); }, mode);
  await p.goto('file://' + require('path').resolve(file)); await p.waitForTimeout(700);
  for (const e of await p.$$('.nav-tab')) if ((await e.textContent()).includes('Sport')) { await e.click(); break; }
  await p.waitForTimeout(300); let all = '';
  for (const nm of ['VO2','Z2','Portage 2','FB1','Z2 long','Portage 1','AGT','Seuil','FB2']) {
    let hit = null; for (const bt of await p.$$('button')) { const t = (await bt.textContent()).replace(/[✓•]/g,'').trim(); if (t === nm) { hit = bt; break; } }
    if (!hit) { all += '\n#### ' + nm + ' INTROUVABLE'; continue; }
    await hit.click(); await p.waitForTimeout(250);
    let t = await p.innerText('body'); const i = t.indexOf('🏋️ ' + nm); t = t.slice(i > 0 ? i : 0, t.indexOf('Séance effectuée aujourd'));
    all += '\n#### ' + nm + ' cursor=' + (await hit.evaluate(e => e.style.cursor)) + '\n' + t;
  }
  fs.writeFileSync(outp, all + '\nERRS ' + JSON.stringify(errs)); await b.close();
})();
