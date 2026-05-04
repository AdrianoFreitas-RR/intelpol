/** Tailwind config — Radar IP-RR design system v0.7 */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Acentos por dimensão (Bússola Visual: 1 cor por dimensão)
        paid: { DEFAULT: "#10b981" },     // verde — investimento
        organic: { DEFAULT: "#3b82f6" },  // azul — engajamento
        anomaly: { DEFAULT: "#f59e0b" },  // âmbar — alerta
        eleitoral: { DEFAULT: "#8b5cf6" }, // roxo — TSE
        negative: { DEFAULT: "#ef4444" }, // vermelho — queda
        // Blocos ideológicos (consistência com bloco_ideologico do schema)
        bloco: {
          bolsonarista: "#f59e0b",
          centro: "#06b6d4",
          esquerda: "#ef4444",
          independente: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
