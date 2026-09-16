import type { Config } from "tailwindcss";

// Warna dibaca dari CSS custom property (lihat app/globals.css) supaya satu
// kelas seperti `bg-surface` otomatis benar di tema terang maupun gelap —
// tidak perlu lagi menulis pasangan `bg-x dark:bg-y` di tiap komponen.
const token = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: token("--c-canvas"),
        surface: token("--c-surface"),
        "surface-2": token("--c-surface-2"),
        line: token("--c-line"),
        "line-strong": token("--c-line-strong"),
        ink: token("--c-ink"),
        "ink-muted": token("--c-ink-muted"),
        "ink-subtle": token("--c-ink-subtle"),
        brand: token("--c-brand"),
        "brand-hover": token("--c-brand-hover"),
        "brand-on": token("--c-brand-on"),
        "brand-soft": token("--c-brand-soft"),
        gold: token("--c-gold"),
        "gold-soft": token("--c-gold-soft"),
        success: token("--c-success"),
        "success-soft": token("--c-success-soft"),
        warn: token("--c-warn"),
        "warn-soft": token("--c-warn-soft"),
        danger: token("--c-danger"),
        "danger-soft": token("--c-danger-soft"),
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      fontSize: {
        // Skala display untuk judul serif — tracking rapat, leading pendek.
        "display-sm": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "display-md": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.04", letterSpacing: "-0.03em" }],
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
      borderRadius: {
        // Radius sengaja kecil & konsisten — bentuk tegas, bukan membulat ceria.
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "10px",
        "2xl": "14px",
      },
      boxShadow: {
        // Bayangan netral berbasis warna tinta, sangat tipis — kedalaman
        // utamanya dibawa garis rambut 1px, bukan drop shadow.
        subtle: "0 1px 2px rgb(var(--shadow-color) / 0.04), 0 1px 1px rgb(var(--shadow-color) / 0.03)",
        card: "0 1px 3px rgb(var(--shadow-color) / 0.05), 0 6px 16px -8px rgb(var(--shadow-color) / 0.08)",
        lifted: "0 2px 6px rgb(var(--shadow-color) / 0.06), 0 16px 32px -12px rgb(var(--shadow-color) / 0.14)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        rise: "rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        fade: "fade 0.4s ease both",
      },
      typography: {
        // Prose ikut token yang sama, jadi satu kelas `prose` sudah benar di
        // kedua tema — tanpa `dark:prose-invert`.
        DEFAULT: {
          css: {
            "--tw-prose-body": "rgb(var(--c-ink-muted))",
            "--tw-prose-headings": "rgb(var(--c-ink))",
            "--tw-prose-lead": "rgb(var(--c-ink-muted))",
            "--tw-prose-links": "rgb(var(--c-brand))",
            "--tw-prose-bold": "rgb(var(--c-ink))",
            "--tw-prose-counters": "rgb(var(--c-ink-subtle))",
            "--tw-prose-bullets": "rgb(var(--c-line-strong))",
            "--tw-prose-hr": "rgb(var(--c-line))",
            "--tw-prose-quotes": "rgb(var(--c-ink))",
            "--tw-prose-quote-borders": "rgb(var(--c-line))",
            "--tw-prose-captions": "rgb(var(--c-ink-subtle))",
            "--tw-prose-code": "rgb(var(--c-ink))",
            "--tw-prose-pre-code": "rgb(var(--c-ink))",
            "--tw-prose-pre-bg": "rgb(var(--c-surface-2))",
            "--tw-prose-th-borders": "rgb(var(--c-line))",
            "--tw-prose-td-borders": "rgb(var(--c-line))",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
