const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),
  getDashboardStats: () => request("/dashboard/stats"),
  getLeads: () => request("/leads"),
  createLead: (payload) => request("/leads", { method: "POST", body: JSON.stringify(payload) }),
  updateLead: (id, payload) => request(`/leads/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteLead: (id) => request(`/leads/${id}`, { method: "DELETE" }),
  getFollowUps: () => request("/followups"),
  createFollowUp: (payload) => request("/followups", { method: "POST", body: JSON.stringify(payload) }),
  updateFollowUp: (id, payload) => request(`/followups/${id}`, { method: "PUT", body: JSON.stringify(payload) })
};
