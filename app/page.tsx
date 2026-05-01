import Image from "next/image";
import ChatBox from "@/components/ChatBox";

export default async function  Home() {

  return (
      <main className="h-screen bg-[#0f172a] text-white">
      <ChatBox />
    </main>
  );
}
