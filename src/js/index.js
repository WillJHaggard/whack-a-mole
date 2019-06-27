/**
 * Whack-A-Mole
 *
 * organize for simplicity and organization
 * Object composition or class es6 (prototypal) for Game and Timer
 *
 * pseudo-code
 * 1. init state for game
 * 2. build functions that change state
 * 3. build public api that calls state setters
 * 4. attach dom events and handlers
 * 5. build pausable timer
 * 6. initialize together and expose public api for use with buttons
 */
import { domUtils } from './shared'
import { HOLE, SCORE, MOLE, START, STOP } from './constants'

const { getNode, getNodes } = domUtils

function render() {
  const els = {
    holes: getNodes(`.${HOLE}`),
    scoreBoard: getNode(`.${SCORE}`),
    moles: getNodes(`.${MOLE}`),
    startButton: getNode(`.${START}`),
    stopButton: getNode(`.${STOP}`),
  }

  stopButton.addEventListener('click', e => {
    e.preventDefault()
    // stop game
  })

  startButton.addEventListener('click', function(e) {
    e.preventDefault()

    return {
      start: () => {},
      pause: () => {},
      resume: () => {},
    }[this.dataset.state || START]()
  })
}

document.addEventListener('DOMContentLoaded', () => render())
