import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";

/* ============================================================ i18n */
let LANG = (() => {
  try { const s = localStorage.getItem("mf_lang"); if (s === "es" || s === "en") return s; } catch (e) {}
  const l = (navigator.language || "en").slice(0, 2).toLowerCase();
  return l === "es" ? "es" : "en";
})();
const T = {
  es: {
    title_suffix: "Finanzas",
    subtitle: "tu dinero, en 3 cuentas 💰",
    months: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
    recur: { daily:"Diario", weekly:"Semanal", biweekly:"Quincenal", monthly:"Mensual", quarterly:"Trimestral", yearly:"Anual" },
    recur_abbr: { daily:"D", weekly:"S", biweekly:"Q", monthly:"M", quarterly:"T", yearly:"A" },
    cat_comida:"Comida", cat_ocio:"Ocio", cat_transporte:"Transporte", cat_compras:"Compras", cat_salud:"Salud", cat_hogar:"Hogar", cat_otros:"Otros",
    quotes: ["Tu sueldito no es lo que ganas, es el michimoney que tu michi guarda.","No eres rico por lo que ganas, sino por el michimoney que tu michi protege.","Ganar michimoney es fácil. No gastarlo… ese es el verdadero instinto felino.","El michimoney que gastas te da croquetas hoy. El que guardas te da libertad mañana.","Trabajas por ingresos, pero tu michi crece con ahorritos.","El sueldo es pasajero, el michimoney bien guardado es tesoro eterno.","Si no ahorras, tu michi solo sobrevive al día.","Gastar es vivir cómodo. Ahorrar es que tu michi tenga 7 vidas tranquilas.","Tu estilo de vida le cuesta vidas a tu michi. Cuéntalo.","Ahorrar no es sacrificio, es cuidar a tu michi del futuro.","Cada gastito: capricho ahora o siesta tranquila después. Tú decides.","Tu libertad empieza cuando tu michi deja de gastar por impulso.","El michimoney que no tocas es el que hace magia gatuna.","Ganar te mantiene jugando. Ahorrar hace que tu michi suba de nivel.","Más michimoney guardado, michi más feliz. 🐾","Menos gastitos, más siestas premium.","Ahorra como michi: silencioso pero efectivo.","Tu michi ama el ahorro.","Croquetas hoy o libertad mañana. Elige sabiamente.","Michi inteligente guarda su tesoro.","Poquito a poquito, michimoney infinito.","Gastar menos = más siestas de calidad.","Tu michi del futuro te da las gracias.","Guarda tu michimoney como si fuera atún. Con cariño."],
    nav_inicio:"Inicio", nav_variables:"Variables", nav_fijos:"Fijos", nav_resumen:"Resumen", nav_karma:"Karma",
    bubble_noincome:"¡Hola! Añade tus ingresos con el botón ＋ 💰", bubble_zero:"Este mes no te está quedando nada para ahorrar 👀", bubble_great:"¡Vas ahorrando como un campeón este mes! 🌱", bubble_ok:"Vas bien de presupuesto. ¡Sigue así! 💪", bubble_neutral:"Vamos a cuidar tu dinero, paso a pasito 🐾",
    savings_label:"🐷 AHORRO ESTE MES", level_abbr:"Nv {n}", backup_save:"guardar →", backup_never:"¡Nunca hiciste copia!", backup_today:"Copia hecha hoy", backup_yesterday:"Copia: ayer", backup_days:"Copia: hace {n} días",
    this_month:"Tu mes · {month}", fixed_label:"🏠 Fijos", var_label:"🛍️ Variables", sav_label:"🐷 Ahorro", ring_gastos:"Gastos", ring_fijos:"Fijos", ring_variables:"Variables", ring_ahorro:"Ahorro", ring_inversion:"e inversión", over_budget:"te has pasado este mes", acc_savings:"ahorro acumulado total", this_month_savings:"ahorrado este mes",
    recent_title:"Últimos movimientos", see_all:"ver todos", no_expenses:"Aún no hay gastos. Toca ＋ para añadir el primero 💕", expense_fallback:"Gasto",
    add_base_currency:"en tu moneda base", add_will_save:"se guardará en", category_label:"Categoría", date_label:"Fecha", note_label:"Nota", optional:"opcional", save_expense_btn:"💸 Guardar gasto", no_spend_btn:"🍃 Hoy no he gastado nada", rate_live_adj:"de hoy", rate_approx_adj:"aprox.", rate_note:"Cambio {rate}: 1 {ccy} = {val}. Se guarda fijado a este valor.", enter_amount:"Pon un importe 🙏",
    var_title:"📂 Gastos variables", spent_this_month:"Gastado este mes", goal_label:"🎯 Tu presupuesto objetivo", goal_hint_var:"opcional, dentro de los {amount} de variables", eg:"Ej.", save_btn:"Guardar", no_var_expenses:"Sin gastos este mes 🌿", movements:"Movimientos ({n})", note_placeholder:"Nota", save_edit_btn:"✓ Guardar", cancel_btn:"Cancelar", nothing_here:"Nada por aquí todavía.", var_goal_saved:"Presupuesto de variables guardado 🎯", var_goal_removed:"Tope de variables quitado", expense_updated:"Gasto actualizado ✏️",
    fixed_title:"🔁 Gastos fijos", fixed_monthly_cost:"Coste mensual total", fixed_note:"Cada gasto se pasa a su equivalente mensual en {cur} (al cambio {rate}) para cuadrar el presupuesto.", goal_hint_fixed:"opcional, dentro de los {amount} de fijos", add_fixed_title:"Añadir gasto fijo", name_label:"Nombre", currency_label:"Moneda", amount_label:"Importe", frequency_label:"Cada cuánto", add_btn:"＋ Añadir", your_fixed:"Tus gastos fijos ({n})", done_btn:"✓ Listo", no_fixed:"Sin gastos fijos. Añade alquiler, suscripciones, etc.", fixed_goal_saved:"Presupuesto de fijos guardado 🎯", fixed_goal_removed:"Tope de fijos quitado", enter_name_amount:"Pon nombre e importe 🙏", fixed_added:"Gasto fijo añadido ✅", per_month:"/mes", fx_cur_adj:"actual",
    resumen_title:"📊 Resumen", income_split:"Reparto de tu sueldo", income_this_month_label:"Ingresos este mes", acc_savings_label:"Ahorro acumulado", this_month_label:"Este mes · {month}", monthly_history:"Histórico mensual", no_data:"Aún no hay datos.", chart_note:"El mes actual aparece más tenue (datos parciales). La línea verde punteada es tu meta de ahorro ({amount}).",
    logros_title:"🏆 Logros", level_label:"Nivel", xp_label:"XP total", streak_label:"Racha (días)", badges_label:"Insignias", badge_first:"Primer gasto", badge_s3:"Racha 3 días", badge_s7:"Racha 7 días", badge_s14:"Racha 14 días", badge_s30:"Racha 30 días", badge_ns1:"Día sin gastos", badge_ns5:"5 días sin gastos", badge_under:"Mes en presupuesto", badge_acc100:"Ahorro 100", badge_acc500:"Ahorro 500", badge_acc1000:"Ahorro 1000", badge_cats:"Todas las categorías", badge_unlocked:"¡Nuevo logro desbloqueado! 🏅",
    back_settings:"← Ajustes", income_title:"💰 Ingresos", income_total_note:"total en {cur} este mes {rate}", rate_live_par:"(al cambio actual)", rate_approx_par:"(aprox.)", source_label:"Fuente (opcional)", source_placeholder:"Ej. Cliente A, Proyecto B, Nómina", income_list_title:"Ingresos de {month} ({n})", income_fallback:"Ingreso", no_income_month:"Sin ingresos registrados este mes.", income_added:"Ingreso añadido ✅",
    settings_title:"⚙️ Ajustes", your_income_section:"Tus ingresos", manage_income_btn:"💰 Ver historial de ingresos", display_currency:"Moneda de visualización", chart_display:"Visualización de gráficos", donuts_btn:"📊 Donuts", batteries_btn:"🔋 Baterías", chart_hint:"Elige cómo ver tu reparto de dinero: círculos (donuts) o baterías de litio.", savings_section:"🐷 Ahorro", rollover_label:"Acumular ahorro mes a mes", rollover_note:"Si lo activas, el total de \"Tu mes\" muestra todo el ahorro acumulado desde el principio, no solo el del mes actual.", split_section:"Reparto en 3 cuentas", fixed_pct:"🏠 Fijos %", var_pct:"🛍️ Variables %", sav_pct:"🐷 Ahorro %", split_ideal:"(lo ideal es que sume 100%)", split_default:"Por defecto un tercio cada uno.", cats_section:"Categorías de gastos variables", backup_section:"🛡️ Copia de seguridad", backup_note:"Tus datos viven solo en este dispositivo, no en ningún servidor nuestro. Guarda una copia donde quieras (WhatsApp, correo, Drive...) para no perderlos si cambias de móvil o borras la app.", backup_never_note:"Aún no has hecho ninguna copia.", backup_last_today:"Última copia: hoy", backup_last_yesterday:"Última copia: ayer", backup_last_days:"Última copia: hace {n} días", backup_btn:"📤 Compartir / descargar copia completa", save_settings_btn:"💾 Guardar ajustes", reset_btn:"🗑️ Reiniciar movimientos y fijos", reset_confirm:"¿Seguro? Toca otra vez para borrar movimientos", settings_saved:"¡Ajustes guardados! ⚙️✨", add_cat_btn:"＋ Añadir categoría",
    conversor_title:"💱 Conversor", fx_thb_desc:"Baht · día a día", fx_usd_desc:"Dólar · tu sueldo", fx_eur_desc:"Euro · tu moneda", fx_btc_desc:"Bitcoin · en tiempo real", fx_updating:"Actualizando tipo de cambio…", fx_live_label:"Tipo de cambio del mercado", fx_offline:"⚠️ Valores aproximados (sin conexión)", fx_update_btn:"actualizar", fx_bank_note:"Es el tipo de referencia (mercado medio). Tu banco, Wise o Trade Republic pueden aplicar un pequeño margen sobre este valor.",
    cafecito_title:"💌 Invítame a un café", cafecito_free:"MichiFinanzas es gratis y siempre lo será", cafecito_body:"Si la app te ayuda a cuidar tu dinero, puedes invitarme a un café. No es obligatorio ni desbloquea nada, es solo una forma de decir gracias 💕", cafecito_bmc_note:"Invítame a un café en un par de clics.", cafecito_copy_btn:"Copiar LNURL", cafecito_copied:"Copiado ✓", cafecito_lightning_note:"Envía una propina en BTC al instante, sin comisiones, desde cualquier wallet Lightning.", cafecito_scan:"Escanea con tu wallet Lightning desde el móvil", cafecito_open_wallet:"⚡ Abrir wallet Lightning", cafecito_compat:"Compatible con Wallet of Satoshi, Phoenix, Muun y cualquier wallet LNURL.",
    btc_price_label:"₿ PRECIO ACTUAL", btc_market:"precio de mercado", btc_offline_label:"valor aproximado (sin conexión)", btc_ath:"máximo histórico", btc_refresh_loading:"Actualizando…", btc_refresh_btn:"↻ Actualizar precio", btc_sim_title:"¿Cuánto valdría tu BTC?", btc_amount_label:"Tienes esta cantidad de BTC", btc_target_label:"Si el precio del BTC sube a ({cur})", btc_value_now:"Valor a precio actual", btc_value_target:"Valor a precio objetivo",
    toast_auto_backup:"💾 Copia de seguridad automática guardada", toast_backup_shared:"Copia compartida 💌", toast_backup_downloaded:"Copia descargada 💾", backup_share_title:"Copia de seguridad MichiFinanzas",
    lang_section:"Idioma", lang_es:"Español", lang_en:"English", add_type_expense:"Gasto", add_type_income:"Ingreso", save_income_btn:"💰 Guardar ingreso",
    pace_over:"⚠️ A este ritmo gastarás {amount} de más este mes", pace_ok:"Vas bien · puedes gastar {amount}/día los próximos {n} días", pace_nodata:"Añade gastos para ver tu ritmo", pace_remaining_label:"queda para gastar", pace_over_label:"de más este mes", pace_today_lbl:"hoy",
    pat_title:"💎 Patrimonio", pat_secret:"Pantalla secreta · solo tú la ves", pat_asset:"Activo", pat_value:"Valor ({cur})", pat_total:"TOTAL", pat_add_btn:"＋ Añadir activo", pat_name_ph:"Cuenta, inmueble, inversión...", pat_empty:"Toca ＋ para añadir tu primer activo", pat_saved:"Activo guardado 💎", pat_back:"← Salir", pat_view_days:"30d", pat_view_months:"12m", pat_view_years:"Todo", pat_no_history:"Abre esta pantalla otro día para ver la evolución",
    toast_level:"¡Nivel {n}! 🎉", toast_nospend:"¡Día sin gastos! 🍃 +12 XP", toast_reset:"Movimientos reiniciados 🗑️", loading:"Cargando MichiFinanzas…", chart_goal_lbl:"meta ahorro", fixed_name_ph:"Ej. Alquiler, Netflix, gimnasio", new_cat_name:"Nueva", csv_download_btn:"⬇️ Descargar gastos (CSV)",
    import_btn:"📥 Restaurar una copia de seguridad", import_confirm_btn:"¿Sustituir los datos actuales? Toca otra vez", import_ok:"Copia restaurada ✅", import_bad:"Ese archivo no parece una copia de MichiFinanzas 😿",
    backup_pin_btn:"📌 Elegir archivo fijo de copia", backup_pin_note:"Elige una vez dónde guardar tu copia (Descargas, tu carpeta de Drive...) y la app mantendrá ese archivo siempre al día, sobrescribiéndolo. Sin acumular archivos nuevos.", backup_pinned:"📌 Copia fija: {name}", backup_pin_unlink:"quitar", toast_backup_pinned:"Archivo de copia vinculado 📌", toast_backup_updated:"Copia actualizada en tu archivo 📌",
    tips: [
      "Ingresos en 3 partes: fijos, variables y ahorro 💰",
      "Toca la caja fuerte unas cuantas veces... 👀",
      "Apunta tus gastos y no te pases este mes 💪",
      "En Resumen ves tu ahorro acumulado 📊",
      "En Karma puedes apoyar el proyecto ☕",
      "Tus datos viven en tu dispositivo 🔒",
      "¿Día sin gastar? Presume con el botón 🍃",
      "Conversor 💱: cambia ฿, $ y € al instante",
      "Apunta en ฿, $, € o ₿: se convierte solo",
      "Los fijos se pasan a coste mensual solos 🔁",
      "Gana XP y sube de nivel cuidando tu dinero ⭐",
      "Haz una copia de seguridad de vez en cuando 🛡️",
      "El ahorro es tu sueldo de verdad 🐷",
      "En Ajustes: anillos o baterías, tú eliges 🔋",
      "Registra algo cada día y mantén tu racha 🔥",
    ],
    onb: [
      { t: "¡Hola! Soy Michi 🐱", d: "Voy a ayudarte a cuidar tu dinero. Sin cuentas, sin registros y sin anuncios: tus datos se quedan en tu dispositivo." },
      { t: "Tu sueldo, en 3 huchas 💰", d: "Cada mes tu dinero se reparte en tres: 🏠 gastos fijos (alquiler, suscripciones), 🛍️ gastos variables (comida, ocio) y 🐷 ahorro." },
      { t: "Las huchas se comen entre ellas 🌊", d: "Si te pasas con los fijos, el dinero sale de los variables. Y si te pasas con los variables, sale de tu ahorro. Por eso cada gastito cuenta." },
      { t: "El ahorro es tu sueldo de verdad 🐷", d: "Lo demás es el coste de seguir en la partida. Elige cómo repartes tu sueldo (podrás cambiarlo cuando quieras en Ajustes):" },
    ],
    onb_skip:"Saltar", onb_next:"Siguiente", onb_start:"¡Empezar!", onb_nomore:"No volver a mostrar", onb_gotit:"¡Vamos!", tip_title:"Consejo de Michi 🐾",
    preset_ideal:"🌱 Ideal", preset_ideal_d:"un tercio cada uno", preset_real:"🏙️ Realista", preset_real_d:"50 / 30 / 20", preset_later:"✏️ Lo configuro luego", preset_applied:"Reparto guardado 🎯",
    tips_section:"👋 Bienvenida y consejos", tips_toggle:"Mostrar un consejo al abrir la app", onb_replay:"🎓 Ver la guía de bienvenida otra vez",
  },
  en: {
    title_suffix: "Finances",
    subtitle: "your money, in 3 pots 💰",
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    recur: { daily:"Daily", weekly:"Weekly", biweekly:"Bi-weekly", monthly:"Monthly", quarterly:"Quarterly", yearly:"Yearly" },
    recur_abbr: { daily:"D", weekly:"W", biweekly:"2W", monthly:"M", quarterly:"Q", yearly:"Y" },
    cat_comida:"Food", cat_ocio:"Leisure", cat_transporte:"Transport", cat_compras:"Shopping", cat_salud:"Health", cat_hogar:"Home", cat_otros:"Other",
    quotes: ["Your salary isn't what you earn, it's the michimoney your michi keeps.","You're not rich because of what you earn, but because of what your michi saves.","Earning michimoney is easy. Not spending it… that's the true feline instinct.","The michimoney you spend gives you kibble today. The one you save gives you freedom tomorrow.","You work for income, but your michi grows with little savings.","Your salary is temporary, but michimoney well kept is eternal treasure.","If you don't save, your michi only survives day by day.","Spending is living comfortably. Saving means your michi has 7 peaceful lives.","Your lifestyle costs your michi lives. Count them.","Saving isn't sacrifice, it's taking care of your future michi.","Every little expense: treat now or peaceful nap later. You decide.","Your freedom starts when your michi stops spending on impulse.","The michimoney you don't touch is the one that makes cat magic.","Earning keeps you playing. Saving makes your michi level up.","More michimoney saved, happier michi. 🐾","Less spending, more premium naps.","Save like a michi: silent but effective.","Your michi loves savings.","Kibble today or freedom tomorrow. Choose wisely.","Smart michi keeps its treasure.","Little by little, infinite michimoney.","Spend less = more quality naps.","Your future michi thanks you.","Keep your michimoney like it's tuna. With care."],
    nav_inicio:"Home", nav_variables:"Expenses", nav_fijos:"Fixed", nav_resumen:"Summary", nav_karma:"Karma",
    bubble_noincome:"Hi! Add your income with the ＋ button 💰", bubble_zero:"You're not saving anything this month 👀", bubble_great:"You're saving like a champion this month! 🌱", bubble_ok:"Budget looking good. Keep it up! 💪", bubble_neutral:"Let's take care of your money, step by step 🐾",
    savings_label:"🐷 SAVINGS THIS MONTH", level_abbr:"Lv {n}", backup_save:"save →", backup_never:"No backup yet!", backup_today:"Backup done today", backup_yesterday:"Backup: yesterday", backup_days:"Backup: {n} days ago",
    this_month:"This month · {month}", fixed_label:"🏠 Fixed", var_label:"🛍️ Variable", sav_label:"🐷 Savings", ring_gastos:"Expenses", ring_fijos:"Fixed", ring_variables:"Variable", ring_ahorro:"Savings", ring_inversion:"& investment", over_budget:"over budget this month", acc_savings:"total accumulated savings", this_month_savings:"saved this month",
    recent_title:"Recent transactions", see_all:"see all", no_expenses:"No expenses yet. Tap ＋ to add your first one 💕", expense_fallback:"Expense",
    add_base_currency:"in your base currency", add_will_save:"will be saved in", category_label:"Category", date_label:"Date", note_label:"Note", optional:"optional", save_expense_btn:"💸 Save expense", no_spend_btn:"🍃 No expenses today", rate_live_adj:"today's", rate_approx_adj:"approx.", rate_note:"{rate} rate: 1 {ccy} = {val}. Saved at this rate.", enter_amount:"Enter an amount 🙏",
    var_title:"📂 Variable expenses", spent_this_month:"Spent this month", goal_label:"🎯 Your target budget", goal_hint_var:"optional, within your {amount} variable budget", eg:"E.g.", save_btn:"Save", no_var_expenses:"No expenses this month 🌿", movements:"Transactions ({n})", note_placeholder:"Note", save_edit_btn:"✓ Save", cancel_btn:"Cancel", nothing_here:"Nothing here yet.", var_goal_saved:"Variable budget saved 🎯", var_goal_removed:"Variable limit removed", expense_updated:"Expense updated ✏️",
    fixed_title:"🔁 Fixed expenses", fixed_monthly_cost:"Total monthly cost", fixed_note:"Each expense is converted to its monthly equivalent in {cur} (at {rate} rate) to fit your budget.", goal_hint_fixed:"optional, within your {amount} fixed budget", add_fixed_title:"Add fixed expense", name_label:"Name", currency_label:"Currency", amount_label:"Amount", frequency_label:"Frequency", add_btn:"＋ Add", your_fixed:"Your fixed expenses ({n})", done_btn:"✓ Done", no_fixed:"No fixed expenses. Add rent, subscriptions, etc.", fixed_goal_saved:"Fixed budget saved 🎯", fixed_goal_removed:"Fixed limit removed", enter_name_amount:"Enter name and amount 🙏", fixed_added:"Fixed expense added ✅", per_month:"/mo", fx_cur_adj:"current",
    resumen_title:"📊 Summary", income_split:"Your income split", income_this_month_label:"Income this month", acc_savings_label:"Accumulated savings", this_month_label:"This month · {month}", monthly_history:"Monthly history", no_data:"No data yet.", chart_note:"The current month appears lighter (partial data). The green dotted line is your savings goal ({amount}).",
    logros_title:"🏆 Achievements", level_label:"Level", xp_label:"Total XP", streak_label:"Streak (days)", badges_label:"Badges", badge_first:"First expense", badge_s3:"3-day streak", badge_s7:"7-day streak", badge_s14:"14-day streak", badge_s30:"30-day streak", badge_ns1:"No-spend day", badge_ns5:"5 no-spend days", badge_under:"Month on budget", badge_acc100:"Savings 100", badge_acc500:"Savings 500", badge_acc1000:"Savings 1000", badge_cats:"All categories", badge_unlocked:"New achievement unlocked! 🏅",
    back_settings:"← Settings", income_title:"💰 Income", income_total_note:"total in {cur} this month {rate}", rate_live_par:"(at today's rate)", rate_approx_par:"(approx.)", source_label:"Source (optional)", source_placeholder:"E.g. Client A, Project B, Salary", income_list_title:"Income for {month} ({n})", income_fallback:"Income", no_income_month:"No income recorded this month.", income_added:"Income added ✅",
    settings_title:"⚙️ Settings", your_income_section:"Your income", manage_income_btn:"💰 View income history", display_currency:"Display currency", chart_display:"Chart display", donuts_btn:"📊 Donuts", batteries_btn:"🔋 Batteries", chart_hint:"Choose how to view your money split: circles (donuts) or lithium batteries.", savings_section:"🐷 Savings", rollover_label:"Accumulate savings month to month", rollover_note:"When enabled, \"This month\" shows all accumulated savings from the start, not just the current month.", split_section:"Split into 3 pots", fixed_pct:"🏠 Fixed %", var_pct:"🛍️ Variable %", sav_pct:"🐷 Savings %", split_ideal:"(ideally should add up to 100%)", split_default:"One third each by default.", cats_section:"Variable expense categories", backup_section:"🛡️ Backup", backup_note:"Your data lives only on this device, not on any of our servers. Save a copy wherever you want (WhatsApp, email, Drive...) so you don't lose it if you change phones or delete the app.", backup_never_note:"You haven't made a backup yet.", backup_last_today:"Last backup: today", backup_last_yesterday:"Last backup: yesterday", backup_last_days:"Last backup: {n} days ago", backup_btn:"📤 Share / download full backup", save_settings_btn:"💾 Save settings", reset_btn:"🗑️ Reset expenses and fixed costs", reset_confirm:"Sure? Tap again to delete all data", settings_saved:"Settings saved! ⚙️✨", add_cat_btn:"＋ Add category",
    conversor_title:"💱 Converter", fx_thb_desc:"Baht · day to day", fx_usd_desc:"Dollar · your salary", fx_eur_desc:"Euro · your currency", fx_btc_desc:"Bitcoin · real time", fx_updating:"Updating exchange rate…", fx_live_label:"Market exchange rate", fx_offline:"⚠️ Approximate values (offline)", fx_update_btn:"update", fx_bank_note:"This is the reference rate (mid-market). Your bank, Wise or Trade Republic may apply a small margin on top.",
    cafecito_title:"💌 Buy me a coffee", cafecito_free:"MichiFinanzas is free and always will be", cafecito_body:"If the app helps you manage your money, you can buy me a coffee. It's not required and unlocks nothing, it's just a way to say thank you 💕", cafecito_bmc_note:"Buy me a coffee in a couple of clicks.", cafecito_copy_btn:"Copy LNURL", cafecito_copied:"Copied ✓", cafecito_lightning_note:"Send a BTC tip instantly, fee-free, from any Lightning wallet.", cafecito_scan:"Scan with your Lightning wallet from mobile", cafecito_open_wallet:"⚡ Open Lightning wallet", cafecito_compat:"Compatible with Wallet of Satoshi, Phoenix, Muun and any LNURL wallet.",
    btc_price_label:"₿ CURRENT PRICE", btc_market:"market price", btc_offline_label:"approximate value (offline)", btc_ath:"all-time high", btc_refresh_loading:"Updating…", btc_refresh_btn:"↻ Refresh price", btc_sim_title:"How much would your BTC be worth?", btc_amount_label:"You have this amount of BTC", btc_target_label:"If BTC price rises to ({cur})", btc_value_now:"Value at current price", btc_value_target:"Value at target price",
    toast_auto_backup:"💾 Automatic backup saved", toast_backup_shared:"Backup shared 💌", toast_backup_downloaded:"Backup downloaded 💾", backup_share_title:"MichiFinanzas backup",
    lang_section:"Language", lang_es:"Español", lang_en:"English", add_type_expense:"Expense", add_type_income:"Income", save_income_btn:"💰 Save income",
    pace_over:"⚠️ At this rate you'll overspend by {amount} this month", pace_ok:"On track · you can spend {amount}/day for the next {n} days", pace_nodata:"Add expenses to see your pace", pace_remaining_label:"left to spend", pace_over_label:"over budget this month", pace_today_lbl:"today",
    pat_title:"💎 Net Worth", pat_secret:"Secret screen · only you see this", pat_asset:"Asset", pat_value:"Value ({cur})", pat_total:"TOTAL", pat_add_btn:"＋ Add asset", pat_name_ph:"Account, real estate, investment...", pat_empty:"Tap ＋ to add your first asset", pat_saved:"Asset saved 💎", pat_back:"← Back", pat_view_days:"30d", pat_view_months:"12m", pat_view_years:"All", pat_no_history:"Open this screen another day to see the evolution",
    toast_level:"Level {n}! 🎉", toast_nospend:"No-spend day! 🍃 +12 XP", toast_reset:"Data reset 🗑️", loading:"Loading MichiFinances…", chart_goal_lbl:"savings goal", fixed_name_ph:"E.g. Rent, Netflix, gym", new_cat_name:"New", csv_download_btn:"⬇️ Download expenses (CSV)",
    import_btn:"📥 Restore a backup", import_confirm_btn:"Replace your current data? Tap again", import_ok:"Backup restored ✅", import_bad:"That file doesn't look like a MichiFinances backup 😿",
    backup_pin_btn:"📌 Choose a fixed backup file", backup_pin_note:"Pick once where to keep your backup (Downloads, your synced Drive folder...) and the app will keep that same file up to date by overwriting it. No more piling up new files.", backup_pinned:"📌 Fixed backup: {name}", backup_pin_unlink:"unlink", toast_backup_pinned:"Backup file linked 📌", toast_backup_updated:"Backup file updated 📌",
    tips: [
      "Income in 3 pots: fixed, variable and savings 💰",
      "Tap the safe a few times... 👀",
      "Log your expenses and stay on budget 💪",
      "See your accumulated savings in Summary 📊",
      "Support the project in Karma ☕",
      "Your data lives on your device 🔒",
      "No-spend day? Brag with the 🍃 button",
      "Converter 💱: ฿, $ and € in a snap",
      "Log in ฿, $, € or ₿: auto-converted",
      "Fixed costs become monthly automatically 🔁",
      "Earn XP and level up your money game ⭐",
      "Make a backup once in a while 🛡️",
      "Savings are your real salary 🐷",
      "Rings or batteries? Pick in Settings 🔋",
      "Log something daily to keep your streak 🔥",
    ],
    onb: [
      { t: "Hi! I'm Michi 🐱", d: "I'll help you take care of your money. No accounts, no sign-ups and no ads: your data stays on your device." },
      { t: "Your salary, in 3 pots 💰", d: "Every month your money is split in three: 🏠 fixed costs (rent, subscriptions), 🛍️ variable spending (food, fun) and 🐷 savings." },
      { t: "The pots eat each other 🌊", d: "If you overspend on fixed costs, the money comes out of your variable pot. And if you overspend there, it comes out of your savings. That's why every little expense counts." },
      { t: "Savings are your real salary 🐷", d: "The rest is the cost of staying in the game. Pick how you split your salary (you can change it any time in Settings):" },
    ],
    onb_skip:"Skip", onb_next:"Next", onb_start:"Let's go!", onb_nomore:"Don't show again", onb_gotit:"Got it!", tip_title:"Michi's tip 🐾",
    preset_ideal:"🌱 Ideal", preset_ideal_d:"one third each", preset_real:"🏙️ Realistic", preset_real_d:"50 / 30 / 20", preset_later:"✏️ I'll set it later", preset_applied:"Split saved 🎯",
    tips_section:"👋 Welcome & tips", tips_toggle:"Show a tip when the app opens", onb_replay:"🎓 See the welcome guide again",
  }
};
const t = (key, vars) => { let s = (T[LANG] || T.en)[key]; if (s === undefined) s = T.en[key] || key; if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.split("{" + k + "}").join(String(v)); }); return s; };

