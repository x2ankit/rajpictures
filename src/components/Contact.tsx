import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  return (
    <section
      id="contact"
      className="relative w-full py-24 bg-transparent overflow-hidden scroll-mt-28"
    >
      <div className="relative z-10 px-6 flex justify-center items-center">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.5, ease: [0.2, 0, 0.2, 1] }}
          className="w-full max-w-4xl rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.55)] hover:border-amber-500/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 md:p-12">
            {/* Left */}
            <div className="min-w-0">
              <Reveal>
                <div className="text-[11px] uppercase tracking-[0.35em] text-amber-500 font-body">
                  WE ARE HERE TO HELP
                </div>
                <h2 className="mt-5 font-serifDisplay text-4xl md:text-5xl text-white leading-tight">
                  Have any <span className="text-amber-500">Queries?</span>
                </h2>
                <p className="mt-4 text-sm md:text-base text-zinc-400 font-body leading-relaxed">
                  Not sure which package fits you? Ask us anything about dates, locations, or custom requirements.
                </p>
              </Reveal>

              <div className="mt-10 space-y-5">
                <div className="flex items-start gap-4 text-zinc-300">
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10">
                    <Phone className="h-5 w-5 text-amber-500" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">Phone</div>
                    <div className="mt-1 text-sm">+91 93375 64186</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-zinc-300">
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10">
                    <Mail className="h-5 w-5 text-amber-500" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">Email</div>
                    <div className="mt-1 text-sm">book@rajpictures.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-zinc-300">
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10">
                    <MapPin className="h-5 w-5 text-amber-500" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">Location</div>
                    <div className="mt-1 text-sm">Bonaigarh, Odisha, India</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="min-w-0">
              <Reveal delay={0.05}>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div>
                    <label className="block text-xs uppercase tracking-[0.25em] text-zinc-500">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="mt-3 w-full bg-transparent border-b border-zinc-800 focus:border-amber-500 text-white outline-none py-3 transition-colors placeholder:text-zinc-600 placeholder:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.25em] text-zinc-500">Phone Number</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 ..."
                      className="mt-3 w-full bg-transparent border-b border-zinc-800 focus:border-amber-500 text-white outline-none py-3 transition-colors placeholder:text-zinc-600 placeholder:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.25em] text-zinc-500">Message</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your date, location, and requirements..."
                      className="mt-3 w-full bg-transparent border-b border-zinc-800 focus:border-amber-500 text-white outline-none py-3 transition-colors placeholder:text-zinc-600 placeholder:text-sm resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 0px 30px rgba(245, 158, 11, 0.4)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full rounded-md bg-amber-500 px-5 py-4 text-xs font-bold uppercase tracking-[0.25em] text-black"
                  >
                    Ask a Question
                  </motion.button>
                </form>
              </Reveal>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
