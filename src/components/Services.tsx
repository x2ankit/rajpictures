import { Reveal } from "@/components/Reveal";
import { supabase } from "@/lib/supabaseClient";
import { motion, type Variants } from "framer-motion";
import { Baby, Camera, Heart, Send, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type ServiceCard = {
  key: string;
  title: React.ReactNode;
  titleText: string;
  description: string;
  Icon: LucideIcon;
  iconClassName?: string;
};

const services: ServiceCard[] = [
  {
    key: "wedding",
    title: (
      <>
        Wedding <span className="text-amber-500">Photography</span>
      </>
    ),
    titleText: "Wedding Photography",
    description:
      "Full-day editorial coverage with cinematic light, crafted compositions, and timeless storytelling.",
    Icon: Heart,
  },
  {
    key: "prewedding",
    title: "Pre-Wedding Shoots",
    titleText: "Pre-Wedding Shoots",
    description:
      "Romantic, cinematic sessions designed for natural emotion and chemistry.",
    Icon: Camera,
  },
  {
    key: "baby",
    title: "Baby & Maternity",
    titleText: "Baby & Maternity",
    description:
      "Gentle portraits capturing the warmth, grace, and new beginnings of your family.",
    Icon: Baby,
  },
  {
    key: "drone",
    title: "Drone Cinematography",
    titleText: "Drone Cinematography",
    description:
      "Capture the scale and grandeur of your event with stunning, high-resolution aerial perspectives.",
    Icon: Send,
    iconClassName: "rotate-45",
  },
] as const;

type GalleryRow = {
  id: number | string;
  category: string | null;
  image_url: string;
  created_at?: string;
};

function isMissingCreatedAtColumnError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();
  return (
    lower.includes("created_at") &&
    (lower.includes("does not exist") ||
      lower.includes("could not find") ||
      lower.includes("unknown column") ||
      (lower.includes("column") && lower.includes("not") && lower.includes("exist")))
  );
}

function normalizeCategory(category: string | null | undefined): string {
  return (category || "").trim().toLowerCase();
}

const SERVICE_CATEGORY_MATCH: Record<string, string[]> = {
  wedding: ["wedding"],
  prewedding: ["pre-wedding", "prewedding", "pre wedding"],
  baby: ["baby", "maternity"],
  drone: ["conceptual", "drone"],
};

const grid: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 70, damping: 20 },
  },
};

export default function Services() {
  const [imageByKey, setImageByKey] = useState<Record<string, string>>({});

  const localOverride: Record<string, string> = {
    prewedding: "/services/prwed.png",
    baby: "/services/baby.png",
  };

  const serviceKeys = useMemo(() => services.map((s) => s.key), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const baseSelect = "id, category, image_url, created_at";

        const { data, error } = await supabase
          .from("gallery")
          .select(baseSelect)
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .limit(250);

        let rows: GalleryRow[] = [];

        if (!error) {
          rows = (data as GalleryRow[]) || [];
        } else if (isMissingCreatedAtColumnError(error)) {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from("gallery")
            .select("id, category, image_url")
            .order("id", { ascending: false })
            .limit(250);
          if (fallbackError) throw fallbackError;
          rows = (fallbackData as GalleryRow[]) || [];
        } else {
          throw error;
        }

        const nextMap: Record<string, string> = {};
        for (const row of rows) {
          if (!row?.image_url || !String(row.image_url).trim()) continue;
          const c = normalizeCategory(row.category);

          for (const key of serviceKeys) {
            if (nextMap[key]) continue;
            const needles = SERVICE_CATEGORY_MATCH[key] || [];
            if (needles.some((n) => c.includes(n))) {
              nextMap[key] = row.image_url;
            }
          }

          if (serviceKeys.every((k) => Boolean(nextMap[k]))) break;
        }

        if (!cancelled) setImageByKey(nextMap);
      } catch (err) {
        // If Supabase is unavailable, keep UI stable with placeholders.
        if (!cancelled) setImageByKey({});
        console.error("Error loading service images:", err);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [serviceKeys]);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <p className="text-amber-500 text-xs sm:text-sm uppercase tracking-[0.2em]">
            WHAT WE CREATE
          </p>
          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="font-serifDisplay text-5xl md:text-7xl leading-[1.02] text-white">
              Our <span className="text-amber-500">Services</span>
            </h2>
            <p className="font-body text-zinc-400 tracking-[0.08em] max-w-xl">
              Editorial coverage, cinematic motion, and intimate portraits — crafted
              with intention and elegance.
            </p>
          </div>
        </Reveal>
      </div>

      <motion.div
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-6 mt-12"
      >
        {services.map(({ key, title, titleText, description, Icon, iconClassName }) => (
          <motion.div
            key={key}
            variants={card}
            className="group relative overflow-hidden min-h-[450px] rounded-2xl border border-zinc-800 transition-all duration-500 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
          >
            {/* Background image */}
            <img
              src={localOverride[key] || imageByKey[key] || "/placeholder.svg"}
              alt={titleText}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
              onError={(e) => {
                if (e.currentTarget.src.endsWith("/placeholder.svg")) return;
                e.currentTarget.src = "/placeholder.svg";
              }}
            />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

            {/* Bottom content */}
            <div className="absolute inset-x-0 bottom-0 p-8">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10">
                <Icon className={`h-5 w-5 text-amber-500 ${iconClassName || ""}`.trim()} />
              </div>

              <div className="mt-5 font-serifDisplay text-3xl md:text-4xl text-white leading-tight">
                {title}
              </div>

              <p className="mt-3 text-sm md:text-base text-zinc-300/90 leading-relaxed max-w-xl">
                {description}
              </p>

              <div className="mt-8">
                <Link
                  to="/#portfolio"
                  className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.28em] font-montserrat text-white/80 group-hover:text-amber-500 transition-colors"
                >
                  VIEW PORTFOLIO <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
