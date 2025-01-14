/** @type {import('tailwindcss').Config} */
// import flowbitePlugin from 'flowbite/plugin';
// import tailwindScrollbar from 'tailwind-scrollbar';
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwind-scrollbar'),
    require('@tailwindcss/line-clamp')
    // flowbitePlugin(),
    // tailwindScrollbar(),
    // tailwindcss/line-clamp(),
  ],
};

