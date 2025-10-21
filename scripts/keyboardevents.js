(() => {
  const results = [];

  // 1️ Buscar listeners registrados con addEventListener
  for (const [ctxName, ctx] of Object.entries({ window, document })) {
    const evs = getEventListeners(ctx);
    for (const type of Object.keys(evs)) {
      if (type.startsWith("key")) {
        for (const l of evs[type]) {
          results.push({
            context: ctxName,
            type,
            listenerType: typeof l.listener,
            code: l.listener?.toString().slice(0, 200).replace(/\s+/g, " "),
            useCapture: !!l.useCapture
          });
        }
      }
    }
  }

  // 2️ Buscar en todos los nodos conocidos del DOM
  document.querySelectorAll("*").forEach(el => {
    const evs = getEventListeners(el);
    for (const type in evs) {
      if (type.startsWith("key")) {
        for (const l of evs[type]) {
          results.push({
            context: el.tagName.toLowerCase(),
            type,
            listenerType: typeof l.listener,
            code: l.listener?.toString().slice(0, 200).replace(/\s+/g, " "),
            useCapture: !!l.useCapture
          });
        }
      }
    }
  });

  // 3️ Buscar inline handlers tipo onkeydown="..."
  document.querySelectorAll("[onkeydown], [onkeyup], [onkeypress]").forEach(el => {
    ["onkeydown", "onkeyup", "onkeypress"].forEach(attr => {
      if (el.hasAttribute(attr)) {
        results.push({
          context: el.tagName.toLowerCase(),
          type: attr,
          listenerType: "inline",
          code: el.getAttribute(attr).slice(0, 200).replace(/\s+/g, " "),
          useCapture: false
        });
      }
    });
  });

  // 4️ Mostrar resultados
  if (results.length) {
    console.table(results);
  } else {
    console.warn("No se detectaron listeners de teclado visibles con getEventListeners().");
  }
})();


(async () => {
  const patterns = [/ctrl/i, /meta/i, /alt/i, /shift/i, /e\.key\s*===/i, /preventDefault/i];
  const entries = performance.getEntriesByType('resource')
    .filter(r => r.name.endsWith('.js'));
  console.log(`Analizando ${entries.length} scripts…`);

  for (const { name } of entries) {
    try {
      const text = await fetch(name).then(r => r.text());
      if (patterns.some(p => p.test(text))) {
        console.log('Posible atajo en:', name);
        const lines = text.split('\n').filter(l => patterns.some(p => p.test(l)));
        console.log(lines.slice(0, 10).join('\n'));
      }
    } catch {}
  }
})();
