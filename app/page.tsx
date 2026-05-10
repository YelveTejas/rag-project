import { signIn, auth } from "@/auth";
import ChatBox from "@/components/ChatBox";
import { Computer} from "lucide-react";

export default async function  Home() {
  const session = await auth();

  // if (!session?.user) {
  //   return (
  //     <main className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-4">
  //       <section className="w-full max-w-sm border border-slate-800 bg-slate-900 rounded-lg p-6 shadow-2xl">
  //         <div className="flex items-center gap-3 mb-8">
  //           <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
  //             <Computer size={22} />
  //           </div>
  //           <div>
  //             <h1 className="text-xl font-bold">Insight Stream</h1>
  //             <p className="text-sm text-slate-400">Sign in to continue</p>
  //           </div>
  //         </div>

  //         <div className="space-y-3">
  //           <form
  //             action={async () => {
  //               "use server";
  //               await signIn("google", { redirectTo: "/" });
  //             }}
  //           >
  //             <button className="w-full h-11 rounded-lg bg-white text-slate-950 hover:bg-slate-200 transition-colors font-medium flex items-center justify-center gap-2">
  //               <Computer size={18} />
  //               Continue with Google
  //             </button>
  //           </form>

  //           <form
  //             action={async () => {
  //               "use server";
  //               await signIn("github", { redirectTo: "/" });
  //             }}
  //           >
  //             <button className="w-full h-11 rounded-lg bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 transition-colors font-medium flex items-center justify-center gap-2">
  //               <Computer size={18} />
  //               Continue with GitHub
  //             </button>
  //           </form>
  //         </div>
  //       </section>
  //     </main>
  //   );
  // }

  return (
      <main className="h-screen bg-[#0f172a] text-white">
        <ChatBox />
    </main>
  );
}
