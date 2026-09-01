import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";

// --- Data ---
const PAIN_POINTS = [
  "Investigation still open from last quarter.",
  "Approval stuck across four inboxes.",
  "Supplier follow-up chased through three mailboxes.",
  "Release shipped before sign-offs landed.",
  "Review closed on a verbal yes.",
];

const PERSONAS = [
  { role: "VP Quality", scope: "92 days. Three reopens. One investigation.", val: "$2.4M" },
  { role: "Operations", scope: "On-time delivery slipping 6% a quarter.", val: "14%" },
  { role: "Regulatory", scope: "Submission rebuilt from 4 shared drives.", val: "400hrs" },
  { role: "CFO", scope: "12-20% of payroll paid in coordination.", val: "18%" },
];

// --- Animation Variants ---
const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const FADE = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

// --- Glow Components ---
const SubtleGlow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen">
    <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-[#0052FF] opacity-[0.08] blur-[120px] rounded-full animate-pulse z-0" />
    <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-[#4D85FF] opacity-[0.05] blur-[100px] rounded-full z-0" />
  </div>
);

// --- Component ---
export default function HomeConceptAnimation() {
  const [painIdx, setPainIdx] = useState(0);

  useEffect(() => {
    document.title = "Unifize · Premium Minimal";
    const id = window.setInterval(() => setPainIdx((i) => (i + 1) % PAIN_POINTS.length), 3500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#07080A] text-[#E4E7EB] font-sans selection:bg-[#0052FF]/30 selection:text-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#07080A]/60 backdrop-blur-xl border-b border-white/[0.04] transition-all">
        <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-[18px] font-semibold tracking-[-0.03em] text-white">
              unifize<b className="text-[#0052FF]">.</b>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-white/50">
            <a href="#problem" className="hover:text-white transition-colors">The Problem</a>
            <a href="#flow" className="hover:text-white transition-colors">The Flow</a>
            <a href="#tax" className="hover:text-white transition-colors">The Tax</a>
          </div>

          <div className="flex items-center gap-5">
            <a href="#login" className="text-[14px] font-medium text-white/50 hover:text-white transition">Log in</a>
            <button className="bg-white hover:bg-[#F4F5F7] text-black font-semibold text-[13px] px-5 py-2.5 rounded-full transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Book a demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-[200px] pb-[160px] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <SubtleGlow />
        
        <motion.div initial="hidden" animate="visible" variants={STAGGER} className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div variants={FADE} className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] animate-pulse shadow-[0_0_8px_#0052FF]" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/60">Coordination tax, measurable.</span>
          </motion.div>

          <motion.h1 variants={FADE} className="text-[clamp(48px,8vw,96px)] font-medium leading-[1.05] tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
            Records live in systems.<br />
            Work lives <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052FF] to-[#4D85FF]">between them.</span>
          </motion.h1>

          <motion.p variants={FADE} className="mt-8 text-[20px] leading-[1.6] text-white/50 max-w-[60ch] font-light">
            Your system of record is fine. The work that produces it is not. Unifize is the native collaboration layer that binds messy human workflows into pristine, auditable records.
          </motion.p>

          <motion.div variants={FADE} className="mt-12 flex items-center gap-4">
            <button className="bg-[#0052FF] hover:bg-[#003ECC] text-white font-medium text-[15px] px-8 py-4 rounded-full flex items-center gap-2 group transition-all shadow-[0_0_30px_rgba(0,82,255,0.2)] hover:shadow-[0_0_40px_rgba(0,82,255,0.4)]">
              Calculate your tax
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        {/* Hero Abstract UI Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[800px] mt-24"
        >
          <div className="bg-[#0B0D12]/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-white/[0.05] bg-white/[0.01]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="mx-auto font-mono text-[11px] text-white/40 tracking-widest pl-6">
                WORKFLOW_STREAM
              </div>
            </div>
            
            <div className="p-8 pb-12 flex flex-col items-center">
              <span className="text-[13px] font-medium text-white/30 uppercase tracking-widest mb-6">Currently Happening</span>
              
              <div className="h-[30px] overflow-hidden relative w-full text-center">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={painIdx}
                    initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-x-0 text-[18px] text-white/90 font-light"
                  >
                    {PAIN_POINTS[painIdx]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Gantt Visualization Section */}
      <section id="flow" className="relative py-[160px] bg-white text-[#0B0D12]">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={STAGGER} className="max-w-3xl">
            <div className="font-mono text-[12px] uppercase tracking-widest text-[#0052FF] mb-6 font-semibold">
              01 // The Gap
            </div>
            
            <h2 className="text-[clamp(40px,5vw,64px)] font-medium leading-[1.05] tracking-[-0.04em]">
              The work itself is 5 days.<br />
              <span className="text-black/30">The waiting between is 92.</span>
            </h2>
            <p className="mt-6 text-[18px] text-black/60 leading-[1.6] max-w-2xl font-light">
              Same record. Same regulations. Same people. The difference is how much of the calendar is actually moving the work versus waiting on handoffs.
            </p>
          </motion.div>

          <div className="mt-24 grid lg:grid-cols-2 gap-10">
            {/* Ideal Visual */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-[#FAFAFA] border border-black/[0.06] rounded-[24px] p-10 relative overflow-hidden"
            >
              <div className="flex justify-between items-baseline mb-12">
                <h3 className="text-[20px] font-semibold tracking-tight text-[#0B0D12]">Ideal Flow</h3>
                <span className="font-mono text-[13px] font-semibold text-[#0B8A5C] bg-[#0B8A5C]/10 px-3 py-1 rounded-full">5 Days</span>
              </div>
              
              <div className="space-y-6">
                {[
                  { n: "Discover", w: "20%", bg: "bg-[#0B0D12]" },
                  { n: "Investigate", w: "30%", bg: "bg-[#0B0D12]" },
                  { n: "Bind", w: "25%", bg: "bg-[#0B0D12]" },
                  { n: "Approve", w: "15%", bg: "bg-[#0B0D12]" },
                  { n: "Close", w: "10%", bg: "bg-[#0052FF]" },
                ].map((s, i) => (
                  <div key={s.n} className="flex items-center gap-6">
                    <span className="w-24 text-[13px] font-medium text-black/40 text-right">{s.n}</span>
                    <div className="flex-1 h-[40px] relative rounded-r-lg border-l border-black/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: s.w }}
                        transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                        viewport={{ once: true }}
                        className={`absolute top-1/2 -translate-y-1/2 h-[8px] rounded-full ${s.bg}`}
                        style={{ left: `${i * 18}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0B8A5C]/20">
                <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1.5 }} className="h-full bg-[#0B8A5C]" />
              </div>
            </motion.div>

            {/* Actual Visual (Chaos) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white border border-black/[0.08] rounded-[24px] p-10 relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.02]"
            >
              <div className="flex justify-between items-baseline mb-12">
                <h3 className="text-[20px] font-semibold tracking-tight text-[#C4303A]">Actual Flow</h3>
                <span className="font-mono text-[13px] font-semibold text-[#C4303A] bg-[#C4303A]/10 px-3 py-1 rounded-full">92 Days</span>
              </div>
              
              <div className="space-y-6">
                {[
                  { n: "Discover", b: [{w: "5%", c: "bg-black"}, {w: "15%", c: "bg-black/10"}] },
                  { n: "Investigate", b: [{w: "10%", c: "bg-[#B4731A]"}, {w: "25%", c: "bg-black/10"}] },
                  { n: "Bind", b: [{w: "20%", c: "bg-black/10"}, {w: "8%", c: "bg-black"}] },
                  { n: "Approve", b: [{w: "25%", c: "bg-black/10"}, {w: "10%", c: "bg-[#C4303A]"}] },
                  { n: "Close", b: [{w: "15%", c: "bg-black/10"}, {w: "5%", c: "bg-[#0052FF]"}] },
                ].map((s, i) => (
                  <div key={s.n} className="flex items-center gap-6">
                    <span className="w-24 text-[13px] font-medium text-black/40 text-right">{s.n}</span>
                    <div className="flex-1 h-[40px] relative rounded-r-lg border-l border-black/10">
                      {s.b.map((blk, j) => (
                        <motion.div 
                          key={j}
                          initial={{ width: 0 }}
                          whileInView={{ width: blk.w }}
                          transition={{ duration: 1.2, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                          viewport={{ once: true }}
                          className={`absolute top-1/2 -translate-y-1/2 h-[8px] rounded-full ${blk.c}`}
                          style={{ left: j === 0 ? `${i * 12}%` : `${(i * 12) + parseInt(s.b[0].w)}%` }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C4303A]/10">
                <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 2.5 }} className="h-full bg-[#C4303A]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tax Section */}
      <section id="tax" className="py-[160px] bg-[#07080A] relative">
        <SubtleGlow />
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="text-center mb-24">
            <h2 className="text-[clamp(40px,7vw,110px)] font-medium leading-[1] tracking-[-0.04em] text-white">
              The <span className="text-[#0052FF]">Coordination Tax</span>.
            </h2>
            <p className="mt-8 text-[20px] text-white/50 max-w-3xl mx-auto font-light leading-[1.6]">
              The hidden, structural cost of holding cross-functional work together when no single system owns it end-to-end. Measure it. Reduce it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {PERSONAS.map((p, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                key={p.role}
                className="bg-white/[0.02] border border-white/[0.06] rounded-[20px] p-8 hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex flex-col h-full">
                  <div className="text-[32px] font-medium text-white mb-2 tracking-tight">{p.val}</div>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-[#0052FF] mb-6">{p.role}</div>
                  <div className="text-[14px] text-white/50 font-light leading-[1.6] mt-auto">
                    {p.scope}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#07080A] py-12 border-t border-white/[0.05] text-center font-mono text-[11px] uppercase tracking-widest text-white/30">
        © {new Date().getFullYear()} Unifize · Premium Linear-Style Variant
      </footer>
    </div>
  );
}
