export type ServiceCategory =
  | "Content & Visual Storytelling"
  | "Real Estate & Spatial Experiences"
  | "Immersive Learning & Training"
  | "Brand & Event Experiences"
  | "Immersive Hardware Solutions";

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

// Default building blocks used by stub entries so the template still renders fully.
const defaultProcess = [
  { title: "Discovery", description: "Audience, goals and success metrics defined with senior leads." },
  { title: "Concept", description: "Written direction, visual references and a production plan locked." },
  { title: "Production", description: "Senior craft teams build the work against the approved direction." },
  { title: "Delivery", description: "Quality-controlled masters and channel cuts handed over." },
];

const defaultIndustries = ["Advertising", "Real Estate", "Education", "Manufacturing"];

const defaultFaqs = [
  { q: "How do projects typically begin?", a: "Every engagement opens with a written treatment and a fixed production plan — no scope creep, no surprises." },
  { q: "Do you handle end-to-end production?", a: "Yes — concept, design, production and delivery all happen under one editorial roof at Tero Studios." },
];

export const services: ServiceEntry[] = [
  // ─── 01 · Content & Visual Storytelling ──────────────────────────────
  {
    slug: "2D-animation",
    name: "2D Animation",
    category: "Content & Visual Storytelling",
    short: "Hand-crafted frame and rigged 2D for brands, broadcast and education.",
    hero: "Editorial frame work with rhythm and restraint.",
    primaryKeyword: "2D animation studio India",
    what:
      "A small, senior 2D team using Toon Boom Harmony, After Effects and TVPaint to deliver illustrative motion that holds attention.",
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
    slug: "3D-animation",
    name: "3D Animation",
    category: "Content & Visual Storytelling",
    short: "Photoreal characters, products and environments rendered at film quality.",
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
    ],
  },
  {
    slug: "anamorphic",
    name: "Anamorphic",
    category: "Content & Visual Storytelling",
    short: "Forced-perspective 3D illusions for the world's biggest screens.",
    hero: "Pixel-perfect 3D illusions, engineered for the largest screens.",
    primaryKeyword: "anamorphic video production India",
    badge: "Differentiator",
    what:
      "We design, model and grade anamorphic content matched to the exact screen geometry — from L-banner LED to immersive corner walls.",
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
    slug: "cgi",
    name: "CGI",
    category: "Content & Visual Storytelling",
    short: "Live-action compositing, simulations and feature-grade finishing.",
    hero: "CGI that lives convincingly inside your footage.",
    primaryKeyword: "CGI studio India",
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
    slug: "corporate-films",
    name: "Corporate Films",
    category: "Content & Visual Storytelling",
    short: "Company films with editorial restraint and production polish.",
    hero: "Corporate films that don't feel corporate.",
    primaryKeyword: "corporate film production India",
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
    slug: "product-visualization",
    name: "Product Visualization",
    category: "Content & Visual Storytelling",
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
    slug: "motion-graphics",
    name: "Motion Graphics",
    category: "Content & Visual Storytelling",
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
    slug: "ai-videos",
    name: "AI Videos",
    category: "Content & Visual Storytelling",
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
    slug: "web-design-development",
    name: "Web Design & Development",
    category: "Content & Visual Storytelling",
    short: "Editorial, motion-led websites engineered for performance.",
    hero: "Brand sites that move with the same care as our films.",
    primaryKeyword: "web design and development studio India",
    what:
      "From editorial brand sites to interactive campaign microsites, our web team designs and builds in-house — pairing motion craft with modern frameworks like React and Next.js for sites that load fast and feel considered.",
    process: defaultProcess,
    industries: ["Advertising", "Real Estate", "Retail", "Education"],
    faqs: defaultFaqs,
  },

  // ─── 02 · Real Estate & Spatial Experiences ──────────────────────────
  {
    slug: "vr-walkthroughs",
    name: "VR Walkthroughs",
    category: "Real Estate & Spatial Experiences",
    short: "Step inside the property in fully immersive virtual reality.",
    hero: "Buyers walk the home before a brick is laid.",
    primaryKeyword: "VR walkthrough studio India",
    what:
      "Room-scale VR walkthroughs of homes, towers and master plans — built in Unreal Engine and shipped on Meta Quest, Pico and tethered headsets for the sales gallery.",
    process: defaultProcess,
    industries: ["Real Estate", "Architecture", "Hospitality"],
    faqs: defaultFaqs,
  },
  {
    slug: "interactive-sales-galleries",
    name: "Interactive Sales Galleries",
    category: "Real Estate & Spatial Experiences",
    short: "Touch tables, interactive walls and digital sales experiences.",
    hero: "Sales galleries that sell, not just show.",
    primaryKeyword: "interactive sales gallery India",
    what:
      "Concept-to-install interactive sales galleries — touch tables, projection floors, interactive site models and CRM-integrated kiosks that move prospects from interest to booking.",
    process: defaultProcess,
    industries: ["Real Estate", "Retail", "Hospitality"],
    faqs: defaultFaqs,
  },
  {
    slug: "3D-cinematic-walkthrough",
    name: "3D Cinematic Walkthrough",
    category: "Real Estate & Spatial Experiences",
    short: "Photoreal CGI films that fly through unbuilt spaces.",
    hero: "Cinematic films of homes that don't exist yet.",
    primaryKeyword: "3D cinematic walkthrough India",
    what:
      "Director-led photoreal CGI walkthroughs of apartments, villas and master plans — lensed and graded like a feature film for launch campaigns and sales decks.",
    process: defaultProcess,
    industries: ["Real Estate", "Hospitality", "Architecture"],
    faqs: defaultFaqs,
  },
  {
    slug: "architectural-visualization",
    name: "Architectural Visualization",
    category: "Real Estate & Spatial Experiences",
    short: "Stills and films that present architecture at its best.",
    hero: "Architecture, presented with the same craft as built.",
    primaryKeyword: "architectural visualization India",
    what:
      "Photoreal exterior and interior stills, day-and-night cycles and aerial flyovers — built from architectural CAD and rendered for marketing and approvals.",
    process: defaultProcess,
    industries: ["Real Estate", "Architecture", "Hospitality"],
    faqs: defaultFaqs,
  },
  {
    slug: "virtual-property-experiences",
    name: "Virtual Property Experiences",
    category: "Real Estate & Spatial Experiences",
    short: "Web-based 3D tours and interactive property explorers.",
    hero: "Explore the property from any browser, on any device.",
    primaryKeyword: "virtual property experience India",
    what:
      "Browser-based 3D tours, interactive unit explorers and configurator experiences — built on WebGL so buyers can explore the property from the campaign, the email or the sales rep's tablet.",
    process: defaultProcess,
    industries: ["Real Estate", "Retail", "Hospitality"],
    faqs: defaultFaqs,
  },

  // ─── 03 · Immersive Learning & Training ─────────────────────────────
  {
    slug: "xr-learning",
    name: "XR Learning",
    category: "Immersive Learning & Training",
    short: "Mixed-reality learning modules that improve retention.",
    hero: "Learn by doing, in fully immersive XR.",
    primaryKeyword: "XR learning studio India",
    what:
      "Curriculum-led XR learning experiences for schools, universities and enterprise L&D — shipped on Meta Quest and Apple Vision Pro with measurable retention outcomes.",
    process: defaultProcess,
    industries: ["Education", "Healthcare", "Manufacturing"],
    faqs: defaultFaqs,
  },
  {
    slug: "vr-training",
    name: "VR Training",
    category: "Immersive Learning & Training",
    short: "Hands-on VR programmes for skills and procedure training.",
    hero: "Train high-stakes skills, safely, in VR.",
    primaryKeyword: "VR training company India",
    what:
      "Procedural VR training for industrial, medical and field operations — built as repeatable modules with analytics dashboards for L&D and HSE teams.",
    process: defaultProcess,
    industries: ["Manufacturing", "Healthcare", "Energy"],
    faqs: defaultFaqs,
  },
  {
    slug: "safety-simulations",
    name: "Safety Simulations",
    category: "Immersive Learning & Training",
    short: "High-fidelity simulations for hazardous and high-risk scenarios.",
    hero: "Practice the dangerous moment without the danger.",
    primaryKeyword: "safety simulation training India",
    what:
      "VR and XR safety simulations covering fire, electrical, working-at-height and chemical scenarios — built to recognised HSE standards and integrated with your LMS.",
    process: defaultProcess,
    industries: ["Manufacturing", "Energy", "Construction"],
    faqs: defaultFaqs,
  },
  {
    slug: "interactive-learning-modules",
    name: "Interactive Learning Modules",
    category: "Immersive Learning & Training",
    short: "Browser-based interactive lessons with analytics.",
    hero: "Self-paced learning that holds attention.",
    primaryKeyword: "interactive learning modules India",
    what:
      "SCORM- and xAPI-ready interactive learning modules — gamified, motion-led and trackable for compliance and skill-building programmes.",
    process: defaultProcess,
    industries: ["Education", "Healthcare", "Manufacturing"],
    faqs: defaultFaqs,
  },
  {
    slug: "enterprise-training-solutions",
    name: "Enterprise Training Solutions",
    category: "Immersive Learning & Training",
    short: "Full-stack L&D programmes for the modern enterprise.",
    hero: "Build the workforce of the next decade.",
    primaryKeyword: "enterprise training solutions India",
    what:
      "Strategy, content design, production and rollout of enterprise training programmes — blending classroom, e-learning, VR and on-the-job formats with LMS integration.",
    process: defaultProcess,
    industries: ["Manufacturing", "Healthcare", "Energy", "Banking"],
    faqs: defaultFaqs,
  },

  // ─── 04 · Brand & Event Experiences ─────────────────────────────────
  {
    slug: "holograms",
    name: "Holograms",
    category: "Brand & Event Experiences",
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
    slug: "holobox-experiences",
    name: "Holobox Experiences",
    category: "Brand & Event Experiences",
    short: "Life-size holobox displays for retail, lobbies and events.",
    hero: "A presence that stops the foot traffic.",
    primaryKeyword: "holobox display India",
    what:
      "End-to-end holobox programmes — hardware sourcing, content production and on-site running — for product reveals, executive avatars and retail showcases.",
    process: defaultProcess,
    industries: ["Retail", "Events", "Hospitality"],
    faqs: defaultFaqs,
  },
  {
    slug: "interactive-installations",
    name: "Interactive Installations",
    category: "Brand & Event Experiences",
    short: "Touch, gesture and sensor-driven brand installations.",
    hero: "Installations the audience helps create.",
    primaryKeyword: "interactive installation studio India",
    what:
      "Sensor-driven, touch and gesture-controlled installations for flagship stores, lobbies, exhibitions and brand experiences — designed, built and run by Tero.",
    process: defaultProcess,
    industries: ["Retail", "Events", "Hospitality"],
    faqs: defaultFaqs,
  },
  {
    slug: "event-technology",
    name: "Event Technology",
    category: "Brand & Event Experiences",
    short: "AV, content and interaction technology for live events.",
    hero: "The technology side of the show, handled.",
    primaryKeyword: "event technology partner India",
    what:
      "Show-control, content production, LED and projection design, audience interaction tools and on-site supervision for conferences, launches and brand activations.",
    process: defaultProcess,
    industries: ["Events", "Advertising", "Hospitality"],
    faqs: defaultFaqs,
  },
  {
    slug: "experiential-activations",
    name: "Experiential Activations",
    category: "Brand & Event Experiences",
    short: "Concept-to-execution experiential brand activations.",
    hero: "Brand moments worth posting about.",
    primaryKeyword: "experiential activation agency India",
    what:
      "Concept, design and execution of experiential brand activations — pop-ups, festival takeovers, mall activations and roadshows powered by Tero's immersive tech stack.",
    process: defaultProcess,
    industries: ["Advertising", "Retail", "Events"],
    faqs: defaultFaqs,
  },
  {
    slug: "projection-mapping",
    name: "Projection Mapping",
    category: "Brand & Event Experiences",
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
    slug: "invisible-touch-led",
    name: "Invisible Touch LED",
    category: "Brand & Event Experiences",
    short: "Touch-responsive LED walls without visible sensors.",
    hero: "Walls that respond, with no visible touch layer.",
    primaryKeyword: "invisible touch LED India",
    what:
      "Concept, content and hardware integration for invisible-touch LED installations — large-format interactive walls for flagship stores, lobbies and exhibitions.",
    process: defaultProcess,
    industries: ["Retail", "Events", "Hospitality"],
    faqs: defaultFaqs,
  },
  {
    slug: "laser-projection",
    name: "Laser Projection",
    category: "Brand & Event Experiences",
    short: "High-lumen laser projection design and execution.",
    hero: "Laser-grade brightness, even in daylight venues.",
    primaryKeyword: "laser projection company India",
    what:
      "Laser projector specification, content design and on-site execution for outdoor mappings, large-scale events and architectural showcases.",
    process: defaultProcess,
    industries: ["Events", "Architecture", "Advertising"],
    faqs: defaultFaqs,
  },
  {
    slug: "flying-led",
    name: "Flying LED",
    category: "Brand & Event Experiences",
    short: "Kinetic and drone-mounted LED for live events.",
    hero: "LED that moves through the room.",
    primaryKeyword: "flying LED kinetic display India",
    what:
      "Kinetic, drone-mounted and rigged flying LED installations — content and choreography designed for keynote reveals, concerts and brand launches.",
    process: defaultProcess,
    industries: ["Events", "Advertising", "Hospitality"],
    faqs: defaultFaqs,
  },

  // ─── 05 · Immersive Hardware Solutions ──────────────────────────────
  {
    slug: "virtual-reality",
    name: "Virtual Reality",
    category: "Immersive Hardware Solutions",
    short: "VR hardware sourcing, deployment and content packaging.",
    hero: "The headsets, the content and the rollout — handled.",
    primaryKeyword: "virtual reality solutions India",
    what:
      "Meta Quest, Pico, Apple Vision Pro and tethered Varjo / Vive deployments — bundled with content, MDM rollouts and ongoing support for enterprise programmes.",
    process: defaultProcess,
    industries: ["Manufacturing", "Healthcare", "Education", "Real Estate"],
    faqs: defaultFaqs,
  },
  {
    slug: "augmented-reality",
    name: "Augmented Reality",
    category: "Immersive Hardware Solutions",
    short: "Mobile, web and headset AR for brand and enterprise.",
    hero: "Layer digital craft onto the real world.",
    primaryKeyword: "augmented reality company India",
    what:
      "WebAR brand activations, native mobile AR apps and enterprise headset AR — built in Unity, Unreal and 8th Wall and shipped on real hardware.",
    process: defaultProcess,
    industries: ["Advertising", "Retail", "Manufacturing"],
    faqs: defaultFaqs,
  },
  {
    slug: "interactive-systems",
    name: "Interactive Systems",
    category: "Immersive Hardware Solutions",
    short: "Custom interactive systems, sensors and show-control.",
    hero: "The software and sensors that drive the experience.",
    primaryKeyword: "interactive systems integrator India",
    what:
      "Custom-built interactive systems — sensors, computer vision, show-control software and integrations — engineered for installations, exhibitions and enterprise use cases.",
    process: defaultProcess,
    industries: ["Retail", "Events", "Manufacturing"],
    faqs: defaultFaqs,
  },
  {
    slug: "custom-immersive-experiences",
    name: "Custom Immersive Experiences",
    category: "Immersive Hardware Solutions",
    short: "Bespoke immersive builds when off-the-shelf won't do.",
    hero: "When the experience doesn't exist yet, we build it.",
    primaryKeyword: "custom immersive experience studio India",
    badge: "Tero exclusive",
    what:
      "Concept-to-commission bespoke immersive experiences — combining hardware, content, software and on-site teams to deliver experiences no off-the-shelf vendor can.",
    process: defaultProcess,
    industries: ["Advertising", "Real Estate", "Events", "Manufacturing"],
    faqs: defaultFaqs,
  },
];

export const servicesByCategory = (): Record<ServiceCategory, ServiceEntry[]> => {
  const map = {
    "Content & Visual Storytelling": [] as ServiceEntry[],
    "Real Estate & Spatial Experiences": [] as ServiceEntry[],
    "Immersive Learning & Training": [] as ServiceEntry[],
    "Brand & Event Experiences": [] as ServiceEntry[],
    "Immersive Hardware Solutions": [] as ServiceEntry[],
  };
  services.forEach((s) => map[s.category].push(s));
  return map;
};

export const getService = (slug: string) => services.find((s) => s.slug === slug);
