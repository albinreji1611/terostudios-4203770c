
import catAi from "@/assets/videos/cat-ai.mp4.asset.json";
import ccpl from "@/assets/videos/ccpl-3d.mp4.asset.json";
import campa2d from "@/assets/videos/campa-2d.mp4.asset.json";
import campa3d from "@/assets/videos/campa-3d.mp4.asset.json";
import caterpillar from "@/assets/videos/caterpillar-3d.mp4.asset.json";
import factoryVR from "@/assets/videos/factory-vr.mp4.asset.json";
import gurunanda from "@/assets/videos/gurunanda-cgi.mp4.asset.json";
import kfsh from "@/assets/videos/kfsh-explainer.mp4.asset.json";
import kingfisher from "@/assets/videos/kingfisher-3d.mp4.asset.json";
import metaverse from "@/assets/videos/metaverse-city.mp4.asset.json";
import motilal from "@/assets/videos/motilal-anamorphic.mp4.asset.json";
import muzen from "@/assets/videos/muzen-speaker-3d.mp4.asset.json";
import phoenix from "@/assets/videos/phoenix-mall-cgi.mp4.asset.json";
import shopontime from "@/assets/videos/shopontime-anamorphic.mp4.asset.json";
import siemens from "@/assets/videos/siemens-gamesa-3d.mp4.asset.json";
import sirc from "@/assets/videos/sirc-hologram.mp4.asset.json";
import sotefin from "@/assets/videos/sotefin.mp4.asset.json";
import { resolveAssetUrl } from "@/lib/asset-url";

const r = resolveAssetUrl;

export type VideoItem = {
  url: string;
  client: string;
  title: string;
  service: string;
  industry: string;
  aspect: number; // width / height
};

export const videos: VideoItem[] = [
  { url: r(sotefin.url), client: "Sotefin", title: "Sotefin", service: "3D Animation", industry: "Industrial", aspect: 2560 / 1440 },

  
  { url: r(campa3d.url), client: "Campa", title: "Campa 3D", service: "3D Animation", industry: "Beverages", aspect: 1920 / 1080 },
  { url: r(campa2d.url), client: "Campa", title: "Campa 2D", service: "Motion Graphics", industry: "Beverages", aspect: 854 / 480 },
  { url: r(caterpillar.url), client: "Caterpillar", title: "Caterpillar 3D", service: "3D Animation", industry: "Industrial", aspect: 640 / 360 },
  { url: r(catAi.url), client: "Caterpillar", title: "CAT AI", service: "AI", industry: "Industrial", aspect: 854 / 480 },
  { url: r(ccpl.url), client: "CCPL", title: "CCPL 3D", service: "3D Animation", industry: "Industrial", aspect: 1056 / 288 },
  { url: r(factoryVR.url), client: "Factory", title: "Factory VR", service: "Immersive XR Training", industry: "Manufacturing", aspect: 1208 / 576 },
  { url: r(gurunanda.url), client: "GuruNanda", title: "Dual Mouthwash CGI", service: "Product 3D", industry: "FMCG", aspect: 324 / 576 },
  { url: r(kfsh.url), client: "KFSH", title: "KFSH Explainer", service: "Explainer", industry: "Healthcare", aspect: 512 / 288 },
  { url: r(kingfisher.url), client: "Kingfisher", title: "Kingfisher 3D", service: "3D Animation", industry: "Beverages", aspect: 854 / 480 },
  { url: r(metaverse.url), client: "Metaverse", title: "Metaverse City", service: "PropViz Experiences", industry: "Real Estate", aspect: 758 / 360 },
  { url: r(motilal.url), client: "Motilal Oswal", title: "Motilal Anamorphic", service: "Anamorphic & DOOH", industry: "Finance", aspect: 854 / 480 },
  { url: r(muzen.url), client: "Muzen", title: "Muzen Speaker", service: "Product 3D", industry: "Consumer", aspect: 1024 / 576 },
  { url: r(phoenix.url), client: "Phoenix Mall", title: "Phoenix CGI", service: "Anamorphic & DOOH", industry: "Retail", aspect: 406 / 720 },
  { url: r(shopontime.url), client: "ShopOnTime", title: "ShopOnTime Anamorphic", service: "Anamorphic & DOOH", industry: "Retail", aspect: 2664 / 1080 },
  { url: r(siemens.url), client: "Siemens Gamesa", title: "Siemens Gamesa 3D", service: "3D Animation", industry: "Energy", aspect: 320 / 180 },
  { url: r(sirc.url), client: "Sirc", title: "Sirc Hologram", service: "Event & Immersive Hardware", industry: "Events", aspect: 320 / 180 },
];
