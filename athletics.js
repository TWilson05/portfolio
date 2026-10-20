/* Static-page race archive. All editable records live in athletics-content.js. */
'use strict';

// Pure helpers are shared by PBs, season bests, and filtering to keep comparisons consistent.
const Athletics = (() => {
  const statuses = new Set(['DQ', 'DNF', 'NT']);
  const mainEventKeys = new Set([
    'run:100', 'run:200', 'run:400', 'run:800', 'run:1500', 'run:3000', 'run:5000', 'run:10000', 'run:21097.5', 'run:42195',
    'walk:3000', 'walk:5000', 'walk:10000', 'walk:20000', 'walk:21097.5', 'walk:42195'
  ]);
  const filterEventKeys = new Set([
    ...mainEventKeys,
    'run:300', 'run:600', 'run:1200', 'run:2000', 'run:4000', 'run:6000', 'run:8000', 'run:15000',
    'walk:1500', 'walk:15000', 'relay:4x100m', 'relay:4x400m'
  ]);
  function timeValue(performance) {
    const value = String(performance ?? '').trim();
    if (!/^\d+(?::\d{1,2}){0,2}(?:\.\d{1,2})?$/.test(value)) return null;
    const parts = value.split(':').map(Number);
    if (parts.some((part, index) => index > 0 && part >= 60)) return null;
    const hundredths = Math.round(parts.reduce((total, part) => total * 60 + part, 0) * 100);
    return hundredths > 0 ? hundredths : null;
  }
  function formatPerformance(race) {
    const raw = String(race.performance ?? '').trim().toUpperCase();
    if (statuses.has(raw)) return raw;
    const value = timeValue(raw);
    if (value === null) return '—';
    // Track retains hundredths; every surface omits leading zero units.
    const totalSeconds = race.surface === 'track' ? Math.floor(value / 100) : Math.round(value / 100);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const seconds = totalSeconds % 60;
    const pad = number => String(number).padStart(2, '0');
    if (race.surface === 'track') {
      const preciseSeconds = `${pad(seconds)}.${pad(value % 100)}`;
      if (hours) return `${hours}:${pad(minutes)}:${preciseSeconds}`;
      if (minutes) return `${minutes}:${preciseSeconds}`;
      return `${seconds}.${pad(value % 100)}`;
    }
    if (hours) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    if (minutes) return `${minutes}:${pad(seconds)}`;
    return String(seconds);
  }
  function eventKey(race) {
    if (race.groupKey) return race.groupKey;
    const distance = Number(race.distanceMeters);
    if (!Number.isFinite(distance) || distance <= 0) return null;
    return `${race.gait === 'walk' ? 'walk' : 'run'}:${distance}`;
  }
  function eventLabel(race) {
    if (race.groupLabel) return race.groupLabel;
    const distance = Number(race.distanceMeters);
    const special = {1609.344: 'Mile', 16093.44: '10 mile', 21097.5: 'Half marathon', 42195: 'Marathon'};
    const label = special[distance] || (distance >= 2000 ? `${distance / 1000}km` : `${distance}m`);
    return race.gait === 'walk' ? `${label} RW` : label;
  }
  const isMainEvent = race => mainEventKeys.has(eventKey(race));
  const isFilterEvent = race => filterEventKeys.has(eventKey(race));
  const eligible = race => race.bestEligible !== false && timeValue(race.performance) !== null && eventKey(race) !== null;
  function bestMap(records, byYear = false) {
    const bests = new Map();
    for (const race of records) {
      if (!eligible(race)) continue;
      const key = `${byYear ? race.date.slice(0, 4) + ':' : ''}${eventKey(race)}`;
      const previous = bests.get(key);
      if (!previous || timeValue(race.performance) < timeValue(previous.performance)) bests.set(key, race);
    }
    return bests;
  }
  const pointsValue = race => race.points !== null && race.points !== undefined && race.points !== '' && Number.isFinite(Number(race.points)) ? Number(race.points) : null;
  const recentFirst = (a, b) => b.date.localeCompare(a.date);
  function selectRaces(records, {year = 'all', event = 'all', sort = 'date'} = {}) {
    return records.filter(race => {
      const matchesYear = year === 'all' || race.date.slice(0, 4) === year;
      const matchesEvent = event === 'all' || (event === 'surface:xc' ? race.surface === 'xc' : eventKey(race) === event);
      return matchesYear && matchesEvent;
    }).sort((a, b) => {
      const left = sort === 'points' ? pointsValue(a) : timeValue(a.performance);
      const right = sort === 'points' ? pointsValue(b) : timeValue(b.performance);
      if (sort === 'date') return recentFirst(a, b);
      if (left === null && right !== null) return 1;
      if (right === null && left !== null) return -1;
      if (left === right) return recentFirst(a, b);
      return sort === 'points' ? right - left : left - right;
    });
  }
  return Object.freeze({ timeValue, formatPerformance, eventKey, eventLabel, isMainEvent, isFilterEvent, eligible, bestMap, pointsValue, selectRaces });
})();