/* ============================================================
   MichiFinanzas  ·  control de gastos kawaii
   - Sueldo repartido en 3: gastos fijos / variables / ahorro (editable)
   - Gastos fijos con recurrencia editable (diario..anual)
   - Gastos variables por categorías
   - Objetivo: acumular el máximo de ahorro
   - Datos persistentes (window.storage)
   ============================================================ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap');
:root{
  --bg:#FFF8EE; --surface:#FFFFFF; --pink:#FF8FA8; --pink-soft:#FFD9E3;
  --mint:#6FBEEF; --mint-soft:#DCF0FC; --lav:#6FBEEF; --lav-soft:#DCF0FC;
  --sun-soft:#E1F7E9; --ink:#4A3A40; --ink-soft:#9C8890;
  --good:#7ED6A5; --warn:#FF8E8E;
  --shadow: 0 10px 26px rgba(255,143,168,.20);
  --shadow-sm: 0 6px 16px rgba(255,143,168,.16);
}
*{box-sizing:border-box; -webkit-tap-highlight-color:transparent;}
.mf-root{font-family:'Nunito',system-ui,sans-serif; color:var(--ink); background:var(--bg); min-height:100%;}
.mf-num{font-family:'Baloo 2',cursive;}
.mf-phone{max-width:480px; margin:0 auto; min-height:100vh; background:var(--bg); position:relative; padding-bottom:108px; overflow-x:hidden;}
.mf-phone::before{content:''; position:fixed; inset:0; background:url('Fondo_app.png') no-repeat center center; background-size:cover; opacity:0.15; z-index:0; pointer-events:none;}
.mf-header{position:sticky; top:0; z-index:40; backdrop-filter:blur(8px); background:rgba(255,248,238,.86); padding:14px 18px 10px; border-bottom:1px solid rgba(255,143,168,.18);}
.mf-hrow{display:flex; align-items:center; gap:10px;}
.mf-title{font-family:'Baloo 2'; font-weight:800; font-size:21px; line-height:1; letter-spacing:.2px;}
.mf-title b{color:var(--pink);}
.mf-tsub{font-size:11px; color:var(--ink-soft); font-weight:700; margin-top:2px;}
@keyframes mf-tip{from{opacity:0; transform:translateY(3px);}to{opacity:1; transform:none;}}
.mf-chip{margin-left:auto; display:flex; gap:8px;}
.mf-mini{display:flex; align-items:center; gap:5px; background:#fff; border:none; padding:7px 11px; border-radius:14px; box-shadow:var(--shadow-sm); font-weight:800; font-family:'Baloo 2'; font-size:14px; color:var(--ink); cursor:pointer;}
.mf-mini.gear{padding:7px 9px; font-size:16px;}
.mf-page{padding:16px 18px 8px; animation:mf-in .32s ease both;}
@keyframes mf-in{from{opacity:0; transform:translateY(8px);}to{opacity:1; transform:none;}}
.mf-h2{font-family:'Baloo 2'; font-weight:800; font-size:18px; margin:4px 0 12px;}
.mf-h3{font-family:'Baloo 2'; font-weight:700; font-size:15px; margin:0 0 6px;}
.mf-card{background:var(--surface); border-radius:24px; padding:18px; box-shadow:var(--shadow); margin-bottom:14px; border:2px solid #fff;}
.mf-card.tight{padding:14px;}
.mf-hero{text-align:center; background:linear-gradient(135deg,var(--mint-soft),var(--sun-soft)); border-radius:24px; padding:20px 18px; box-shadow:var(--shadow); margin-bottom:14px; border:2px solid #fff;}
.mf-hero .lab{font-family:'Baloo 2'; font-weight:800; font-size:12px; color:var(--ink-soft); letter-spacing:.3px;}
.mf-hero .v{font-family:'Baloo 2'; font-weight:800; font-size:38px; color:#2f8f68; margin-top:4px; line-height:1;}
.mf-hero .sub{font-size:12px; color:var(--ink-soft); font-weight:700; margin-top:6px;}
.mf-mascotwrap{display:flex; gap:14px; align-items:center;}
.mf-bubble{flex:1; background:var(--lav-soft); border-radius:18px 18px 18px 6px; padding:12px 14px; font-weight:700; font-size:14px; position:relative; line-height:1.35; min-height:64px; display:flex; align-items:center; animation:mf-tip .5s ease both;}
.mf-bob{animation:mf-bob 3.4s ease-in-out infinite;}
@keyframes mf-bob{0%,100%{transform:translateY(0) rotate(-1deg);}50%{transform:translateY(-7px) rotate(1deg);}}
.mf-rings{display:flex; justify-content:space-around; gap:6px; align-items:flex-start;}
.mf-ring{display:flex; flex-direction:column; align-items:center; gap:6px;}
.mf-ring .lab{font-size:11px; font-weight:800; color:var(--ink-soft);}
.mf-ringval{font-family:'Baloo 2'; font-weight:800; font-size:15px; line-height:1;}
.mf-ringval small{font-size:10px; color:var(--ink-soft); font-weight:700;}
.mf-balance{display:flex; align-items:center; gap:10px; margin-top:14px; border-radius:18px; padding:12px 14px;}
.mf-balance .big{font-family:'Baloo 2'; font-weight:800; font-size:22px;}
.mf-balance .lab{font-size:12px; font-weight:700;}
.mf-xprow{display:flex; align-items:center; gap:10px; margin-top:12px;}
.mf-xpbar{flex:1; height:13px; background:var(--lav-soft); border-radius:99px; overflow:hidden;}
.mf-xpfill{height:100%; background:linear-gradient(90deg,var(--lav),var(--pink)); border-radius:99px; transition:width .8s cubic-bezier(.34,1.56,.64,1);}
.mf-lvl{font-family:'Baloo 2'; font-weight:800; font-size:14px; background:var(--lav); color:#fff; padding:4px 10px; border-radius:12px; white-space:nowrap;}
.mf-quest{display:flex; align-items:center; gap:11px; padding:9px 0; border-bottom:1px dashed var(--pink-soft);}
.mf-quest:last-child{border-bottom:none;}
.mf-qbox{width:26px; height:26px; border-radius:9px; display:grid; place-items:center; font-size:15px; flex-shrink:0; background:var(--pink-soft); color:var(--ink-soft); font-weight:900;}
.mf-qbox.done{background:var(--good); color:#fff;}
.mf-qtxt{font-weight:700; font-size:13.5px; flex:1;}
.mf-qtxt.done{color:var(--ink-soft); text-decoration:line-through;}
.mf-qxp{font-family:'Baloo 2'; font-weight:800; font-size:12px; color:var(--lav);}
.mf-grid2{display:grid; grid-template-columns:1fr 1fr; gap:10px;}
.mf-stat{background:var(--surface); border-radius:18px; padding:13px; box-shadow:var(--shadow-sm); border:2px solid #fff;}
.mf-stat .v{font-family:'Baloo 2'; font-weight:800; font-size:21px; line-height:1;}
.mf-stat .l{font-size:11.5px; color:var(--ink-soft); font-weight:700; margin-top:3px;}
.mf-field{margin-bottom:13px;}
.mf-field label{display:block; font-weight:800; font-size:13px; margin-bottom:6px;}
.mf-field label .hint{color:var(--ink-soft); font-weight:700; font-size:11px;}
.mf-input{width:100%; border:2px solid var(--pink-soft); background:#fff; border-radius:14px; padding:12px 14px; font-family:'Baloo 2'; font-weight:700; font-size:17px; color:var(--ink); outline:none; transition:border .15s;}
.mf-input:focus{border-color:var(--pink);}
.mf-inrow{display:flex; gap:9px;} .mf-inrow>*{flex:1;}
.mf-btn{border:none; border-radius:16px; padding:13px 16px; font-family:'Baloo 2'; font-weight:800; font-size:15px; cursor:pointer; transition:transform .12s, box-shadow .12s; display:flex; align-items:center; justify-content:center; gap:8px; width:100%;}
.mf-btn:active{transform:scale(.96);}
.mf-btn.primary{background:var(--pink); color:#fff; box-shadow:0 8px 18px rgba(255,143,168,.5);}
.mf-btn.mint{background:var(--mint); color:#1d5c80; box-shadow:0 8px 18px rgba(111,190,239,.45);}
.mf-btn.ghost{background:var(--lav-soft); color:var(--ink);}
.mf-btn.sm{padding:9px 13px; font-size:13px; width:auto;}
.mf-macro{margin-bottom:13px;}
.mf-macro .top{display:flex; justify-content:space-between; align-items:baseline; margin-bottom:5px;}
.mf-macro .nm{font-family:'Baloo 2'; font-weight:800; font-size:13.5px;}
.mf-macro .vl{font-weight:800; font-size:12.5px; color:var(--ink-soft);}
.mf-macro .vl b{font-family:'Baloo 2'; color:var(--ink); font-size:14px;}
.mf-mbar{height:14px; background:#FBEFE0; border-radius:99px; overflow:hidden; position:relative;}
.mf-mfill{height:100%; border-radius:99px; transition:width .7s cubic-bezier(.34,1.56,.64,1);}
.mf-mgoal{position:absolute; top:-3px; bottom:-3px; width:3px; background:#4A3A40; border-radius:2px; box-shadow:0 0 0 1.5px #fff; transition:left .7s cubic-bezier(.34,1.56,.64,1);}
.mf-badges{display:grid; grid-template-columns:repeat(3,1fr); gap:11px;}
.mf-badge{text-align:center; background:var(--surface); border-radius:18px; padding:13px 8px; box-shadow:var(--shadow-sm); border:2px solid #fff; opacity:.4; filter:grayscale(.7);}
.mf-badge.on{opacity:1; filter:none; animation:mf-pop .4s ease both;}
@keyframes mf-pop{0%{transform:scale(.5);}70%{transform:scale(1.1);}100%{transform:scale(1);}}
.mf-badge .ic{font-size:30px;} .mf-badge .nm{font-family:'Baloo 2'; font-weight:800; font-size:11.5px; margin-top:5px; line-height:1.1;}
.mf-nav{position:fixed; bottom:0; left:0; right:0; z-index:50;}
.mf-navin{max-width:480px; margin:0 auto; background:#fff; border-radius:26px 26px 0 0; box-shadow:0 -8px 24px rgba(255,143,168,.18); padding:9px 10px calc(9px + env(safe-area-inset-bottom)); display:flex; justify-content:space-around; align-items:flex-end;}
.mf-navit{background:none; border:none; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:3px; flex:1; padding:5px 2px; color:var(--ink-soft); font-weight:800; font-size:10.5px;}
.mf-navit .ic{font-size:21px; transition:transform .18s;}
.mf-navit.active{color:var(--pink);}
.mf-navit.active .ic{transform:translateY(-3px) scale(1.12);}
.mf-navadd{flex:0 0 auto; margin-top:-22px;}
.mf-navadd .fab{width:58px; height:58px; object-fit:contain; filter:drop-shadow(0 6px 10px rgba(255,143,168,.5)); transition:transform .15s;}
.mf-navit:active .fab{transform:scale(.9);}
.mf-toast{position:fixed; left:50%; transform:translateX(-50%); bottom:118px; z-index:80; background:var(--ink); color:#fff; padding:12px 18px; border-radius:18px; font-family:'Baloo 2'; font-weight:800; font-size:14px; box-shadow:var(--shadow); animation:mf-toast 2.6s ease both; max-width:90%; text-align:center;}
@keyframes mf-toast{0%{opacity:0; transform:translate(-50%,16px);}12%,82%{opacity:1; transform:translate(-50%,0);}100%{opacity:0; transform:translate(-50%,-8px);}}
.mf-confetti{position:fixed; inset:0; pointer-events:none; z-index:90; overflow:hidden;}
.mf-cp{position:absolute; top:-12px; width:11px; height:11px; border-radius:3px; animation:mf-fall 1.6s ease-in forwards;}
@keyframes mf-fall{to{transform:translateY(105vh) rotate(720deg); opacity:.2;}}
.mf-empty{text-align:center; color:var(--ink-soft); font-weight:700; font-size:13px; padding:14px;}
.mf-note{font-size:11.5px; color:var(--ink-soft); font-weight:700; line-height:1.4; margin-top:8px;}
.mf-link{background:none; border:none; color:var(--pink); font-weight:800; font-size:13px; cursor:pointer; text-decoration:underline; padding:0;}
/* finanzas */
.mf-amt{width:100%; border:none; background:transparent; text-align:center; font-family:'Baloo 2'; font-weight:800; font-size:46px; color:var(--ink); outline:none;}
.mf-amt::placeholder{color:#f3d6dd;}
.mf-chips{display:flex; flex-wrap:wrap; gap:8px;}
.mf-chip2{border:2px solid var(--pink-soft); background:#fff; border-radius:14px; padding:8px 12px; font-weight:800; font-size:13px; color:var(--ink); cursor:pointer; display:flex; align-items:center; gap:6px;}
.mf-chip2.on{background:var(--pink); border-color:var(--pink); color:#fff;}
.mf-seg{display:flex; flex-wrap:wrap; gap:7px;}
.mf-range{width:100%; accent-color:var(--pink); height:6px; margin:6px 0 2px;}
.mf-segp{border:2px solid var(--lav-soft); background:#fff; border-radius:12px; padding:7px 11px; font-weight:800; font-size:12.5px; color:var(--ink-soft); cursor:pointer;}
.mf-segp.on{background:var(--lav); border-color:var(--lav); color:#fff;}
.mf-tx{display:flex; align-items:center; gap:11px; padding:11px 0; border-bottom:1px dashed var(--pink-soft);}
.mf-tx:last-child{border-bottom:none;}
.mf-tx .ic{width:38px; height:38px; border-radius:12px; background:var(--lav-soft); display:grid; place-items:center; font-size:18px; flex-shrink:0;}
.mf-tx .mid{flex:1; min-width:0;}
.mf-tx .nm{font-weight:800; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
.mf-tx .sub{font-size:11px; color:var(--ink-soft); font-weight:700;}
.mf-tx .amt{font-family:'Baloo 2'; font-weight:800; font-size:15px; white-space:nowrap;}
.mf-tx .x{background:none; border:none; color:var(--ink-soft); font-size:16px; cursor:pointer; padding:4px;}
.mf-calnav{display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;}
.mf-calnav b{font-family:'Baloo 2'; font-size:15px;}
.mf-calnav button{background:var(--pink-soft); border:none; width:34px; height:34px; border-radius:11px; font-size:16px; cursor:pointer; color:var(--ink); font-weight:900;}
.mf-onb{position:fixed; inset:0; z-index:100; background:var(--bg); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px 22px calc(30px + env(safe-area-inset-bottom)); text-align:center; overflow-y:auto; animation:mf-in .3s ease both;}
.mf-onb .card{max-width:400px; width:100%; display:flex; flex-direction:column; align-items:center; gap:13px;}
.mf-onb h3{font-family:'Baloo 2'; font-weight:800; font-size:23px; margin:0; line-height:1.2; text-wrap:balance;}
.mf-onb p{font-weight:700; font-size:14.5px; line-height:1.5; color:var(--ink-soft); margin:0;}
.mf-onb .dots{display:flex; gap:6px; justify-content:center;}
.mf-onb .dot{width:8px; height:8px; border-radius:99px; background:var(--pink-soft); transition:width .25s, background .25s;}
.mf-onb .dot.on{background:var(--pink); width:22px;}
.mf-onbskip{position:absolute; top:calc(12px + env(safe-area-inset-top)); right:14px; background:none; border:none; color:var(--ink-soft); font-weight:800; font-size:13px; cursor:pointer; font-family:inherit; padding:8px 10px;}
.mf-onbchk{display:flex; align-items:center; gap:9px; font-size:12.5px; font-weight:700; color:var(--ink-soft); cursor:pointer;}
.mf-preset{width:100%; border:2px solid var(--lav-soft); background:#fff; border-radius:16px; padding:11px 14px; font-family:inherit; font-weight:800; font-size:14px; color:var(--ink); cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:10px;}
.mf-preset small{color:var(--ink-soft); font-weight:700; font-size:12px;}
.mf-preset:active{transform:scale(.97);}
.mf-ccysel{position:relative; display:inline-block;}
.mf-ccybtn{border:none; background:var(--lav); color:#fff; border-radius:12px; padding:9px 16px; font-weight:800; font-size:13.5px; cursor:pointer; display:flex; align-items:center; gap:6px; font-family:inherit;}
.mf-ccyveil{position:fixed; inset:0; z-index:60;}
.mf-ccymenu{position:absolute; top:calc(100% + 6px); left:50%; transform:translateX(-50%); background:#fff; border:2px solid var(--lav-soft); border-radius:14px; box-shadow:var(--shadow); padding:5px; display:flex; flex-direction:column; gap:2px; z-index:61; min-width:112px; max-height:280px; overflow-y:auto; animation:mf-in .18s ease both;}
.mf-ccyopt{border:none; background:none; border-radius:10px; padding:9px 12px; font-weight:800; font-size:13.5px; color:var(--ink); cursor:pointer; text-align:left; font-family:inherit; white-space:nowrap;}
.mf-ccyopt.on{background:var(--lav); color:#fff;}
@media (prefers-reduced-motion: reduce){ *{animation-duration:.001s !important; transition-duration:.05s !important;} }
`;

/* ---------- helpers ---------- */
const todayISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const addDays = (iso, n) => { const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const fmt = (n, d = 0) => (n === null || n === undefined || isNaN(n)) ? "—" : Number(n).toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });
const money = (n, cur = "€", d) => (n === null || n === undefined || isNaN(n)) ? "—" : fmt(n, d != null ? d : (Number.isInteger(Number(n)) ? 0 : 2)) + " " + cur;
const uid = () => Math.random().toString(36).slice(2, 9);
const ymOf = (iso) => (iso || "").slice(0, 7);
const ymToLabel = (ym) => { const [y, m] = ym.split("-"); return (T[LANG].months || T.en.months)[(+m) - 1] + " " + y; };
const ymShift = (ym, n) => { const [y, m] = ym.split("-").map(Number); const d = new Date(y, m - 1 + n, 1); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); };

const RECUR = [
  { k: "daily", x: 30.4375 },
  { k: "weekly", x: 4.34524 },
  { k: "biweekly", x: 2.17262 },
  { k: "monthly", x: 1 },
  { k: "quarterly", x: 1 / 3 },
  { k: "yearly", x: 1 / 12 },
];
const recurX = (k) => (RECUR.find((r) => r.k === k) || RECUR[3]).x;
const recurLabel = (k) => { const rec = T[LANG].recur || T.en.recur; return rec[k] || k; };
const recurAbbr = (k) => { const ab = T[LANG].recur_abbr || T.en.recur_abbr; return ab[k] || k; };

const CURRENCIES = ["EUR", "USD", "GBP", "JPY", "CHF", "CAD", "AUD", "MXN", "ARS", "COP", "THB", "BTC"];
const FX_FALLBACK = { EUR: 1, USD: 1.16, GBP: 0.84, JPY: 163, CHF: 0.94, CAD: 1.57, AUD: 1.77, MXN: 22.5, ARS: 1050, COP: 5000, THB: 37.7, BTC: 1 / 60000 };

// Suma entradas de ingreso para un ym dado, convertidas a EUR. Devuelve null si no hay entradas.
function incomeForYm(incomeArr, ym, fxRates) {
  const entries = (incomeArr || []).filter((e) => e.ym === ym);
  if (entries.length === 0) return null;
  const rates = fxRates || FX_FALLBACK;
  return entries.reduce((sum, e) => sum + (Number(e.amount) || 0) / (rates[e.cur || "EUR"] || 1), 0);
}

const DEFAULT_CATS = [
  { id: "c_comida", name: t("cat_comida"), emoji: "🍔" },
  { id: "c_ocio", name: t("cat_ocio"), emoji: "🎉" },
  { id: "c_transporte", name: t("cat_transporte"), emoji: "🚇" },
  { id: "c_compras", name: t("cat_compras"), emoji: "🛍️" },
  { id: "c_salud", name: t("cat_salud"), emoji: "💊" },
  { id: "c_hogar", name: t("cat_hogar"), emoji: "🏠" },
  { id: "c_otros", name: t("cat_otros"), emoji: "✨" },
];
// nombre de categoría a mostrar: las 7 por defecto se traducen con el idioma activo,
// salvo que el usuario las haya renombrado (entonces gana su nombre personalizado)
const CAT_KEY = { c_comida: "cat_comida", c_ocio: "cat_ocio", c_transporte: "cat_transporte", c_compras: "cat_compras", c_salud: "cat_salud", c_hogar: "cat_hogar", c_otros: "cat_otros" };
const catDisplay = (c) => {
  if (!c) return "";
  const k = CAT_KEY[c.id];
  if (k && (c.name === T.es[k] || c.name === T.en[k])) return t(k);
  return c.name;
};

// se elige el índice una vez por carga, pero el texto se resuelve en cada render para que cambie con el idioma
const DAILY_QUOTE_IDX = Math.floor(Math.random() * T.en.quotes.length);
const dailyQuote = () => { const q = T[LANG].quotes || T.en.quotes; return q[DAILY_QUOTE_IDX % q.length]; };
// ────────────────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  income: 0, splitFixed: 34, splitVar: 33, splitSav: 33,
  currency: "€", categories: DEFAULT_CATS,
  chartMode: "donuts", // "donuts" o "batteries"
  goalFixed: 0, goalVar: 0, // tope visual opcional dentro del presupuesto de fijos/variables (0 = sin tope)
  rolloverSavings: false, // si true, el ahorro se acumula mes a mes en lugar de reiniciarse
};

const budgetsOf = (s) => ({
  fixed: (s.income || 0) * (s.splitFixed || 0) / 100,
  variable: (s.income || 0) * (s.splitVar || 0) / 100,
  savings: (s.income || 0) * (s.splitSav || 0) / 100,
});
// suma mensual de fijos, en EUR (cada fijo puede estar en otra moneda; se convierte con el cambio actual)
const monthlyFixed = (fixed, rates) => (fixed || []).reduce((a, f) => {
  const m = (Number(f.amount) || 0) * recurX(f.rec);
  const rt = (rates && rates[f.cur || "EUR"]) || 1;
  return a + m / rt;
}, 0);
// los movimientos guardan su importe ya en EUR (amount); varSpent suma en EUR
const varSpentIn = (txns, ym) => (txns || []).filter((t) => !t.noSpend && ymOf(t.date) === ym).reduce((a, t) => a + (Number(t.amount) || 0), 0);

const SYM = { EUR: "€", USD: "$", GBP: "£", JPY: "¥", CHF: "Fr", CAD: "C$", AUD: "A$", MXN: "$", ARS: "$", COP: "$", THB: "฿", BTC: "₿" };
const ccyDec = (c) => c === "BTC" ? 8 : c === "JPY" ? 0 : 2;
// importe original a mostrar (฿350) si el gasto se pagó en otra moneda; null => mostrar solo el importe base
const txOrig = (t) => {
  const o = t.orig;
  if (o && o.cur && o.cur !== "EUR") return SYM[o.cur] + " " + fmt(o.amt, o.cur === "BTC" ? ccyDec(o.cur) : (Number.isInteger(Number(o.amt)) ? 0 : 2));
  return null;
};
// convierte lo escrito en una moneda (THB/USD/EUR/BTC) a los campos que guarda un movimiento; null si el importe no es válido
const buildTxnPatch = (ccy, raw, rate, date, cat, note) => {
  const native = parseFloat(String(raw).replace(",", "."));
  if (!native || native <= 0) return null;
  const eurVal = Math.round((native / rate) * 100) / 100;
  const dp = Math.pow(10, ccyDec(ccy));
  return { date, amount: eurVal, cat, note: (note || "").trim(), orig: { cur: ccy, amt: Math.round(native * dp) / dp }, rate, native };
};

// importe de un movimiento: original (p. ej. ฿350) y debajo el equivalente en la moneda base
function TxAmount({ tx, cur }) {
  const orig = txOrig(tx);
  return (
    <div style={{ textAlign: "right" }}>
      <div className="amt" style={{ color: "var(--warn)" }}>−{orig || money(tx.amount, cur)}</div>
      {orig && <div className="sub">≈ {money(tx.amount, cur)}</div>}
    </div>
  );
}

/* ---------- selector desplegable de moneda (muestra solo la activa) ---------- */
function CcySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const pick = (c) => { onChange(c); setOpen(false); };
  return (
    <div className="mf-ccysel">
      <button type="button" className="mf-ccybtn" onClick={() => setOpen((o) => !o)}>
        {SYM[value] || ""} {value} <span style={{ fontSize: 10, opacity: 0.75 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (<>
        <div className="mf-ccyveil" onClick={() => setOpen(false)} />
        <div className="mf-ccymenu">
          {CURRENCIES.map((c) => (
            <button type="button" key={c} className={`mf-ccyopt ${c === value ? "on" : ""}`} onClick={() => pick(c)}>{SYM[c]} {c}</button>
          ))}
        </div>
      </>)}
    </div>
  );
}

/* ---------- copia de seguridad (todo vive en el dispositivo del usuario) ---------- */
const BACKUP_KEY = "mf_fin_lastBackup";
const daysSinceISO = (iso) => {
  if (!iso) return Infinity;
  const d1 = new Date(iso + "T00:00:00"), d2 = new Date(todayISO() + "T00:00:00");
  return Math.round((d2 - d1) / 86400000);
};
const getLastBackup = () => { try { return localStorage.getItem(BACKUP_KEY); } catch (e) { return null; } };
const recordBackup = () => { try { localStorage.setItem(BACKUP_KEY, todayISO()); } catch (e) {} };

function buildBackupBlob(settings, fixed, txns, income, patrimonio, patHist) {
  const payload = { app: "MichiFinanzas", version: 2, exportedAt: new Date().toISOString(), settings, fixed, txns, income: income || [], patrimonio: patrimonio || [], patrimonioHistory: patHist || [] };
  return new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
}

// intenta compartir (WhatsApp, correo, Drive...) y si no se puede, descarga el archivo. `silent` = sin pedir compartir (uso automático)
async function shareOrDownloadBackup(settings, fixed, txns, income, patrimonio, patHist, silent) {
  const blob = buildBackupBlob(settings, fixed, txns, income, patrimonio, patHist);
  const filename = `michifinanzas-backup-${todayISO()}.json`;
  if (!silent) {
    try {
      const file = new File([blob], filename, { type: "application/json" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: t("backup_share_title") });
        recordBackup();
        return "shared";
      }
    } catch (e) { if (e && e.name === "AbortError") return "cancelled"; }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  recordBackup();
  return "downloaded";
}

/* ---------- archivo fijo de copia (File System Access API; Chrome/Edge/Android; en iOS no existe) ---------- */
const FSA_OK = typeof window !== "undefined" && "showSaveFilePicker" in window;
// mini almacen clave-valor en IndexedDB: los FileHandle no caben en localStorage
const idbOpen = () => new Promise((res, rej) => {
  const r = indexedDB.open("mf_fin_db", 1);
  r.onupgradeneeded = () => { r.result.createObjectStore("kv"); };
  r.onsuccess = () => res(r.result);
  r.onerror = () => rej(r.error);
});
const idbGet = async (k) => { try { const db = await idbOpen(); return await new Promise((res, rej) => { const q = db.transaction("kv").objectStore("kv").get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); } catch (e) { return null; } };
const idbSet = async (k, v) => { try { const db = await idbOpen(); await new Promise((res, rej) => { const q = db.transaction("kv", "readwrite").objectStore("kv").put(v, k); q.onsuccess = () => res(); q.onerror = () => rej(q.error); }); return true; } catch (e) { return false; } };
const idbDel = async (k) => { try { const db = await idbOpen(); await new Promise((res, rej) => { const q = db.transaction("kv", "readwrite").objectStore("kv").delete(k); q.onsuccess = () => res(); q.onerror = () => rej(q.error); }); } catch (e) {} };

// escribe la copia en el archivo vinculado; false si no hay permiso o falla (el que llama hace fallback)
async function writeBackupToHandle(handle, blob, interactive) {
  try {
    let perm = handle.queryPermission ? await handle.queryPermission({ mode: "readwrite" }) : "granted";
    if (perm !== "granted" && interactive && handle.requestPermission) perm = await handle.requestPermission({ mode: "readwrite" });
    if (perm !== "granted") return false;
    const w = await handle.createWritable();
    await w.write(blob);
    await w.close();
    recordBackup();
    return true;
  } catch (e) { return false; }
}

/* ---------- bienvenida: guia la primera vez y un consejo en los siguientes arranques ---------- */
const ONB_KEY = "mf_fin_onboarded", TIPS_KEY = "mf_fin_tips";
const onbDone = () => { try { return localStorage.getItem(ONB_KEY) === "1"; } catch (e) { return false; } };
const markOnbDone = () => { try { localStorage.setItem(ONB_KEY, "1"); } catch (e) {} };
const tipsEnabled = () => { try { return localStorage.getItem(TIPS_KEY) !== "0"; } catch (e) { return true; } };
const setTipsEnabled = (v) => { try { localStorage.setItem(TIPS_KEY, v ? "1" : "0"); } catch (e) {} };
const SPLIT_PRESETS = { ideal: { splitFixed: 34, splitVar: 33, splitSav: 33 }, real: { splitFixed: 50, splitVar: 30, splitSav: 20 } };

function Onboarding({ mode, onClose, setSettings, toastMsg }) {
  const [step, setStep] = useState(0);
  const [noMore, setNoMore] = useState(false);
  const cards = (T[LANG] && T[LANG].onb) || T.en.onb;
  const isTip = mode === "tip";
  const last = step >= cards.length - 1;

  const finish = () => {
    markOnbDone();
    if (noMore) setTipsEnabled(false);
    onClose();
  };
  const applyPreset = (k) => {
    if (SPLIT_PRESETS[k]) { setSettings((s) => ({ ...s, ...SPLIT_PRESETS[k] })); toastMsg(t("preset_applied")); }
    finish();
  };

  if (isTip) {
    const tips = (T[LANG] && T[LANG].tips) || T.en.tips;
    const tip = tips[DAILY_QUOTE_IDX % tips.length];
    return (
      <div className="mf-onb">
        <div className="card">
          <Mascot mood="happy" size={104} />
          <h3>{t("tip_title")}</h3>
          <p>{tip}</p>
          <button className="mf-btn primary" style={{ marginTop: 4 }} onClick={finish}>{t("onb_gotit")}</button>
          <label className="mf-onbchk">
            <input type="checkbox" checked={noMore} onChange={(e) => setNoMore(e.target.checked)} style={{ width: 17, height: 17, accentColor: "var(--pink)" }} />
            {t("onb_nomore")}
          </label>
        </div>
      </div>
    );
  }

  const c = cards[step];
  return (
    <div className="mf-onb">
      <button className="mf-onbskip" onClick={finish}>{t("onb_skip")} ✕</button>
      <div className="card">
        <Mascot mood={last ? "excited" : "happy"} size={104} />
        <h3>{c.t}</h3>
        <p>{c.d}</p>
        {last ? (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, marginTop: 2 }}>
            <button className="mf-preset" onClick={() => applyPreset("ideal")}>{t("preset_ideal")} <small>{t("preset_ideal_d")}</small></button>
            <button className="mf-preset" onClick={() => applyPreset("real")}>{t("preset_real")} <small>{t("preset_real_d")}</small></button>
            <button className="mf-preset" onClick={() => applyPreset("later")} style={{ borderColor: "var(--pink-soft)" }}>{t("preset_later")}</button>
            <label className="mf-onbchk" style={{ justifyContent: "center", marginTop: 2 }}>
              <input type="checkbox" checked={noMore} onChange={(e) => setNoMore(e.target.checked)} style={{ width: 17, height: 17, accentColor: "var(--pink)" }} />
              {t("onb_nomore")}
            </label>
          </div>
        ) : (
          <button className="mf-btn primary" style={{ marginTop: 4 }} onClick={() => setStep((n) => n + 1)}>{t("onb_next")} →</button>
        )}
        <div className="dots">{cards.map((_, i) => <div key={i} className={`dot ${i === step ? "on" : ""}`} />)}</div>
      </div>
    </div>
  );
}

/* ---------- mascota ---------- */
const MASCOT_IMG = { worried: "Michi_poor.png", excited: "Michi_rich.png" };
function Mascot({ mood = "neutral", size = 88 }) {
  const src = MASCOT_IMG[mood] || "Michi_normal.png";
  return <img className="mf-bob" src={src} alt="Michi" width={size} height={size} style={{ flexShrink: 0, objectFit: "contain" }} />;
}

function Ring({ size = 84, stroke = 10, value = 0, max = 1, color = "#FF8FA8", track = "#FFD9E3", center, overColor, goalPct }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, cx = size / 2, cy = size / 2;
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const overPct = overColor && max > 0 ? Math.max(0, Math.min(1, (value - max) / max)) : 0;
  const gPct = goalPct != null ? Math.max(0, Math.min(1, goalPct)) : null;
  const gDeg = gPct != null ? gPct * 360 : 0;
  // IDs únicos para los gradientes de bevel
  const idShine = `rs-${size}-${color.replace("#", "")}`;
  const idShadow = `rd-${size}-${color.replace("#", "")}`;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {/* gradiente cónico simulado: brillo arriba-izquierda, sombra abajo-derecha */}
          <linearGradient id={idShine} x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%"   stopColor="#fff" stopOpacity="0.55"/>
            <stop offset="45%"  stopColor="#fff" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0.18"/>
          </linearGradient>
          <linearGradient id={idShadow} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0.28"/>
          </linearGradient>
        </defs>
        {/* pista (track) con sombra interior sutil */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={track} strokeWidth={stroke}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#${idShadow})`} strokeWidth={stroke} opacity="0.35"/>
        {/* arco de color */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dashoffset .9s cubic-bezier(.34,1.56,.64,1)" }}/>
        {overPct > 0 && (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={overColor} strokeWidth={stroke}
            strokeDasharray={c} strokeDashoffset={c * (1 - overPct)} strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dashoffset .9s cubic-bezier(.34,1.56,.64,1)" }}/>
        )}
        {/* capa de bevel encima de todo: brillo arriba, sombra abajo */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#${idShine})`} strokeWidth={stroke}/>
        {gPct != null && (
          <g transform={`rotate(${gDeg} ${cx} ${cy})`}>
            <line x1={cx} y1={cy - r - stroke / 2 - 3} x2={cx} y2={cy - r + stroke / 2 + 3} stroke="#4B5A7A" strokeWidth="4" strokeLinecap="round"/>
            <line x1={cx} y1={cy - r - stroke / 2 - 3} x2={cx} y2={cy - r + stroke / 2 + 3} stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
          </g>
        )}
      </svg>
      {center && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>{center}</div>}
    </div>
  );
}

function Battery({ size = 88, value = 0, max = 1, color = "#FF8FA8", track = "#FFD9E3", center, label, overColor, goalPct }) {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const isOver = max > 0 && value > max;
  // dimensiones: pila gorda (ancha), terminal arriba
  const termW = size * 0.28, termH = size * 0.07;
  const bW = size * 0.76, bH = size * 0.82, rx = size * 0.1;
  const bX = (size - bW) / 2, bY = termH + 2;
  // área interior de relleno (margen interior de 4px)
  const pad = size * 0.06;
  const innerX = bX + pad, innerW = bW - pad * 2;
  const innerBottom = bY + bH - pad;
  const innerH = bH - pad * 2;
  const fillH = innerH * pct;
  const fillY = innerBottom - fillH;
  // porcentaje del exceso (cuánto sobresale del límite) para colorear la parte superior de la barra
  const excessPct = isOver ? Math.min(1, (value - max) / max) : 0;
  const excessH = fillH * Math.min(excessPct, 1);
  const fillColor = isOver ? overColor : color;
  const gPct = goalPct != null ? Math.max(0, Math.min(1, goalPct)) : null;
  const goalY = gPct != null ? innerBottom - innerH * gPct : null;
  const gradId = `bat-g-${size}-${color.replace("#", "")}`;
  const shinId = `bat-s-${size}-${color.replace("#", "")}`;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fillColor} stopOpacity="1"/>
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.75"/>
          </linearGradient>
          <linearGradient id={shinId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.35"/>
            <stop offset="40%" stopColor="#fff" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
          <clipPath id={`bat-clip-${size}-${color.replace("#", "")}`}>
            <rect x={innerX} y={bY + pad} width={innerW} height={innerH} rx={rx * 0.5}/>
          </clipPath>
        </defs>
        {/* terminal + (arriba, centrado) */}
        <rect x={(size - termW) / 2} y={0} width={termW} height={termH + 3} rx={termH * 0.4}
          fill={track} stroke={track} strokeWidth="1"/>
        {/* cuerpo de la pila */}
        <rect x={bX} y={bY} width={bW} height={bH} rx={rx} fill={track} stroke={track} strokeWidth="1.5"/>
        {/* relleno (con clipPath para no salirse del borde interior) */}
        <g clipPath={`url(#bat-clip-${size}-${color.replace("#", "")})`}>
          {fillH > 0 && (
            <rect x={innerX} y={fillY} width={innerW} height={fillH} rx={rx * 0.5}
              fill={`url(#${gradId})`}/>
          )}
          {/* franja de exceso más intensa en la parte superior del relleno */}
          {excessH > 0 && (
            <rect x={innerX} y={fillY} width={innerW} height={excessH} rx={rx * 0.5}
              fill={fillColor} opacity="0.7"/>
          )}
        </g>
        {/* línea de meta */}
        {goalY != null && (
          <>
            <line x1={bX - 2} y1={goalY} x2={bX + bW + 2} y2={goalY} stroke="#4B5A7A" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1={bX - 2} y1={goalY} x2={bX + bW + 2} y2={goalY} stroke="#fff" strokeWidth="1" strokeDasharray="3 2"/>
          </>
        )}
        {/* brillo lateral izquierdo */}
        <rect x={bX} y={bY} width={bW} height={bH} rx={rx} fill={`url(#${shinId})`}/>
        {/* ojos kawaii */}
        <circle cx={size * 0.36} cy={bY + bH * 0.3} r={size * 0.04} fill="#4A3A40"/>
        <circle cx={size * 0.64} cy={bY + bH * 0.3} r={size * 0.04} fill="#4A3A40"/>
        <circle cx={size * 0.36 + size * 0.015} cy={bY + bH * 0.28} r={size * 0.016} fill="#fff" opacity="0.85"/>
        <circle cx={size * 0.64 + size * 0.015} cy={bY + bH * 0.28} r={size * 0.016} fill="#fff" opacity="0.85"/>
        {/* boca */}
        <path d={`M ${size * 0.38} ${bY + bH * 0.42} Q ${size * 0.5} ${bY + bH * 0.52} ${size * 0.62} ${bY + bH * 0.42}`}
          stroke="#4A3A40" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      </svg>
      {center && <div style={{ textAlign: "center", fontSize: 12, fontWeight: 800, fontFamily: "Baloo 2" }}>{center}</div>}
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textAlign: "center" }}>{label}</div>}
    </div>
  );
}


function Confetti({ trigger }) {
  const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colors = ["#FF8FA8", "#6FBEEF", "#9AE6B4", "#7ED6A5"];
  const pieces = useMemo(() => Array.from({ length: 32 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.25,
    round: Math.random() > 0.5,
    color: colors[i % colors.length],
  })), [trigger]);
  if (!trigger || reduced) return null;
  return (
    <div className="mf-confetti" key={trigger}>
      {pieces.map((p, i) => (
        <div className="mf-cp" key={i} style={{ left: `${p.left}%`, background: p.color, animationDelay: `${p.delay}s`, borderRadius: p.round ? "50%" : "3px" }}/>
      ))}
    </div>
  );
}

/* ---------- gráfica mensual: fijos + variables + ahorro ---------- */
function MonthlyChart({ data, targetSavings }) {
  const W = 700, H = 370, padL = 68, padR = 18, padT = 24, padB = 44;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = data.length;
  if (n === 0) return null;
  const allVals = data.flatMap((d) => [d.fijos, d.vars, d.savings]);
  let yMax = Math.max(targetSavings || 0, ...allVals, 1) * 1.12;
  let yMin = Math.min(0, ...allVals);
  if (yMax - yMin < 1) yMax = yMin + 1;
  const range = yMax - yMin;
  const groupW = plotW / n;
  const barW = Math.max(8, Math.min(28, groupW * 0.22));
  const gap = barW * 0.2;
  const offsets = [-(barW + gap), 0, barW + gap];
  const xc = (i) => padL + (i + 0.5) * groupW;
  const yFn = (v) => padT + ((yMax - v) / range) * plotH;
  const y0 = yFn(0);
  const FF = "Nunito, system-ui, sans-serif";
  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => yMin + (range * i) / ticks);
  const mkBar = (cx, v, color, dim) => {
    const top = Math.min(yFn(v), y0), h = Math.max(2, Math.abs(yFn(v) - y0));
    return <rect x={cx - barW / 2} y={top} width={barW} height={h} rx={3} fill={v < 0 ? "#E8453C" : color} opacity={dim ? 0.55 : 1} />;
  };
  return (
    <div>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 10, flexWrap: "wrap" }}>
        {[["#6FBEEF",t("fixed_label")],["#FF8FA8",t("var_label")],["#9AE6B4",t("sav_label")]].map(([c,l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "var(--ink-soft)" }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: c, flexShrink: 0 }} />{l}
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto", display: "block" }}>
        {yTicks.map((t, i) => (
          <g key={`g${i}`}>
            <line x1={padL} y1={yFn(t)} x2={W - padR} y2={yFn(t)} stroke="#F5E4D0" strokeWidth="1.5" />
            <text x={padL - 8} y={yFn(t) + 5} textAnchor="end" fontSize="13" fontWeight="700" fill="#9C8890" fontFamily={FF}>{Math.round(t)}</text>
          </g>
        ))}
        {yMin < 0 && <line x1={padL} y1={y0} x2={W - padR} y2={y0} stroke="#C8B8C0" strokeWidth="1" />}
        {targetSavings > 0 && <>
          <line x1={padL} y1={yFn(targetSavings)} x2={W - padR} y2={yFn(targetSavings)} stroke="#7ED6A5" strokeWidth="2" strokeDasharray="8 5" />
          <text x={W - padR} y={yFn(targetSavings) - 7} textAnchor="end" fontSize="12" fontWeight="800" fill="#5aa17e" fontFamily={FF}>{t("chart_goal_lbl")}</text>
        </>}
        {data.map((d, i) => {
          const cx = xc(i), isLast = i === n - 1;
          return (
            <g key={`m${i}`}>
              {mkBar(cx + offsets[0], d.fijos, "#6FBEEF", isLast)}
              {mkBar(cx + offsets[1], d.vars, "#FF8FA8", isLast)}
              {mkBar(cx + offsets[2], d.savings, "#9AE6B4", isLast)}
              <text x={cx} y={H - 10} textAnchor="middle" fontSize={n > 9 ? "11" : "13"} fontWeight="700"
                fill={isLast ? "var(--ink)" : "#9C8890"} fontFamily={FF}>{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ============================================================ APP */
export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [fixed, setFixed] = useState([]);
  const [txns, setTxns] = useState([]);
  const [income, setIncome] = useState([]);
  const [patrimonio, setPatrimonio] = useState([]);
  const [patrimonioHistory, setPatrimonioHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("inicio");
  const [toast, setToast] = useState(null);
  const [burst, setBurst] = useState(0);
  const [lastBackup, setLastBackup] = useState(() => getLastBackup());
  // bienvenida: guia completa la primera vez, un consejo en los siguientes arranques
  const [onbMode, setOnbMode] = useState(null);
  useEffect(() => { if (loaded) setOnbMode(!onbDone() ? "full" : (tipsEnabled() ? "tip" : null)); }, [loaded]);
  const replayOnboarding = useCallback(() => setOnbMode("full"), []);
  // archivo fijo de copia: recuperar el enlace guardado (si el navegador soporta la API)
  const [backupHandle, setBackupHandle] = useState(null);
  const [backupFileName, setBackupFileName] = useState("");
  const [handleReady, setHandleReady] = useState(!FSA_OK);
  useEffect(() => {
    if (!FSA_OK) return;
    idbGet("backupHandle").then((h) => { if (h) { setBackupHandle(h); setBackupFileName(h.name || ""); } }).finally(() => setHandleReady(true));
  }, []);
  const toastMsg = useCallback((m) => setToast({ m, id: Date.now() }), []);

  useEffect(() => {
    (async () => {
      try { const s = await window.storage.get("mf_fin_settings"); if (s && s.value) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s.value) }); } catch (e) {}
      try { const f = await window.storage.get("mf_fin_fixed"); if (f && f.value) setFixed(JSON.parse(f.value)); } catch (e) {}
      try { const t = await window.storage.get("mf_fin_var"); if (t && t.value) setTxns(JSON.parse(t.value)); } catch (e) {}
      try { const i = await window.storage.get("mf_fin_income"); if (i && i.value) setIncome(JSON.parse(i.value)); } catch (e) {}
      try { const p = await window.storage.get("mf_fin_patrimonio"); if (p && p.value) setPatrimonio(JSON.parse(p.value)); } catch (e) {}
      try { const ph = await window.storage.get("mf_fin_pat_hist"); if (ph && ph.value) setPatrimonioHistory(JSON.parse(ph.value)); } catch (e) {}
      setLoaded(true);
    })();
    // pide al navegador que no borre los datos por inactividad (mejor esfuerzo, no garantizado en todos los navegadores)
    try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
  }, []);

  // copia de seguridad automática: una vez al día, si hay algo que respaldar, se guarda sola (silenciosa, sin pedir compartir)
  const backedUpToday = useRef(false);
  useEffect(() => {
    if (!loaded || !handleReady || backedUpToday.current) return;
    const hasData = income.length > 0 || fixed.length > 0 || txns.length > 0 || patrimonio.length > 0;
    if (!hasData || getLastBackup() === todayISO()) return;
    backedUpToday.current = true;
    (async () => {
      if (backupHandle) {
        const ok = await writeBackupToHandle(backupHandle, buildBackupBlob(settings, fixed, txns, income, patrimonio, patrimonioHistory), false);
        if (ok) { setLastBackup(getLastBackup()); toastMsg(t("toast_backup_updated")); return; }
      }
      await shareOrDownloadBackup(settings, fixed, txns, income, patrimonio, patrimonioHistory, true);
      setLastBackup(getLastBackup());
      toastMsg(t("toast_auto_backup"));
    })();
  }, [loaded, handleReady, backupHandle, settings, fixed, txns, income, patrimonio, patrimonioHistory]);

  // restaurar una copia de seguridad JSON: sustituye todos los datos por los del archivo
  const applyBackup = useCallback((payload) => {
    if (!payload || payload.app !== "MichiFinanzas" || typeof payload.settings !== "object") return false;
    setSettings({ ...DEFAULT_SETTINGS, ...payload.settings });
    setFixed(Array.isArray(payload.fixed) ? payload.fixed : []);
    setTxns(Array.isArray(payload.txns) ? payload.txns : []);
    setIncome(Array.isArray(payload.income) ? payload.income : []);
    setPatrimonio(Array.isArray(payload.patrimonio) ? payload.patrimonio : []);
    setPatrimonioHistory(Array.isArray(payload.patrimonioHistory) ? payload.patrimonioHistory : []);
    return true;
  }, []);

  const doManualBackup = useCallback(async () => {
    if (backupHandle) {
      const ok = await writeBackupToHandle(backupHandle, buildBackupBlob(settings, fixed, txns, income, patrimonio, patrimonioHistory), true);
      if (ok) { setLastBackup(getLastBackup()); toastMsg(t("toast_backup_updated")); return; }
    }
    const r = await shareOrDownloadBackup(settings, fixed, txns, income, patrimonio, patrimonioHistory, false);
    setLastBackup(getLastBackup());
    if (r === "shared") toastMsg(t("toast_backup_shared"));
    else if (r === "downloaded") toastMsg(t("toast_backup_downloaded"));
  }, [backupHandle, settings, fixed, txns, income, patrimonio, patrimonioHistory]);

  // vincular / desvincular el archivo fijo de copia
  const choosePinnedFile = useCallback(async () => {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "michifinanzas-backup.json",
        types: [{ description: "MichiFinanzas backup (JSON)", accept: { "application/json": [".json"] } }],
      });
      await idbSet("backupHandle", handle);
      setBackupHandle(handle); setBackupFileName(handle.name || "");
      const ok = await writeBackupToHandle(handle, buildBackupBlob(settings, fixed, txns, income, patrimonio, patrimonioHistory), true);
      if (ok) setLastBackup(getLastBackup());
      toastMsg(t("toast_backup_pinned"));
    } catch (e) {} // cancelado por el usuario
  }, [settings, fixed, txns, income, patrimonio, patrimonioHistory, toastMsg]);
  const unlinkPinned = useCallback(() => { idbDel("backupHandle"); setBackupHandle(null); setBackupFileName(""); }, []);

  const sk = useRef(false), fk = useRef(false), tk = useRef(false), ik = useRef(false);
  useEffect(() => { if (!loaded) return; if (!sk.current) { sk.current = true; return; } window.storage.set("mf_fin_settings", JSON.stringify(settings)).catch(() => {}); }, [settings, loaded]);
  useEffect(() => { if (!loaded) return; if (!fk.current) { fk.current = true; return; } window.storage.set("mf_fin_fixed", JSON.stringify(fixed)).catch(() => {}); }, [fixed, loaded]);
  useEffect(() => { if (!loaded) return; if (!tk.current) { tk.current = true; return; } window.storage.set("mf_fin_var", JSON.stringify(txns)).catch(() => {}); }, [txns, loaded]);
  useEffect(() => { if (!loaded) return; if (!ik.current) { ik.current = true; return; } window.storage.set("mf_fin_income", JSON.stringify(income)).catch(() => {}); }, [income, loaded]);
  const pk = useRef(false);
  useEffect(() => { if (!loaded) return; if (!pk.current) { pk.current = true; return; } window.storage.set("mf_fin_patrimonio", JSON.stringify(patrimonio)).catch(() => {}); }, [patrimonio, loaded]);
  const phk = useRef(false);
  useEffect(() => { if (!loaded) return; if (!phk.current) { phk.current = true; return; } window.storage.set("mf_fin_pat_hist", JSON.stringify(patrimonioHistory)).catch(() => {}); }, [patrimonioHistory, loaded]);

  // tipo de cambio compartido por toda la app (gastos, fijos y conversor)
  const [fxRates, setFxRates] = useState(FX_FALLBACK);
  const [fxLive, setFxLive] = useState(false);
  const [fxUpdated, setFxUpdated] = useState("");
  const [fxLoading, setFxLoading] = useState(true);
  const loadFx = useCallback(() => {
    setFxLoading(true);
    const withT = (url, ms) => { const c = new AbortController(); const t = setTimeout(() => c.abort(), ms); return fetch(url, { signal: c.signal, cache: "no-store" }).finally(() => clearTimeout(t)); };
    const btcPromise = withT("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur", 7000)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d) => { const p = d?.bitcoin?.eur; if (!p) throw 0; return 1 / p; })
      .catch(() => withT("https://api.coinbase.com/v2/prices/BTC-EUR/spot", 5000)
        .then((r) => r.ok ? r.json() : Promise.reject())
        .then((d) => { const p = parseFloat(d?.data?.amount); if (!p) throw 0; return 1 / p; }))
      .catch(() => withT("https://api.kraken.com/0/public/Ticker?pair=XBTEUR", 5000)
        .then((r) => r.ok ? r.json() : Promise.reject())
        .then((d) => { const p = parseFloat(d?.result?.XXBTZEUR?.c?.[0]); if (!p) throw 0; return 1 / p; }))
      .catch(() => FX_FALLBACK.BTC);
    const FX_LIVE = ["USD","GBP","JPY","CHF","CAD","AUD","MXN","THB"];
    withT(`https://api.frankfurter.app/latest?from=EUR&to=${FX_LIVE.join(",")}`, 7000)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d) => { if (!d || !d.rates || !d.rates.USD) throw 0; return { ...d.rates, date: d.date }; })
      .catch(() => withT("https://open.er-api.com/v6/latest/EUR", 7000)
        .then((r) => r.ok ? r.json() : Promise.reject())
        .then((d) => { if (!d || !d.rates || !d.rates.USD) throw 0; const r = d.rates; return { USD: r.USD, GBP: r.GBP, JPY: r.JPY, CHF: r.CHF, CAD: r.CAD, AUD: r.AUD, MXN: r.MXN, THB: r.THB, date: (d.time_last_update_utc || "").slice(5, 16) }; }))
      .then((res) => Promise.all([res, btcPromise]))
      .then(([res, btc]) => { setFxRates({ EUR: 1, ARS: FX_FALLBACK.ARS, COP: FX_FALLBACK.COP, ...res, BTC: btc }); setFxUpdated(res.date || ""); setFxLive(true); })
      .catch(() => { setFxLive(false); })
      .finally(() => setFxLoading(false));
  }, []);
  useEffect(() => { loadFx(); }, [loadFx]);
  const fx = { rates: fxRates, live: fxLive, updated: fxUpdated, loading: fxLoading, reload: loadFx };

  const incomeThisMonth = useMemo(() => {
    const v = incomeForYm(income, todayISO().slice(0, 7), fxRates);
    return v !== null ? v : 0;
  }, [income, fxRates]);

  const budgets = useMemo(() => budgetsOf({ ...settings, income: incomeThisMonth }), [settings, incomeThisMonth]);

  const fixedM = useMemo(() => monthlyFixed(fixed, fxRates), [fixed, fxRates]);
  const curYm = todayISO().slice(0, 7);
  const varSpentCurYm = useMemo(() => varSpentIn(txns, curYm), [txns, curYm]);

  const accSavings = useMemo(() => {
    const real = txns.filter((t) => !t.noSpend);
    const months = new Set(real.map((t) => ymOf(t.date))); months.add(curYm);
    let acc = 0;
    months.forEach((ym) => { acc += (incomeForYm(income, ym, fxRates) ?? 0) - fixedM - varSpentIn(txns, ym); });
    return acc;
  }, [txns, fixedM, curYm, income, fxRates]);

  const addTxn = useCallback((t) => { setTxns((x) => [...x, { id: uid(), ...t }]); }, []);
  const addIncome = useCallback((entry) => { setIncome((x) => [...x, { id: uid(), ...entry }]); }, []);
  const logoTapRef = useRef({ count: 0, timer: null });
  const handleLogoTap = useCallback(() => {
    const ltr = logoTapRef.current;
    clearTimeout(ltr.timer);
    ltr.count += 1;
    if (ltr.count >= 7) { ltr.count = 0; setTab("patrimonio"); }
    else { ltr.timer = setTimeout(() => { ltr.count = 0; }, 2000); }
  }, []);
  const addNoSpend = useCallback(() => {
    const d = todayISO();
    setTxns((x) => {
      if (x.some((t) => t.date === d && t.noSpend)) return x;
      return [...x, { id: uid(), date: d, amount: 0, noSpend: true }];
    });
    toastMsg(t("toast_nospend"));
  }, [toastMsg]);
  const delTxn = useCallback((id) => setTxns((x) => x.filter((t) => t.id !== id)), []);
  const editTxn = useCallback((id, patch) => setTxns((x) => x.map((t) => (t.id === id ? { ...t, ...patch } : t))), []);

  const onReset = useCallback(async () => {
    try { await window.storage.delete("mf_fin_var"); } catch (e) {}
    try { await window.storage.delete("mf_fin_fixed"); } catch (e) {}
    try { await window.storage.delete("mf_fin_income"); } catch (e) {}
    setTxns([]); setFixed([]); setIncome([]);
    toastMsg(t("toast_reset")); setTab("inicio");
  }, [toastMsg]);

  const [lang, setLangState] = useState(LANG);
  const changeLang = useCallback((l) => {
    LANG = l;
    try { localStorage.setItem("mf_lang", l); } catch (e) {}
    setLangState(l);
  }, []);

  if (!loaded) {
    return (<div className="mf-root"><style>{STYLES}</style>
      <div className="mf-phone" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center", color: "var(--ink-soft)" }}><Mascot mood="happy" size={90} /><div style={{ fontWeight: 800, marginTop: 8 }}>{t("loading")}</div></div>
      </div></div>);
  }

  const cur = settings.currency || "€";
  const ctx = { settings, setSettings, fixed, setFixed, txns, addTxn, addNoSpend, delTxn, editTxn, income, setIncome, addIncome, incomeThisMonth, budgets, fixedM, cur, curYm, varSpentCurYm, accSavings, setTab, toastMsg, onReset, fx, lastBackup, doManualBackup, applyBackup, choosePinnedFile, unlinkPinned, backupFileName, replayOnboarding, lang, changeLang, patrimonio, setPatrimonio, patrimonioHistory, setPatrimonioHistory };
  const NAV = [
    { id: "inicio", img: "ICO_Home.png", l: t("nav_inicio") },
    { id: "fijos", img: "ICO_Fix.png", l: t("nav_fijos") },
    { id: "variables", img: "ICO_Wallet.png", l: t("nav_variables") },
    { id: "add", center: true },
    { id: "btc", img: "ICO_BTC.png", l: "BTC" },
    { id: "resumen", img: "ICO_Resume.png", l: t("nav_resumen") },
    { id: "cafecito", img: "ICO_Heart.png", l: t("nav_karma") },
  ];

  return (
    <div className="mf-root"><style>{STYLES}</style>
      <div className="mf-phone">
        <div className="mf-header"><div className="mf-hrow">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div onClick={() => setTab("inicio")} style={{ cursor: "pointer" }}><div className="mf-title">Michi<b>{t("title_suffix")}</b></div><div className="mf-tsub">{t("subtitle")}</div></div>
            <img src="Logo_app.png" alt="" style={{ width: 52, height: 52, objectFit: "contain", cursor: "pointer" }} onClick={handleLogoTap} />
          </div>
          <div className="mf-chip">
            <button className="mf-mini" onClick={() => setTab("ayuda")} style={{ fontWeight: 900, fontSize: 15 }}>?</button>
            <button className="mf-mini" onClick={() => setTab("conversor")}>💱</button>
            <button className="mf-mini gear" onClick={() => setTab("ajustes")}>⚙️</button>
          </div>
        </div></div>

        {tab === "inicio" && <Inicio {...ctx} />}
        {tab === "variables" && <Variables {...ctx} />}
        {tab === "add" && <Añadir {...ctx} />}
        {tab === "fijos" && <Fijos {...ctx} />}
        {tab === "resumen" && <Resumen {...ctx} />}

        {tab === "ayuda" && <Ayuda setTab={setTab} />}
        {tab === "conversor" && <Conversor fx={fx} />}
        {tab === "ajustes" && <Ajustes {...ctx} />}
        {tab === "ingresos" && <Ingresos {...ctx} />}
        {tab === "patrimonio" && <Patrimonio {...ctx} />}
        {tab === "cafecito" && <Cafecito />}
        {tab === "btc" && <BtcPage {...ctx} />}

        <div className="mf-nav"><div className="mf-navin">
          {NAV.map((n) => n.center ? (
            <button key="add" className="mf-navit mf-navadd" onClick={() => setTab("add")}><img className="fab" src="ICO_Add.png" alt="＋" /></button>
          ) : (
            <button key={n.id} className={`mf-navit ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
              {n.img ? <img className="ic" src={n.img} alt="" style={{ width: 30, height: 30, objectFit: "contain" }} /> : <span className="ic">{n.ic}</span>}
              <span>{n.l}</span>
            </button>
          ))}
        </div></div>

        {toast && <div className="mf-toast" key={toast.id}>{toast.m}</div>}
        <Confetti trigger={burst} />
        {onbMode && <Onboarding mode={onbMode} onClose={() => setOnbMode(null)} setSettings={setSettings} toastMsg={toastMsg} />}
      </div>
    </div>
  );
}

/* ---------- INICIO ---------- */
function Inicio({ settings, incomeThisMonth, budgets, fixedM, txns, cur, curYm, varSpentCurYm, accSavings, setTab, lastBackup }) {
  const varSpent = varSpentCurYm;
  const savingsNow = incomeThisMonth - fixedM - varSpent;
  const noIncome = !incomeThisMonth;
  // el animo de Michi depende del ahorro del mes, no de los gastos: >=90% del ahorro objetivo => rico, 0-90% => normal, nada => pobre
  const savingsPct = budgets.savings > 0 ? savingsNow / budgets.savings : (savingsNow > 0 ? 1 : 0);
  let mood = "neutral", bubble = t("bubble_neutral");
  if (noIncome) { mood = "worried"; bubble = t("bubble_noincome"); }
  else if (savingsNow <= 0) { mood = "worried"; bubble = t("bubble_zero"); }
  else if (savingsPct >= 1) { mood = "excited"; bubble = t("bubble_great"); }
  else { mood = "happy"; bubble = t("bubble_ok"); }

  // la burbuja de Michi alterna entre el mensaje de estado y los consejos de uso
  const [bubbleIdx, setBubbleIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setBubbleIdx((i) => i + 1), 6500);
    return () => clearInterval(iv);
  }, []);
  const bubblePhrases = [bubble, ...((T[LANG] && T[LANG].tips) || T.en.tips)];
  const bubbleText = bubblePhrases[bubbleIdx % bubblePhrases.length];

  const goalFixedPct = settings.goalFixed > 0 && budgets.fixed > 0 ? settings.goalFixed / budgets.fixed : null;
  const goalVarPct = settings.goalVar > 0 && budgets.variable > 0 ? settings.goalVar / budgets.variable : null;
  const recent = [...txns].filter((t) => !t.noSpend).sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 4);
  const catOf = (id) => (settings.categories || []).find((c) => c.id === id);

  const backupDays = daysSinceISO(lastBackup);
  const backupOk = backupDays <= 2, backupWarn = backupDays > 2 && backupDays <= 10;
  const backupBg = backupOk ? "var(--mint-soft)" : backupWarn ? "var(--sun-soft)" : "#ffe3e3";
  const backupFg = backupOk ? "#1d5c80" : backupWarn ? "#8a6d1a" : "var(--warn)";
  const backupTxt = !lastBackup ? t("backup_never") : backupDays === 0 ? t("backup_today") : backupDays === 1 ? t("backup_yesterday") : t("backup_days", { n: backupDays });

  return (
    <div className="mf-page">
      {(() => {
        const goal = budgets.savings || 1;
        const isNeg = savingsNow < 0;
        const pct = noIncome ? 0 : (isNeg ? 0 : Math.min(1, savingsNow / goal));
        const overPct = !isNeg && !noIncome && savingsNow > goal ? Math.min(1, (savingsNow - goal) / goal) : 0;
        return (
          <div className="mf-hero">
            <div className="lab">{t("savings_label")}</div>
            <div className="v mf-num" style={{ color: isNeg ? "#E8453C" : undefined }}>
              {(isNeg ? "−" : "") + money(Math.abs(Math.round(noIncome ? 0 : savingsNow)), cur)}
            </div>
            <div style={{ width: "100%", marginTop: 8 }}>
              <div style={{ position: "relative", height: 10, borderRadius: 99, background: "rgba(154,230,180,0.45)", overflow: "hidden" }}>
                {isNeg && !noIncome
                  ? <div style={{ position: "absolute", inset: 0, background: "#E8453C", borderRadius: 99 }} />
                  : <>
                      <div style={{ position: "absolute", inset: 0, width: `${pct * 100}%`, background: "#9AE6B4", borderRadius: 99, transition: "width .9s cubic-bezier(.34,1.56,.64,1)" }} />
                      {overPct > 0 && <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: `${(overPct / (1 + overPct)) * 100}%`, background: "#1E9E5C", borderRadius: 99, transition: "width .9s cubic-bezier(.34,1.56,.64,1)" }} />}
                    </>
                }
              </div>
            </div>
          </div>
        );
      })()}
      <div className="mf-card">
        <div className="mf-h3">{t("this_month", { month: ymToLabel(curYm) })}</div>
        {settings.chartMode === "batteries" ? (
          <div className="mf-rings">
            <div className="mf-ring" onClick={() => setTab("fijos")} style={{ cursor: "pointer" }}>
              <Battery value={fixedM} max={budgets.fixed || 1} color="#6FBEEF" track="#DCF0FC" overColor="#E8453C" goalPct={goalFixedPct} size={96}
                center={<div className="mf-ringval" style={{ fontSize: 12 }}>{fmt(Math.round(fixedM))}</div>}
                label={<><div style={{ fontSize: 10, lineHeight: 1.2, opacity: 0.7 }}>{t("ring_gastos")}</div><div>{t("ring_fijos")}</div></>} />
            </div>
            <div className="mf-ring" onClick={() => setTab("variables")} style={{ cursor: "pointer" }}>
              <Battery value={varSpent} max={budgets.variable || 1} color="#FF8FA8" track="#FFD9E3" overColor="#E8453C" goalPct={goalVarPct} size={96}
                center={<div className="mf-ringval" style={{ fontSize: 12 }}>{fmt(Math.round(varSpent))}</div>}
                label={<><div style={{ fontSize: 10, lineHeight: 1.2, opacity: 0.7 }}>{t("ring_gastos")}</div><div>{t("ring_variables")}</div></>} />
            </div>
            <div className="mf-ring" onClick={() => setTab("resumen")} style={{ cursor: "pointer" }}>
              <Battery value={Math.max(0, savingsNow)} max={budgets.savings || 1} color="#9AE6B4" track="#E1F7E9" overColor="#1E9E5C" size={96}
                center={<div className="mf-ringval" style={{ fontSize: 12 }}>{fmt(Math.round(Math.max(0, savingsNow)))}</div>}
                label={<><div>{t("ring_ahorro")}</div><div style={{ fontSize: 10, lineHeight: 1.2, opacity: 0.7 }}>{t("ring_inversion")}</div></>} />
            </div>
          </div>
        ) : (
          <div className="mf-rings">
            <div className="mf-ring" onClick={() => setTab("fijos")} style={{ cursor: "pointer" }}>
              <Ring value={fixedM} max={budgets.fixed || 1} color="#6FBEEF" track="#DCF0FC" overColor="#E8453C" goalPct={goalFixedPct} size={96}
                center={<div className="mf-ringval">{fmt(Math.round(fixedM))}<br/><small>/{fmt(Math.round(budgets.fixed))}</small></div>} />
              <div className="lab" style={{ textAlign: "center", lineHeight: 1.3 }}>
                <div style={{ fontSize: 9, opacity: 0.7 }}>{t("ring_gastos")}</div>
                <div>{t("ring_fijos")}{fixedM > budgets.fixed && budgets.fixed > 0 ? <b style={{ color: "#E8453C" }}> +{Math.round(((fixedM - budgets.fixed) / budgets.fixed) * 100)}%</b> : null}</div>
              </div>
            </div>
            <div className="mf-ring" onClick={() => setTab("variables")} style={{ cursor: "pointer" }}>
              <Ring value={varSpent} max={budgets.variable || 1} color="#FF8FA8" track="#FFD9E3" overColor="#E8453C" goalPct={goalVarPct} size={96}
                center={<div className="mf-ringval">{fmt(Math.round(varSpent))}<br/><small>/{fmt(Math.round(budgets.variable))}</small></div>} />
              <div className="lab" style={{ textAlign: "center", lineHeight: 1.3 }}>
                <div style={{ fontSize: 9, opacity: 0.7 }}>{t("ring_gastos")}</div>
                <div>{t("ring_variables")}{varSpent > budgets.variable && budgets.variable > 0 ? <b style={{ color: "#E8453C" }}> +{Math.round(((varSpent - budgets.variable) / budgets.variable) * 100)}%</b> : null}</div>
              </div>
            </div>
            <div className="mf-ring" onClick={() => setTab("resumen")} style={{ cursor: "pointer" }}>
              <Ring value={Math.max(0, savingsNow)} max={budgets.savings || 1} color="#9AE6B4" track="#E1F7E9" overColor="#1E9E5C" size={96}
                center={<div className="mf-ringval">{fmt(Math.round(Math.max(0, savingsNow)))}<br/><small>/{fmt(Math.round(budgets.savings))}</small></div>} />
              <div className="lab" style={{ textAlign: "center", lineHeight: 1.3 }}>
                <div>{t("ring_ahorro")}{savingsNow > budgets.savings && budgets.savings > 0 ? <b style={{ color: "#1E9E5C" }}> +{Math.round(((savingsNow - budgets.savings) / budgets.savings) * 100)}%</b> : null}</div>
                <div style={{ fontSize: 9, opacity: 0.7 }}>{t("ring_inversion")}</div>
              </div>
            </div>
          </div>
        )}
        {budgets.variable > 0 && (() => {
          const parts = curYm.split("-");
          const dayOfMonth = parseInt(todayISO().split("-")[2], 10);
          const daysInMon = new Date(parseInt(parts[0]), parseInt(parts[1]), 0).getDate();
          const daysLeft = daysInMon - dayOfMonth;
          const remaining = budgets.variable - varSpent;
          const isOver = remaining < 0;
          const spentPct = Math.min(1, varSpent / budgets.variable);
          const pacePct = Math.min(1, dayOfMonth / daysInMon);
          let hint = null;
          if (varSpent > 0 && dayOfMonth > 0) {
            const projected = (varSpent / dayOfMonth) * daysInMon;
            if (projected > budgets.variable) {
              hint = { warn: true, msg: t("pace_over", { amount: money(Math.round(projected - budgets.variable), cur) }) };
            } else if (daysLeft > 0) {
              hint = { warn: false, msg: t("pace_ok", { amount: money(Math.round(remaining / daysLeft), cur), n: daysLeft }) };
            }
          } else if (varSpent === 0 && dayOfMonth > 1) {
            hint = { warn: false, msg: t("pace_nodata") };
          }
          return (
            <div style={{ marginTop: 14, marginBottom: 4 }}>
              {/* Número grande + etiqueta */}
              <div style={{ textAlign: "center", marginBottom: 10 }}>
                <div style={{ fontFamily: "Baloo 2", fontWeight: 900, fontSize: 30, lineHeight: 1, color: isOver ? "var(--warn)" : "var(--good)" }}>
                  {isOver ? "−" : ""}{money(Math.round(Math.abs(remaining)), cur)}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", marginTop: 3 }}>
                  {isOver ? t("pace_over_label") : t("pace_remaining_label")}
                </div>
              </div>
              {/* Barra: gris-rosa (gastado) | verde (queda) + línea de hoy */}
              <div style={{ position: "relative", paddingBottom: 20 }}>
                <div style={{ display: "flex", height: 14, borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${spentPct * 100}%`, background: isOver ? "var(--warn)" : "var(--pink-soft)", flexShrink: 0, transition: "width .7s" }} />
                  {!isOver && <div style={{ flex: 1, background: "linear-gradient(90deg,#1E9E5C,#3acea0)", transition: "width .7s" }} />}
                </div>
                {/* Línea de hoy (sobresale arriba y abajo de la barra) */}
                <div style={{ position: "absolute", top: -4, height: 22, left: `calc(${pacePct * 100}% - 1.5px)`, width: 3, background: "rgba(30,30,30,0.45)", borderRadius: 99, zIndex: 2 }} />
                {/* Etiqueta "hoy" debajo de la línea */}
                <div style={{ position: "absolute", top: 18, left: `${pacePct * 100}%`, transform: "translateX(-50%)", fontSize: 10.5, fontWeight: 800, color: "var(--ink-soft)", whiteSpace: "nowrap" }}>
                  {t("pace_today_lbl")}
                </div>
              </div>
              {hint && (
                <div style={{ marginTop: 2, fontSize: 12.5, fontWeight: 700, color: hint.warn ? "var(--warn)" : "#1E9E5C", textAlign: "center" }}>{hint.msg}</div>
              )}
            </div>
          );
        })()}
        <div className="mf-balance" style={{ background: savingsNow >= 0 ? "var(--mint-soft)" : "#ffe9e9", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
            <span style={{ fontSize: 26 }}>{savingsNow >= 0 ? "🎉" : "⚠️"}</span>
            <div>
              <div className="big" style={{ color: savingsNow >= 0 ? "var(--good)" : "var(--warn)" }}>
                {settings.rolloverSavings ? money(Math.round(accSavings), cur) : money(Math.round(savingsNow), cur)}
              </div>
              <div className="lab" style={{ color: "var(--ink-soft)" }}>
                {savingsNow < 0 ? t("over_budget") : settings.rolloverSavings ? t("acc_savings") : t("this_month_savings")}
              </div>
              {settings.rolloverSavings && savingsNow >= 0 && (
                <div className="lab" style={{ color: "var(--ink-soft)", fontSize: 11 }}>{t("this_month_label", { month: ymToLabel(curYm) })}: {money(Math.round(savingsNow), cur)}</div>
              )}
            </div>
          </div>
          {savingsNow >= 0 && (
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink)", fontStyle: "italic", paddingLeft: 2, lineHeight: 1.4 }}>
              {dailyQuote()}
            </div>
          )}

        </div>
      </div>

      <div className="mf-card">
        <div className="mf-mascotwrap"><Mascot mood={mood} size={86} /><div className="mf-bubble" key={bubbleIdx % bubblePhrases.length}>{bubbleText}</div></div>
        <button onClick={() => setTab("ajustes")} style={{ marginTop: 10, width: "100%", display: "flex", alignItems: "center", gap: 8, border: "none", borderRadius: 14, padding: "9px 12px", background: backupBg, color: backupFg, fontWeight: 800, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>
          <span style={{ fontSize: 16 }}>🛡️</span><span style={{ flex: 1, textAlign: "left" }}>{backupTxt}</span><span style={{ opacity: .7 }}>{t("backup_save")}</span>
        </button>
      </div>

      <div className="mf-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div className="mf-h3" style={{ margin: 0 }}>{t("recent_title")}</div>
          <button className="mf-link" onClick={() => setTab("variables")}>{t("see_all")}</button>
        </div>
        {recent.length ? recent.map((tx) => {
          const c = catOf(tx.cat);
          return (<div className="mf-tx" key={tx.id}>
            <div className="ic">{c ? c.emoji : "✨"}</div>
            <div className="mid"><div className="nm">{tx.note || (c ? catDisplay(c) : t("expense_fallback"))}</div><div className="sub">{c ? catDisplay(c) : ""} · {tx.date.slice(5)}</div></div>
            <TxAmount tx={tx} cur={cur} />
          </div>);
        }) : <div className="mf-empty">{t("no_expenses")}</div>}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 8, marginBottom: 4 }}>
        <img src="Michi_rich.png" alt="" style={{ width: "70%", maxWidth: 260, opacity: 0.93 }} />
      </div>
    </div>
  );
}

