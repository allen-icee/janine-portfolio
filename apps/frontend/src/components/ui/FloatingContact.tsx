import { Mail, MessageCircle } from "lucide-react";

export function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href="#contact"
        className="grid size-12 place-items-center rounded-full border border-[#ad6a6c]/30 bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        aria-label="Open contact section"
      >
        <MessageCircle size={20} />
      </a>

      <a
        href="mailto:janedeqz@gmail.com"
        className="grid size-12 place-items-center rounded-full border border-[#efdad0] bg-white/80 text-[#3c232c] shadow-xl backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#ad6a6c]/50 hover:bg-white"
        aria-label="Send email"
      >
        <Mail size={20} />
      </a>
    </div>
  );
}
