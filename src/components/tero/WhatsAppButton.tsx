import { motion } from "framer-motion";

const WHATSAPP_URL = "https://wa.me/919900013988";

export function WhatsAppButton() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, y: 20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
      className="group fixed bottom-24 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-parchment bg-ink text-cream shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-colors duration-300 hover:bg-vermillion hover:border-vermillion/30 hover:shadow-[0_8px_30px_rgba(232,57,14,0.35)]"
    >
      <svg viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.715.315-.688.717-1.032 1.39-1.06 2.395v.13c-.015.99.41 1.918.95 2.748 1.34 2.05 2.937 3.832 5.143 4.91.616.302 2.063.93 2.748.93.817 0 2.583-.43 2.83-1.31.085-.27.085-.555.045-.84-.115-.43-2.13-1.59-2.46-1.59zm-3.32 8.347c-1.875 0-3.692-.516-5.272-1.49l-3.683.974.974-3.605c-1.074-1.65-1.62-3.62-1.62-5.6 0-5.605 4.59-10.194 10.196-10.194 5.605 0 10.196 4.59 10.196 10.196 0 5.605-4.59 10.196-10.196 10.196z" />
      </svg>
    </motion.a>
  );
}