/* ---------- AÑADIR ---------- */
function Añadir({ settings, addTxn, addNoSpend, addIncome, cur, setTab, toastMsg, fx }) {
  const cats = settings.categories || [];
  const [mode, setMode] = useState("gasto");

  // — estado gasto —
  const [amount, setAmount] = useState("");
  const [ccy, setCcy] = useState("THB");
  const [cat, setCat] = useState(cats[0]?.id || "");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");

  // — estado ingreso —
  const [incAmt, setIncAmt] = useState("");
  const [incCcy, setIncCcy] = useState("EUR");
  const [incNote, setIncNote] = useState("");

  const rate = (fx?.rates && fx.rates[ccy]) || 1;
  const native = parseFloat(String(amount).replace(",", "."));
  const eur = !isNaN(native) ? native / rate : null;

  const save = () => {
    const patch = buildTxnPatch(ccy, amount, rate, date, cat, note);
    if (!patch) { toastMsg(t("enter_amount")); return; }
    addTxn({ date: patch.date, amount: patch.amount, cat: patch.cat, note: patch.note, orig: patch.orig, rate: patch.rate });
    toastMsg(`${t("add_type_expense")} · ${SYM[ccy] || ccy}${fmt(patch.native, Number.isInteger(patch.native) ? 0 : 2)}${ccy !== "EUR" ? " ≈ " + money(patch.amount, cur) : ""} 💸`);
    setTab("inicio");
  };

  const saveIncome = () => {
    const a = parseFloat(String(incAmt).replace(",", "."));
    if (!a || a <= 0) { toastMsg(t("enter_amount")); return; }
    addIncome({ ym: todayISO().slice(0, 7), amount: Math.round(a * 100) / 100, cur: incCcy, note: incNote.trim() });
    toastMsg(t("income_added"));
    setTab("inicio");
  };

  return (
    <div className="mf-page">
      <div className="mf-seg" style={{ justifyContent: "center", marginBottom: 16, gap: 10 }}>
        <button className={`mf-segp ${mode === "ingreso" ? "on" : ""}`} onClick={() => setMode("ingreso")} style={{ fontSize: 17, padding: "14px 28px", flex: 1 }}>💰 {t("add_type_income")}</button>
        <button className={`mf-segp ${mode === "gasto" ? "on" : ""}`} onClick={() => setMode("gasto")} style={{ fontSize: 17, padding: "14px 28px", flex: 1 }}>💸 {t("add_type_expense")}</button>
      </div>

      {mode === "gasto" && (<>
        <div className="mf-card">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <CcySelect value={ccy} onChange={setCcy} />
          </div>
          <input className="mf-amt" inputMode="decimal" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
          <div style={{ textAlign: "center", fontWeight: 800, fontSize: 14, color: "var(--ink-soft)", minHeight: 20 }}>
            {ccy === "EUR" ? t("add_base_currency") : (eur != null ? "≈ " + money(eur, cur) : t("add_will_save") + " " + cur)}
          </div>
        </div>
        <div className="mf-card">
          <div className="mf-h3">{t("category_label")}</div>
          <div className="mf-chips">{cats.map((c) => (
            <button key={c.id} className={`mf-chip2 ${cat === c.id ? "on" : ""}`} onClick={() => setCat(c.id)}>{c.emoji} {catDisplay(c)}</button>
          ))}</div>
        </div>
        <div className="mf-card">
          <div className="mf-field"><label>{t("date_label")}</label><input className="mf-input" type="date" value={date} min="2000-01-01" max="2099-12-31" onChange={(e) => setDate(e.target.value)} /></div>
          <div className="mf-field" style={{ marginBottom: 0 }}><label>{t("note_label")} <span className="hint">{t("optional")}</span></label><input className="mf-input" value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} /></div>
        </div>
        <button className="mf-btn primary" onClick={save}>{t("save_expense_btn")}</button>
        <div style={{ height: 10 }} />
        <button className="mf-btn mint" onClick={() => { addNoSpend(); setTab("inicio"); }}>{t("no_spend_btn")}</button>
        {ccy !== "EUR" && <div className="mf-note" style={{ textAlign: "center" }}>{t("rate_note", { rate: fx?.live ? t("rate_live_adj") : t("rate_approx_adj"), ccy: ccy, val: money(1 / rate, cur, 4) })}</div>}
      </>)}

      {mode === "ingreso" && (<>
        <div className="mf-card">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <CcySelect value={incCcy} onChange={setIncCcy} />
          </div>
          <input className="mf-amt" inputMode="decimal" placeholder="0" value={incAmt} onChange={(e) => setIncAmt(e.target.value)} autoFocus />
        </div>
        <div className="mf-card">
          <div className="mf-field" style={{ marginBottom: 0 }}>
            <label>{t("source_label")}</label>
            <input className="mf-input" placeholder={t("source_placeholder")} maxLength={80} value={incNote} onChange={(e) => setIncNote(e.target.value)} />
          </div>
        </div>
        <button className="mf-btn primary" onClick={saveIncome}>{t("save_income_btn")}</button>
      </>)}
    </div>
  );
}

