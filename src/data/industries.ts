export interface IndustryEntry {
  slug: string;
  name: string;
  short: string;
  hero: string;
  primaryKeyword: string;
  pain: string[];
  services: string[];
  proof: string[];
  faqs: { q: string; a: string }[];
  badge?: string;
}

export const industries: IndustryEntry[] = [
  {
    slug: "real-estate",
    name: "Real Estate Solutions",
    short: "Sell properties before they exist with cinematic visualisation.",
    hero: "Property storytelling for the pre-launch market.",
    primaryKeyword: "real estate animation solutions India",
    badge: "New flagship",
    pain: [
      "Sales teams pitching unbuilt inventory without compelling visuals",
      "Generic walkthroughs that fail to differentiate the development",
      "Long lag between architectural design and marketing material",
    ],
    services: [
      "3D walkthroughs",
      "Virtual property tours",
      "AR staging",
      "CGI renders",
      "Floor plan animation",
      "Pre-launch sales visuals",
    ],
    proof: ["Clayworks", "Developer case studies across South India"],
    faqs: [
      { q: "Can you work from architectural drawings?", a: "Yes — we accept Revit, SketchUp and AutoCAD as starting points." },
      { q: "How quickly can we go to market?", a: "A 60-second hero walkthrough typically ships in 4 to 6 weeks." },
    ],
  },
  {
    slug: "advertising",
    name: "Advertising & Brands",
    short: "CGI ads, anamorphic OOH, TVC and social content for agencies.",
    hero: "Work that earns its slot on the brief.",
    primaryKeyword: "animation studio for advertising India",
    pain: [
      "Tight launch windows with no room for re-shoots",
      "Cross-channel deliverables on a single budget",
      "Concepts that need bespoke craft, not stock",
    ],
    services: ["CGI ads", "Anamorphic OOH", "TVC", "Social content"],
    proof: ["Campa Cola", "Ford", "Bhima Gold", "Bang & Olufsen"],
    faqs: [
      { q: "Do you work directly with agencies?", a: "We partner with creative agencies as a production partner, white-label or co-credit." },
    ],
  },
  {
    slug: "events-exhibitions",
    name: "Events & Exhibitions",
    short: "Immersive content for the country's most ambitious live moments.",
    hero: "Built for the largest screens and the biggest moments.",
    primaryKeyword: "immersive event experience India",
    pain: [
      "Static content failing to hold attention on the floor",
      "Vendor coordination across hardware, content and rigging",
      "Live deadlines that don't move",
    ],
    services: ["Projection mapping", "Holograms", "Anamorphic", "AR activations"],
    proof: ["Lulu Mall", "NMACC", "IMTEX", "Forum Mall"],
    faqs: [
      { q: "Can you supervise on-site?", a: "Yes — content, hardware and show-call leads ship to site for every major install." },
    ],
  },
  {
    slug: "architecture",
    name: "Architecture & Interior Design",
    short: "3D renders, walkthroughs and immersive tours for design practices.",
    hero: "Drawings, brought to life.",
    primaryKeyword: "3D architectural animation India",
    pain: [
      "Drawings that don't convey atmosphere or scale",
      "Pitch decks competing against photoreal CGI from rivals",
      "Client revisions that require fast turnaround",
    ],
    services: ["3D renders", "Walkthroughs", "VR tours", "CGI environments"],
    proof: ["Practices across India and the GCC"],
    faqs: [
      { q: "Do you take Revit and SketchUp models?", a: "Yes — we accept all leading architectural formats and rebuild only when material." },
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare & Pharma",
    short: "Medical 3D, pharma explainers and immersive clinical training.",
    hero: "Clinical accuracy with the craft of editorial film.",
    primaryKeyword: "medical animation studio India",
    pain: [
      "Mechanisms of action explained without losing rigour",
      "Patient communication that builds trust",
      "Clinical training that scales geographically",
    ],
    services: ["Medical 3D", "Pharma explainers", "VR training"],
    proof: ["Sanofi"],
    faqs: [
      { q: "Do you work with medical advisors?", a: "Yes — every film is reviewed by a qualified medical advisor as part of the process." },
    ],
  },
  {
    slug: "education",
    name: "Education & E-Learning",
    short: "2D explainers, interactive VR learning and whiteboard animation.",
    hero: "Lessons that actually move.",
    primaryKeyword: "e-learning animation studio India",
    pain: [
      "Subject matter that is hard to visualise",
      "Production budgets stretched across long curricula",
      "Course material that needs to age well",
    ],
    services: ["2D explainers", "Interactive VR learning", "Whiteboard animation"],
    proof: ["Edtech platforms across India"],
    faqs: [
      { q: "Can you scale across a curriculum?", a: "Yes — we build reusable design systems so episodes 1 to 100 stay consistent." },
    ],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    short: "Process animation, equipment walkthroughs and trade-show visuals.",
    hero: "Show the machine, not the brochure.",
    primaryKeyword: "manufacturing animation studio India",
    pain: [
      "Equipment too large or expensive to demo on-site",
      "Technical sales cycles that drag",
      "Trade-show content recycled year after year",
    ],
    services: ["Process animation", "Equipment walkthroughs", "Trade show visuals"],
    proof: ["IMTEX", "ACMEE"],
    faqs: [
      { q: "Can you work from CAD?", a: "Yes — we routinely build from STEP, IGES and native CAD assemblies." },
    ],
  },
  {
    slug: "automotive",
    name: "Automotive",
    short: "CGI product films, launch reveals and technical animation.",
    hero: "Reveals that own the launch window.",
    primaryKeyword: "automotive CGI animation India",
    pain: [
      "Vehicles under embargo until launch day",
      "Global reveal calendars that don't move",
      "Technical features that need cinematic treatment",
    ],
    services: ["CGI product films", "Launch reveals", "Technical animation"],
    proof: ["Ford", "CAT / GMMCO"],
    faqs: [
      { q: "Can you work pre-production from CAD only?", a: "Yes — we are routinely briefed under NDA with CAD-only assets months before launch." },
    ],
  },
  {
    slug: "retail-ecommerce",
    name: "Retail & E-Commerce",
    short: "3D product renders, unboxing animation and social content.",
    hero: "Catalogue-grade content, without a photo shoot.",
    primaryKeyword: "product animation for e-commerce India",
    pain: [
      "Hundreds of SKUs needing consistent visuals",
      "Frequent variant updates",
      "Social formats that move faster than studio shoots",
    ],
    services: ["3D product renders", "Unboxing animation", "Social content"],
    proof: ["D2C brands across India"],
    faqs: [
      { q: "Can you scale a SKU library?", a: "Yes — we build automated render pipelines for repeat SKUs and variants." },
    ],
  },
];

export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
