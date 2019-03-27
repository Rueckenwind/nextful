module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['inline-react-svg', {
      svgo: {
        plugins: [{
          cleanupIDs: false
        }]
      }
    }],
    'emotion',
  ]
};
