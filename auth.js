const API_BASE_URL = '/api/v1/auth';

/* ─── SESSION HELPERS ─── */
function vcGetSession() {
  try { return JSON.parse(localStorage.getItem('vc_session')) || null; }
  catch { return null; }
}

function vcSetSession(obj) {
  localStorage.setItem('vc_session', JSON.stringify(obj));
}

function vcClearSession() {
  localStorage.removeItem('vc_session');
}

function vcGetRole() {
  const s = vcGetSession();
  return s ? s.role : null;
}

function vcIsLoggedIn() {
  return !!vcGetSession();
}

/* ─── AUTH FUNCTIONS ─── */
async function vcLoginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (result.success) {
      vcSetSession({ 
        role: 'user', 
        name: result.data.user.name, 
        email: result.data.user.email,
        token: result.token 
      });
      return { ok: true };
    }
    return { ok: false, msg: result.message || 'Login failed' };
  } catch (error) {
    return { ok: false, msg: '🌐 Connection error. Is the backend running?' };
  }
}

async function vcRegisterUser(name, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const result = await response.json();
    if (result.success) {
      vcSetSession({ 
        role: 'user', 
        name: result.data.user.name, 
        email: result.data.user.email,
        token: result.token 
      });
      return { ok: true };
    }
    return { ok: false, msg: result.message || 'Registration failed' };
  } catch (error) {
    return { ok: false, msg: '🌐 Connection error.' };
  }
}

async function vcRegisterVendor(vendorData) {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorData)
    });
    const result = await response.json();
    return { ok: result.success, msg: result.message };
  } catch (error) {
    return { ok: false, msg: '🌐 Connection error.' };
  }
}

async function vcLoginVendor(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (result.success) {
      vcSetSession({ 
        role: 'vendor', 
        name: result.data.vendor.ownerName, 
        shopname: result.data.vendor.shopName,
        username: result.data.vendor.username,
        token: result.token 
      });
      return { ok: true };
    }
    return { ok: false, msg: result.message || 'Login failed' };
  } catch (error) {
    return { ok: false, msg: '🌐 Connection error.' };
  }
}

async function vcLoginAdmin(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (result.success) {
      vcSetSession({ 
        role: 'admin', 
        name: result.data.admin.name, 
        email: result.data.admin.email,
        token: result.token 
      });
      return { ok: true };
    }
    return { ok: false, msg: result.message || 'Login failed' };
  } catch (error) {
    return { ok: false, msg: '🌐 Connection error.' };
  }
}

function vcLogout() {
  vcClearSession();
  window.location.href = 'index.html';
}

function vcGuard(requiredRoles, redirectTo = 'user-login.html') {
  const role = vcGetRole();
  const allowed = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  if (!role || !allowed.includes(role)) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}
