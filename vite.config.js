import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// package.json ha "type": "module", quindi questo file gira come ESM:
// __dirname non esiste, va ricavato da import.meta.url.
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    // Sito multi-pagina: index.html (app React) + pagine statiche come
    // torre-a-mare.html. Senza questo, "npm run build" includerebbe solo
    // index.html in dist/. Ogni nuova pagina statica in root va aggiunta
    // qui per finire nella build.
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        torreAMare: resolve(__dirname, "torre-a-mare.html"),
        torreAMareEn: resolve(__dirname, "torre-a-mare-en.html"),
        polignanoAMare: resolve(__dirname, "polignano-a-mare.html"),
        polignanoAMareEn: resolve(__dirname, "polignano-a-mare-en.html"),
        monopoli: resolve(__dirname, "monopoli.html"),
        monopoliEn: resolve(__dirname, "monopoli-en.html"),
        bari: resolve(__dirname, "bari.html"),
        bariEn: resolve(__dirname, "bari-en.html"),
        alberobello: resolve(__dirname, "alberobello.html"),
        alberobelloEn: resolve(__dirname, "alberobello-en.html"),
      },
    },
  },
});
