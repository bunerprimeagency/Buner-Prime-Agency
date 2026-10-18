/* DEMO MODE. Used only while the Supabase keys in db.js are not filled in yet.
   Authorized admin email: bunerprimeagency@gmail.com.
   Forgot password and reset features also function seamlessly! */
const DEMO_ADMINS = ["bunerprimeagency@gmail.com", "azmatali1122az2@gmail.com"];
window.__demoPasswords = window.__demoPasswords || {
  "bunerprimeagency@gmail.com": (typeof localStorage !== "undefined" && localStorage.getItem("bpa_admin_pw_bunerprimeagency@gmail.com")) || "demo",
  "azmatali1122az2@gmail.com": (typeof localStorage !== "undefined" && localStorage.getItem("bpa_admin_pw_azmatali1122az2@gmail.com")) || "demo"
};

window.__demoClient = function () {
  const mem = {}, blobs = {};
  const rows = t => mem[t] || (mem[t] = t === "inquiries" ? [
    { id: 1, name: "Irfan Ullah", phone: "03459876543", message: "Hi BPA, we need a complete brand identity and website for our business in Buner.", created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
    { id: 2, name: "Sohail Ahmad", phone: "03331234567", message: "Looking for Meta and Google Ads campaign setup for our local store.", created_at: new Date(Date.now() - 3600000 * 22).toISOString() }
  ] : t === "settings"
    ? [{ id: 1, call_no: CONTACT.call, whatsapp: CONTACT.whatsapp, email: CONTACT.email, location: CONTACT.location }]
    : (store[t] || []).map((x, i) => ({ ...x, id: i + 1, sort: i + 1 })));
  function Q(t) {
    let single = false, upd = null, flt = null;
    const q = {
      select() { return q }, order() { return q }, limit() { return q },
      eq(k, v) { flt = [k, v]; return q }, maybeSingle() { single = true; return q },
      insert(r) { rows(t).push({ id: Date.now(), created_at: new Date().toISOString(), ...r }); return Promise.resolve({ error: null }); },
      update(o) { upd = o; return q },
      upsert(o) { const r = rows(t); if (t === "settings") Object.assign(r[0], o); else r.push(o); return Promise.resolve({ error: null }); },
      then(res, rej) {
        let out = rows(t).slice(); if (t === "inquiries") out.reverse();
        if (upd) { const it = rows(t).find(x => x.id == flt[1]); if (it) Object.assign(it, upd); return Promise.resolve({ error: null }).then(res, rej); }
        if (t === "admins") return Promise.resolve({ data: { role: "owner" } }).then(res, rej);
        if (flt) out = out.filter(x => x[flt[0]] == flt[1]);
        return Promise.resolve(single ? { data: out[0] || null, error: null } : { data: out, error: null }).then(res, rej);
      }
    };
    return q;
  }
  return {
    from: Q,
    auth: {
      signInWithPassword: async ({ email, password }) => {
        const em = String(email || "").toLowerCase().trim();
        const stored = typeof localStorage !== "undefined" && localStorage.getItem("bpa_admin_pw_" + em);
        const expected = stored || window.__demoPasswords[em] || "demo";
        if (DEMO_ADMINS.map(x => x.toLowerCase()).includes(em) && password === expected) {
          return { error: null, data: { user: { id: "demo-user-1", email: em } } };
        }
        return { error: { message: "Invalid email or password. Please check your credentials or use Forgot Password." } };
      },
      resetPasswordForEmail: async (email) => {
        return { error: null, data: {} };
      },
      updateUser: async ({ password }) => {
        const em = (document.getElementById("em") && document.getElementById("em").value.trim().toLowerCase()) || "bunerprimeagency@gmail.com";
        window.__demoPasswords[em] = password;
        try { localStorage.setItem("bpa_admin_pw_" + em, password); } catch(e){}
        return { error: null, data: { user: { id: "demo-user-1", email: em } } };
      },
      getSession: async () => ({ data: { session: null } }),
      signOut: async () => ({})
    },
    storage: { from: () => ({
      upload: async (p, b) => { blobs[p] = URL.createObjectURL(b); return { error: null }; },
      getPublicUrl: p => ({ data: { publicUrl: blobs[p] } })
    }) }
  };
};
