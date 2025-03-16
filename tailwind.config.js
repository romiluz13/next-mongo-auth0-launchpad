/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // MongoDB color palette
        mongodb: {
          green: {
            DEFAULT: "#00ED64", // MongoDB primary green
            50: "#E3FFF0",
            100: "#C7FFE1",
            200: "#94FFC3",
            300: "#61FFA6",
            400: "#2EFF88",
            500: "#00ED64", // Primary
            600: "#00C954",
            700: "#00A544",
            800: "#008135",
            900: "#005D25",
            950: "#004B1E",
          },
          dark: {
            DEFAULT: "#001E2B", // MongoDB dark background
            50: "#004D6B",
            100: "#004561",
            200: "#003A52",
            300: "#002E42",
            400: "#002433",
            500: "#001E2B", // Primary dark
            600: "#001824",
            700: "#00121C",
            800: "#000C14",
            900: "#00060A",
            950: "#000305",
          },
          gray: {
            DEFAULT: "#B8C4C2", // MongoDB neutral gray
            50: "#F8F9F9",
            100: "#EEF0F0",
            200: "#DFE3E2",
            300: "#D0D6D5",
            400: "#C1C9C8",
            500: "#B8C4C2", // Primary gray
            600: "#9AA9A6",
            700: "#7C8F8B",
            800: "#637570",
            900: "#4D5A56",
            950: "#3D4744",
          },
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "slide-in": {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 0 0 rgba(0, 237, 100, 0)" 
          },
          "50%": { 
            boxShadow: "0 0 20px 5px rgba(0, 237, 100, 0.3)" 
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.5s ease-out",
        "pulse-glow": "pulse-glow 3s infinite",
        "float": "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 