(() => {
  const content = window.ATHLETICS_CONTENT;
  const $ = id => document.getElementById(id);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  const formatDate = date => new Intl.DateTimeFormat('en-GB', {day:'2-digit', month:'short', year:'numeric', timeZone:'UTC'}).format(new Date(`${date}T12:00:00Z`));
  const surfaceLabel = {track:'Track', road:'Road', xc:'Cross country'};
  const notes = race => Array.isArray(race.notes) ? race.notes : race.notes ? [race.notes] : [];
  const noteTags = race => notes(race).map(note => `<span class="race-note">${escape(note)}</span>`).join(' ');
  const dateMarkup = date => `<time datetime="${escape(date)}">${escape(formatDate(date))}</time>`;
  const performanceMarkup = race => `${escape(Athletics.formatPerformance(race))}${race.performanceNote ? ` <span class="performance-note">(${escape(race.performanceNote)})</span>` : ''}`;
  // Local PDFs and external official results are both supported.
  const resultLink = (race, label) => `<a href="${escape(race.resultsUrl)}"${/^https?:/.test(race.resultsUrl) ? ' target="_blank" rel="noopener noreferrer"' : ''} aria-label="${escape(`Official results: ${race.competition}, ${race.date}; ${label}`)}">${escape(label)} <span aria-hidden="true">↗</span></a>`;

  $('athletics-intro').textContent = content.profile.intro;
  $('archive-intro').textContent = content.profile.archiveIntro;
  $('athletics-banner').src = content.profile.banner;
  $('athletics-banner').alt = content.profile.bannerAlt || '';
  $('athlete-profile').href = content.profile.worldAthletics;

  const pbs = [...Athletics.bestMap(content.races).values()]
    .filter(Athletics.isMainEvent)
    .sort((a, b) => (a.gait || 'run').localeCompare(b.gait || 'run') || a.distanceMeters - b.distanceMeters);
  $('pb-list').innerHTML = pbs.map(race => `<article class="pb-card"><p class="eyebrow">${escape(Athletics.eventLabel(race))}</p><h3>${escape(Athletics.formatPerformance(race))}</h3><p class="pb-event">${escape(race.event)} · ${escape(surfaceLabel[race.surface])}</p><p>${dateMarkup(race.date)}</p><p class="pb-location">${escape(race.location)}</p><div class="pb-notes">${noteTags(race)}</div></article>`).join('') || '<p>No personal bests recorded yet.</p>';

  const years = [...new Set(content.races.map(race => race.date.slice(0, 4)))].sort().reverse();
  $('race-year').innerHTML += years.map(year => `<option value="${escape(year)}">${escape(year)}</option>`).join('');
  const groups = new Map();
  content.races.forEach(race => { const key = Athletics.eventKey(race); if (key && Athletics.isFilterEvent(race)) groups.set(key, race); });
  const events = [...groups.entries()].sort(([,a], [,b]) => (a.gait || 'run').localeCompare(b.gait || 'run') || a.distanceMeters - b.distanceMeters);
  const crossCountryOption = content.races.some(race => race.surface === 'xc') ? '<option value="surface:xc">Cross country</option>' : '';
  $('race-event').innerHTML += crossCountryOption + events.map(([key, race]) => `<option value="${escape(key)}">${escape(Athletics.eventLabel(race))}</option>`).join('');

  // Use the entire saved race archive, so sorting/filtering never changes what counts as SB.
  const seasonBests = Athletics.bestMap(content.races, true);
  function renderRaces() {
    const year = $('race-year').value;
    const event = $('race-event').value;
    const sort = $('race-sort').value;
    const races = Athletics.selectRaces(content.races, {year, event, sort});
    $('race-count').textContent = `${races.length} ${races.length === 1 ? 'race' : 'races'} · ${year === 'all' ? 'All years' : year} · ${$('race-sort').selectedOptions[0].textContent}`;
    $('race-rows').innerHTML = races.map(race => {
      const best = seasonBests.get(`${race.date.slice(0, 4)}:${Athletics.eventKey(race)}`);
      const isBest = Athletics.eligible(race) && best && Athletics.timeValue(best.performance) === Athletics.timeValue(race.performance);
      const time = performanceMarkup(race);
      const place = race.place === null || race.place === undefined || race.place === '' ? null : String(race.place);
      return `<tr><td class="race-date">${dateMarkup(race.date)}</td><td><span class="race-event-name">${escape(race.event)}</span><span class="race-surface">${escape(surfaceLabel[race.surface] || race.surface)}</span></td><td class="race-performance">${isBest ? `<strong>${time}<span class="sr-only"> — Season’s best</span></strong>` : time}</td><td>${escape(race.competition)}</td><td>${escape(race.location)}</td><td class="race-points">${Athletics.pointsValue(race) ?? '—'}</td><td class="race-place">${race.resultsUrl ? resultLink(race, place || 'Results') : escape(place || '—')}</td><td>${noteTags(race) || '—'}</td></tr>`;
    }).join('') || '<tr><td colspan="8" class="race-empty">No races match these filters. Try another year or event.</td></tr>';
  }
  $('race-event').addEventListener('change', () => {
    const comparableEvent = !['all', 'surface:xc'].includes($('race-event').value);
    $('race-sort').querySelector('[value="time"]').disabled = !comparableEvent;
    $('race-sort').value = comparableEvent ? 'time' : 'date';
    renderRaces();
  });
  $('race-year').addEventListener('change', renderRaces);
  $('race-sort').addEventListener('change', renderRaces);
  document.querySelector('.race-controls').addEventListener('reset', event => {
    event.preventDefault();
    $('race-year').value = 'all';
    $('race-event').value = 'all';
    $('race-sort').value = 'date';
    $('race-sort').querySelector('[value="time"]').disabled = true;
    renderRaces();
  });
  renderRaces();
})();
