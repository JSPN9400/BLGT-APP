const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true" || !API_BASE_URL;
const DEMO_STORAGE_KEY = "lead-grid-demo-db";
const FREE_PLAN_LIMIT = 50;

function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function getIsoTimestamp() {
  return new Date().toISOString();
}

function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function buildStatsForUser(state, user) {
  const today = getTodayIsoDate();
  const leads = state.leads.filter((lead) => lead.user_id === user.id);
  const followUps = state.followUps.filter((followUp) => followUp.user_id === user.id);
  const totalLeads = leads.length;
  const isFreePlan = user.current_plan?.toLowerCase() !== "pro";

  return {
    leads_today: leads.filter((lead) => lead.created_at.slice(0, 10) === today).length,
    total_leads: totalLeads,
    followups_due_today: followUps.filter((followUp) => followUp.due_date === today && !followUp.is_completed).length,
    contacted_leads: leads.filter((lead) => lead.status === "Contacted").length,
    converted_leads: leads.filter((lead) => lead.status === "Converted").length,
    is_free_plan: isFreePlan,
    max_leads: FREE_PLAN_LIMIT,
    upgrade_required: isFreePlan && totalLeads >= FREE_PLAN_LIMIT,
    show_ads: isFreePlan
  };
}

function buildSeedState() {
  const today = getTodayIsoDate();
  const now = getIsoTimestamp();

  return {
    users: [
      {
        id: "user_demo",
        email: "demo@leadgrid.app",
        password: "demo1234",
        business_name: "BrightLine Services",
        business_type: "Home Services",
        current_plan: "free"
      }
    ],
    sessions: {},
    leads: [
      {
        id: "lead_1",
        user_id: "user_demo",
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        email: "rahul@example.com",
        company_name: "Sharma Residency",
        city: "Ahmedabad",
        service_interest: "AC installation",
        lead_source: "Instagram ad",
        assigned_to: "Ravi",
        priority: "High",
        budget_amount: 35000,
        status: "Contacted",
        last_contacted_at: now,
        last_contact_summary: "Shared quotation on WhatsApp and booked site visit.",
        client_feedback: "Client wants final confirmation after spouse review.",
        next_step: "Call tomorrow evening and close site visit date.",
        conversion_notes: "",
        notes: "Urgent summer requirement.",
        created_at: now,
        interactions: [
          {
            id: "int_1",
            channel: "WhatsApp",
            direction: "Outbound",
            outcome: "Interested",
            message: "Sent quote and product options.",
            client_response: "Looks good, please call tomorrow.",
            contacted_at: now,
            created_at: now
          }
        ]
      },
      {
        id: "lead_2",
        user_id: "user_demo",
        name: "Neha Verma",
        phone: "+91 99887 77665",
        email: "neha@example.com",
        company_name: "Maple Heights",
        city: "Surat",
        service_interest: "Deep cleaning package",
        lead_source: "Referral",
        assigned_to: "Anita",
        priority: "Medium",
        budget_amount: 12000,
        status: "Converted",
        last_contacted_at: addDays(now, 0),
        last_contact_summary: "Confirmed booking and advance payment.",
        client_feedback: "Happy with pricing and asked for monthly package later.",
        next_step: "Collect post-service feedback and upsell maintenance plan.",
        conversion_notes: "Advance paid. Service scheduled for Sunday.",
        notes: "Premium apartment client.",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        interactions: [
          {
            id: "int_2",
            channel: "Call",
            direction: "Outbound",
            outcome: "Converted",
            message: "Called to confirm final package.",
            client_response: "Approved. Please send team on Sunday.",
            contacted_at: new Date(Date.now() - 7200000).toISOString(),
            created_at: new Date(Date.now() - 7200000).toISOString()
          }
        ]
      },
      {
        id: "lead_3",
        user_id: "user_demo",
        name: "Arjun Patel",
        phone: "+91 90000 11223",
        email: "",
        company_name: "Patel Foods",
        city: "Vadodara",
        service_interest: "Water purifier service",
        lead_source: "Google search",
        assigned_to: "Kiran",
        priority: "Low",
        budget_amount: 5000,
        status: "New",
        last_contacted_at: null,
        last_contact_summary: "",
        client_feedback: "",
        next_step: "First qualification call pending.",
        conversion_notes: "",
        notes: "Asked for annual AMC details.",
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        interactions: []
      }
    ],
    followUps: [
      {
        id: "fu_1",
        user_id: "user_demo",
        lead_id: "lead_1",
        lead_name: "Rahul Sharma",
        due_date: today,
        note: "Call back with final quote after site check.",
        is_completed: false
      },
      {
        id: "fu_2",
        user_id: "user_demo",
        lead_id: "lead_3",
        lead_name: "Arjun Patel",
        due_date: addDays(today, 1),
        note: "Introduce AMC package and book demo visit.",
        is_completed: false
      }
    ]
  };
}

