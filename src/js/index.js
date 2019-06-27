import { START, PLAY, STOP, SCORE, HOLE, HIGH, MOLE, UP } from './constants'
import { fragments, domUtils, LS } from './shared'
import Game from './game'

const {
  getNode,
  getNodes,
  removeClass,
  setContent,
  editButton,
  eventType,
} = domUtils

function attachHandlers() {
  const EVENT = eventType(document)
  // fetch necessary nodes
  const els = {
    holes: getNodes(`.${HOLE}`),
    scoreBoard: getNode(`.${SCORE}`),
    hiScoreBoard: getNode(`.${HIGH}`),
    moles: getNodes(`.${MOLE}`),
    startButton: getNode(`.${START}`),
    stopButton: getNode(`.${STOP}`),
  }

  const { scoreBoard, hiScoreBoard, startButton, stopButton, moles } = els

  // initial button edit
  editButton(startButton.childNodes, START, PLAY)
  editButton(stopButton.childNodes, STOP)
  setContent(scoreBoard, 0)
  setContent(hiScoreBoard, parseInt(LS.get('hiScore')))

  // create game and pass in element nodes
  const game = new Game(els)

  // attach listeners that toggle or call exposed functions from game
  stopButton.addEventListener(EVENT, e => {
    e.preventDefault()
    game.stop()
  })

  startButton.addEventListener(EVENT, function(e) {
    e.preventDefault()

    return {
      start: () => game.start(),
      pause: () => game.pause(),
      resume: () => game.resume(),
    }[this.dataset.state || START]()
  })

  moles.forEach(mole =>
    mole.addEventListener(EVENT, function(e) {
      e.preventDefault()

      if (!e.isTrusted) {
        return
      }

      game.scoreUp()
      removeClass(this.parentNode, UP)
    })
  )
}

document.addEventListener('DOMContentLoaded', () => attachHandlers())
