export type ServiceCategory =
  | "Animation & Motion"
  | "Immersive & XR"
  | "Video & CGI"
  | "3D, AI & Hardware";

export interface ServiceEntry {
  slug: string;
  name: string;
  category: ServiceCategory;
  short: string;
  hero: string;
  primaryKeyword: string;
  what: string;
  process: { title: string; description: string }[];
  industries: string[];
  faqs: { q: string; a: string }[];
  badge?: string;
}

export const services: ServiceEntry[] = [
  {
    slug: "3d-animation",
    name: "3D Animation Services",
    category: "Animation & Motion",
    short:
      "Photoreal characters, products and environments rendered at film quality.",
    hero: "Stories built frame by frame in three dimensions.",
    primaryKeyword: "3D animation studio India",
    badge: "High volume",
    what:
      "From product films to character-led campaigns, our 3D pipeline blends Houdini, Maya and Unreal to deliver cinematic visuals trusted by global brands.",
    process: [
      { title: "Treatment", description: "Written direction, references and motion language locked before a frame is animated." },
      { title: "Previs & Blocking", description: "Camera, staging and timing approved in greyscale to de-risk production." },
      { title: "Animation & Look-dev", description: "Performance, shading and lighting built in parallel by senior leads." },
      { title: "Render & Finishing", description: "GPU and CPU farms, comp finishing in Nuke, colour graded for delivery." },
    ],
    industries: ["Advertising", "Automotive", "Real Estate", "Healthcare"],
    faqs: [
      { q: "How long does a 3D animation project take?", a: "Most films land between 6 and 12 weeks depending on length, character count and look complexity." },
      { q: "Can you match our existing brand visual language?", a: "Yes — we begin with a written treatment that locks the look against your brand system." },
      { q: "Do you handle scripts and storyboards?", a: "Our in-house writers and storyboard artists cover everything from concept to final cut." },
    ],
  },
  {
    slug: "2d-animation",
    name: "2D Animation Services",
    category: "Animation & Motion",
    short: "Hand-crafted frame and rigged 2D for brands, broadcast and education.",
    hero: "Editorial frame work with rhythm and restraint.",
    primaryKeyword: "2D animation studio India",
    what: "A small, senior 2D team using Toon Boom Harmony, After Effects and TVPaint to deliver illustrative motion that holds attention.",
    process: [
      { title: "Concept", description: "Script, mood and frame language defined up front." },
      { title: "Design", description: "Characters, props and palettes built as a reusable system." },
      { title: "Animation", description: "Frame-by-frame and rigged techniques chosen per shot." },
      { title: "Sound & Finish", description: "Original score, SFX and final delivery in your target formats." },
    ],
    industries: ["Education", "Healthcare", "Retail"],
    faqs: [
      { q: "Frame-by-frame or rigged?", a: "We use both — and often blend them inside the same film for the right balance of craft and speed." },
      { q: "Can you animate in our brand illustration style?", a: "Yes — we routinely extend existing illustration systems into motion." },
    ],
  },
  {
    slug: "motion-graphics",
    name: "Motion Graphics",
    category: "Animation & Motion",
    short: "Editorial typography, transitions and brand motion systems.",
    hero: "Type, shape and pace, treated with care.",
    primaryKeyword: "motion graphics studio India",
    what: "From launch films to broadcast packages, our motion design lead writes motion the way an editor writes a sentence.",
    process: [
      { title: "Brief", description: "Story, hierarchy and target outlets defined." },
      { title: "Style frames", description: "Three signed-off frames that lock the visual language." },
      { title: "Animation", description: "Lower-thirds, transitions and key sequences built." },
      { title: "Master & versions", description: "Deliverables cut for every channel — 16:9, 9:16, 1:1 and bespoke." },
    ],
    industries: ["Advertising", "Education", "Manufacturing"],
    faqs: [
      { q: "Can you build a reusable motion system?", a: "Yes — we deliver After Effects templates plus a written motion guideline document." },
    ],
  },
  {
    slug: "anamorphic-video",
    name: "Anamorphic Video Production",
    category: "Immersive & XR",
    short: "Forced-perspective 3D illusions for the world's biggest screens.",
    hero: "Pixel-perfect 3D illusions, engineered for the largest screens.",
    primaryKeyword: "anamorphic video production India",
    badge: "Differentiator",
    what: "We design, model and grade anamorphic content matched to the exact screen geometry — from L-banner LED to immersive corner walls.",
    process: [
      { title: "Survey", description: "Screen dimensions, pixel pitch and viewing angle captured." },
      { title: "Concept", description: "Forced-perspective storyboards approved with 3D previs." },
      { title: "Production", description: "Modelling, FX, lighting and rendering tuned to the canvas." },
      { title: "On-site QC", description: "Calibration, colour and audio supervised on the screen." },
    ],
    industries: ["Advertising", "Events", "Retail"],
    faqs: [
      { q: "Do you work with any LED specification?", a: "Yes — we map content to your screen's exact pixel grid and viewing cone." },
      { q: "Can you handle the on-site rollout?", a: "Our team can travel for installation, QC and live tuning." },
    ],
  },
  {
    slug: "projection-mapping",
    name: "Projection Mapping",
    category: "Immersive & XR",
    short: "Architectural light installations and immersive room takeovers.",
    hero: "Built surfaces, painted with light.",
    primaryKeyword: "projection mapping India",
    badge: "Niche authority",
    what: "End-to-end projection mapping — from architectural surveys and content design through to onsite calibration with high-lumen projectors.",
    process: [
      { title: "Site capture", description: "LIDAR and photogrammetry of the target surface." },
      { title: "Concept", description: "Mood films and key frames approved." },
      { title: "Content", description: "Generated and mapped to surface geometry." },
      { title: "Show", description: "Hardware, blends and cues finalised on-site." },
    ],
    industries: ["Events", "Architecture", "Advertising"],
    faqs: [
      { q: "Do you supply projectors and hardware?", a: "We partner with leading hardware vendors to spec, supply and run the show." },
    ],
  },
  {
    slug: "ar-vr-xr",
    name: "AR / VR / XR Solutions",
    category: "Immersive & XR",
    short: "Spatial experiences for brand, training and product discovery.",
    hero: "Immersive experiences for headsets, phones and rooms.",
    primaryKeyword: "AR VR XR studio India",
    what: "From WebAR brand activations to fully simulated VR training, we build experiences in Unity and Unreal that ship on real hardware.",
    process: [
      { title: "Discovery", description: "Audience, hardware and success metrics defined." },
      { title: "Prototype", description: "A playable prototype within two weeks." },
      { title: "Build", description: "Production in Unity / Unreal with art and code in lockstep." },
      { title: "Deploy", description: "Distribution, analytics and post-launch support." },
    ],
    industries: ["Education", "Healthcare", "Manufacturing", "Retail"],
    faqs: [
      { q: "Which headsets do you support?", a: "Meta Quest, Apple Vision Pro, Pico and tethered Vive / Varjo for enterprise use cases." },
    ],
  },
  {
    slug: "holographic-displays",
    name: "Holographic Displays",
    category: "Immersive & XR",
    short: "Content for fan-based and volumetric holographic hardware.",
    hero: "Three-dimensional content for the new holographic canvas.",
    primaryKeyword: "hologram display company India",
    what: "We produce content tuned to leading holographic display platforms — fan, prism and pepper's-ghost — with installation support.",
    process: [
      { title: "Hardware match", description: "Content specs locked to the target hologram unit." },
      { title: "Concept", description: "Volumetric storyboards approved with motion previs." },
      { title: "Production", description: "Modelling, animation and rendering matched to display geometry." },
      { title: "Install", description: "On-site calibration and tuning." },
    ],
    industries: ["Retail", "Events", "Automotive"],
    faqs: [
      { q: "Do you have units on hand for testing?", a: "Yes — our studio carries multiple hologram form-factors for daily QA." },
    ],
  },
  {
    slug: "cgi-vfx",
    name: "CGI & Visual Effects",
    category: "Video & CGI",
    short: "Live-action compositing, simulations and feature-grade finishing.",
    hero: "CGI that lives convincingly inside your footage.",
    primaryKeyword: "CGI VFX studio India",
    what: "Houdini-led FX, Nuke compositing and on-set supervision for ads, brand films and short-form narrative work.",
    process: [
      { title: "On-set supervision", description: "Plates shot with our supervisor present." },
      { title: "Tracking & matchmove", description: "Footage prepared and locked." },
      { title: "FX & comp", description: "Sims, CG elements and final comp." },
      { title: "Grade", description: "Final colour pass for delivery masters." },
    ],
    industries: ["Advertising", "Automotive", "Events"],
    faqs: [
      { q: "Can you travel for on-set work?", a: "Yes — our VFX supervisor regularly travels for shoots across India and the GCC." },
    ],
  },
  {
    slug: "explainer-videos",
    name: "Explainer Videos",
    category: "Video & CGI",
    short: "One-watch films that move pipelines for SaaS, fintech and pharma.",
    hero: "Software stories told with clarity.",
    primaryKeyword: "explainer video company India",
    what: "Editorial scripts, considered design and motion that holds attention — built for sales, onboarding and category launches.",
    process: [
      { title: "Script", description: "Story arc, voice and call-to-action locked." },
      { title: "Design", description: "Style frames and a tested motion language." },
      { title: "Animate", description: "Production with senior animators." },
      { title: "Master", description: "Voiceover, music and delivery cuts." },
    ],
    industries: ["Healthcare", "Education", "Retail"],
    faqs: [
      { q: "How long are most explainers?", a: "60 to 90 seconds is the sweet spot for performance — though we regularly build long-form variants for sales." },
    ],
  },
  {
    slug: "corporate-videos",
    name: "Corporate Videos",
    category: "Video & CGI",
    short: "Company films with editorial restraint and production polish.",
    hero: "Corporate films that don't feel corporate.",
    primaryKeyword: "corporate video production India",
    what: "Director-led shoots, interview scripting and finishing — built for AGMs, sales kick-offs and investor decks.",
    process: [
      { title: "Treatment", description: "Story, interviews and B-roll mapped." },
      { title: "Shoot", description: "Two-camera, broadcast-grade production." },
      { title: "Edit", description: "Director-led offline and online cuts." },
      { title: "Finish", description: "Colour, sound and delivery in your formats." },
    ],
    industries: ["Manufacturing", "Healthcare", "Real Estate"],
    faqs: [
      { q: "Can you crew across India?", a: "Yes — we run consistent crews in Chennai, Bengaluru, Mumbai and Delhi NCR." },
    ],
  },
  {
    slug: "brand-films",
    name: "Brand Films",
    category: "Video & CGI",
    short: "Anthemic launches, founder narratives and cinematic sizzle reels.",
    hero: "Brand films that earn the screen they're on.",
    primaryKeyword: "brand film production India",
    what: "Cinematic films with senior directors at the helm — written, shot and finished as a single body of work.",
    process: [
      { title: "Concept", description: "Three written directions presented." },
      { title: "Preproduction", description: "Casting, locations and styling locked." },
      { title: "Shoot", description: "On-location production with cinematic camera teams." },
      { title: "Post", description: "Edit, VFX, colour and audio in one place." },
    ],
    industries: ["Advertising", "Automotive", "Real Estate"],
    faqs: [
      { q: "Do you handle casting?", a: "Yes — we hold a roster of agencies across India and run bespoke casting calls for every film." },
    ],
  },
  {
    slug: "product-visualisation",
    name: "Product Visualisation",
    category: "3D, AI & Hardware",
    short: "Photoreal CGI product imagery and films for launch and e-commerce.",
    hero: "Every detail of the product, lit and rendered in 3D.",
    primaryKeyword: "3D product visualisation India",
    what: "From watches to cars, we model and render products at studio-photography quality — without ever shipping the unit.",
    process: [
      { title: "Asset", description: "CAD or scan data prepared for production." },
      { title: "Look-dev", description: "Shaders and lighting locked against reference." },
      { title: "Render", description: "Stills and films rendered at delivery resolution." },
      { title: "Finish", description: "Comp, retouch and final colour." },
    ],
    industries: ["Retail", "Automotive", "Manufacturing"],
    faqs: [
      { q: "Can you work from CAD?", a: "Yes — we routinely accept STEP, IGES and native CAD formats from engineering teams." },
    ],
  },
  {
    slug: "ai-generated-content",
    name: "AI Generative Content",
    category: "3D, AI & Hardware",
    short: "Director-led generative film blended with traditional production.",
    hero: "Generative pipelines, directed by humans.",
    primaryKeyword: "AI generative video India",
    badge: "Trending",
    what: "We blend Runway, Veo, Sora and bespoke pipelines with conventional CGI and live action — directed and quality-controlled by senior staff.",
    process: [
      { title: "Prompt design", description: "Brand and story converted to a directed prompt system." },
      { title: "Generation", description: "Iterated runs against locked references." },
      { title: "Composite", description: "Generated material conformed with traditional VFX." },
      { title: "Finish", description: "Colour and sound for delivery." },
    ],
    industries: ["Advertising", "Retail", "Education"],
    faqs: [
      { q: "Do you train custom models?", a: "Yes — for long-running brands we train and host bespoke models against approved style." },
    ],
  },
  {
    slug: "animation-hardware",
    name: "Hardware for Animation",
    category: "3D, AI & Hardware",
    short: "Workstation, render farm and studio infrastructure consulting.",
    hero: "Build the studio the work actually needs.",
    primaryKeyword: "animation hardware studio setup India",
    badge: "Tero exclusive",
    what: "Drawing on twelve years of in-house build experience, we spec, supply and commission workstations, render farms and review rooms for studios across South Asia.",
    process: [
      { title: "Audit", description: "Pipeline, headcount and project mix analysed." },
      { title: "Spec", description: "Workstations, render nodes and review hardware specified." },
      { title: "Procure & deploy", description: "Sourced, racked, networked and commissioned." },
      { title: "Run-in", description: "Pipeline, monitoring and support documentation handed over." },
    ],
    industries: ["Manufacturing", "Education", "Real Estate"],
    faqs: [
      { q: "Do you supply render farm hardware?", a: "Yes — both on-premise nodes and hybrid burst-to-cloud designs." },
      { q: "Can you train our team on the new pipeline?", a: "Each build ships with documentation and a one-week on-site enablement programme." },
    ],
  },
];

export const servicesByCategory = (): Record<ServiceCategory, ServiceEntry[]> => {
  const map = {
    "Animation & Motion": [] as ServiceEntry[],
    "Immersive & XR": [] as ServiceEntry[],
    "Video & CGI": [] as ServiceEntry[],
    "3D, AI & Hardware": [] as ServiceEntry[],
  };
  services.forEach((s) => map[s.category].push(s));
  return map;
};

export const getService = (slug: string) => services.find((s) => s.slug === slug);
