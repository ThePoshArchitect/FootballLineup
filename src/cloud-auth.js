import { ConvexClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

const URL_ = "https://calm-stoat-863.convex.cloud";
const KEY = "lineup-cloud-auth-v1";

const signInRef = makeFunctionReference("auth:signIn");
const signOutRef = makeFunctionReference("auth:signOut");
const meRef = makeFunctionReference("auth:me");
const deleteRef = makeFunctionReference("auth:deleteAccount");

const client = new ConvexClient(URL_);
const listeners = new Set();
let tokens = null;
let email = null;

try {
  const saved = JSON.parse(localStorage.getItem(KEY) || "null");
  if (saved && saved.token && saved.refreshToken) {
    tokens = { token: saved.token, refreshToken: saved.refreshToken };
    email = saved.email || null;
  }
} catch (e) {
  tokens = null;
}

const persist = () => {
  if (tokens) localStorage.setItem(KEY, JSON.stringify({ ...tokens, email }));
  else localStorage.removeItem(KEY);
};
const notify = () => listeners.forEach((fn) => fn(email));

const expiresSoon = (jwt) => {
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp * 1000 < Date.now() + 30000;
  } catch (e) {
    return true;
  }
};

async function refresh() {
  const res = await client.action(signInRef, { refreshToken: tokens.refreshToken });
  if (!res || !res.tokens) throw new Error("Session expired");
  tokens = res.tokens;
  persist();
}

const fetchToken = async () => {
  if (!tokens) return null;
  if (expiresSoon(tokens.token)) {
    try {
      await refresh();
    } catch (e) {
      tokens = null;
      email = null;
      persist();
      notify();
      return null;
    }
  }
  return tokens.token;
};
client.setAuth(fetchToken);

async function authenticate(params) {
  const res = await client.action(signInRef, params);
  if (!res || !res.tokens) throw new Error("Invalid email or password");
  tokens = res.tokens;
  email = params.params.email;
  persist();
  client.setAuth(fetchToken);
  notify();
}

const clean = (err) => {
  const m = String((err && err.message) || err);
  const pw = m.match(/Password must be[^\n"]*/);
  if (pw) return pw[0];
  if (/already exists/i.test(m)) return "An account with this email already exists";
  if (/InvalidAccountId|InvalidSecret|Invalid/i.test(m)) return "Invalid email or password";
  if (/Network|fetch|Failed/i.test(m)) return "Can't reach the server. Check your connection.";
  return "Something went wrong. Please try again.";
};

window.CloudAuth = {
  get email() {
    return tokens ? email : null;
  },
  isSignedIn: () => !!tokens,
  onChange: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  async signUp(addr, password) {
    try {
      await authenticate({ provider: "password", params: { email: addr, password, flow: "signUp" } });
    } catch (e) {
      throw new Error(clean(e));
    }
  },
  async signIn(addr, password) {
    try {
      await authenticate({ provider: "password", params: { email: addr, password, flow: "signIn" } });
    } catch (e) {
      throw new Error(clean(e));
    }
  },
  async signOut() {
    try {
      if (tokens) await client.action(signOutRef, {});
    } catch (e) {
      // sign out locally even if the server call fails
    }
    tokens = null;
    email = null;
    persist();
    notify();
  },
  async deleteAccount() {
    await client.mutation(deleteRef, {});
    tokens = null;
    email = null;
    persist();
    notify();
  },
  me: () => client.query(meRef, {}),
};
