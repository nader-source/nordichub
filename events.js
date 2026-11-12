/* Nordic Hub: loads open events into the booking form and submits bookings. */
(function () {
  var API = (window.SITE && window.SITE.formEndpoint) || '';
  var en = (document.documentElement.lang || 'nb').indexOf('en') === 0;
  var T = en ? {
    label: 'Event', choose: 'Choose event', loading: 'Loading events...',
    none: 'There are no open events to book right now. Follow us or contact us on +46 70 402 21 16.',
    full: function (n) { return n > 0 ? 'Only ' + n + ' seats left for this event.' : 'This event is fully booked.'; },
    closed: 'Booking for this event has closed. Please refresh the page.',
    invalid: 'Please fill in your name, a valid email and the number of guests.',
    pick: 'Please choose an event.', left: ' seats left', soldout: 'Fully booked',
    error: 'Something went wrong. Please try again or contact us on +46 70 402 21 16.'
  } : {
    label: 'Arrangement', choose: 'Velg arrangement', loading: 'Henter arrangementer...',
    none: 'Det er ingen åpne arrangementer å bestille akkurat nå. Kontakt oss gjerne på +46 70 402 21 16.',
    full: function (n) { return n > 0 ? 'Bare ' + n + ' plasser igjen på dette arrangementet.' : 'Dette arrangementet er fullbooket.'; },
    closed: 'Bestillingen for dette arrangementet er stengt. Last inn siden på nytt.',
    invalid: 'Fyll inn navn, en gyldig e-postadresse og antall gjester.',
    pick: 'Velg et arrangement.', left: ' plasser igjen', soldout: 'Fullbooket',
    error: 'Noe gikk galt. Prøv igjen, eller kontakt oss på +46 70 402 21 16.'
  };
  var EVENTS = [], sel = null;

  function post(body) {
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); });
  }
  function maps(v) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(v); }
  function setAll(key, val) {
    document.querySelectorAll('[data-c="' + key + '"]').forEach(function (el) { el.textContent = val; });
  }
  function current() {
    if (!EVENTS.length) return null;
    if (EVENTS.length === 1) return EVENTS[0];
    return EVENTS.filter(function (e) { return e.id === (sel && sel.value); })[0] || null;
  }
  function apply(ev) {
    if (!ev) return;
    setAll('date', ev.date || '');
    setAll('time', ev.time || '');
    setAll('venue', ev.venue || '');
    setAll('price', String(ev.price));
    var tr = document.getElementById('timeRow'); if (tr) tr.style.display = ev.time ? '' : 'none';
    document.querySelectorAll('a[data-c="venue"]').forEach(function (a) { if (ev.venue) a.href = maps(ev.venue); });
    document.querySelectorAll('[data-c="eventName"]').forEach(function (el) { el.textContent = ev.name; });
  }
  function noEvents() {
    var f = document.getElementById('fields');
    if (f) f.innerHTML = '<p class="nh-none" style="padding:8px 0;color:var(--muted)">' + T.none + '</p>';
    var st = document.getElementById('sticky'); if (st) st.style.display = 'none';
  }
  function build() {
    var f = document.getElementById('fields'); if (!f) return;
    var wrap = document.createElement('div'); wrap.id = 'evwrap';
    if (EVENTS.length > 1) {
      var opts = '<option value="">' + T.choose + '</option>' + EVENTS.map(function (e) {
        var extra = e.seatsLeft === 0 ? ' (' + T.soldout + ')' : (e.seatsLeft ? ' (' + e.seatsLeft + T.left + ')' : '');
        return '<option value="' + e.id + '"' + (e.seatsLeft === 0 ? ' disabled' : '') + '>' +
          (e.name + ' · ' + e.date).replace(/</g, '&lt;') + extra + '</option>';
      }).join('');
      wrap.innerHTML = '<label for="eventId">' + T.label + '</label><select id="eventId" name="eventId" required>' + opts + '</select>';
    } else {
      var e = EVENTS[0];
      var info = e.seatsLeft === 0 ? ' · ' + T.soldout : (e.seatsLeft ? ' · ' + e.seatsLeft + T.left : '');
      wrap.innerHTML = '<label>' + T.label + '</label><div class="nh-ev" style="padding:12px 14px;border:1px solid var(--line);border-radius:2px;background:#fff">' +
        (e.name + ' · ' + e.date).replace(/</g, '&lt;') + info + '</div>';
    }
    var anchor = f.querySelector('.row');
    f.insertBefore(wrap, anchor || f.firstChild);
    sel = document.getElementById('eventId');
    if (sel) sel.addEventListener('change', function () { apply(current()); });
    apply(EVENTS[0]);
  }

  window.NH = {
    ready: !API ? Promise.resolve([]) : post({ action: 'publicEvents' }).then(function (j) {
      EVENTS = (j && j.ok && j.result) || [];
      if (!EVENTS.length) noEvents(); else build();
      return EVENTS;
    }).catch(function () { return []; }),
    submit: function (d) {
      var ev = current();
      if (!ev) return Promise.resolve({ ok: false, msg: EVENTS.length ? T.pick : T.none });
      var body = Object.assign({}, d, { eventId: ev.id, lang: en ? 'en' : 'nb' });
      return post(body).then(function (j) {
        if (j && j.ok) return { ok: true };
        var e = j && j.error;
        return { ok: false, msg: e === 'full' ? T.full(j.seatsLeft) : e === 'closed' ? T.closed : e === 'invalid' ? T.invalid : T.error };
      }).catch(function () { return { ok: false, msg: T.error }; });
    }
  };
})();
