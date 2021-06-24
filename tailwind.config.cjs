const colors = require('tailwindcss/colors')

const config = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    // https://tailwindcss.com/docs/customizing-colors
    extend: {
      colors: {
        trueGray: colors.trueGray,
      },
    },
  },
  plugins: [],
}

module.exports = config