function readDemoState() {
  const existing = localStorage.getItem(DEMO_STORAGE_KEY);
  if (existing) {
    return JSON.parse(existing);
  }

  const initialState = buildSeedState();
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(initialState));
  return initialState;
}

function writeDemoState(state) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
}

function getDemoSession() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Please login to continue");
  }

  const state = readDemoState();
  const userId = state.sessions[token];
  if (!userId) {
    throw new Error("Session expired. Please login again");
  }

  const user = state.users.find((item) => item.id === userId);
  if (!user) {
    throw new Error("Demo user not found");
  }

  return { state, user };
}

function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${path}`, { ...options, headers }).then(async (response) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || "Request failed");
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  });
}

function demoSignup(payload) {
  const state = readDemoState();
  const email = payload.email.trim().toLowerCase();

  if (state.users.some((user) => user.email === email)) {
    throw new Error("An account with this email already exists");
  }

  const user = {
    id: createId("user"),
    email,
    password: payload.password,
    business_name: payload.business_name.trim(),
    business_type: payload.business_type.trim(),
    current_plan: "free"
  };
  const token = createId("token");

  state.users.push(user);
  state.sessions[token] = user.id;
  writeDemoState(state);

  return { access_token: token, token_type: "bearer" };
}

function demoLogin(payload) {
  const state = readDemoState();
  const email = payload.email.trim().toLowerCase();
  const user = state.users.find((item) => item.email === email && item.password === payload.password);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const token = createId("token");
  state.sessions[token] = user.id;
  writeDemoState(state);

  return { access_token: token, token_type: "bearer" };
}

function demoMe() {
  const { user } = getDemoSession();
  return {
    id: user.id,
    email: user.email,
    business_name: user.business_name,
    business_type: user.business_type,
    current_plan: user.current_plan
  };
}

function demoGetDashboardStats() {
  const { state, user } = getDemoSession();
  return buildStatsForUser(state, user);
}

function demoGetLeads() {
  const { state, user } = getDemoSession();
  return state.leads.filter((lead) => lead.user_id === user.id);
}

function demoCreateLead(payload) {
  const { state, user } = getDemoSession();
  const stats = buildStatsForUser(state, user);

  if (stats.upgrade_required) {
    throw new Error("Lead limit reached on Free plan. Upgrade to Pro for unlimited leads.");
  }

  const lead = {
    id: createId("lead"),
    user_id: user.id,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email?.trim() || "",
    company_name: payload.company_name?.trim() || "",
    city: payload.city?.trim() || "",
    service_interest: payload.service_interest.trim(),
    lead_source: payload.lead_source.trim(),
    assigned_to: payload.assigned_to?.trim() || "",
    priority: payload.priority || "Medium",
    budget_amount: payload.budget_amount ? Number(payload.budget_amount) : null,
    status: payload.status || "New",
    last_contacted_at: payload.last_contacted_at || null,
    last_contact_summary: payload.last_contact_summary?.trim() || "",
    client_feedback: payload.client_feedback?.trim() || "",
    next_step: payload.next_step?.trim() || "",
    conversion_notes: payload.conversion_notes?.trim() || "",
    notes: payload.notes?.trim() || "",
    created_at: getIsoTimestamp(),
    interactions: []
  };

  state.leads.unshift(lead);

  if (payload.follow_up_date) {
    state.followUps.unshift({
      id: createId("fu"),
      user_id: user.id,
      lead_id: lead.id,
      lead_name: lead.name,
      due_date: payload.follow_up_date,
      note: payload.next_step?.trim() || payload.notes?.trim() || "",
      is_completed: false
    });
  }

  writeDemoState(state);
  return lead;
}

function demoUpdateLead(id, payload) {
  const { state, user } = getDemoSession();
  const lead = state.leads.find((item) => item.id === id && item.user_id === user.id);
  if (!lead) {
    throw new Error("Lead not found");
  }

  Object.assign(lead, {
    name: payload.name?.trim() ?? lead.name,
    phone: payload.phone?.trim() ?? lead.phone,
    email: payload.email?.trim() ?? lead.email,
    company_name: payload.company_name?.trim() ?? lead.company_name,
    city: payload.city?.trim() ?? lead.city,
    service_interest: payload.service_interest?.trim() ?? lead.service_interest,
    lead_source: payload.lead_source?.trim() ?? lead.lead_source,
    assigned_to: payload.assigned_to?.trim() ?? lead.assigned_to,
    priority: payload.priority ?? lead.priority,
    budget_amount: payload.budget_amount === "" ? null : payload.budget_amount ?? lead.budget_amount,
    status: payload.status ?? lead.status,
    last_contacted_at: payload.last_contacted_at ?? lead.last_contacted_at,
    last_contact_summary: payload.last_contact_summary?.trim() ?? lead.last_contact_summary,
    client_feedback: payload.client_feedback?.trim() ?? lead.client_feedback,
    next_step: payload.next_step?.trim() ?? lead.next_step,
    conversion_notes: payload.conversion_notes?.trim() ?? lead.conversion_notes,
    notes: payload.notes?.trim() ?? lead.notes
  });

  state.followUps = state.followUps.map((followUp) =>
    followUp.lead_id === lead.id ? { ...followUp, lead_name: lead.name } : followUp
  );

  writeDemoState(state);
  return lead;
}

function demoDeleteLead(id) {
  const { state, user } = getDemoSession();
  state.leads = state.leads.filter((lead) => !(lead.id === id && lead.user_id === user.id));
  state.followUps = state.followUps.filter((followUp) => !(followUp.lead_id === id && followUp.user_id === user.id));
  writeDemoState(state);
  return null;
}

function demoAddInteraction(id, payload) {
  const { state, user } = getDemoSession();
  const lead = state.leads.find((item) => item.id === id && item.user_id === user.id);
  if (!lead) {
    throw new Error("Lead not found");
  }

  const interaction = {
    id: createId("int"),
    channel: payload.channel,
    direction: payload.direction,
    outcome: payload.outcome,
    message: payload.message?.trim() || "",
    client_response: payload.client_response?.trim() || "",
    contacted_at: payload.contacted_at || getIsoTimestamp(),
    created_at: getIsoTimestamp()
  };

  lead.interactions = [interaction, ...(lead.interactions || [])];
  lead.last_contacted_at = interaction.contacted_at;
  lead.last_contact_summary = interaction.message || interaction.client_response || lead.last_contact_summary;
  if (interaction.client_response) {
    lead.client_feedback = interaction.client_response;
  }
  if (interaction.outcome === "Converted") {
    lead.status = "Converted";
  } else if (interaction.outcome === "Lost") {
    lead.status = "Lost";
  } else if (["Interested", "Follow Up", "Negotiating"].includes(interaction.outcome)) {
    lead.status = "Contacted";
  }

  writeDemoState(state);
  return lead;
}

function demoGetFollowUps() {
  const { state, user } = getDemoSession();
  return state.followUps.filter((followUp) => followUp.user_id === user.id);
}

function demoUpdateFollowUp(id, payload) {
  const { state, user } = getDemoSession();
  const followUp = state.followUps.find((item) => item.id === id && item.user_id === user.id);
  if (!followUp) {
    throw new Error("Follow-up not found");
  }

  Object.assign(followUp, {
    due_date: payload.due_date ?? followUp.due_date,
    note: payload.note?.trim() ?? followUp.note,
    is_completed: payload.is_completed ?? followUp.is_completed
  });

  writeDemoState(state);
  return followUp;
}

async function withDemo(handler) {
  return handler();
}

export const api = {
  isDemoMode: DEMO_MODE,
  signup: (payload) => (DEMO_MODE ? withDemo(() => demoSignup(payload)) : request("/auth/signup", { method: "POST", body: JSON.stringify(payload) })),
  login: (payload) => (DEMO_MODE ? withDemo(() => demoLogin(payload)) : request("/auth/login", { method: "POST", body: JSON.stringify(payload) })),
  me: () => (DEMO_MODE ? withDemo(demoMe) : request("/auth/me")),
  getDashboardStats: () => (DEMO_MODE ? withDemo(demoGetDashboardStats) : request("/dashboard/stats")),
  getLeads: () => (DEMO_MODE ? withDemo(demoGetLeads) : request("/leads")),
  createLead: (payload) => (DEMO_MODE ? withDemo(() => demoCreateLead(payload)) : request("/leads", { method: "POST", body: JSON.stringify(payload) })),
  updateLead: (id, payload) => (DEMO_MODE ? withDemo(() => demoUpdateLead(id, payload)) : request(`/leads/${id}`, { method: "PUT", body: JSON.stringify(payload) })),
  deleteLead: (id) => (DEMO_MODE ? withDemo(() => demoDeleteLead(id)) : request(`/leads/${id}`, { method: "DELETE" })),
  addLeadInteraction: (id, payload) => (DEMO_MODE ? withDemo(() => demoAddInteraction(id, payload)) : request(`/leads/${id}/interactions`, { method: "POST", body: JSON.stringify(payload) })),
  getFollowUps: () => (DEMO_MODE ? withDemo(demoGetFollowUps) : request("/followups")),
  updateFollowUp: (id, payload) => (DEMO_MODE ? withDemo(() => demoUpdateFollowUp(id, payload)) : request(`/followups/${id}`, { method: "PUT", body: JSON.stringify(payload) }))
};
