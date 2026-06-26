import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import { LogoStrip } from "@/components/tero/LogoStrip";
import { Testimonials } from "@/components/tero/Testimonials";
import { KineticBand } from "@/components/tero/KineticBand";
import { submitContactLead } from "@/lib/contact.functions";
import { ArrowRight, ArrowLeft, Check, Calendar, Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Tero Studios" },
      { name: "description", content: "Start a project with Tero Studios. We respond within 24 hours." },
    ],
  }),
});

const services = ["3D Animation", "Motion Graphics", "Explainer", "Character", "VFX", "Brand Film", "Other"];
const budgets = ["0-2L", "2L-5L", "5L-10L", "10L+"];

function ContactPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    service: "",
    budget: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    brief: "",
  });
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const sendLead = useServerFn(submitContactLead);

  const canNext = () =>
    (step === 0 && data.service && data.budget) ||
    step === 1 ||
    (step === 2 && data.name && /\S+@\S+\.\S+/.test(data.email));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      await sendLead({
        data: {
          ...data,
          message: data.brief,
          source: "terostudios.com /contact",
        },
      });

      setDone(true);
    } catch (err) {
      console.error("Contact form submission failed", err);
      setSubmitError("We couldn't record your brief. Please try again or message us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-32">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="overline">— Start a project</p>
              <h1 className="mt-6 hero-headline text-[clamp(48px,9vw,128px)] leading-[0.92]">
                Tell us what <br />
                <span className="italic">you&apos;re making.</span>
              </h1>
              <p className="mt-8 max-w-md font-body text-[16px] leading-relaxed text-slate">
                We reply to every brief within 24 hours with a realistic
                timeline and a senior creative point of view.
              </p>

              <ul className="mt-12 space-y-5 border-t border-parchment pt-8">
                <li className="flex items-start gap-4">
                  <Mail className="mt-1 h-5 w-5 text-vermillion" strokeWidth={1.5} />
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">Email</p>
                    <p className="mt-1 font-body text-[15px] text-ink">info@terostudios.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <svg className="mt-1 h-5 w-5 text-vermillion" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.554-5.338 11.89-11.893 11.89a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">WhatsApp</p>
                    <a
                      href="https://wa.me/919900013988"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block font-body text-[15px] text-ink hover:text-vermillion transition-colors"
                    >
                      Chat on WhatsApp →
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 text-vermillion" strokeWidth={1.5} />
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">Studio</p>
                    <p className="mt-1 font-body text-[15px] text-ink">Chennai · India · IST</p>
                  </div>
                </li>
              </ul>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <Reveal>
              <div className="rounded-3xl border border-parchment bg-card p-6 md:p-10">
                {/* Step indicator */}
                <div className="mb-10 flex items-center gap-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span
                        className={[
                          "flex h-9 w-9 items-center justify-center rounded-full border text-[12px] font-medium transition-colors",
                          step > i
                            ? "bg-ink border-ink text-cream"
                            : step === i
                              ? "bg-vermillion border-vermillion text-white"
                              : "border-parchment text-slate",
                        ].join(" ")}
                      >
                        {step > i ? <Check className="h-4 w-4" /> : String(i + 1).padStart(2, "0")}
                      </span>
                      {i < 2 && <span className="h-px w-10 bg-parchment" />}
                    </div>
                  ))}
                  <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
                    Step {step + 1} / 3
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-vermillion/10">
                        <Check className="h-7 w-7 text-vermillion" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-display text-[48px] leading-tight text-ink">Got it.</h3>
                      <p className="mx-auto mt-4 max-w-md font-body text-[15px] text-slate">
                        Thanks {data.name.split(" ")[0]}. We&apos;ll reply within 24 hours. If
                        it&apos;s urgent, you can also book a call directly.
                      </p>
                      <a href="#" className="mt-8 inline-flex items-center gap-2 rounded-[4px] border-[1.5px] border-ink px-6 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-ink hover:text-cream">
                        <Calendar className="h-4 w-4" strokeWidth={1.5} />
                        Book a 30-min call
                      </a>
                    </motion.div>
                  ) : (
                    <motion.form
                      key={step}
                      onSubmit={submit}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-8"
                    >
                      {step === 0 && (
                        <>
                          <div className="rounded-2xl border border-parchment bg-white p-5 md:p-6">
                            <p className="overline">— What service do you need?</p>
                            <p className="mt-1 font-body text-[13px] text-slate">
                              Select a service to continue
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {services.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setData({ ...data, service: s })}
                                  className={[
                                    "rounded-full border px-4 py-2 font-body text-[13px] font-medium transition-all",
                                    data.service === s
                                      ? "bg-ink border-ink text-cream"
                                      : "bg-muted border-parchment text-slate hover:border-ink/30",
                                  ].join(" ")}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                            {!data.service && (
                              <p className="mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-vermillion">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-vermillion animate-pulse" />
                                Pick a service above to unlock the next step
                              </p>
                            )}
                          </div>
                          <div className={[
                            "rounded-2xl border p-5 md:p-6 transition-all duration-300",
                            data.service ? "border-parchment bg-white" : "border-dashed border-parchment/60 bg-muted/50",
                          ].join(" ")}>
                            <p className={["overline", !data.service && "opacity-50"].join(" ")}>— Project budget</p>
                            {!data.service ? (
                              <p className="mt-3 font-body text-[13px] text-slate/60">
                                Choose a service first, then set your budget range
                              </p>
                            ) : (
                              <>
                                <p className="mt-1 font-body text-[13px] text-slate">
                                  Select a budget range
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {budgets.map((s) => (
                                    <button
                                      key={s}
                                      type="button"
                                      onClick={() => setData({ ...data, budget: s })}
                                      className={[
                                        "rounded-full border px-4 py-2 font-body text-[13px] font-medium transition-all",
                                        data.budget === s
                                          ? "bg-ink border-ink text-cream"
                                          : "bg-muted border-parchment text-slate hover:border-ink/30",
                                      ].join(" ")}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      )}

                      {step === 1 && (
                        <div>
                          <label htmlFor="brief" className="overline block">— Tell us about your project</label>
                          <textarea
                            id="brief"
                            value={data.brief}
                            onChange={(e) => setData({ ...data, brief: e.target.value })}
                            placeholder="Who's it for, what's the story, when do you need it? Even a rough sketch helps."
                            className="mt-4 w-full min-h-[200px] rounded-md border-[1.5px] border-parchment bg-white px-4 py-3 font-body text-[15px] text-ink placeholder:text-ink/30 focus:border-ink focus:outline-none"
                          />
                        </div>
                      )}

                      {step === 2 && (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <label className="overline block">— Your name</label>
                            <input
                              value={data.name}
                              onChange={(e) => setData({ ...data, name: e.target.value })}
                              className="mt-4 w-full rounded-md border-[1.5px] border-parchment bg-white px-4 py-3 font-body text-[15px] text-ink focus:border-ink focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="overline block">— Company</label>
                            <input
                              value={data.company}
                              onChange={(e) => setData({ ...data, company: e.target.value })}
                              className="mt-4 w-full rounded-md border-[1.5px] border-parchment bg-white px-4 py-3 font-body text-[15px] text-ink focus:border-ink focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="overline block">— Email</label>
                            <input
                              type="email"
                              value={data.email}
                              onChange={(e) => setData({ ...data, email: e.target.value })}
                              className="mt-4 w-full rounded-md border-[1.5px] border-parchment bg-white px-4 py-3 font-body text-[15px] text-ink focus:border-ink focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="overline block">— Phone</label>
                            <input
                              type="tel"
                              value={data.phone}
                              onChange={(e) => setData({ ...data, phone: e.target.value })}
                              placeholder="+91 98765 43210"
                              className="mt-4 w-full rounded-md border-[1.5px] border-parchment bg-white px-4 py-3 font-body text-[15px] text-ink placeholder:text-ink/30 focus:border-ink focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-6 border-t border-parchment">
                        <button
                          type="button"
                          onClick={() => setStep(Math.max(0, step - 1))}
                          disabled={step === 0}
                          className="inline-flex items-center gap-2 font-body text-[14px] text-slate hover:text-ink disabled:opacity-30"
                        >
                          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back
                        </button>
                        {step < 2 ? (
                          <button
                            type="button"
                            disabled={!canNext()}
                            onClick={() => setStep(step + 1)}
                            className="inline-flex items-center gap-2 rounded-[4px] bg-gradient-to-br from-[#E8390E] to-[#C42D06] px-6 py-3 text-[14px] font-medium text-white shadow-[0_6px_20px_rgba(232,57,14,0.25)] transition-transform hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100"
                          >
                            Continue <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        ) : (
                        <div>
                          {submitError && (
                            <p className="mb-3 max-w-sm font-body text-[13px] leading-relaxed text-vermillion" role="alert">
                              {submitError}
                            </p>
                          )}
                          <button
                            type="submit"
                            disabled={!canNext() || submitting}
                            className="inline-flex items-center gap-2 rounded-[4px] bg-gradient-to-br from-[#E8390E] to-[#C42D06] px-6 py-3 text-[14px] font-medium text-white shadow-[0_6px_20px_rgba(232,57,14,0.25)] transition-transform hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100"
                          >
                            {submitting ? "Sending..." : "Send brief"} <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        )}
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <LogoStrip />

      <section className="container-tero py-20 md:py-28">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <Reveal>
              <p className="overline">— Visit the studio</p>
              <h2 className="mt-6 hero-headline text-[clamp(36px,5vw,64px)]">
                Find us in <span className="italic">Chennai.</span>
              </h2>
              <p className="mt-6 max-w-sm font-body text-[15px] leading-relaxed text-slate">
                Drop by for a coffee, a pitch, or a screening — our doors are
                open to collaborators, partners, and curious minds.
              </p>
              <ul className="mt-8 space-y-4 border-t border-parchment pt-6">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-vermillion" strokeWidth={1.5} />
                  <p className="font-body text-[14px] text-ink">
                    Tero Studios, Anna Salai,<br />Chennai, Tamil Nadu 600002
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="mt-1 h-4 w-4 text-vermillion" strokeWidth={1.5} />
                  <p className="font-body text-[14px] text-ink">
                    Mon – Fri · 10:00 – 19:00 IST
                  </p>
                </li>
              </ul>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-parchment bg-card">
                <iframe
                  title="Tero Studios — Chennai"
                  src="https://www.google.com/maps?q=Anna+Salai,+Chennai,+Tamil+Nadu&output=embed"
                  width="100%"
                  height="480"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <KineticBand />
      <Testimonials />
    </PageLayout>
  );
}
