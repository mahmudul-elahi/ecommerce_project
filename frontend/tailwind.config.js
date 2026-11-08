/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#15803d',
          600: '#166534',
          700: '#14532d',
          800: '#052e16',
        },
        aloe: {
          10: '#c1fbd4',
          DEFAULT: '#c1fbd4',
          deep: '#065f46',
        },
        pistachio: {
          10: '#d4f9e0',
          DEFAULT: '#d4f9e0',
        },
        shopify: {
          cream: '#fbfbf5',
          mint: '#c1fbd4',
          dark: '#000000',
          border: '#e4e4e7',
        },
        paper: {
          50: '#fbfbfa',
          100: '#f6f5f1',
          200: '#edece6',
          300: '#dedcd3',
          DEFAULT: '#faf9f5',
        },
        ink: {
          light: '#57534e',
          DEFAULT: '#292524',
          deep: '#1c1917',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'craft': '0 4px 20px -2px rgba(28, 25, 23, 0.06), 0 2px 6px -1px rgba(28, 25, 23, 0.03)',
        'elevated': '0 20px 25px -5px rgba(28, 25, 23, 0.08), 0 8px 10px -6px rgba(28, 25, 23, 0.03)',
      },
    },
  },
  plugins: [],
}