/* ---------- VARIABLES ---------- */
function Variables({ settings, setSettings, txns, budgets, cur, delTxn, editTxn, fx, toastMsg }) {
  const [ym, setYm] = useState(todayISO().slice(0, 7));
  const [draft, setDraft] = useState(null); // { id, ccy, amount, cat, date, note }
  const [goalDraft, setGoalDraft] = useState(String(settings.goalVar || ""));
  const [openCat, setOpenCat] = useState(null);
  const cats = settings.categories || [];
  const monthTx = txns.filter((t) => !t.noSpend && ymOf(t.date) === ym).sort((a, b) => (a.date < b.date ? 1 : -1));
  const spent = monthTx.reduce((a, t) => a + (Number(t.amount) || 0), 0);
  const byCat = cats.map((c) => ({ c, total: monthTx.filter((t) => t.cat === c.id).reduce((a, t) => a + (Number(t.amount) || 0), 0) }))
    .filter((x) => x.total > 0).sort((a, b) => b.total - a.total);
  const maxCat = Math.max(1, ...byCat.map((x) => x.total));
  const catOf = (id) => cats.find((c) => c.id === id);
  const colors = ["#FF8FA8", "#6FBEEF", "#B9A6E8", "#9AE6B4", "#7ED6A5", "#FF8E8E"];
  const pct = budgets.variable > 0 ? Math.min(100, (spent / budgets.variable) * 100) : 0;
  const goalVar = Number(settings.goalVar) || 0;
  const goalPct = goalVar > 0 && budgets.variable > 0 ? Math.max(0, Math.min(100, (goalVar / budgets.variable) * 100)) : null;
  const saveGoal = () => {
    const v = parseFloat(String(goalDraft).replace(",", "."));
    setSettings((s) => ({ ...s, goalVar: v > 0 ? Math.round(v * 100) / 100 : 0 }));
    toastMsg(v > 0 ? t("var_goal_saved") : t("var_goal_removed"));
  };

  const startEdit = (tx) => setDraft({ id: tx.id, ccy: (tx.orig && tx.orig.cur) || "EUR", amount: String((tx.orig && tx.orig.amt) ?? tx.amount), cat: tx.cat, date: tx.date, note: tx.note || "" });
  const cancelEdit = () => setDraft(null);
  const saveEdit = () => {
    const rate = (fx?.rates && fx.rates[draft.ccy]) || 1;
    const patch = buildTxnPatch(draft.ccy, draft.amount, rate, draft.date, draft.cat, draft.note);
    if (!patch) { toastMsg(t("enter_amount")); return; }
    editTxn(draft.id, { date: patch.date, amount: patch.amount, cat: patch.cat, note: patch.note, orig: patch.orig, rate: patch.rate });
    setDraft(null);
    toastMsg(t("expense_updated"));
  };

  return (
    <div className="mf-page">
      <h2 className="mf-h2">{t("var_title")}</h2>
      <div className="mf-calnav">
        <button onClick={() => setYm(ymShift(ym, -1))}>‹</button>
        <b>{ymToLabel(ym)}</b>
        <button onClick={() => setYm(ymShift(ym, 1))}>›</button>
      </div>

      <div className="mf-card">
        <div className="mf-macro"><div className="top"><span className="nm">{t("spent_this_month")}</span><span className="vl"><b>{money(spent, cur)}</b> / {money(Math.round(budgets.variable), cur)}</span></div>
          <div className="mf-mbar"><div className="mf-mfill" style={{ width: `${pct}%`, background: spent > budgets.variable ? "var(--warn)" : "linear-gradient(90deg,var(--pink),var(--lav))" }} />
            {goalPct != null && <div className="mf-mgoal" style={{ left: `${goalPct}%` }} />}</div></div>
        <div className="mf-field" style={{ marginTop: 12, marginBottom: 0 }}>
          <label>{t("goal_label")} <span className="hint">({t("goal_hint_var", { amount: money(Math.round(budgets.variable), cur) })})</span></label>
          <div className="mf-inrow">
            <input className="mf-input" inputMode="decimal" placeholder={`${t("eg")} ${Math.round(budgets.variable * 0.9)}`} value={goalDraft} onChange={(e) => setGoalDraft(e.target.value)} />
            <button className="mf-btn primary sm" onClick={saveGoal} style={{ flex: "0 0 auto" }}>{t("save_btn")}</button>
          </div>
        </div>
        {byCat.length ? <div style={{ marginTop: 12 }}>{byCat.map((x, i) => {
          const isOpen = openCat === x.c.id;
          const catTxns = monthTx.filter((tx) => tx.cat === x.c.id);
          return (
            <div key={x.c.id}>
              <div className="mf-macro" onClick={() => setOpenCat(isOpen ? null : x.c.id)} style={{ cursor: "pointer", userSelect: "none" }}>
                <div className="top">
                  <span className="nm">{x.c.emoji} {catDisplay(x.c)}</span>
                  <span className="vl"><b>{money(x.total, cur)}</b><span style={{ marginLeft: 7, fontSize: 11, opacity: 0.55 }}>{isOpen ? "▲" : "▼"}</span></span>
                </div>
                <div className="mf-mbar"><div className="mf-mfill" style={{ width: `${(x.total / maxCat) * 100}%`, background: colors[i % colors.length] }} /></div>
              </div>
              {isOpen && (
                <div style={{ marginBottom: 4, borderLeft: `3px solid ${colors[i % colors.length]}`, marginLeft: 4, paddingLeft: 10 }}>
                  {catTxns.map((tx) => {
                    return (
                      <div key={tx.id} className="mf-tx" style={{ borderBottom: "1px dashed var(--pink-soft)", paddingTop: 9, paddingBottom: 9 }}>
                        <div className="ic">{x.c.emoji}</div>
                        <div className="mid">
                          <div className="nm">{tx.note || catDisplay(x.c)}</div>
                          <div className="sub">{tx.date.slice(5).replace("-", "/")}</div>
                        </div>
                        <TxAmount tx={tx} cur={cur} />
                        <button className="x" onClick={(e) => { e.stopPropagation(); startEdit(tx); }}>✏️</button>
                        <button className="x" onClick={(e) => { e.stopPropagation(); delTxn(tx.id); }}>✕</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}</div> : <div className="mf-empty">{t("no_var_expenses")}</div>}
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("movements", { n: monthTx.length })}</div>
        {monthTx.length ? monthTx.map((tx) => {
          const c = catOf(tx.cat);
          if (draft && draft.id === tx.id) return (
            <div key={tx.id} style={{ padding: "11px 0", borderBottom: "1px dashed var(--pink-soft)" }}>
              <div style={{ marginBottom: 8 }}><CcySelect value={draft.ccy} onChange={(cc) => setDraft((d) => ({ ...d, ccy: cc }))} /></div>
              <input className="mf-input" style={{ marginBottom: 8 }} inputMode="decimal" value={draft.amount} onChange={(e) => setDraft((d) => ({ ...d, amount: e.target.value }))} />
              <div className="mf-chips" style={{ marginBottom: 8 }}>{cats.map((cc) => (
                <button key={cc.id} className={`mf-chip2 ${draft.cat === cc.id ? "on" : ""}`} onClick={() => setDraft((d) => ({ ...d, cat: cc.id }))}>{cc.emoji} {catDisplay(cc)}</button>
              ))}</div>
              <input className="mf-input" style={{ marginBottom: 8 }} type="date" value={draft.date} min="2000-01-01" max="2099-12-31" onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))} />
              <input className="mf-input" style={{ marginBottom: 8, fontSize: 14 }} placeholder={t("note_placeholder")} maxLength={200} value={draft.note} onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))} />
              <div className="mf-inrow">
                <button className="mf-btn primary sm" onClick={saveEdit}>{t("save_edit_btn")}</button>
                <button className="mf-btn ghost sm" onClick={cancelEdit}>{t("cancel_btn")}</button>
              </div>
            </div>
          );
          return (
          <div className="mf-tx" key={tx.id}>
            <div className="ic">{c ? c.emoji : "✨"}</div>
            <div className="mid"><div className="nm">{tx.note || (c ? catDisplay(c) : t("expense_fallback"))}</div><div className="sub">{c ? catDisplay(c) : ""} · {tx.date.slice(5)}</div></div>
            <TxAmount tx={tx} cur={cur} />
            <button className="x" onClick={() => startEdit(tx)}>✏️</button>
            <button className="x" onClick={() => delTxn(tx.id)}>✕</button>
          </div>); }) : <div className="mf-empty">{t("nothing_here")}</div>}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
        <img src="Michi_Hucha.png" alt="" style={{ width: "70%", maxWidth: 260, opacity: 0.92 }} />
      </div>
    </div>
  );
}

/* ---------- FIJOS ---------- */
function Fijos({ fixed, setFixed, settings, setSettings, budgets, fixedM, cur, toastMsg, fx }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [rec, setRec] = useState("monthly");
  const [ccy, setCcy] = useState("THB");
  const [editingId, setEditingId] = useState(null);
  const [goalDraft, setGoalDraft] = useState(String(settings.goalFixed || ""));
  const rates = fx?.rates || FX_FALLBACK;

  const add = () => {
    const a = parseFloat(String(amount).replace(",", "."));
    if (!name.trim() || !a || a <= 0) { toastMsg(t("enter_name_amount")); return; }
    setFixed((x) => [...x, { id: uid(), name: name.trim(), amount: Math.round(a * 100) / 100, rec, cur: ccy }]);
    setName(""); setAmount(""); setRec("monthly"); toastMsg(t("fixed_added"));
  };
  const del = (id) => setFixed((x) => x.filter((f) => f.id !== id));
  const setRecOf = (id, k) => setFixed((x) => x.map((f) => f.id === id ? { ...f, rec: k } : f));
  const updateFixed = (id, field, v) => setFixed((x) => x.map((f) => f.id === id ? { ...f, [field]: v } : f));
  const normalizeAmount = (id, v) => { const a = parseFloat(String(v).replace(",", ".")); updateFixed(id, "amount", a > 0 ? Math.round(a * 100) / 100 : 0); };
  const pct = budgets.fixed > 0 ? Math.min(100, (fixedM / budgets.fixed) * 100) : 0;
  const eurMonth = (f) => ((Number(f.amount) || 0) * recurX(f.rec)) / ((rates[f.cur || "EUR"]) || 1);
  const goalFixed = Number(settings.goalFixed) || 0;
  const goalPct = goalFixed > 0 && budgets.fixed > 0 ? Math.max(0, Math.min(100, (goalFixed / budgets.fixed) * 100)) : null;
  const saveGoal = () => {
    const v = parseFloat(String(goalDraft).replace(",", "."));
    setSettings((s) => ({ ...s, goalFixed: v > 0 ? Math.round(v * 100) / 100 : 0 }));
    toastMsg(v > 0 ? t("fixed_goal_saved") : t("fixed_goal_removed"));
  };

  return (
    <div className="mf-page">
      <h2 className="mf-h2">{t("fixed_title")}</h2>

      <div className="mf-card">
        <div className="mf-macro"><div className="top"><span className="nm">{t("fixed_monthly_cost")}</span><span className="vl"><b>{money(Math.round(fixedM), cur)}</b> / {money(Math.round(budgets.fixed), cur)}</span></div>
          <div className="mf-mbar"><div className="mf-mfill" style={{ width: `${pct}%`, background: fixedM > budgets.fixed ? "var(--warn)" : "linear-gradient(90deg,var(--mint),var(--pink))" }} />
            {goalPct != null && <div className="mf-mgoal" style={{ left: `${goalPct}%` }} />}</div></div>
        <div className="mf-note">{t("fixed_note", { cur: cur, rate: fx?.live ? t("fx_cur_adj") : t("rate_approx_adj") })}</div>
        <div className="mf-field" style={{ marginTop: 12, marginBottom: 0 }}>
          <label>{t("goal_label")} <span className="hint">({t("goal_hint_fixed", { amount: money(Math.round(budgets.fixed), cur) })})</span></label>
          <div className="mf-inrow">
            <input className="mf-input" inputMode="decimal" placeholder={`${t("eg")} ${Math.round(budgets.fixed * 0.9)}`} value={goalDraft} onChange={(e) => setGoalDraft(e.target.value)} />
            <button className="mf-btn primary sm" onClick={saveGoal} style={{ flex: "0 0 auto" }}>{t("save_btn")}</button>
          </div>
        </div>
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("add_fixed_title")}</div>
        <div className="mf-field"><label>{t("name_label")}</label><input className="mf-input" placeholder={t("fixed_name_ph")} value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="mf-field"><label>{t("currency_label")}</label>
          <CcySelect value={ccy} onChange={setCcy} />
        </div>
        <div className="mf-field"><label>{t("amount_label")} ({SYM[ccy]} {ccy})</label><input className="mf-input" inputMode="decimal" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        <div className="mf-field"><label>{t("frequency_label")}</label>
          <div className="mf-seg">{RECUR.map((r) => (
            <button key={r.k} className={`mf-segp ${rec === r.k ? "on" : ""}`} onClick={() => setRec(r.k)} title={recurLabel(r.k)}>{recurAbbr(r.k)}</button>
          ))}</div>
        </div>
        <button className="mf-btn primary" onClick={add}>{t("add_btn")}</button>
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("your_fixed", { n: fixed.length })}</div>
        {fixed.length ? fixed.map((f) => (
          <div key={f.id} style={{ padding: "11px 0", borderBottom: "1px dashed var(--pink-soft)" }}>
            {editingId === f.id ? (
              <>
                <div className="mf-field"><label>{t("name_label")}</label><input className="mf-input" value={f.name} onChange={(e) => updateFixed(f.id, "name", e.target.value)} /></div>
                <div className="mf-field"><label>{t("currency_label")}</label>
                  <CcySelect value={f.cur || "EUR"} onChange={(c) => updateFixed(f.id, "cur", c)} />
                </div>
                <div className="mf-field" style={{ marginBottom: 8 }}><label>{t("amount_label")} ({SYM[f.cur || "EUR"]})</label>
                  <input className="mf-input" inputMode="decimal" value={f.amount} onChange={(e) => updateFixed(f.id, "amount", e.target.value)} onBlur={(e) => normalizeAmount(f.id, e.target.value)} />
                </div>
                <button className="mf-btn primary sm" onClick={() => setEditingId(null)}>{t("done_btn")}</button>
              </>
            ) : (
              <div className="mf-tx" style={{ padding: 0, border: "none" }}>
                <div className="mid"><div className="nm">{f.name}</div><div className="sub">{SYM[f.cur || "EUR"]}{fmt(f.amount, Number.isInteger(Number(f.amount)) ? 0 : 2)} · {recurLabel(f.rec).toLowerCase()} → {money(Math.round(eurMonth(f)), cur)}{t("per_month")}</div></div>
                <button className="x" onClick={() => setEditingId(f.id)}>✏️</button>
                <button className="x" onClick={() => del(f.id)}>✕</button>
              </div>
            )}
            <div className="mf-seg" style={{ marginTop: 8 }}>{RECUR.map((r) => (
              <button key={r.k} className={`mf-segp ${f.rec === r.k ? "on" : ""}`} onClick={() => setRecOf(f.id, r.k)} style={{ fontSize: 11, padding: "5px 9px" }} title={recurLabel(r.k)}>{recurAbbr(r.k)}</button>
            ))}</div>
          </div>
        )) : <div className="mf-empty">{t("no_fixed")}</div>}
      </div>
    </div>
  );
}

