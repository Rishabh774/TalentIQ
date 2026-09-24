import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckIcon,
  ClipboardCheckIcon,
  Code2Icon,
  MessageSquareIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TerminalIcon,
  TrophyIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import RoleSelectionModal from "../components/RoleSelectionModal";

function HomePage() {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const platformHighlights = [
    {
      icon: VideoIcon,
      title: "Interview Rooms",
      text: "Create focused 1-on-1 coding rooms with live video, audio, and participant limits.",
    },
    {
      icon: Code2Icon,
      title: "Practice Workspace",
      text: "Solve curated DSA problems inside a Monaco-powered editor with language switching.",
    },
    {
      icon: TerminalIcon,
      title: "Code Execution",
      text: "Run JavaScript, Python, and Java solutions and compare output against expected results.",
    },
    {
      icon: MessageSquareIcon,
      title: "Session Chat",
      text: "Discuss approach, edge cases, and feedback in a real-time chat alongside the call.",
    },
  ];

  const workflowSteps = [
    {
      title: "Pick a Problem",
      text: "Choose from easy, medium, and hard interview-style questions across common DSA topics.",
    },
    {
      title: "Start a Session",
      text: "Host a live room or join an available session from the dashboard.",
    },
    {
      title: "Solve Together",
      text: "Talk through the approach, write code, and test solutions inside the same workspace.",
    },
    {
      title: "Review Progress",
      text: "Track recent sessions and keep improving with practical interview repetitions.",
    },
  ];

  const audienceCards = [
    {
      title: "For Candidates",
      text: "Practice under realistic interview pressure before the actual technical round.",
    },
    {
      title: "For Interviewers",
      text: "Host structured coding sessions with problem context, video, chat, and execution in one place.",
    },
    {
      title: "For Learners",
      text: "Pair up with peers, explain your thinking, and build stronger problem-solving habits.",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* NAVBAR */}
      <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to={"/"}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          >
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
              <SparklesIcon className="size-6 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
                Talent IQ
              </span>
              <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
            </div>
          </Link>

          {/* AUTH BTN */}
          <button
            onClick={() => setShowRoleModal(true)}
            className="group px-5 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-10 min-h-[calc(100vh-73px)] flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-12 items-center w-full">
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <div className="badge badge-primary badge-sm">
              <ZapIcon className="size-3.5" />
              Real-time Collaboration
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Code Together,
              </span>
              <br />
              <span className="text-base-content">Learn Together</span>
            </h1>

            <p className="text-base lg:text-lg text-base-content/70 leading-relaxed max-w-xl">
              Talent IQ is a full-stack interview practice platform where candidates, learners,
              and interviewers can meet face-to-face, solve coding problems, run solutions, and
              review sessions in one focused workspace.
            </p>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-2.5">
              <div className="badge badge-sm badge-outline">
                <CheckIcon className="size-3.5 text-success" />
                Live Video Chat
              </div>
              <div className="badge badge-sm badge-outline">
                <CheckIcon className="size-3.5 text-success" />
                Code Editor
              </div>
              <div className="badge badge-sm badge-outline">
                <CheckIcon className="size-3.5 text-success" />
                Multi-Language
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="btn btn-primary" onClick={() => setShowRoleModal(true)}>
                Start Coding Now
                <ArrowRightIcon className="size-4" />
              </button>

              <a href="#overview" className="btn btn-outline">
                <BookOpenIcon className="size-4" />
                Explore Platform
              </a>
            </div>

            {/* STATS */}
            <div className="stats stats-horizontal bg-base-100 shadow-lg">
              <div className="stat">
                <div className="stat-value text-primary text-3xl">10K+</div>
                <div className="stat-title text-xs">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-value text-secondary text-3xl">50K+</div>
                <div className="stat-title text-xs">Sessions</div>
              </div>
              <div className="stat">
                <div className="stat-value text-accent text-3xl">99.9%</div>
                <div className="stat-title text-xs">Uptime</div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="/hero.png"
              alt="CodeCollab Platform"
              className="w-full max-w-[34rem] xl:max-w-[37rem] h-auto rounded-3xl shadow-2xl border-4 border-base-100 hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-[90rem] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to <span className="text-primary font-mono">Succeed</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Powerful features designed to make your coding interviews seamless and productive
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <VideoIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">HD Video Call</h3>
              <p className="text-base-content/70">
                Crystal clear video and audio for seamless communication during interviews
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Code2Icon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Live Code Editor</h3>
              <p className="text-base-content/70">
                Collaborate in real-time with syntax highlighting and multiple language support
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <UsersIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Easy Collaboration</h3>
              <p className="text-base-content/70">
                Share your screen, discuss solutions, and learn from each other in real-time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* OVERVIEW SECTION */}
      <section id="overview" className="max-w-[90rem] mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-stretch">
          <div className="bg-base-100/70 border border-primary/20 rounded-2xl p-8 lg:p-10 shadow-xl">
            <div className="badge badge-primary badge-lg mb-5">
              <SparklesIcon className="size-4" />
              Project Overview
            </div>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-5">
              A realistic coding interview environment, built for practice and collaboration.
            </h2>
            <p className="text-lg text-base-content/70 leading-relaxed mb-6">
              Talent IQ combines authentication, problem selection, live sessions, video calling,
              chat, a code editor, code execution, and session history. Instead of switching
              between meeting apps, editors, and notes, users get the complete interview flow in
              one clean dashboard.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Secure Google sign-in",
                "MongoDB-backed session tracking",
                "Stream-powered video and chat",
                "Curated DSA problem library",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-base-content/80">
                  <CheckIcon className="size-5 text-success shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {platformHighlights.map((highlight) => {
              const HighlightIcon = highlight.icon;

              return (
                <div
                  key={highlight.title}
                  className="card bg-base-100 border border-base-300 shadow-lg"
                >
                  <div className="card-body">
                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                      <HighlightIcon className="size-7 text-primary" />
                    </div>
                    <h3 className="card-title">{highlight.title}</h3>
                    <p className="text-base-content/70">{highlight.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section className="max-w-[90rem] mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">
            From Practice to <span className="text-primary font-mono">Interview Ready</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
            The platform is designed around the same steps users face in a real technical
            interview: understand the problem, discuss the plan, write code, run it, and improve.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {workflowSteps.map((step, index) => (
            <div key={step.title} className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-4xl font-black text-primary">
                    0{index + 1}
                  </span>
                  <ClipboardCheckIcon className="size-8 text-primary/70" />
                </div>
                <h3 className="card-title">{step.title}</h3>
                <p className="text-base-content/70">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AUDIENCE SECTION */}
      <section className="max-w-[90rem] mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-center">
          <div>
            <div className="badge badge-outline badge-lg mb-5">
              <UsersIcon className="size-4 text-primary" />
              Built For Growth
            </div>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-5">
              Clear enough for beginners, practical enough for interview preparation.
            </h2>
            <p className="text-lg text-base-content/70 leading-relaxed">
              A visitor should understand Talent IQ quickly: it is not just a problem list, and it
              is not only a video call. It brings the interview room, coding workspace, execution
              panel, and progress dashboard together for a complete preparation experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {audienceCards.map((card) => (
              <div key={card.title} className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                  <div className="size-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-2">
                    <TrophyIcon className="size-7 text-secondary" />
                  </div>
                  <h3 className="card-title">{card.title}</h3>
                  <p className="text-base-content/70">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="max-w-[90rem] mx-auto px-6 py-24">
        <div className="bg-base-100/80 border border-primary/20 rounded-2xl p-8 lg:p-10 shadow-xl">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            <div>
              <div className="badge badge-primary badge-lg mb-5">
                <ShieldCheckIcon className="size-4" />
                Full-Stack Platform
              </div>
              <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-5">
                A complete MERN-style project with real service integrations.
              </h2>
              <p className="text-lg text-base-content/70 leading-relaxed">
                The project demonstrates frontend routing, protected pages, backend APIs, MongoDB
                models, Stream video/chat integration, Google authentication, and code execution
                support for common interview languages.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Frontend", value: "React, Vite, Tailwind, daisyUI" },
                { label: "Backend", value: "Node.js, Express, REST APIs" },
                { label: "Database", value: "MongoDB with Mongoose models" },
                { label: "Realtime", value: "Stream video rooms and chat" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-base-200 p-5 border border-base-300">
                  <p className="text-sm font-bold uppercase tracking-wide text-primary mb-2">
                    {item.label}
                  </p>
                  <p className="text-base-content/80 font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-[90rem] mx-auto px-6 pt-12 pb-28">
        <div className="text-center bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/15 border border-primary/20 rounded-2xl p-10 shadow-xl">
          <h2 className="text-4xl lg:text-5xl font-black mb-5">
            Ready to practice like a real interview?
          </h2>
          <p className="text-lg text-base-content/70 max-w-3xl mx-auto mb-8">
            Sign in, create a session, invite a partner, and start building interview confidence
            with live collaboration and executable code.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => setShowRoleModal(true)}>
            Start With Talent IQ
            <ArrowRightIcon className="size-5" />
          </button>
        </div>
      </section>

      <RoleSelectionModal isOpen={showRoleModal} onClose={() => setShowRoleModal(false)} />
    </div>
  );
}
export default HomePage;
