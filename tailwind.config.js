/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Xanh dương
        primary: {
          50: '#e6f0fa',
          100: '#cce0f5',
          200: '#99c2eb',
          300: '#66a3e0',
          400: '#3385d6',
          500: '#146eb4',  // Màu chính 
          600: '#11589a',
          700: '#0d437f',
          800: '#092e64',
          900: '#051a4a',
        },
        // Secondary - Vàng 
        secondary: {
          50: '#fff8e6',
          100: '#ffefcc',
          200: '#ffde99',
          300: '#ffcc66',
          400: '#ffb733',
          500: '#ff9900',  // Màu vàng
          600: '#e68a00',
          700: '#b36b00',
          800: '#804c00',
          900: '#4d2e00',
        },
        // Success, Warning, Danger 
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'button': '0 4px 12px rgba(20, 110, 180, 0.3)',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
};
