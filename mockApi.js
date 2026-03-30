// mockApi.js
const mockUsers = [
  { vards: "Alice", lietotajvards: "alice01", parole: "1234", e_pasts: "alice@test.com" },
  { vards: "Bob", lietotajvards: "bob02", parole: "abcd", e_pasts: "bob@test.com" }
];

let loggedInUser = null;
let mockResults = [
  [95, "Alice", "Math"],
  [87, "Bob", "Science"]
];

export async function mockFetch(url, options) {
  await new Promise(res => setTimeout(res, 300)); // simulate delay
  const { method } = options || {};

  // ----- REGISTER -----
  if (url === "/register" && method === "POST") {
    const body = JSON.parse(options.body);
    const exists = mockUsers.some(u => u.lietotajvards === body.lietotajvards);
    if (exists) return { ok: false, json: async () => ({ error: "Username taken" }) };

    mockUsers.push(body);
    return { ok: true, json: async () => ({}) };
  }

  // ----- LOGIN -----
  if (url === "/log_in" && method === "POST") {
    const body = JSON.parse(options.body);
    const user = mockUsers.find(u => u.lietotajvards === body.lietotajvards && u.parole === body.parole);
    if (!user) return { ok: false, json: async () => ({ error: "Invalid credentials" }) };

    loggedInUser = user;
    return { ok: true, json: async () => ({}) };
  }

  // ----- LOGOUT -----
  if (url === "/log_out" && method === "POST") {
    loggedInUser = null;
    return { ok: true, json: async () => ({ ok: true }) };
  }

  // ----- CHANGE PASSWORD -----
  if (url === "/change_password" && method === "POST") {
    const body = JSON.parse(options.body);
    if (!loggedInUser || loggedInUser.parole !== body.old_password)
      return { ok: false, json: async () => ({ error: "Incorrect old password" }) };

    loggedInUser.parole = body.new_password;
    return { ok: true, json: async () => ({}) };
  }

  // ----- SHOW RESULTS -----
  if (url === "/paradit_rez" && method === "GET") {
    if (!loggedInUser) return { ok: false, json: async () => ({ error: "Not logged in" }) };
    return { ok: true, json: async () => ({ ok: true, rezultati: mockResults }) };
  }

  return { ok: false, json: async () => ({ error: "Unknown endpoint" }) };
}
