#!/usr/bin/env python3
# MichiMoney (MichiFinanzas): compila MichiFinanzas.jsx en index.html.
# Los datos de cada usuario viven SOLO en su dispositivo (localStorage).
# Uso: python build.py
import re, os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(SCRIPT_DIR, "MichiFinanzas.jsx")
OUT = os.path.join(SCRIPT_DIR, "index.html")

code = open(SRC, encoding="utf-8").read()

# Extraer STYLES del JSX e inyectarlo en el HTML (evita <style> dentro del render de React)
styles_match = re.search(r'const STYLES = `([\s\S]*?)`;', code)
assert styles_match, "STYLES constant not found in JSX"
APP_CSS = styles_match.group(1).strip()
code = code.replace(styles_match.group(0), "")
code = code.replace("<style>{STYLES}</style>", "")

imp_react = 'import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";\n'
assert imp_react in code, "react import not found"
code = code.replace(imp_react, "")

assert "export default function App()" in code, "App export not found"
code = code.replace("export default function App()", "function App()")

code = code.replace("window.storage", "storage")

# boton de descarga CSV junto al de guardar (igual que en la version personal)
btn_anchor = ('      <button className="mf-btn primary" onClick={save}>{t("save_settings_btn")}</button>\n'
              '      <div style={{ height: 8 }} />\n')
assert btn_anchor in code, "Ajustes save-button anchor not found"
btn_new = btn_anchor + (
    '      <button className="mf-btn ghost" onClick={() => downloadBackupCSV()}>{t("csv_download_btn")}</button>\n'
    '      <div style={{ height: 8 }} />\n')
code = code.replace(btn_anchor, btn_new)

for bad in ["window.storage", "import React", 'from "recharts"', "Recharts", "data.php", "DATA_TOKEN"]:
    assert bad not in code, f"leftover: {bad}"

PREAMBLE = r"""
const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ---- almacenamiento 100% local (variante MVP): los datos nunca salen del dispositivo ----
const lsGet = (k) => { try { const v = localStorage.getItem(k); return v == null ? null : v; } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const lsDel = (k) => { try { localStorage.removeItem(k); } catch (e) {} };

const storage = {
  get: async (k) => { const v = lsGet(k); return v == null ? null : { key: k, value: v }; },
  set: async (k, v) => { lsSet(k, v); return { key: k, value: v }; },
  delete: async (k) => { lsDel(k); return { key: k, deleted: true }; },
};

// ---- descargar la tabla de gastos en CSV ----
function downloadBackupCSV() {
  let txns = [], cats = [];
  try { const v = localStorage.getItem("mf_fin_var"); if (v) txns = JSON.parse(v); } catch (e) {}
  try { const s = localStorage.getItem("mf_fin_settings"); if (s) cats = (JSON.parse(s).categories || []); } catch (e) {}
  // idioma activo de la app (LANG y catDisplay existen en el bundle cuando se pulsa el boton)
  const en = (typeof LANG !== "undefined" && LANG === "en");
  const catName = (id) => { const c = cats.find((x) => x.id === id); if (!c) return id || ""; try { return catDisplay(c); } catch (e) { return c.name; } };
  const cols = en ? ["date", "orig_amount", "currency", "amount_eur", "category", "note", "type"]
                  : ["fecha", "importe_orig", "moneda", "importe_eur", "categoria", "nota", "tipo"];
  // evita inyeccion de formulas en Excel/Sheets si una nota o categoria empieza por = + - @
  const guard = (x) => (typeof x === "string" && /^[=+\-@]/.test(x)) ? "'" + x : x;
  const esc = (x) => { if (x == null) return ""; const s = String(x); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const rows = [cols.join(",")];
  txns.slice().sort((a, b) => (a.date < b.date ? -1 : 1)).forEach((t) => {
    const o = t.orig || {};
    const moneda = o.cur || "EUR";
    const impOrig = t.noSpend ? 0 : (o.amt != null ? o.amt : t.amount);
    const impEur = t.noSpend ? 0 : t.amount;
    const categoria = guard(t.noSpend ? "" : catName(t.cat));
    const nota = guard(t.noSpend ? (en ? "No-spend day" : "Dia sin gastos") : (t.note || ""));
    const tipo = t.noSpend ? (en ? "no spend" : "sin gasto") : (en ? "expense" : "gasto");
    rows.push([t.date, impOrig, moneda, impEur, categoria, nota, tipo].map(esc).join(","));
  });
  const csv = "\ufeff" + rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "michifinanzas-gastos.csv";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

"""

