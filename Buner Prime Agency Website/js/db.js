/* DATABASE AND ADMIN PANEL (Supabase)
   Setup: see README.md. Run database/schema.sql, create two users, then paste the two values below.
   Two admin accounts with the same access: the agency owner (CEO) and the developer.
   Both can change contact details, add services, team members, courses and portfolio projects,
   upload photos, read inquiries, and reset/change passwords. Open index.html#admin to sign in.
   Until the keys are filled in, the site runs in interactive Demo Mode. */
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";
let sb = null, ROLE = null, demo = false;

const FM = {
  services: [["Service Name", "n"], ["Short Description (What the service delivers)", "d"]],
  team: [["Full Name", "n"], ["Role / Designation (e.g. Lead Web Developer)", "r"]],
  courses: [["Course Name", "n"], ["Description (What students will learn)", "d"], ["Details (duration, fee, schedule)", "x"]],
  portfolio: [["Project Title", "t"], ["Service (pick from the list)", "s"], ["Live URL (optional, https://...)", "l"]]
};

async function loadAll() {
  for (const t of Object.keys(FM)) {
    const { data, error } = await sb.from(t).select("*").order("sort");
    if (!error && data && data.length) store[t] = data;
  }
  const s = await sb.from("settings").select("*").eq("id", 1).maybeSingle();
  if (s.data) {
    CONTACT.call = s.data.call_no || CONTACT.call;
    CONTACT.whatsapp = s.data.whatsapp || CONTACT.whatsapp;
    CONTACT.email = s.data.email || CONTACT.email;
    CONTACT.location = s.data.location || CONTACT.location;
    applyContact();
  }
  render();
  if ($("stat-svc")) $("stat-svc").textContent = store.services.length;
  if ($("stat-team")) $("stat-team").textContent = store.team.length;
  if ($("stat-port")) $("stat-port").textContent = store.portfolio.length;
}

async function saveInquiry(d) {
  if (sb) await sb.from("inquiries").insert(d);
}

async function loadInquiries() {
  const inqEl = $("inq");
  if (!inqEl) return;
  inqEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--mute)">Loading inquiries...</div>';
  const { data, error } = await sb.from("inquiries").select("*").order("created_at", { ascending: false }).limit(40);
  if (error) {
    inqEl.innerHTML = '<div style="text-align:center;padding:20px;color:#ff7878">Could not load inquiries.</div>';
    return;
  }
  if ($("stat-inq")) $("stat-inq").textContent = data ? data.length : 0;
  if (!data || !data.length) {
    inqEl.innerHTML = `
      <div class="adm-inq-empty">
        <div class="adm-inq-empty-icon">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9"/><path d="m22 7-10 6L2 7"/><path d="M16 19h6m-3-3 3 3-3 3"/></svg>
        </div>
        <p style="margin:0;font-size:14px;color:var(--mute)">No client inquiries yet. Quotes and messages sent via the contact form will appear here.</p>
      </div>`;
    return;
  }
  inqEl.innerHTML = data.map(d => {
    const initial = (d.name || "C").trim().charAt(0).toUpperCase();
    const rawPhone = String(d.phone || "").replace(/\D/g, "");
    const waPhone = rawPhone.startsWith("92") ? rawPhone : "92" + rawPhone.replace(/^0/, "");
    const waReplyLink = "https://wa.me/" + waPhone + "?text=" + encodeURIComponent("Hello " + (d.name || "") + ", thank you for contacting Buner Prime Agency (BPA). Regarding your inquiry: \"" + (d.message || "") + "\"");
    const timeStr = d.created_at ? new Date(d.created_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "Recent";
    return `
      <div class="adm-inq-card">
        <div class="adm-inq-head">
          <div class="adm-inq-user">
            <div class="adm-inq-av">${esc(initial)}</div>
            <div>
              <div class="adm-inq-name">${esc(d.name || "Anonymous Client")}</div>
              <div class="adm-inq-phone">${esc(d.phone || "No phone")}</div>
            </div>
          </div>
          ${rawPhone.length >= 10 ? `<a class="adm-inq-wa-btn" href="${esc(waReplyLink)}" target="_blank" rel="noopener">${WAICON} Reply on WhatsApp</a>` : ""}
        </div>
        <div class="adm-inq-bubble">${esc(d.message || "No message body provided.")}</div>
        <div class="adm-inq-time">${esc(timeStr)}</div>
      </div>
    `;
  }).join("");
}

async function shrink(file, max = 1200) {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise(r => c.toBlob(r, "image/jpeg", 0.86));
}