/* ---------- RESUMEN ---------- */
function Resumen({ settings, income, incomeThisMonth, txns, budgets, fixedM, cur, curYm, varSpentCurYm, accSavings, fx }) {
  const varSpent = varSpentCurYm;
  const savingsNow = incomeThisMonth - fixedM - varSpent;
  // serie mensual: hasta 12 meses con actividad + mes actual
  const real = txns.filter((t) => !t.noSpend);
  const monthsSet = new Set(real.map((t) => ymOf(t.date))); monthsSet.add(curYm);
  const months = Array.from(monthsSet).sort().slice(-12);
  const chartData = useMemo(() => months.map((ym) => {
    const ymIncome = incomeForYm(income, ym, fx?.rates) ?? 0;
    return {
      label: ymToLabel(ym).slice(0, 3),
      fijos: Math.round(fixedM),
      vars: Math.round(varSpentIn(txns, ym)),
      savings: Math.round(ymIncome - fixedM - varSpentIn(txns, ym)),
    };
  }), [txns, income, fixedM, fx?.rates]);

  return (
    <div className="mf-page">
      <h2 className="mf-h2">{t("resumen_title")}</h2>

      <div className="mf-card">
        <div className="mf-h3">{t("income_split")}</div>
        <div className="mf-grid2">
          <div className="mf-stat"><div className="v mf-num">{money(Math.round(incomeThisMonth), cur)}</div><div className="l">{t("income_this_month_label")}</div></div>
          <div className="mf-stat"><div className="v mf-num" style={{ color: "var(--good)" }}>{money(Math.round(accSavings), cur)}</div><div className="l">{t("acc_savings_label")}</div></div>
          <div className="mf-stat"><div className="v mf-num" style={{ color: "#3aa06f" }}>{money(Math.round(budgets.fixed), cur)}</div><div className="l">{t("fixed_label")} ({settings.splitFixed}%)</div></div>
          <div className="mf-stat"><div className="v mf-num" style={{ color: "var(--pink)" }}>{money(Math.round(budgets.variable), cur)}</div><div className="l">{t("var_label")} ({settings.splitVar}%)</div></div>
        </div>
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("this_month_label", { month: ymToLabel(curYm) })}</div>
        <div className="mf-macro"><div className="top"><span className="nm">{t("fixed_label")}</span><span className="vl"><b>{money(Math.round(fixedM), cur)}</b></span></div></div>
        <div className="mf-macro"><div className="top"><span className="nm">{t("var_label")}</span><span className="vl"><b>{money(Math.round(varSpent), cur)}</b></span></div></div>
        <div className="mf-macro" style={{ marginBottom: 0 }}><div className="top"><span className="nm">{t("sav_label")}</span><span className="vl"><b style={{ color: savingsNow >= 0 ? "var(--good)" : "var(--warn)" }}>{money(Math.round(savingsNow), cur)}</b></span></div></div>
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("monthly_history")}</div>
        {chartData.length >= 1
          ? <MonthlyChart data={chartData} targetSavings={budgets.savings} />
          : <div className="mf-empty">{t("no_data")}</div>}
        <div className="mf-note">{t("chart_note", { amount: money(Math.round(budgets.savings), cur) })}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
        <img src="Resume_img.png" alt="" style={{ width: "70%", maxWidth: 260, opacity: 0.92 }} />
      </div>
    </div>
  );
}

