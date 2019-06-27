import {
  START,
  PLAY,
  RESUME,
  PAUSE,
  ARIA_PRESSED,
  MIN,
  MAX,
  UP,
  GAME_TIME,
} from './constants'
import Timer from './timer'
import { random, toUpper, domUtils, LS } from './shared'

const {
  editButton,
  removeClass,
  addClass,
  setContent,
  setState,
  setAttr,
  eventType,
} = domUtils
const { index, time } = random

const EVENT = eventType(document)

class Game {
  constructor({
    moles,
    scoreBoard,
    hiScoreBoard,
    holes,
    startButton,
    stopButton,
  }) {
    this.startButton = startButton
    this.stopButton = stopButton
    this.moles = moles
    this.scoreBoard = scoreBoard
    this.hiScoreBoard = hiScoreBoard
    this.holes = holes
    this.state = {}

    this.stopButton.disabled = true
  }
  // internal state mechanics
  _setInitialState() {
    const hiScore = parseInt(LS.get('hiScore'))

    this.state = {
      paused: false,
      lastHole: undefined,
      timeUp: false,
      score: 0,
      hiScore: hiScore || 0,
      timer: new Timer(() => {
        editButton(this.startButton.childNodes, START, PLAY)

        this.stop()

        if (this.state.score > this.state.hiScore) {
          this.state.hiScore = this.state.score
          setContent(this.hiScoreBoard, this.state.hiScore)
          LS.set({ hiScore: this.state.score })
        }

        this.state.score = 0
      }, GAME_TIME),
    }
  }
  _randomHole() {
    const {
      holes,
      moles,
      state: { lastHole },
    } = this

    const hole = moles[index(holes)]

    if (hole === lastHole) {
      return this._randomHole(holes)
    }

    this.state.lastHole = hole

    return hole
  }
  _showMole() {
    const { timeUp, paused, holes } = this.state

    if (timeUp || paused) {
      return
    }

    const hole = this._randomHole(holes)

    addClass(hole, UP)

    setTimeout(() => {
      removeClass(hole, UP)
      if (!timeUp || !paused) this._showMole()
    }, time(MIN, MAX))
  }

  // public api
  scoreUp() {
    const { scoreBoard } = this
    this.state.score = this.state.score + 1
    setContent(scoreBoard, this.state.score)
  }
  start() {
    const { startButton, stopButton } = this
    // reset state and reattach handlers
    this._setInitialState()
    this._showMole()

    // set start button
    editButton(startButton.childNodes, PAUSE)
    setAttr(startButton, ARIA_PRESSED, 'true')
    setState(startButton, PAUSE)
    // set stop button
    setAttr(stopButton, ARIA_PRESSED, 'false')
    this.stopButton.disabled = false
  }
  resume() {
    const { startButton } = this
    // toggle start button
    editButton(startButton.childNodes, PAUSE)
    setState(startButton, RESUME)
    // unset pause states
    this.state.paused = false
    this.state.timer.resume()
    // reattach handlers
    this._attachActions()
  }
  pause() {
    const { startButton } = this
    // toggle start button
    editButton(startButton.childNodes, RESUME, PLAY)
    setAttr(startButton, ARIA_PRESSED, 'true')
    setState(startButton, START)
    // set pause states
    this.state.paused = true
    this.state.timer.pause()
  }
  stop() {
    const { button, scoreBoard, startButton, stopButton } = this

    // stop game
    this.state.timeUp = true
    this.state.timer.stop()
    // reset stop button
    this.stopButton.disabled = true
    setAttr(stopButton, ARIA_PRESSED, 'true')
    // reset start button
    editButton(startButton.childNodes, START, PLAY)
    setState(startButton, START)
    // reset scoreboard
    setContent(scoreBoard, 0)
  }
}

export default Game
