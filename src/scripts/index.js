import 'Styles/main.styl'

import Playground from './Playground'


const $container = document.getElementById('playground-container')

// Initialize
const playground = new Playground({
  debug: window.location.hash === '#debug',
})

// Start
playground.renderTo($container)
