import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import { Loader2, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser/es";
import { toast } from "@/hooks/use-toast";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const primaryWhatsapp = "919337564186";
  const secondaryWhatsapp = "919437750574";
  const contactEmail = "support@rajpictures.in";

  const openWhatsApp = (number: string) => {
    const defaultMessage = "Hi Raj Pictures, I have a query regarding a shoot.";
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(defaultMessage)}`, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

    if (!serviceId || !templateId || !publicKey) {
      toast({
        title: "Email not configured",
        description: "EmailJS keys are missing. Please use WhatsApp or configure VITE_EMAILJS_* on Vercel.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await emailjs.send(
        serviceId,
        templateId,
        {
          user_name: name,
          user_phone: phone,
          user_email: email,
          message,
        },
        { publicKey }
      );

      toast({
        title: "Message sent!",
        description: "We’ll reply from support@rajpictures.in soon.",
      });

      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch {
      toast({
        title: "Failed to send",
        description: "Please try again, or use WhatsApp for faster response.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full py-20 bg-transparent overflow-hidden scroll-mt-28"
    >
      <div className="relative z-10 px-6 flex justify-center items-center">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.5, ease: [0.2, 0, 0.2, 1] }}
          className="w-full max-w-6xl rounded-2xl bg-transparent border border-white/10 shadow-2xl shadow-black/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.55)] hover:border-amber-500/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-10">
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

              <div className="mt-10">
                <Reveal delay={0.03}>
                  <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">Quick Chat (WhatsApp)</div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => openWhatsApp(primaryWhatsapp)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-3 text-xs font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-emerald-400"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat with Raj
                    </button>

                    <button
                      type="button"
                      onClick={() => openWhatsApp(secondaryWhatsapp)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-zinc-900/40 px-4 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800/60"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat with Team
                    </button>
                  </div>
                </Reveal>
              </div>

              <div className="mt-10 space-y-5">
                <div className="flex items-start gap-4 text-zinc-300">
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10">
                    <Phone className="h-5 w-5 text-amber-500" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">Phone</div>
                    <div className="mt-1 text-sm">+91 93375 64186 / +91 94377 50574</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-zinc-300">
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10">
                    <Mail className="h-5 w-5 text-amber-500" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">Email</div>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="mt-1 inline-block text-sm text-zinc-200 hover:text-amber-500 transition-colors"
                    >
                      {contactEmail}
                    </a>
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
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label className="block text-xs uppercase tracking-[0.25em] text-zinc-500">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="mt-3 w-full bg-transparent border-b border-zinc-800 focus:border-amber-500 text-white outline-none py-3 transition-colors placeholder:text-zinc-600 placeholder:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.25em] text-zinc-500">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 ..."
                        required
                        className="mt-3 w-full bg-transparent border-b border-zinc-800 focus:border-amber-500 text-white outline-none py-3 transition-colors placeholder:text-zinc-600 placeholder:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.25em] text-zinc-500">Your Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        required
                        className="mt-3 w-full bg-transparent border-b border-zinc-800 focus:border-amber-500 text-white outline-none py-3 transition-colors placeholder:text-zinc-600 placeholder:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.25em] text-zinc-500">Message</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your date, location, and requirements..."
                      required
                      className="mt-3 w-full bg-transparent border-b border-zinc-800 focus:border-amber-500 text-white outline-none py-3 transition-colors placeholder:text-zinc-600 placeholder:text-sm resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 0px 30px rgba(245, 158, 11, 0.4)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full rounded-md bg-amber-500 px-5 py-4 text-xs font-bold uppercase tracking-[0.25em] text-black inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {loading ? "Sending..." : "Ask a Question"}
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
