/* User dropdown component — builds the markup from the Figma data and exposes a small state API. */
function UserDropdown(root, ICONS, IMG, opts) {
  opts = opts || {};
  const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
  const bg = (u) => `background-image:url('${u}')`;

  const ROWS = [
    // id, section, icon, label, trailing, extra class
    ['status', 1, 'status', 'Update status', `<span class="trail">${ICONS.chevron}</span>`, 'muted'],
    ['profile', 2, 'profile', 'Your profile', '<span class="kbd">1</span>'],
    ['appearance', 2, 'appearance', 'Appearance', '<span class="kbd">2</span>'],
    ['settings', 2, 'settings', 'Settings', '<span class="kbd">3</span>'],
    ['notifications', 2, 'notifications', 'Notifications', '<span class="kbd">4</span>'],
    ['upgrade', 3, null, 'Upgrade to Pro', '<span class="promo">20% off</span>'],
    ['referrals', 3, 'referrals', 'Referrals', ''],
    ['download', 4, 'download', 'Download', ''],
    ['whatsnew', 4, 'whatsnew', 'What’s new?', ICONS.external],
    ['help', 4, 'help', 'Get help?', ICONS.external],
    ['account', 5, 'switchaccount', 'Switch account', '<span class="kbd">S</span>'],
  ];
  const row = (r) => {
    const icon = r[0] === 'upgrade'
      ? `<span class="ico-swap"><span data-up="star">${ICONS.upgrade}</span><span data-up="green" style="opacity:0">${ICONS.diamond_green}</span><span data-up="blue" style="opacity:0">${ICONS.diamond_blue}</span></span>`
      : ICONS[r[2]];
    return `<button class="row ${r[5] || ''}" data-row="${r[0]}" type="button">${icon}<span class="lbl">${r[3]}</span>${r[4]}</button>`;
  };
  const sec = (n, cls) => `<div class="sec ${cls || ''}">${ROWS.filter(r => r[1] === n).map(row).join('')}</div>`;

  root.classList.add('ud');
  root.innerHTML = `
  <div class="dd">
    <div class="card">
      <div class="sec s1">
        <button class="row head" data-row="head" type="button" aria-haspopup="menu" aria-expanded="false">
          <span class="ava" style="${bg(IMG.me)}"></span>
          <span class="who"><span class="top"><span class="name">Lisa John</span><span class="badge">Online</span></span>
          <span class="mail">lisa@stacks.com</span></span>
        </button>
        ${row(ROWS[0])}
      </div>
      ${sec(2)}${sec(3)}${sec(4)}${sec(5, 'last')}
    </div>
    <div class="foot">
      <button class="row" data-row="space" type="button">${ICONS.switchspace}<span class="lbl">Switch space</span><span class="logo" style="${bg(IMG.space_trigger)}"></span></button>
      <button class="row" data-row="logout" type="button">${ICONS.logout}<span class="lbl">Log out</span></button>
    </div>
  </div>

  <div class="sub sub-status" data-sub="status" role="menu">
    <div class="ttl">Update status</div>
    <div class="list">
      ${[['notavailable', 'Not Available'], ['meeting', 'In A Meeting'], ['focusing', 'Focusing'], ['vacation', 'On A Vacation']]
        .map(([i, l]) => `<button class="row" data-status="${l}" type="button" role="menuitem">${ICONS[i]}<span class="lbl">${l}</span></button>`).join('')}
      <label class="row boxed white" data-row="mind">${ICONS.mind}<input class="lbl" type="text" placeholder="What’s on your mind?" aria-label="Custom status" ${opts.interactive ? '' : 'tabindex="-1" readonly'}><span class="kbd">⏎</span></label>
    </div>
  </div>

  <div class="sub sub-space" data-sub="space" role="menu">
    <div class="ttl">Switch space:</div>
    <div class="list">
      ${[['sp1', 'New Solutions', '⌘⌃1'], ['sp2', 'Firma Accounting', '⌘⌃2'], ['sp3', 'Aether AI', '⌘⌃3']]
        .map(([i, l, k]) => `<button class="row" data-space="${i}" type="button" role="menuitem"><span class="mini sq" style="${bg(IMG[i])}"></span><span class="lbl">${l}</span><span class="kbd" style="color:var(--muted)">${k}</span></button>`).join('')}
      <button class="row boxed" data-row="addspace" type="button">${ICONS.addspace}<span class="lbl">Add new space</span><span class="kbd" style="color:var(--muted)">⌘⌃P</span></button>
    </div>
  </div>

  <div class="sub sub-account" data-sub="account" role="menu">
    <div class="ttl">Switch account:</div>
    <div class="list">
      ${[['acc1', 'Lila Thompson', '⌘1'], ['acc2', 'Maya Johnson', '⌘2'], ['acc3', 'Sophie Carter', '⌘3'], ['acc4', 'Ella Martinez', '⌘4'], ['acc5', 'Lisa Kim', '⌘5']]
        .map(([i, l, k]) => `<button class="row" data-account="${i}" type="button" role="menuitem"><span class="mini" style="${bg(IMG[i])}"></span><span class="lbl">${l}</span><span class="kbd">${k}</span></button>`).join('')}
      <button class="row boxed" data-row="addaccount" type="button">${ICONS.addaccount}<span class="lbl">Add new account</span><span class="kbd">⌘P</span></button>
    </div>
  </div>`;

  const $ = (s) => root.querySelector(s);
  const $$ = (s) => [...root.querySelectorAll(s)];
  const R = (id) => $(`[data-row="${id}"]`);

  // cross-fade a text node or background when its value changes (Smart Animate dissolve)
  function swapText(node, txt) {
    if (!node || node.textContent === txt) return;
    if (opts.instant) { node.textContent = txt; return; }
    node.classList.add('fade'); node.style.opacity = 0;
    setTimeout(() => { node.textContent = txt; node.style.opacity = 1; }, 150);
  }
  function swapBg(node, url) {
    if (!node) return;
    const v = `url("${url}")`;
    if (node.dataset.src === url) return;
    node.dataset.src = url;
    if (opts.instant || !node.style.backgroundImage) { node.style.backgroundImage = v; return; }
    node.classList.add('fade'); node.style.opacity = 0;
    setTimeout(() => { node.style.backgroundImage = v; node.style.opacity = 1; }, 150);
  }

  const api = {
    root, $, $$, R,
    setOpen(o) { root.classList.toggle('open', !!o); R('head').setAttribute('aria-expanded', !!o); if (!o) api.setSub(null); },
    isOpen() { return root.classList.contains('open'); },
    setSub(name) {
      $$('.sub').forEach(s => s.classList.toggle('show', s.dataset.sub === name));
      api.current = name;
    },
    setPersona(p) {
      swapText($('.who .name'), p.name); swapText($('.who .mail'), p.mail); swapBg($('.ava'), p.ava);
      const b = $('.badge'); swapText(b, p.online ? 'Online' : 'Offline'); b.classList.toggle('off', !p.online);
    },
    setUpgrade(kind) { // 'star' | 'green' | 'blue'
      $$('[data-up]').forEach(s => s.style.cssText = `position:absolute;inset:0;transition:opacity var(--dur) var(--ease);opacity:${s.dataset.up === kind ? 1 : 0}`);
      swapText(R('upgrade').querySelector('.lbl'), kind === 'blue' ? 'Upgrade to Premium' : 'Upgrade to Pro');
      R('upgrade').querySelector('.promo').style.background = { star: '#f97316', green: '#22c55e', blue: '#2563eb' }[kind];
    },
    setLabel(id, txt) { swapText(R(id).querySelector('.lbl'), txt); },
    setSpaceLogo(url, round6) { const l = R('space').querySelector('.logo'); swapBg(l, url); l.classList.toggle('r6', !!round6); },
    // row visual states from the frames: hover = grey fill, boxed = white outlined "active" row
    setRowStates(hover, boxed) {
      $$('.dd .row').forEach(r => { r.classList.toggle('hover', r.dataset.row === hover); });
      ['status', 'account', 'space'].forEach(id => {
        const r = R(id); const on = boxed === id; r.classList.toggle('boxed', on); r.classList.toggle('white', on && boxed !== 'account-default');
      });
      if (boxed === 'account-default') { R('account').classList.add('boxed'); R('account').classList.remove('white'); }
    },
    setSubHover(name, idx) {
      $$(`.sub-${name} .list .row`).forEach((r, i) => r.classList.toggle('hover', i === idx && !r.classList.contains('boxed')));
    },
  };
  [...$$('[data-up]')].forEach(s => s.style.cssText = 'position:absolute;inset:0');
  $('.ava').dataset.src = IMG.me; $('.ava').style.backgroundImage = `url("${IMG.me}")`;
  R('space').querySelector('.logo').dataset.src = IMG.space_trigger;
  api.setUpgrade('star');
  return api;
}
