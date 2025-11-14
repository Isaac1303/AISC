import React, { useState, useEffect } from "react";
import {
  Users, Sparkles, ShieldCheck, Clock,
  Link as LinkIcon, Star, ArrowRight
} from "lucide-react";

const API_BASE =
  (import.meta && import.meta.env && import.meta.env.VITE_API_URL) ||
  "http://localhost:8000"; // fallback for local dev

// Single-file, production-ready landing page for "HuskyConnect - Smart Matching Platform for UW Students"
// Tech: React + TailwindCSS + lucide-react icons (no extra UI kit required)
// Drop into any React app. In Next.js, place as app/page.tsx (rename to TSX) or in src/pages/HuskyConnect.jsx and render it.
// Colors roughly follow UW brand (purple + gold). Adjust in Tailwind config if desired.

export default function HuskyConnectLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <Header />
      <main>
        <Hero />
        <LogosStrip />
        <Features />
        <RecommendationsPreview />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function RecommendationsPreview() {
  const [userId, setUserId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Auto-load once for quick demo
    fetchRecs(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TEST
async function fetchRecs(id) {
  setLoading(true);
  setError("");
  try {
    const base = API_BASE.replace(/\/$/, ""); // trim trailing slash
    const res = await fetch(`${base}/recommendations/${id}?limit=5`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setResults(data.results || []);
  } catch (e) {
    setError(e.message || "Failed to load recommendations");
  } finally {
    setLoading(false);
  }
}


  // async function fetchRecs(id) {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const res = await fetch(`http://localhost:8000/recommendations/${id}?limit=5`);
  //     if (!res.ok) {
  //       const msg = await res.text();
  //       throw new Error(msg || `HTTP ${res.status}`);
  //     }
  //     const data = await res.json();
  //     setResults(data.results || []);
  //   } catch (e) {
  //     setError(e.message || "Failed to load recommendations");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Recommended connections</h2>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              className="w-24 rounded-xl border border-slate-300 px-3 py-1.5 text-sm"
              placeholder="User ID"
            />
            <button
              onClick={() => fetchRecs(userId)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-700 to-purple-600 px-4 py-2 rounded-xl shadow-sm hover:brightness-110"
            >
              Refresh
            </button>
          </div>
        </div>
        <p className="text-slate-600 mb-6">
          Based on shared interests and location overlap from your profile.
        </p>
        <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
          {loading && <div className="text-sm text-slate-600">Loading...</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {!loading && !error && results.length === 0 && (
            <div className="text-sm text-slate-600">No recommendations found.</div>
          )}
          <ul className="divide-y divide-slate-200">
            {results.map((r) => (
              <li key={r.user_id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-slate-500">
                    {r.city || "Unknown city"}{r.country ? ` • ${r.country}` : ""}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {Array.isArray(r.reasons) && r.reasons.length > 0 ? `Reasons: ${r.reasons.join(", ")}` : "No reasons available"}
                  </div>
                </div>
                <div className="text-sm font-semibold text-purple-700">Score: {Math.round(r.score * 10) / 10}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="size-8 rounded-xl bg-gradient-to-br from-purple-700 to-purple-500 grid place-items-center text-white shadow-md">
            <Sparkles className="size-5" />
          </div>
          <div className="font-semibold tracking-tight text-slate-900">
            Husky<span className="text-purple-700">Connect</span>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#features" className="hover:text-purple-700">Features</a>
          <a href="#how" className="hover:text-purple-700">How it works</a>
          <a href="#faq" className="hover:text-purple-700">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://readdy.link/preview/e04e7b28-5016-46fb-a946-9cddb7f60050/3926740"
            className="hidden sm:inline-block text-sm font-medium px-4 py-2 rounded-xl hover:bg-slate-100"
          >
            View demo
          </a>
          <a
            href="#get-started"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-700 to-purple-600 px-4 py-2 rounded-xl shadow-sm hover:brightness-110"
          >
            Get started <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute -inset-x-20 -top-40 h-72 bg-gradient-to-b from-purple-100 to-transparent blur-2xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full mb-4">
            <Sparkles className="size-3" /> Smart matching for UW students
          </p>
          <h1 className="text-4xl/tight sm:text-5xl/tight font-extrabold tracking-tight">
            Find the <span className="text-purple-700">right peers</span>, mentors, and teams—
            faster.
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            HuskyConnect pairs students by goals, courses, and interests. Join study groups, project
            teams, and mentoring circles in minutes—not weeks.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#get-started" className="inline-flex items-center gap-2 bg-purple-700 text-white px-5 py-3 rounded-2xl font-semibold shadow hover:brightness-110">
              Try it free <ArrowRight className="size-4" />
            </a>
            <a href="#how" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold border border-slate-300 hover:bg-slate-50">
              How it works
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500">No credit card. UW email required.</p>
        </div>
        <HeroCard />
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-purple-300 to-amber-200 opacity-60 blur-2xl" aria-hidden />
      <div className="relative rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-purple-100 text-purple-700 grid place-items-center">
            <Users className="size-5" />
          </div>
          <div>
            <div className="font-semibold">Live cohort: INFO 201</div>
            <div className="text-sm text-slate-500">128 students matching now</div>
          </div>
        </div>
        <ul className="mt-6 space-y-3">
          {[
            { name: "Project partners", detail: "JS / Python, evenings, Capstone-ready" },
            { name: "Study groups", detail: "2x weekly, Zoom + Suzzallo Library" },
            { name: "Mentor chats", detail: "Alum-led sessions, resume reviews" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 size-5 rounded-full bg-green-100 text-green-700 grid place-items-center text-xs">✓</span>
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-slate-500">{item.detail}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 p-3">
          <div>
            <div className="text-sm font-medium">Match quality</div>
            <div className="text-xs text-slate-500">Based on goals, skills, availability</div>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogosStrip() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-wider text-slate-500 text-center mb-4">Integrates with</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 opacity-70">
          {['Canvas', 'Google', 'Slack', 'Zoom', 'GitHub', 'Handshake'].map((name) => (
            <div key={name} className="h-12 rounded-xl border border-slate-200 grid place-items-center text-sm font-medium">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const list = [
    {
      icon: <Sparkles className="size-5" />, title: "Smart matching",
      desc: "Pair by goals, courses, skills, time and location preferences using a transparent scoring model."
    },
    {
      icon: <ShieldCheck className="size-5" />, title: "Privacy first",
      desc: "Students control what is shared. Requests require mutual consent; no spam or mass DMs."
    },
    {
      icon: <Clock className="size-5" />, title: "Quick onboarding",
      desc: "Two-minute quiz builds a profile; import from Canvas or LinkedIn to skip typing."
    },
    {
      icon: <LinkIcon className="size-5" />, title: "UW tools integration",
      desc: "Canvas rosters, Zoom scheduling, and Slack channels are created automatically."
    },
  ];
  return (
    <section id="features" className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">Everything you need to connect</h2>
        <p className="mt-3 text-center text-slate-600 max-w-2xl mx-auto">
          From project teaming to mentoring, HuskyConnect removes the friction so you can focus on learning.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-white hover:shadow-sm transition">
              <div className="size-9 rounded-xl bg-purple-100 text-purple-700 grid place-items-center mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Create your profile",
      body: "Tell us your goals, classes, skills, and schedule. Import from Canvas to prefill.",
    },
    { title: "Get matched", body: "See top matches with compatibility reasons you can trust." },
    { title: "Connect & schedule", body: "Open a Slack chat or auto-create a Zoom session at a shared time." },
  ];
  return (
    <section id="how" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-purple-700 to-purple-600 text-white p-8 sm:p-12 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold">How it works</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-5">
                <div className="size-8 rounded-lg bg-white/20 grid place-items-center font-semibold mb-3">{i + 1}</div>
                <div className="font-semibold">{s.title}</div>
                <div className="text-sm/6 text-purple-50 mt-1">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            {
              quote: "I found a capstone partner in two days. The reasons for each match were spot on.",
              name: "Tina • INFO 490"
            },
            {
              quote: "Our study group boosted my grade from 3.2 to 3.7. Scheduling was painless.",
              name: "Luis • CSE 142"
            },
            {
              quote: "As a transfer student, this made it easy to meet peers with similar goals.",
              name: "Maya • iSchool"
            },
          ].map((t, i) => (
            <figure key={i} className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
              <blockquote className="text-slate-700">“{t.quote}”</blockquote>
              <figcaption className="mt-3 text-sm text-slate-500">{t.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="get-started" className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ready to connect?</h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Join the beta with your UW email and start matching with classmates, mentors, and teammates today.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <a
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-700 text-white font-semibold hover:brightness-110"
              href="https://readdy.link/preview/e04e7b28-5016-46fb-a946-9cddb7f60050/3926740"
            >
              Open live demo <ArrowRight className="size-4" />
            </a>
            <a
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-300 font-semibold hover:bg-slate-50"
              href="#"
            >
              Request access
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-gradient-to-br from-purple-700 to-purple-500 grid place-items-center text-white">
            <Sparkles className="size-4" />
          </div>
          <span className="font-semibold">Husky<span className="text-purple-700">Connect</span></span>
        </div>
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} HuskyConnect. Built for UW students.</p>
      </div>
    </footer>
  );
}
