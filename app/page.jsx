import { signIn, auth } from "@/auth";
import ChatBox from "@/components/ChatBox";
import {
  BadgeCheck,
  Bot,
  BrainCircuit,
  GitFork,
  Globe,
  LogIn,
  SearchCheck,
  Sparkles,
} from "lucide-react";

export default async function Home() {
  const session = await auth();
   console.log(session,'session')
  if (!session?.user) {
    return (
      <main className="min-h-screen overflow-hidden bg-[#09111f] text-white">
        <div className="min-h-screen bg-[linear-gradient(135deg,rgba(20,184,166,0.16)_0%,transparent_30%),linear-gradient(225deg,rgba(245,158,11,0.12)_0%,transparent_34%),linear-gradient(180deg,#0b1424_0%,#09111f_58%,#07101d_100%)]">
          <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-8 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <section className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-lg border border-teal-300/20 bg-teal-300/10 px-3 py-2 text-sm font-medium text-teal-100">
                <Sparkles size={16} className="text-amber-200" />
                Research-ready conversations
              </div>

              <div className="max-w-2xl">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-teal-300/30 bg-teal-300/15 shadow-lg shadow-teal-950/40">
                    <Bot size={26} className="text-teal-200" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase text-slate-400">
                      Insight Stream
                    </p>
                    <p className="text-sm text-amber-100/80">Your private AI workspace</p>
                  </div>
                </div>

                <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
                  Bring your questions. Leave with clarity.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
                  Sign in to keep your research threads, revisit past chats, and move faster
                  from messy curiosity to useful answers.
                </p>
              </div>

              <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  { icon: SearchCheck, label: "Focused answers" },
                  { icon: BrainCircuit, label: "Context aware" },
                  { icon: BadgeCheck, label: "Saved history" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm font-medium text-slate-200 shadow-xl shadow-black/10"
                  >
                    <Icon size={20} className="mb-3 text-amber-200" />
                    {label}
                  </div>
                ))}
              </div>
            </section>

            <section className="w-full max-w-md justify-self-center rounded-lg border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="mb-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-950">
                  <LogIn size={22} />
                </div>
                <h2 className="text-2xl font-bold">Welcome back</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Choose a provider to open your workspace.
                </p>
              </div>

              <div className="space-y-3">
                <form
                  action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: "/" });
                  }}
                >
                  <button className="group flex h-12 w-full items-center justify-between rounded-lg bg-white px-4 font-semibold text-slate-950 transition-all hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-300">
                    <span className="flex items-center gap-3">
                      <Globe size={18} className="text-teal-700" />
                      Continue with Google
                    </span>
                    <span className="text-slate-400 transition-transform group-hover:translate-x-0.5">
                      -&gt;
                    </span>
                  </button>
                </form>

                <form
                  action={async () => {
                    "use server";
                    await signIn("github", { redirectTo: "/" });
                  }}
                >
                  <button className="group flex h-12 w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-4 font-semibold text-white transition-all hover:border-amber-200/50 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-200">
                    <span className="flex items-center gap-3">
                      <GitFork size={18} className="text-amber-200" />
                      Continue with GitHub
                    </span>
                    <span className="text-slate-500 transition-transform group-hover:translate-x-0.5">
                      -&gt;
                    </span>
                  </button>
                </form>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs leading-5 text-slate-500">
                  Your conversations stay attached to your signed-in account.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen bg-[#0f172a] text-white">
      <ChatBox user={session.user} />
    </main>
  );
}