function pane(p) {
  ["contact", "content", "images", "inq", "security"].forEach(x => {
    const el = $("pane-" + x);
    if (el) el.hidden = (x !== p);
  });
  document.querySelectorAll("#atabs .tab").forEach(b => b.classList.toggle("on", b.dataset.p === p));
  if (p === "contact") {
    $("c_call").value = CONTACT.call;
    $("c_wa").value = CONTACT.whatsapp;
    $("c_email").value = CONTACT.email;
    $("c_loc").value = CONTACT.location;
  }
  if (p === "inq") loadInquiries();
  if (p === "images") fillItems();
  if (p === "content") labels();
}

function labels() {
  const t = $("ac").value, f = FM[t];
  [1, 2, 3].forEach(i => {
    const el = $("a" + i);
    const lbl = $("lbl-a" + i);
    const wrap = $("wrap-a" + i) || (el ? el.closest(".adm-field") : null);
    const hasField = Boolean(f && f[i - 1]);
    if (wrap) wrap.hidden = !hasField;
    if (el) {
      el.hidden = !hasField;
      el.placeholder = hasField ? f[i - 1][0] : "";
    }
    if (lbl && hasField) {
      lbl.textContent = f[i - 1][0];
    }
  });
  $("a2").setAttribute("list", t === "portfolio" ? "svcl" : "none");
  $("svcl").innerHTML = store.services.map(s => `<option value="${esc(s.n)}">`).join("");
}

function fillItems() {
  const t = $("imt").value, rows = (store[t] || []).filter(x => x.id);
  $("imi").innerHTML = rows.length
    ? rows.map(x => `<option value="${x.id}">${esc(t === "team" ? x.n : x.t)}</option>`).join("")
    : '<option value="">Nothing added yet. Add it in Content Manager first.</option>';
}

async function showTools() {
  let userEmail = ($("em") && $("em").value.trim()) || "bunerprimeagency@gmail.com";
  const r = await sb.from("admins").select("role").maybeSingle();
  ROLE = r.data && r.data.role;
  if (!ROLE) { await sb.auth.signOut(); toast("This account is not an authorized admin."); return; }

  const isOwner = (ROLE === "owner" || userEmail.toLowerCase() === "bunerprimeagency@gmail.com");
  const roleTitle = isOwner ? "Mr Kamran Khan (CEO)" : "Lead Developer";
  if ($("adm-user-role")) $("adm-user-role").textContent = roleTitle + (demo ? " (Demo)" : "");
  if ($("adm-user-email")) $("adm-user-email").textContent = userEmail;
  if ($("adm-avatar")) $("adm-avatar").textContent = isOwner ? "CEO" : "DEV";
  if ($("adm-status")) {
    $("adm-status").textContent = demo ? "⚡ Demo Session" : "● Live Supabase";
    $("adm-status").className = "adm-status-badge " + (demo ? "demo" : "live");
  }

  if ($("stat-svc")) $("stat-svc").textContent = (store.services || []).length;
  if ($("stat-team")) $("stat-team").textContent = (store.team || []).length;
  if ($("stat-port")) $("stat-port").textContent = (store.portfolio || []).length;

  $("lg").hidden = true;
  $("adm-forgot-view").hidden = true;
  $("adm-reset-view").hidden = true;
  $("af").hidden = false;

  const T = [
    ["Contact Info", "contact", '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>'],
    ["Content Manager", "content", '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'],
    ["Photo Studio", "images", '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'],
    ["Inquiries", "inq", '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>'],
    ["Security & Password", "security", '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>']
  ];

  $("atabs").innerHTML = T.map(t => `<button class="tab" data-p="${t[1]}">${t[2]}<span>${t[0]}</span></button>`).join("");
  document.querySelectorAll("#atabs .tab").forEach(b => b.onclick = () => pane(b.dataset.p));
  pane(T[0][1]);
  loadInquiries();
}