EPILOGUE = ('\n\nReactDOM.createRoot(document.getElementById("root")).render(<App />);\n'
            'window.__michifinMounted = true;\n')

babel_code = PREAMBLE + code + EPILOGUE

HTML = """<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>MichiFinanzas</title>
<meta name="theme-color" content="#FF8FA8" />
<link rel="manifest" href="manifest.json" />
<link rel="apple-touch-icon" href="apple-touch-icon-v4.png" />
<link rel="icon" href="favicon-v4.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="MichiFinanzas" />
<style>
  html, body { margin: 0; padding: 0; background: #FFF8EE; }
  #root { min-height: 100vh; }
  .mf-boot { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 10px; font-family: system-ui, -apple-system, sans-serif; color: #9A8AA8; }
  .mf-boot .b { width: 96px; height: 96px; border-radius: 24px; animation: mfb 1.2s ease-in-out infinite; }
  @keyframes mfb { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-8px);} }
  .mf-fail { max-width: 440px; margin: 0 auto; padding: 40px 24px; text-align: center; font-family: system-ui, -apple-system, sans-serif; color: #5B4B6B; }
  .mf-fail h3 { margin: 8px 0; } .mf-fail p { color: #9A8AA8; line-height: 1.5; }
</style>
<style>__APP_STYLES__</style>
</head>
<body>
<div id="root">
  <div class="mf-boot"><img class="b" src="icon-192-v4.png" alt="MichiFinanzas" /><div id="mf-boot-txt">Cargando MichiFinanzas…</div></div>
</div>

<script>
// idioma de la pantalla de arranque: el guardado en la app (mf_lang) o el del dispositivo
var MF_BOOT_LANG = (function () {
  try { var s = localStorage.getItem("mf_lang"); if (s === "es" || s === "en") return s; } catch (e) {}
  return ((navigator.language || "en").slice(0, 2).toLowerCase() === "es") ? "es" : "en";
})();
if (MF_BOOT_LANG === "en") {
  var mfbt = document.getElementById("mf-boot-txt");
  if (mfbt) mfbt.textContent = "Loading MichiFinances…";
}
</script>

<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin integrity="sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin integrity="sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.7/babel.min.js" crossorigin integrity="sha384-ezQ6HS3FLspd9te19o2McUV6FAK091+GG7KO54f/R8DKgCDi7fULhapNrd5LY+vG"></script>

<script type="text/babel" data-presets="react">
__BABEL_CODE__
</script>

<script>
setTimeout(function () {
  if (window.__michifinMounted) return;
  var en = (typeof MF_BOOT_LANG !== "undefined" && MF_BOOT_LANG === "en");
  var miss = [];
  if (typeof React === "undefined") miss.push("React");
  if (typeof ReactDOM === "undefined") miss.push("ReactDOM");
  if (typeof Babel === "undefined") miss.push(en ? "Babel (compiler)" : "Babel (compilador)");
  var msg = miss.length
    ? (en
        ? "Could not load: " + miss.join(", ") + ". Usually the connection is blocking the CDNs (unpkg.com). Try WiFi, disable blockers/VPN, or reload."
        : "No se cargaron: " + miss.join(", ") + ". Suele ser la conexion bloqueando los CDN (unpkg.com). Prueba con WiFi, sin bloqueadores/VPN, o recarga.")
    : (en
        ? "The libraries loaded but something failed while running. Open the browser console (or tell me) to see the details."
        : "Las librerias cargaron pero hubo un error al ejecutar. Abre la consola del navegador (o avisame) para ver el detalle.");
  var root = document.getElementById("root");
  if (root) root.innerHTML = '<div class="mf-fail"><div style="font-size:44px">\U0001F4B8</div><h3>' + (en ? "Could not start" : "No pude arrancar") + '</h3><p>' + msg + '</p></div>';
}, 9000);
</script>
</body>
</html>
"""

html = HTML.replace("__BABEL_CODE__", babel_code).replace("__APP_STYLES__", APP_CSS)
open(OUT, "w", encoding="utf-8").write(html)

print("OK ->", OUT)
print("bytes:", len(html))