/* ---------- LOGROS ---------- */
/* ---------- AYUDA / FAQ ---------- */
function Ayuda({ setTab }) {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open === i ? null : i);

  const faqs = LANG === "en" ? [
    { section: "🚀 Getting started", items: [
      { q: "How do I start?", a: "Tap ＋ to log your income for the month. Then go to ⚙️ Settings and set how you split it between fixed expenses, variable expenses and savings." },
      { q: "Where is my data stored?", a: "Everything stays on your device — nobody else has access. Back up regularly using the 🛡️ button on the home screen." },
    ]},
    { section: "🏠 Fixed expenses", items: [
      { q: "What are fixed expenses?", a: "Recurring costs you pay regularly: rent, subscriptions, gym... Add them once and the app converts them to a monthly amount automatically." },
      { q: "What do D, W, 2W, M, Q, Y mean?", a: "Daily, Weekly, Bi-weekly, Monthly, Quarterly, Yearly. It is the frequency you pay that expense." },
    ]},
    { section: "🛍️ Variable expenses", items: [
      { q: "What are variable expenses?", a: "Day-to-day spending: food, transport, leisure... Log each one with the ＋ button." },
      { q: "Can I see my spending by category?", a: "Yes — tap any category bar in the Variables screen to expand all transactions for that category." },
    ]},
    { section: "🐷 Savings", items: [
      { q: "How is my savings calculated?", a: "Income − Fixed expenses (monthly) − Variable expenses = Savings this month." },
      { q: "What is the savings goal?", a: "The amount you aim to save each month. Set it in ⚙️. The bar at the top of Home shows your progress." },
    ]},
    { section: "🏦 Net worth", items: [
      { q: "What is the net worth screen?", a: "Your total assets: bank accounts, investments, property... Tap the app logo 7 times to access it." },
      { q: "Does it connect to my bank?", a: "No — you enter values manually. Full control, full privacy." },
    ]},
    { section: "₿ BTC", items: [
      { q: "What is the BTC screen?", a: "It shows the current Bitcoin price and a simulator to calculate what your BTC would be worth at a target price." },
    ]},
    { section: "💾 Backup", items: [
      { q: "Why is backup important?", a: "Your data lives only on this device. If you lose it or reset it, your data is gone. Back up regularly." },
      { q: "How do I restore my data?", a: "Go to ⚙️ Settings → Restore backup and select your backup file." },
      { q: "Can I always use the same backup file?", a: "Yes. In ⚙️ Settings → Choose a fixed backup file, pick once where to keep it (Downloads, your synced Drive folder, a USB drive...) and the app keeps that same file up to date instead of piling up new ones. Available on Chrome, Edge and Android; on iPhone the usual share/download is used." },
    ]},
  ] : [
    { section: "🚀 Primeros pasos", items: [
      { q: "¿Cómo empiezo?", a: "Pulsa ＋ para registrar tus ingresos del mes. Luego ve a ⚙️ Ajustes y configura el reparto entre gastos fijos, variables y ahorro." },
      { q: "¿Dónde se guardan mis datos?", a: "Todo está en tu dispositivo, nadie más tiene acceso. Haz copias de seguridad con el botón 🛡️ de la pantalla de inicio." },
    ]},
    { section: "🏠 Gastos Fijos", items: [
      { q: "¿Qué son los gastos fijos?", a: "Gastos recurrentes: alquiler, suscripciones, gimnasio... Los añades una vez y la app los convierte a coste mensual automáticamente." },
      { q: "¿Qué significan D, S, Q, M, T, A?", a: "Diario, Semanal, Quincenal, Mensual, Trimestral, Anual. Es la frecuencia con la que pagas ese gasto." },
    ]},
    { section: "🛍️ Gastos Variables", items: [
      { q: "¿Qué son los gastos variables?", a: "Los gastos del día a día: comida, transporte, ocio... Los registras cada vez que gastas con el botón ＋." },
      { q: "¿Puedo ver mis gastos por categoría?", a: "Sí, toca cualquier categoría o barra en la pantalla de Variables para ver todos sus gastos desglosados." },
    ]},
    { section: "🐷 Ahorro", items: [
      { q: "¿Cómo se calcula el ahorro?", a: "Ingresos − Gastos Fijos (mes) − Gastos Variables = Ahorro del mes." },
      { q: "¿Qué es el objetivo de ahorro?", a: "El importe que te propones ahorrar cada mes. Lo configuras en ⚙️. La barra de inicio muestra tu progreso." },
    ]},
    { section: "🏦 Patrimonio", items: [
      { q: "¿Qué es el patrimonio?", a: "El valor total de lo que tienes: cuenta corriente, inversiones, inmuebles... Toca el logo de la app 7 veces para acceder." },
      { q: "¿Se conecta con mi banco?", a: "No. Lo introduces tú manualmente. Control total y privacidad absoluta." },
    ]},
    { section: "₿ BTC", items: [
      { q: "¿Para qué sirve la pantalla BTC?", a: "Muestra el precio actual de Bitcoin y un simulador para calcular cuánto valdría si el precio sube a X." },
    ]},
    { section: "💾 Copia de seguridad", items: [
      { q: "¿Por qué es importante la copia?", a: "Tus datos están solo en este dispositivo. Si lo pierdes o formateas, se pierden. Haz copias regularmente." },
      { q: "¿Cómo restauro mis datos?", a: "Ve a ⚙️ Ajustes → Restaurar copia y selecciona tu archivo de backup." },
      { q: "¿Puedo usar siempre el mismo archivo de copia?", a: "Sí. En ⚙️ Ajustes → Elegir archivo fijo de copia, decides una sola vez dónde guardarlo (Descargas, tu carpeta de Drive, un USB...) y la app mantiene ese mismo archivo al día en lugar de acumular archivos nuevos. Disponible en Chrome, Edge y Android; en iPhone se usa el compartir/descargar de siempre." },
    ]},
  ];

  let idx = 0;
  return (
    <div className="mf-page">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <button className="mf-btn ghost sm" onClick={() => setTab("inicio")}>{t("back_settings")}</button>
        <h2 className="mf-h2" style={{ margin: 0 }}>{LANG === "en" ? "❓ Help & FAQ" : "❓ Ayuda y FAQ"}</h2>
      </div>
      {faqs.map((sec) => (
        <div className="mf-card" key={sec.section} style={{ padding: "12px 14px" }}>
          <div className="mf-h3" style={{ marginBottom: 8 }}>{sec.section}</div>
          {sec.items.map((item) => {
            const i = idx++;
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderTop: "1px dashed var(--pink-soft)", paddingTop: 10, marginTop: 10 }}>
                <button onClick={() => toggle(i)} style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, textAlign: "left", fontFamily: "inherit" }}>
                  <span style={{ fontWeight: 800, fontSize: 13.5, color: "var(--ink)", lineHeight: 1.35 }}>{item.q}</span>
                  <span style={{ fontSize: 14, color: "var(--lav)", flexShrink: 0, marginTop: 1 }}>{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen && (
                  <div style={{ marginTop: 8, fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6, paddingLeft: 2 }}>{item.a}</div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ---------- INGRESOS ---------- */
function Ingresos({ income, setIncome, fx, cur, curYm, setTab }) {
  const [ym, setYm] = useState(curYm);
  const rates = fx?.rates || FX_FALLBACK;

  const entriesThisYm = income.filter((e) => e.ym === ym);
  const totalEur = entriesThisYm.reduce((s, e) => s + (Number(e.amount) || 0) / (rates[e.cur || "EUR"] || 1), 0);
  const del = (id) => setIncome((x) => x.filter((e) => e.id !== id));

  return (
    <div className="mf-page">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <button className="mf-btn ghost sm" onClick={() => setTab("ajustes")} style={{ flex: "0 0 auto" }}>{t("back_settings")}</button>
        <h2 className="mf-h2" style={{ margin: 0 }}>{t("income_title")}</h2>
      </div>

      <div className="mf-card">
        <div className="mf-calnav">
          <button onClick={() => setYm(ymShift(ym, -1))}>‹</button>
          <b>{ymToLabel(ym)}</b>
          <button onClick={() => setYm(ymShift(ym, 1))}>›</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <span className="mf-num" style={{ fontSize: 28, color: totalEur > 0 ? "var(--good)" : "var(--ink-soft)" }}>{money(Math.round(totalEur), cur)}</span>
          <div className="mf-note" style={{ marginTop: 2 }}>{t("income_total_note", { cur: cur, rate: fx?.live ? t("rate_live_par") : t("rate_approx_par") })}</div>
        </div>
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("income_list_title", { month: ymToLabel(ym), n: entriesThisYm.length })}</div>
        {entriesThisYm.length ? entriesThisYm.map((e) => {
          const eEur = (Number(e.amount) || 0) / (rates[e.cur || "EUR"] || 1);
          return (
            <div key={e.id} className="mf-tx" style={{ padding: "10px 0", borderBottom: "1px dashed var(--pink-soft)" }}>
              <div className="mid">
                <div className="nm">{e.note || t("income_fallback")}</div>
                <div className="sub">{SYM[e.cur] || e.cur}{fmt(e.amount, Number.isInteger(Number(e.amount)) ? 0 : 2)} {e.cur !== "EUR" ? `→ ${money(Math.round(eEur), cur)}` : ""}</div>
              </div>
              <button className="x" onClick={() => del(e.id)}>✕</button>
            </div>
          );
        }) : <div className="mf-empty">{t("no_income_month")}</div>}
      </div>
    </div>
  );
}

/* ---------- PATRIMONIO (pantalla secreta) ---------- */
function PatrimonioChart({ history, cur, view, setView }) {
  const data = useMemo(() => {
    if (!history.length) return [];
    const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
    if (view === "d") {
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 29);
      const cutStr = cutoff.toISOString().slice(0, 10);
      return sorted.filter(x => x.date >= cutStr);
    }
    if (view === "m") {
      const byMonth = {};
      sorted.forEach(x => { byMonth[x.date.slice(0, 7)] = x.total; });
      return Object.keys(byMonth).sort().slice(-12).map(m => ({ date: m, total: byMonth[m] }));
    }
    const byYear = {};
    sorted.forEach(x => { byYear[x.date.slice(0, 4)] = x.total; });
    return Object.keys(byYear).sort().map(y => ({ date: y, total: byYear[y] }));
  }, [history, view]);

  const W = 320, H = 170, PL = 50, PR = 8, PT = 12, PB = 28;
  const cw = W - PL - PR, ch = H - PT - PB;
  const totals = data.map(d => d.total);
  const rawMin = data.length ? Math.min(...totals) : 0;
  const rawMax = data.length ? Math.max(...totals) : 0;
  const pad = (rawMax - rawMin) * 0.08 || rawMax * 0.1 || 100;
  const minY = Math.max(0, rawMin - pad), maxY = rawMax + pad;
  const range = maxY - minY || 1;
  const toX = (i) => PL + (data.length > 1 ? (i / (data.length - 1)) * cw : cw / 2);
  const toY = (v) => PT + ch - ((v - minY) / range) * ch;

  const shortNum = (v) => {
    if (Math.abs(v) >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}k`;
    return `${Math.round(v)}`;
  };
  const fmtDate = (d) => {
    if (view === "d") return d.slice(5).replace("-", "/");
    if (view === "m") { const [y, m] = d.split("-"); return `${m}/${y.slice(2)}`; }
    return d;
  };

  const isUp = data.length < 2 || data[data.length - 1].total >= data[0].total;
  const lineColor = isUp ? "#1E9E5C" : "#e05575";

  const polyPts = data.map((d, i) => `${toX(i)},${toY(d.total)}`).join(" ");
  const fillD = data.length
    ? `M${toX(0)},${toY(data[0].total)} ` + data.map((d, i) => `L${toX(i)},${toY(d.total)}`).join(" ") + ` L${toX(data.length - 1)},${PT + ch} L${toX(0)},${PT + ch} Z`
    : "";

  const xIdxRaw = data.length <= 4 ? data.map((_, i) => i) : [0, Math.floor((data.length - 1) / 3), Math.floor(2 * (data.length - 1) / 3), data.length - 1];
  const xIdx = [...new Set(xIdxRaw)];
  const yLabels = range > 0 ? [minY, minY + range / 2, maxY] : [rawMax];

  return (
    <div className="mf-card" style={{ padding: "14px 14px 10px" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {["d", "m", "y"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: "6px 0", borderRadius: 10, border: "none", background: view === v ? "var(--lav)" : "var(--pink-soft)", color: view === v ? "#fff" : "var(--ink)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            {v === "d" ? t("pat_view_days") : v === "m" ? t("pat_view_months") : t("pat_view_years")}
          </button>
        ))}
      </div>
      {data.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--ink-soft)", fontSize: 13, padding: "18px 0" }}>{t("pat_no_history")}</div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
          <defs>
            <linearGradient id="patg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {yLabels.map((val, i) => {
            const y = toY(val);
            return (
              <g key={i}>
                <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="var(--pink-soft)" strokeWidth="0.8" strokeDasharray={i === 0 ? "" : "3,3"} />
                <text x={PL - 4} y={y + 3.5} textAnchor="end" fontSize="9.5" fill="var(--ink-soft)">{shortNum(val)}</text>
              </g>
            );
          })}
          {data.length > 1 && <path d={fillD} fill="url(#patg)" />}
          {data.length > 1 && <polyline points={polyPts} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
          {data.map((d, i) => (
            <circle key={i} cx={toX(i)} cy={toY(d.total)} r={data.length > 20 ? 2 : 3.5} fill={lineColor} stroke="#fff" strokeWidth="1.2" />
          ))}
          {xIdx.map(i => (
            <text key={i} x={toX(i)} y={H - 5} textAnchor="middle" fontSize="9" fill="var(--ink-soft)">{fmtDate(data[i].date)}</text>
          ))}
          <text x={W - PR} y={PT - 2} textAnchor="end" fontSize="8.5" fill="var(--ink-soft)">{cur}</text>
        </svg>
      )}
    </div>
  );
}

function Patrimonio({ patrimonio, setPatrimonio, patrimonioHistory, setPatrimonioHistory, cur, setTab, toastMsg }) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");
  const [chartView, setChartView] = useState("d");

  const total = useMemo(() => patrimonio.reduce((s, e) => s + (Number(e.value) || 0), 0), [patrimonio]);

  // auto-snapshot: cada vez que cambia el patrimonio, registra el total de hoy
  useEffect(() => {
    const today = todayISO();
    const snap = { date: today, total };
    setPatrimonioHistory(h => {
      if (!h.length && !patrimonio.length) return h; // sin activos y sin historico: nada que registrar
      const idx = h.findIndex(x => x.date === today);
      if (idx >= 0 && h[idx].total === total) return h;
      if (idx >= 0) { const c = [...h]; c[idx] = snap; return c; }
      return [...h, snap].sort((a, b) => a.date.localeCompare(b.date));
    });
  }, [patrimonio, total]);

  const add = () => {
    const v = parseFloat(String(value).replace(",", "."));
    if (!name.trim() || !v || v <= 0) return;
    setPatrimonio((x) => [...x, { id: uid(), name: name.trim(), value: Math.round(v * 100) / 100, date: todayISO() }]);
    setName(""); setValue("");
    toastMsg(t("pat_saved"));
  };
  const del = (id) => setPatrimonio((x) => x.filter((e) => e.id !== id));
  const startEdit = (e) => { setEditId(e.id); setEditName(e.name); setEditValue(String(e.value)); };
  const saveEdit = () => {
    const v = parseFloat(String(editValue).replace(",", "."));
    if (!editName.trim() || !v || v <= 0) return;
    setPatrimonio(x => x.map(e => e.id === editId ? { ...e, name: editName.trim(), value: Math.round(v * 100) / 100 } : e));
    setEditId(null);
  };

  return (
    <div className="mf-page" style={{ padding: "16px 18px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <button className="mf-btn ghost sm" onClick={() => setTab("inicio")} style={{ flex: "0 0 auto" }}>{t("pat_back")}</button>
        <div>
          <h2 className="mf-h2" style={{ margin: 0 }}>{t("pat_title")}</h2>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", letterSpacing: 0.3 }}>{t("pat_secret")}</div>
        </div>
      </div>

      {/* Gráfica evolución */}
      <PatrimonioChart history={patrimonioHistory} cur={cur} view={chartView} setView={setChartView} />

      {/* Tabla */}
      <div className="mf-card" style={{ padding: 0, overflow: "hidden", marginTop: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", background: "var(--lav)", padding: "10px 14px", gap: 6 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: "#fff" }}>{t("pat_asset")}</div>
          <div style={{ fontWeight: 800, fontSize: 13, color: "#fff", textAlign: "right" }}>{t("pat_value", { cur })}</div>
          <div style={{ width: 22 }} /><div style={{ width: 22 }} />
        </div>
        {patrimonio.length === 0 && (
          <div className="mf-empty" style={{ padding: "24px 16px" }}>{t("pat_empty")}</div>
        )}
        {patrimonio.map((e, i) => (
          <div key={e.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", alignItems: "center", padding: "10px 14px", gap: 6, borderBottom: i < patrimonio.length - 1 ? "1px dashed var(--pink-soft)" : "none" }}>
            {editId === e.id ? (
              <>
                <input className="mf-input" style={{ padding: "4px 8px", fontSize: 13 }} value={editName} onChange={ev => setEditName(ev.target.value)} />
                <input className="mf-input" style={{ padding: "4px 8px", fontSize: 13, width: 78, textAlign: "right" }} inputMode="decimal" value={editValue} onChange={ev => setEditValue(ev.target.value)} />
                <button className="x" onClick={saveEdit} style={{ color: "var(--good)", fontWeight: 900 }}>✓</button>
                <button className="x" onClick={() => setEditId(null)}>✕</button>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)", wordBreak: "break-word" }}>{e.name}</div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "var(--good)", textAlign: "right", whiteSpace: "nowrap" }}>{money(Math.round(e.value), cur)}</div>
                <button className="x" onClick={() => startEdit(e)} style={{ fontSize: 14, opacity: 0.7 }}>✏️</button>
                <button className="x" onClick={() => del(e.id)}>✕</button>
              </>
            )}
          </div>
        ))}
        {patrimonio.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", alignItems: "center", padding: "13px 14px", gap: 6, background: "var(--mint-soft)", borderTop: "2px solid var(--good)" }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: "var(--ink-soft)", letterSpacing: 0.5 }}>{t("pat_total")}</div>
            <div style={{ fontWeight: 900, fontSize: 20, color: "var(--good)", textAlign: "right", fontFamily: "Baloo 2" }}>{money(Math.round(total), cur)}</div>
            <div /><div />
          </div>
        )}
      </div>

      {/* Formulario añadir */}
      <div className="mf-card">
        <div className="mf-h3" style={{ marginBottom: 10 }}>{t("pat_add_btn")}</div>
        <div className="mf-field">
          <label>{t("pat_asset")}</label>
          <input className="mf-input" placeholder={t("pat_name_ph")} maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mf-field" style={{ marginBottom: 12 }}>
          <label>{t("pat_value", { cur })}</label>
          <input className="mf-input" inputMode="decimal" placeholder="0" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <button className="mf-btn primary" onClick={add}>{t("pat_add_btn")}</button>
      </div>

      {/* Michi Patrimonio enmarcada al pie */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 18, marginBottom: 4 }}>
        <div style={{ width: "70%", maxWidth: 260, borderRadius: 22, boxShadow: "0 4px 18px rgba(180,120,220,0.18)", overflow: "hidden", lineHeight: 0 }}>
          <img src="Michi_Patrimonio.png" alt="" style={{ width: "100%", display: "block" }} />
        </div>
      </div>
    </div>
  );
}

/* ---------- AJUSTES ---------- */
function Ajustes({ settings, setSettings, cur, toastMsg, onReset, lastBackup, doManualBackup, applyBackup, choosePinnedFile, unlinkPinned, backupFileName, replayOnboarding, setTab, lang, changeLang }) {
  const [tipsOn, setTipsOnState] = useState(() => tipsEnabled());
  const [s, setS] = useState(settings);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmImport, setConfirmImport] = useState(false);
  const importRef = useRef(null);
  const onImportFile = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo
    setConfirmImport(false);
    if (!f) return;
    try {
      const payload = JSON.parse(await f.text());
      toastMsg(applyBackup(payload) ? t("import_ok") : t("import_bad"));
    } catch (err) { toastMsg(t("import_bad")); }
  };
  const set = (k, v) => setS((x) => ({ ...x, [k]: v }));
  const setNum = (k, v) => setS((x) => ({ ...x, [k]: v === "" ? "" : Number(v) }));
  const sum = (Number(s.splitFixed) || 0) + (Number(s.splitVar) || 0) + (Number(s.splitSav) || 0);

  const setCat = (i, field, v) => setS((x) => { const cs = [...(x.categories || [])]; cs[i] = { ...cs[i], [field]: v }; return { ...x, categories: cs }; });
  const addCat = () => setS((x) => ({ ...x, categories: [...(x.categories || []), { id: "c_" + uid(), name: t("new_cat_name"), emoji: "🏷️" }] }));
  const delCat = (i) => setS((x) => ({ ...x, categories: (x.categories || []).filter((_, j) => j !== i) }));

  const save = () => {
    const clean = { ...s };
    ["splitFixed", "splitVar", "splitSav"].forEach((k) => { if (clean[k] === "" || isNaN(clean[k])) clean[k] = DEFAULT_SETTINGS[k]; });
    if (!clean.currency) clean.currency = "€";
    setSettings(clean); toastMsg(t("settings_saved"));
  };

  return (
    <div className="mf-page">
      <h2 className="mf-h2">{t("settings_title")}</h2>

      <div className="mf-card">
        <div className="mf-h3">{t("your_income_section")}</div>
        <button className="mf-btn primary" style={{ marginBottom: 12 }} onClick={() => setTab("ingresos")}>{t("manage_income_btn")}</button>
        <div className="mf-field" style={{ marginBottom: 0 }}><label>{t("display_currency")}</label><input className="mf-input" value={s.currency} maxLength={3} onChange={(e) => set("currency", e.target.value)} /></div>
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("chart_display")}</div>
        <div className="mf-seg" style={{ justifyContent: "center", marginBottom: 12 }}>
          <button className={`mf-segp ${s.chartMode === "donuts" || !s.chartMode ? "on" : ""}`} onClick={() => set("chartMode", "donuts")}>{t("donuts_btn")}</button>
          <button className={`mf-segp ${s.chartMode === "batteries" ? "on" : ""}`} onClick={() => set("chartMode", "batteries")}>{t("batteries_btn")}</button>
        </div>
        <div className="mf-note">{t("chart_hint")}</div>
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("savings_section")}</div>
        <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <input type="checkbox" checked={!!s.rolloverSavings} onChange={(e) => set("rolloverSavings", e.target.checked)}
            style={{ width: 20, height: 20, accentColor: "var(--pink)", cursor: "pointer", flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{t("rollover_label")}</div>
            <div className="mf-note" style={{ margin: 0 }}>{t("rollover_note")}</div>
          </div>
        </label>
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("split_section")}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button className="mf-preset" style={{ flex: 1, justifyContent: "center", gap: 6, flexWrap: "wrap" }}
            onClick={() => { setS((x) => ({ ...x, ...SPLIT_PRESETS.ideal })); }}>{t("preset_ideal")} <small>{t("preset_ideal_d")}</small></button>
          <button className="mf-preset" style={{ flex: 1, justifyContent: "center", gap: 6, flexWrap: "wrap" }}
            onClick={() => { setS((x) => ({ ...x, ...SPLIT_PRESETS.real })); }}>{t("preset_real")} <small>{t("preset_real_d")}</small></button>
        </div>
        <div className="mf-inrow">
          <div className="mf-field"><label>{t("fixed_pct")}</label><input className="mf-input" inputMode="numeric" value={s.splitFixed} onChange={(e) => setNum("splitFixed", e.target.value)} /></div>
          <div className="mf-field"><label>{t("var_pct")}</label><input className="mf-input" inputMode="numeric" value={s.splitVar} onChange={(e) => setNum("splitVar", e.target.value)} /></div>
          <div className="mf-field"><label>{t("sav_pct")}</label><input className="mf-input" inputMode="numeric" value={s.splitSav} onChange={(e) => setNum("splitSav", e.target.value)} /></div>
        </div>
        <div className="mf-note" style={{ color: sum === 100 ? "var(--ink-soft)" : "var(--warn)" }}>
          {sum}% {sum === 100 ? "✓" : t("split_ideal")} · {t("split_default")}
        </div>
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("cats_section")}</div>
        {(s.categories || []).map((c, i) => (
          <div className="mf-tx" key={c.id} style={{ padding: "8px 0" }}>
            <input className="mf-input" style={{ width: 56, textAlign: "center", padding: "10px 4px", flex: "0 0 auto" }} value={c.emoji} onChange={(e) => setCat(i, "emoji", e.target.value)} />
            <input className="mf-input" style={{ fontSize: 14 }} value={catDisplay(c)} onChange={(e) => setCat(i, "name", e.target.value)} />
            <button className="x" onClick={() => delCat(i)}>✕</button>
          </div>
        ))}
        <button className="mf-btn ghost sm" style={{ marginTop: 8 }} onClick={addCat}>{t("add_cat_btn")}</button>
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("tips_section")}</div>
        <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <input type="checkbox" checked={tipsOn} onChange={(e) => { setTipsOnState(e.target.checked); setTipsEnabled(e.target.checked); }}
            style={{ width: 20, height: 20, accentColor: "var(--pink)", cursor: "pointer", flexShrink: 0 }} />
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{t("tips_toggle")}</div>
        </label>
        <button className="mf-btn ghost" style={{ marginTop: 10 }} onClick={replayOnboarding}>{t("onb_replay")}</button>
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("lang_section")}</div>
        <div className="mf-seg" style={{ justifyContent: "center" }}>
          <button className={`mf-segp ${lang === "es" ? "on" : ""}`} onClick={() => changeLang("es")}>🇪🇸 {t("lang_es")}</button>
          <button className={`mf-segp ${lang === "en" ? "on" : ""}`} onClick={() => changeLang("en")}>🇬🇧 {t("lang_en")}</button>
        </div>
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("backup_section")}</div>
        <div className="mf-note" style={{ marginTop: 0 }}>
          {t("backup_note")}
          {" "}{!lastBackup ? t("backup_never_note") : daysSinceISO(lastBackup) === 0 ? t("backup_last_today") : daysSinceISO(lastBackup) === 1 ? t("backup_last_yesterday") : t("backup_last_days", { n: daysSinceISO(lastBackup) })}
        </div>
        <button className="mf-btn mint" style={{ marginTop: 10 }} onClick={doManualBackup}>{t("backup_btn")}</button>
        <input type="file" accept=".json,application/json" ref={importRef} style={{ display: "none" }} onChange={onImportFile} />
        <button className="mf-btn ghost" style={{ marginTop: 8, color: confirmImport ? "var(--warn)" : undefined }}
          onClick={() => { if (confirmImport) { importRef.current && importRef.current.click(); } else setConfirmImport(true); }}>
          {confirmImport ? t("import_confirm_btn") : t("import_btn")}
        </button>
        {FSA_OK && (backupFileName ? (
          <div className="mf-note" style={{ marginTop: 10 }}>
            {t("backup_pinned", { name: backupFileName })} · <button className="mf-link" onClick={unlinkPinned}>{t("backup_pin_unlink")}</button>
          </div>
        ) : (
          <>
            <button className="mf-btn ghost" style={{ marginTop: 8 }} onClick={choosePinnedFile}>{t("backup_pin_btn")}</button>
            <div className="mf-note">{t("backup_pin_note")}</div>
          </>
        ))}
      </div>

      <button className="mf-btn primary" onClick={save}>{t("save_settings_btn")}</button>
      <div style={{ height: 8 }} />
      <button className="mf-btn ghost" onClick={() => { if (confirmReset) { onReset(); setConfirmReset(false); } else { setConfirmReset(true); } }}
        style={{ color: "var(--warn)", borderColor: confirmReset ? "var(--warn)" : undefined }}>
        {confirmReset ? t("reset_confirm") : t("reset_btn")}
      </button>
      <div style={{ height: 8 }} />
    </div>
  );
}

/* ---------- CONVERSOR de monedas ฿ / $ / € ---------- */
const fxRound = (n, d = 2) => { const dp = Math.pow(10, d); const r = Math.round(n * dp) / dp; return Number.isFinite(r) ? String(r) : ""; };
function fxCalc(src, raw, rates) {
  const num = parseFloat(String(raw).replace(",", "."));
  const empty = Object.fromEntries(CURRENCIES.map((c) => [c, ""]));
  if (raw === "" || isNaN(num)) { empty[src] = raw; return empty; }
  const eur = num / rates[src];
  const o = {};
  CURRENCIES.forEach((c) => { o[c] = c === src ? raw : fxRound(eur * rates[c], ccyDec(c)); });
  return o;
}
const FX_META = [
  { code: "EUR", sym: "€", flag: "🇪🇺", get desc() { return t("fx_eur_desc"); } },
  { code: "USD", sym: "$", flag: "🇺🇸", get desc() { return t("fx_usd_desc"); } },
  { code: "GBP", sym: "£", flag: "🇬🇧", desc: "Libra · pound" },
  { code: "JPY", sym: "¥", flag: "🇯🇵", desc: "Yen japonés" },
  { code: "CHF", sym: "Fr", flag: "🇨🇭", desc: "Franco suizo" },
  { code: "CAD", sym: "C$", flag: "🇨🇦", desc: "Dólar canadiense" },
  { code: "AUD", sym: "A$", flag: "🇦🇺", desc: "Dólar australiano" },
  { code: "MXN", sym: "$", flag: "🇲🇽", desc: "Peso mexicano" },
  { code: "ARS", sym: "$", flag: "🇦🇷", desc: "Peso argentino *" },
  { code: "COP", sym: "$", flag: "🇨🇴", desc: "Peso colombiano *" },
  { code: "THB", sym: "฿", flag: "🇹🇭", get desc() { return t("fx_thb_desc"); } },
  { code: "BTC", sym: "₿", flag: "🟠", get desc() { return t("fx_btc_desc"); } },
];

function Conversor({ fx }) {
  const rates = (fx && fx.rates) || FX_FALLBACK;
  const live = !!(fx && fx.live);
  const loading = !!(fx && fx.loading);
  const updated = (fx && fx.updated) || "";
  const [vals, setVals] = useState(() => fxCalc("THB", "1000", rates));
  const src = useRef("THB");

  useEffect(() => { setVals((v) => fxCalc(src.current, v[src.current], rates)); }, [rates]);

  const onChange = (code, raw) => { src.current = code; setVals(fxCalc(code, raw, rates)); };

  return (
    <div className="mf-page">
      <h2 className="mf-h2">{t("conversor_title")}</h2>
      <div className="mf-card">
        {FX_META.map((m) => (
          <div className="mf-field" key={m.code} style={{ marginBottom: 14 }}>
            <label>{m.flag} {m.code} <span className="hint">· {m.desc}</span></label>
            <div className="mf-inrow" style={{ alignItems: "stretch" }}>
              <input className="mf-input" inputMode="decimal" value={vals[m.code]} onChange={(e) => onChange(m.code, e.target.value)} placeholder="0" />
              <div style={{ flex: "0 0 auto", display: "grid", placeItems: "center", minWidth: 50, fontFamily: "Baloo 2", fontWeight: 800, fontSize: 20, color: "var(--ink-soft)" }}>{m.sym}</div>
            </div>
          </div>
        ))}
        <div className="mf-note">1 € = {fxRound(rates.USD)} $ · {fxRound(rates.THB)} ฿</div>
        <div className="mf-note" style={{ marginTop: 2 }}>
          {loading ? t("fx_updating") : live ? (t("fx_live_label") + (updated ? " · " + updated : "")) : t("fx_offline")}
          {"  "}
          <button className="mf-link" onClick={() => fx && fx.reload && fx.reload()} disabled={loading}>{t("fx_update_btn")}</button>
        </div>
      </div>
      <div className="mf-card">
        <div className="mf-note" style={{ marginTop: 0 }}>{t("fx_bank_note")}</div>
      </div>
    </div>
  );
}

/* ---------- CAFECITO (apoya el proyecto) ---------- */
const LIGHTNING_LNURL = "lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhkcmmrv9kxxmmvwsmrxdfddcg";

function Cafecito() {
  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const [copied, setCopied] = useState(false);

  const copyLnurl = () => {
    navigator.clipboard.writeText(LIGHTNING_LNURL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mf-page">
      <h2 className="mf-h2">{t("cafecito_title")}</h2>
      <div className="mf-card" style={{ textAlign: "center" }}>
        <img src="ICO_Heart.png" alt="" style={{ width: 90, height: 90, objectFit: "contain", margin: "4px auto 10px" }} />
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{t("cafecito_free")}</div>
        <div className="mf-note" style={{ marginTop: 0 }}>
          {t("cafecito_body")}
        </div>
      </div>

      <div className="mf-card" style={{ textAlign: "center" }}>
        <div className="mf-h3">☕ Buy Me a Coffee</div>
        <div className="mf-note" style={{ marginTop: 0 }}>{t("cafecito_bmc_note")}</div>
        <a href="https://www.buymeacoffee.com/MichiFinanzas" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8, padding: "10px 22px", borderRadius: 999, background: "#FFDD00", color: "#000", fontWeight: 800, fontFamily: "Cookie, inherit", fontSize: 17, textDecoration: "none", border: "1px solid #000" }}>
          ☕ Buy me a coffee
        </a>
      </div>

      <div className="mf-card" style={{ textAlign: "center" }}>
        <div className="mf-h3">⚡ Bitcoin Lightning</div>
        <div className="mf-note" style={{ marginTop: 0, marginBottom: 12 }}>
          {t("cafecito_lightning_note")}
        </div>
        {isMobile ? (
          <a href={`lightning:${LIGHTNING_LNURL}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 999, background: "#F7931A", color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none", border: "1.5px solid #000", textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}>
            {t("cafecito_open_wallet")}
          </a>
        ) : (
          <div>
            <div className="mf-note" style={{ marginBottom: 10 }}>{t("cafecito_scan")}</div>
            <img src="lightning_qr.png" alt="Lightning QR" style={{ width: 200, height: 200, borderRadius: 12, border: "3px solid #F7931A", display: "block", margin: "0 auto 12px" }} />
          </div>
        )}
        <button onClick={copyLnurl}
          style={{ marginTop: 8, background: "none", border: "1.5px solid var(--lav)", borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", cursor: "pointer" }}>
          {copied ? t("cafecito_copied") : t("cafecito_copy_btn")}
        </button>
        <div className="mf-note" style={{ marginTop: 8, fontSize: 11 }}>{t("cafecito_compat")}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
        <img src="Michi_love.png" alt="" style={{ width: "70%", maxWidth: 260, opacity: 0.92 }} />
      </div>
    </div>
  );
}

/* ---------- BTC ---------- */
function BtcPage({ accSavings, cur, fx }) {
  // moneda de visualización del simulador, independiente de la moneda principal de la app: BTC se suele cotizar en dólares
  const [btcCcy, setBtcCcy] = useState("EUR");
  const usdRate = (fx?.rates && fx.rates.USD) || FX_FALLBACK.USD; // $ por 1 €
  const dispCur = btcCcy === "USD" ? "$" : "€";
  const toDisp = (eur) => (btcCcy === "USD" ? eur * usdRate : eur);

  const rate = (fx?.rates && fx.rates.BTC) || FX_FALLBACK.BTC; // BTC por 1 EUR
  const price = rate > 0 ? 1 / rate : 0; // EUR por 1 BTC
  const priceDisp = toDisp(price);

  const [ath, setAth] = useState(null);
  useEffect(() => {
    const c = new AbortController();
    fetch("https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false", { signal: c.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { const a = d?.market_data?.ath?.eur; if (a) setAth(a); })
      .catch(() => {});
    return () => c.abort();
  }, []);
  const athDisp = ath != null ? toDisp(ath) : null;

  // simulador: cuánto valdría tu BTC ahora y a un precio objetivo (por defecto x2 o el ATH, el que sea mayor)
  // el texto del input se guarda aparte del número: así se puede escribir "0," o "0,5" sin que se borre a "0" en cada pulsación
  const defaultBtc = price > 0 && accSavings > 0 ? Number((accSavings / price).toFixed(6)) : 0.01;
  const [btcAmountStr, setBtcAmountStr] = useState(String(defaultBtc));
  const btcAmount = parseFloat(btcAmountStr.replace(",", ".")) || 0;
  const btcMax = Math.max(0.05, defaultBtc * 4);

  const targetTouched = useRef(false);
  const [targetPriceStr, setTargetPriceStr] = useState(() => String(Math.round(priceDisp > 0 ? priceDisp * 2 : 120000)));
  const targetPrice = parseFloat(targetPriceStr.replace(",", ".")) || 0;
  useEffect(() => {
    if (!targetTouched.current) setTargetPriceStr(String(Math.round(Math.max(priceDisp * 2, athDisp || 0))));
  }, [ath, btcCcy]);
  const targetMax = Math.max(targetPrice * 1.3, priceDisp * 6, (athDisp || 0) * 1.3, 50000);

  const valueNow = btcAmount * priceDisp;
  const valueTarget = btcAmount * targetPrice;

  return (
    <div className="mf-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 className="mf-h2">₿ Bitcoin</h2>
        <div className="mf-seg" style={{ width: "auto" }}>
          {["EUR", "USD"].map((c) => (
            <button key={c} className={`mf-segp ${btcCcy === c ? "on" : ""}`} onClick={() => { targetTouched.current = false; setBtcCcy(c); }} style={{ fontSize: 11, padding: "5px 9px" }}>
              {c === "EUR" ? "€ EUR" : "$ USD"}
            </button>
          ))}
        </div>
      </div>
      <div className="mf-hero">
        <div className="lab">{t("btc_price_label")}</div>
        <div className="v mf-num">{money(Math.round(priceDisp), dispCur)}</div>
        <div className="sub">{fx?.live ? `${t("btc_market")}${fx.updated ? ` · ${fx.updated}` : ""}` : t("btc_offline_label")} · 1 BTC{athDisp ? ` · ${t("btc_ath")} ${money(Math.round(athDisp), dispCur)}` : ""}</div>
        <button onClick={fx?.reload} disabled={fx?.loading}
          style={{ marginTop: 8, background: "var(--pink)", border: "none", borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 800, color: "#fff", cursor: "pointer", opacity: fx?.loading ? 0.6 : 1, boxShadow: "0 2px 8px rgba(255,143,168,0.4)" }}>
          {fx?.loading ? t("btc_refresh_loading") : t("btc_refresh_btn")}
        </button>
      </div>

      <div className="mf-card">
        <div className="mf-h3">{t("btc_sim_title")}</div>
        <div className="mf-field" style={{ marginBottom: 4 }}>
          <label>{t("btc_amount_label")}</label>
          <input className="mf-input" inputMode="decimal" value={btcAmountStr} onChange={(e) => setBtcAmountStr(e.target.value)} />
          <input className="mf-range" type="range" min="0" max={btcMax} step="0.0001" value={btcAmount}
            onChange={(e) => setBtcAmountStr(e.target.value)} />
        </div>
        <div className="mf-field" style={{ marginBottom: 0 }}>
          <label>{t("btc_target_label", { cur: dispCur })}</label>
          <input className="mf-input" inputMode="decimal" value={targetPriceStr} onChange={(e) => { targetTouched.current = true; setTargetPriceStr(e.target.value); }} />
          <input className="mf-range" type="range" min={Math.round(priceDisp)} max={Math.round(targetMax)} step="500" value={targetPrice}
            onChange={(e) => { targetTouched.current = true; setTargetPriceStr(e.target.value); }} />
        </div>
        <div className="mf-grid2" style={{ marginTop: 10 }}>
          <div className="mf-stat"><div className="v mf-num">{money(Math.round(valueNow), dispCur)}</div><div className="l">{t("btc_value_now")}</div></div>
          <div className="mf-stat"><div className="v mf-num" style={{ color: "#F7931A" }}>{money(Math.round(valueTarget), dispCur)}</div><div className="l">{t("btc_value_target")}</div></div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
        <img src="Michi_BTC.png" alt="" style={{ width: "70%", maxWidth: 260, opacity: 0.92 }} />
      </div>
    </div>
  );
}