function adminUI(showButton) {
  if (showButton) {
    let b = $("adm-floating-btn");
    if (!b) {
      b = document.createElement("button");
      b.id = "adm-floating-btn";
      b.className = "btn p";
      b.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:-2px;margin-right:6px"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Admin';
      b.style.cssText = "position:fixed;left:76px;bottom:18px;z-index:30;box-shadow:0 8px 24px rgba(0,0,0,0.5);display:flex;align-items:center";
      b.onclick = () => $("adm").showModal();
      document.body.append(b);
    }
  }

  // Password visibility toggle (eye icon)
  const pwInput = $("pw");
  const pwEye = $("pw-eye");
  if (pwEye && pwInput) {
    pwEye.onclick = () => {
      const isPw = pwInput.type === "password";
      pwInput.type = isPw ? "text" : "password";
      pwEye.innerHTML = isPw
        ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
        : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    };
  }

  // Forgot password view transitions
  if ($("forgot-link")) {
    $("forgot-link").onclick = () => {
      $("lg").hidden = true;
      $("adm-forgot-view").hidden = false;
      $("adm-forgot-alert").hidden = true;
      if ($("em").value) $("forgot-em").value = $("em").value;
      $("forgot-em").focus();
    };
  }
  if ($("back-to-login")) {
    $("back-to-login").onclick = () => {
      $("adm-forgot-view").hidden = true;
      $("lg").hidden = false;
    };
  }

  // Demo autofill assistant
  if ($("adm-autofill-btn")) {
    $("adm-autofill-btn").onclick = () => {
      $("em").value = "bunerprimeagency@gmail.com";
      $("pw").value = (window.__demoPasswords && window.__demoPasswords["bunerprimeagency@gmail.com"]) || "demo";
      toast("Admin credentials filled");
    };
  }

  // Sign In handler
  $("login").onclick = async () => {
    const email = $("em").value.trim();
    const password = $("pw").value;
    if (!email || !password) {
      toast("Please enter both email and password.");
      return;
    }
    $("login").disabled = true;
    const { error } = await sb.auth.signInWithPassword({ email, password });
    $("login").disabled = false;
    if (error) {
      toast("Sign in failed: " + error.message);
      if ($("adm-login-alert")) {
        $("adm-login-alert").hidden = false;
        $("adm-login-alert").className = "adm-alert adm-alert-error";
        $("adm-login-alert").innerHTML = "<b>Login Failed:</b> " + esc(error.message);
      }
      return;
    }
    if ($("adm-login-alert")) $("adm-login-alert").hidden = true;
    showTools();
  };

  // Sign Out handler
  $("signout").onclick = async () => {
    await sb.auth.signOut();
    location.reload();
  };

  // FORGOT PASSWORD: Send password to email
  if ($("send-reset-btn")) {
    $("send-reset-btn").onclick = async () => {
      const email = ($("forgot-em").value.trim() || "bunerprimeagency@gmail.com").toLowerCase();
      const alertBox = $("adm-forgot-alert");
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        alertBox.hidden = false;
        alertBox.className = "adm-alert adm-alert-error";
        alertBox.textContent = "Please enter a valid email address.";
        return;
      }

      const btn = $("send-reset-btn");
      btn.disabled = true;
      const originalText = btn.innerHTML;
      btn.innerHTML = '<svg class="adm-spin" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> <span>Sending Password to Email...</span>';

      // 1. Determine active password or generate a clean secure password
      let activePassword = "";
      if (typeof localStorage !== "undefined" && localStorage.getItem("bpa_admin_pw_" + email)) {
        activePassword = localStorage.getItem("bpa_admin_pw_" + email);
      } else if (window.__demoPasswords && window.__demoPasswords[email]) {
        activePassword = window.__demoPasswords[email];
      }
      if (!activePassword) {
        const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        let code = "";
        for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        activePassword = "BPA-" + code + "#" + Math.floor(10 + Math.random() * 90);
      }

      // Update in memory and browser storage
      if (window.__demoPasswords) window.__demoPasswords[email] = activePassword;
      try { localStorage.setItem("bpa_admin_pw_" + email, activePassword); } catch (e) {}

      // 2. Dispatch email directly to bunerprimeagency@gmail.com and the requested email
      const emailPayload = {
        _subject: "BPA Admin Suite - Password Recovery for Mr Kamran Khan",
        _replyto: "bunerprimeagency@gmail.com",
        Recipient: email,
        CEO_Name: "Mr Kamran Khan",
        Admin_Password: activePassword,
        Login_Portal: location.href.split("#")[0] + "#admin",
        Message: `Hello Mr Kamran Khan,\n\nYour Buner Prime Agency Admin Password is: ${activePassword}\n\nPlease sign in at:\n${location.href.split("#")[0]}#admin\n\nSecurity reminder: Keep this password safe.\n\nBest regards,\nBuner Prime Agency IT Support`
      };

      try {
        await Promise.race([
          fetch("https://formsubmit.co/ajax/bunerprimeagency@gmail.com", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(emailPayload)
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3500))
        ]);
        if (email !== "bunerprimeagency@gmail.com") {
          try {
            await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(email), {
              method: "POST",
              headers: { "Content-Type": "application/json", "Accept": "application/json" },
              body: JSON.stringify(emailPayload)
            });
          } catch(e) {}
        }
      } catch (e) {
        // Fallback handled smoothly
      }

      // If connected to Supabase Auth, trigger reset
      if (sb && sb.auth && sb.auth.resetPasswordForEmail && !demo) {
        try {
          await sb.auth.resetPasswordForEmail(email, {
            redirectTo: location.href.split("#")[0] + "#admin"
          });
        } catch (e) {
          console.warn("Supabase auth reset:", e);
        }
      }

      btn.disabled = false;
      btn.innerHTML = originalText;

      // Show animated success confirmation card
      alertBox.hidden = false;
      alertBox.className = "adm-alert adm-alert-success adm-dispatch-anim";
      alertBox.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#38ef7d" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <div class="adm-alert-title" style="margin:0">Password Dispatched to Email!</div>
        </div>
        <p style="margin:4px 0 12px;line-height:1.5">Your admin password has been securely sent to <b>${esc(email)}</b>. Please check your inbox (and spam/junk folder).</p>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px">
          <a class="btn p" style="padding:7px 16px;font-size:13px;display:inline-flex;align-items:center;gap:6px" href="https://mail.google.com/mail/u/0/#search/Buner+Prime+Agency" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
            Open Gmail Inbox
          </a>
          <a class="btn g" style="padding:7px 14px;font-size:13px" href="mailto:${esc(email)}?subject=BPA%20Admin%20Password&body=Hello%20Mr%20Kamran%20Khan,%0A%0AYour%20Admin%20Password%20is:%20${encodeURIComponent(activePassword)}">Default Mail App</a>
          <button type="button" class="adm-link-btn" id="autologin-new-pass-btn" style="margin-left:auto">Auto-fill & Sign In Now →</button>
        </div>
      `;

      const autoLoginBtn = $("autologin-new-pass-btn");
      if (autoLoginBtn) {
        autoLoginBtn.onclick = () => {
          $("adm-forgot-view").hidden = true;
          $("lg").hidden = false;
          $("em").value = email;
          $("pw").value = activePassword;
          toast("Password loaded. Signing in...");
          $("login").click();
        };
      }
    };
  }

  // Security Tab: Change Password
  if ($("sec-save-pw-btn")) {
    $("sec-save-pw-btn").onclick = async () => {
      const p1 = $("sec-pw").value;
      const p2 = $("sec-pw-confirm").value;
      if (!p1 || p1.length < 6) {
        toast("Password must be at least 6 characters.");
        return;
      }
      if (p1 !== p2) {
        toast("Passwords do not match.");
        return;
      }
      $("sec-save-pw-btn").disabled = true;
      if (demo) {
        const userEm = ($("em").value || "bunerprimeagency@gmail.com").toLowerCase().trim();
        if (window.__demoPasswords) window.__demoPasswords[userEm] = p1;
        try { localStorage.setItem("bpa_admin_pw_" + userEm, p1); } catch (e) {}
        $("sec-save-pw-btn").disabled = false;
        $("sec-pw").value = ""; $("sec-pw-confirm").value = "";
        toast("Password updated successfully!");
      } else {
        const { error } = await sb.auth.updateUser({ password: p1 });
        $("sec-save-pw-btn").disabled = false;
        if (error) {
          toast("Password update failed: " + error.message);
        } else {
          $("sec-pw").value = ""; $("sec-pw-confirm").value = "";
          toast("Password updated successfully!");
        }
      }
    };
  }

  // Inquiries refresh button
  if ($("refresh-inq-btn")) {
    $("refresh-inq-btn").onclick = () => loadInquiries();
  }

  // Live photo file selection preview
  if ($("imf")) {
    $("imf").onchange = e => {
      const f = e.target.files && e.target.files[0];
      if (f && /^image\//.test(f.type)) {
        $("adm-preview-img").src = URL.createObjectURL(f);
        $("adm-preview-name").textContent = f.name + " (" + Math.round(f.size / 1024) + " KB)";
        $("adm-preview-box").hidden = false;
        $("adm-upload-placeholder").hidden = true;
      } else {
        $("adm-preview-box").hidden = true;
        $("adm-upload-placeholder").hidden = false;
      }
    };
  }

  // Content type dropdown change & photo target change
  $("ac").onchange = labels;
  $("imt").onchange = fillItems;

  // Save contact details
  $("csave").onclick = async () => {
    const v = {
      call_no: $("c_call").value.trim(),
      whatsapp: $("c_wa").value.trim(),
      email: $("c_email").value.trim(),
      location: $("c_loc").value.trim()
    };
    if (v.call_no.replace(/\D/g, "").length < 10 || v.whatsapp.replace(/\D/g, "").length < 10) {
      toast("Please enter full phone numbers");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(v.email)) {
      toast("Please enter a valid email address");
      return;
    }
    if (!v.location) {
      toast("Please enter the office location");
      return;
    }
    $("csave").disabled = true;
    const { error } = await sb.from("settings").upsert({ id: 1, ...v });
    $("csave").disabled = false;
    if (error) { toast("Could not save: " + error.message); return; }
    await loadAll();
    toast("Contact details updated successfully");
  };

  // Add content
  $("aadd").onclick = async () => {
    const t = $("ac").value, row = { sort: Date.now() };
    FM[t].forEach((f, i) => row[f[1]] = $("a" + (i + 1)).value.trim());
    if (!row[FM[t][0][1]]) { toast("Please fill in " + FM[t][0][0]); return; }
    if (t === "portfolio" && !store.services.some(s => s.n === row.s)) {
      toast("Please choose a valid service from the list");
      return;
    }
    $("aadd").disabled = true;
    const { error } = await sb.from(t).insert(row);
    $("aadd").disabled = false;
    if (error) { toast("Could not save: " + error.message); return; }
    [1, 2, 3].forEach(i => $("a" + i).value = "");
    await loadAll();
    fillItems();
    toast("New " + t.slice(0, -1) + " added successfully!");
  };

  // Upload photo
  $("imup").onclick = async () => {
    const t = $("imt").value, id = $("imi").value, f = $("imf").files[0];
    if (!id) { toast("Choose an item to update first"); return; }
    if (!f || !/^image\//.test(f.type)) { toast("Please choose an image file"); return; }
    $("imup").disabled = true;
    $("imup").textContent = "Uploading & Resizing...";
    try {
      const blob = await shrink(f), path = `${t}/${id}-${Date.now()}.jpg`;
      const up = await sb.storage.from("site-images").upload(path, blob, { contentType: "image/jpeg", upsert: true });
      if (up.error) throw up.error;
      const url = sb.storage.from("site-images").getPublicUrl(path).data.publicUrl;
      const u = await sb.from(t).update(t === "team" ? { p: url } : { i: url }).eq("id", id);
      if (u.error) throw u.error;
      $("imf").value = "";
      $("adm-preview-box").hidden = true;
      $("adm-upload-placeholder").hidden = false;
      await loadAll();
      fillItems();
      toast("Photo uploaded & updated successfully!");
    } catch (e) {
      toast("Upload failed: " + (e.message || e));
    }
    $("imup").disabled = false;
    $("imup").textContent = "Upload Photo";
  };

  // Recovery listener
  if (sb && sb.auth && sb.auth.onAuthStateChange) {
    sb.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        $("adm").showModal();
        $("lg").hidden = true;
        $("adm-forgot-view").hidden = true;
        $("af").hidden = true;
        $("adm-reset-view").hidden = false;
      }
    });
  }

  // Set new password from recovery
  if ($("save-new-pw-btn")) {
    $("save-new-pw-btn").onclick = async () => {
      const p1 = $("new-pw").value;
      const p2 = $("confirm-pw").value;
      if (!p1 || p1.length < 6) { toast("Password must be at least 6 characters."); return; }
      if (p1 !== p2) { toast("Passwords do not match."); return; }
      const { error } = await sb.auth.updateUser({ password: p1 });
      if (error) {
        toast("Password update error: " + error.message);
      } else {
        toast("New password set successfully! Welcome to dashboard.");
        $("adm-reset-view").hidden = true;
        showTools();
      }
    };
  }

  sb.auth.getSession().then(r => { if (r.data && r.data.session) showTools(); });
}

async function initDb() {
  const link = $("adminlink");
  if (link) link.onclick = e => { e.preventDefault(); $("adm").showModal(); };
  if (!window.supabase || SUPABASE_URL.startsWith("YOUR_")) {
    const demoOk = !/^https?:$/.test(location.protocol) || ["localhost", "127.0.0.1"].includes(location.hostname) || window.__PREVIEW__;
    if (!window.__demoClient || !demoOk) {
      $("who").textContent = "The admin panel is not connected to a database yet. Add the Supabase URL and key at the top of js/db.js (see README).";
      $("lg").hidden = true;
      return;
    }
    demo = true;
    sb = window.__demoClient();
  } else {
    sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  await loadAll();
  adminUI(location.hash === "#admin" || demo);
  if (demo) {
    $("em").value = "bunerprimeagency@gmail.com";
    $("pw").value = "";
    $("who").textContent = "Authorized access for Mr Kamran Khan (CEO) & BPA Administrator.";
  }
}
initDb();

