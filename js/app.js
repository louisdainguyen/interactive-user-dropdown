// Interactive behaviour for the mockup page
(function(){
  const ud = UserDropdown(document.getElementById('ud'), ICONS, IMG, {interactive:true});
  const root = ud.root; root.classList.add('interactive');
  const stage = document.getElementById('stage'), scaler = document.getElementById('scaler'), hint = document.getElementById('hint');
  const ACCOUNTS = {
    me:  {name:'Lisa John',     mail:'lisa@stacks.com',   ava:IMG.me,     online:true},
    acc1:{name:'Lila Thompson', mail:'lila@boards.com',   ava:IMG.acc1_lg, online:true},
    acc2:{name:'Maya Johnson',  mail:'maya@boards.com',   ava:IMG.acc2,   online:true},
    acc3:{name:'Sophie Carter', mail:'sophie@boards.com', ava:IMG.acc3,   online:true},
    acc4:{name:'Ella Martinez', mail:'ella@boards.com',   ava:IMG.acc4,   online:true},
    acc5:{name:'Lisa Kim',      mail:'lisa.kim@boards.com', ava:IMG.acc5, online:true},
  };
  // theme: system setting by default; the toggle overrides and is remembered
  const html = document.documentElement, tbtn = document.getElementById('theme'), mq = matchMedia('(prefers-color-scheme: dark)');
  let saved = null; try { saved = localStorage.getItem('ud-theme'); } catch (e) {}
  const q = new URLSearchParams(location.search).get('theme'); if (q === 'dark' || q === 'light') saved = q;
  function applyTheme(){
    if (saved) html.dataset.theme = saved; else delete html.dataset.theme;
    const dark = saved ? saved === 'dark' : mq.matches;
    html.classList.toggle('is-dark', dark);
    tbtn.querySelector('.lbl').textContent = dark ? 'Light' : 'Dark';
    tbtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  tbtn.addEventListener('click', e => { e.stopPropagation(); saved = html.classList.contains('is-dark') ? 'light' : 'dark'; try { localStorage.setItem('ud-theme', saved); } catch (e) {} applyTheme(); });
  mq.addEventListener('change', applyTheme); applyTheme();
  let online = true, sub = null, openTimer = 0, closeTimer = 0;

  function fit(){
    const w = innerWidth, h = innerHeight, narrow = w < 960;
    stage.classList.toggle('narrow', narrow);
    const s = narrow ? Math.min(1, (w-24)/288, (h-40)/638) : Math.min(1, (h-48)/638, (w-48)/896);
    scaler.style.transform = `translate(-50%,-50%) scale(${s})`;
  }
  addEventListener('resize', fit); fit();

  function paintRows(){ ud.setRowStates(null, sub || 'account-default'); }
  function openSub(name){
    clearTimeout(closeTimer); clearTimeout(openTimer);
    if (sub === name) return;
    sub = name; ud.setSub(name); paintRows();
    if (name) ud.setSubHover(name, 0);
  }
  function closeSub(){ clearTimeout(openTimer); sub = null; ud.setSub(null); paintRows(); }
  function setOpen(o){
    ud.setOpen(o); if (!o) closeSub(); else { paintRows(); hint.classList.add('gone'); }
  }

  // open / close the menu
  ud.R('head').addEventListener('click', e => { e.stopPropagation(); setOpen(!ud.isOpen()); });
  ud.$('.dd').addEventListener('click', e => { if (!ud.isOpen()) { e.stopPropagation(); setOpen(true); } });
  stage.addEventListener('click', e => { if (!root.contains(e.target)) setOpen(false); });

  // sub-menu triggers: hover on desktop, tap anywhere
  ['status','account','space'].forEach(id => {
    const r = ud.R(id);
    r.setAttribute('aria-haspopup','menu');
    r.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && ud.isOpen()) { clearTimeout(openTimer); openTimer = setTimeout(() => openSub(id), 90); } });
    r.addEventListener('click', e => { e.stopPropagation(); sub === id ? closeSub() : openSub(id); });
  });
  ud.$$('.dd .row').forEach(r => {
    if (['status','account','space','head'].includes(r.dataset.row)) return;
    r.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && sub) { clearTimeout(openTimer); closeTimer = setTimeout(closeSub, 160); } });
  });
  ud.$$('.sub').forEach(s => {
    s.addEventListener('pointerenter', () => clearTimeout(closeTimer));
    s.addEventListener('pointermove', () => s.querySelectorAll('.row.hover').forEach(r => r.classList.remove('hover')), {passive:true});
    s.addEventListener('click', e => e.stopPropagation());
  });

  // actions
  ud.$$('[data-account]').forEach(b => b.addEventListener('click', () => {
    const a = ACCOUNTS[b.dataset.account]; online = true; ud.setPersona(a); ud.setLabel('status','Update status'); closeSub();
  }));
  ud.$$('[data-space]').forEach(b => b.addEventListener('click', () => { ud.setSpaceLogo(IMG[b.dataset.space], true); closeSub(); }));
  ud.$$('[data-status]').forEach(b => b.addEventListener('click', () => {
    const st = b.dataset.status; const p = currentPersona(); p.online = st !== 'Not Available';
    ud.setPersona(p); ud.setLabel('status', st); closeSub();
  }));
  const mind = ud.$('[data-row="mind"] input');
  mind.addEventListener('keydown', e => {
    if (e.key === 'Enter' && mind.value.trim()) { ud.setLabel('status', mind.value.trim()); mind.value=''; mind.blur(); closeSub(); }
    e.stopPropagation();
  });
  ud.R('logout').addEventListener('click', () => setOpen(false));
  function currentPersona(){
    return {name:ud.$('.who .name').textContent, mail:ud.$('.who .mail').textContent, ava:ud.$('.ava').dataset.src, online:!ud.$('.badge').classList.contains('off')};
  }

  // keyboard: Esc, shortcuts shown in the design, arrow keys inside sub-menus
  const flash = r => { r.classList.add('hover'); setTimeout(() => r.classList.remove('hover'), 220); r.focus({preventScroll:true}); };
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { sub ? closeSub() : setOpen(false); return; }
    if (!ud.isOpen()) { if (e.key === 'Enter' && document.activeElement === document.body) setOpen(true); return; }
    const mod = e.metaKey || e.ctrlKey;
    if (!mod && /^[1-4]$/.test(e.key)) { flash(ud.R(['profile','appearance','settings','notifications'][+e.key-1])); return; }
    if (!mod && (e.key === 's' || e.key === 'S')) { sub === 'account' ? closeSub() : openSub('account'); return; }
    if (mod && e.ctrlKey && e.metaKey && /^[1-3]$/.test(e.key)) { e.preventDefault(); ud.$(`[data-space="sp${e.key}"]`).click(); return; }
    if (mod && !e.shiftKey && /^[1-5]$/.test(e.key) && sub === 'account') { e.preventDefault(); ud.$(`[data-account="acc${e.key}"]`).click(); return; }
    if (sub && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      const rows = ud.$$(`.sub-${sub} .list > *`); let i = rows.indexOf(document.activeElement.closest('.row'));
      if (i < 0) i = rows.findIndex(r => r.classList.contains('hover'));
      i = (i + (e.key === 'ArrowDown' ? 1 : rows.length - 1)) % rows.length;
      rows.forEach(r => r.classList.remove('hover'));
      const t = rows[i]; t.classList.add('hover'); (t.querySelector('input') || t).focus({preventScroll:true});
    }
  });
})();
