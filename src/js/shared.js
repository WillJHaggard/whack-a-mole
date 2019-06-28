import { CLICK, TOUCHSTART } from './constants'

export const random = {
  index: ({ length }) => Math.floor(Math.random() * length),
  time: (min, max) => Math.round(Math.random() * (max - min) + min),
}

export function toUpper(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const domUtils = {
  getNode: attr => document.querySelector(attr),
  getNodes: attr => document.querySelectorAll(attr),
  editButton: ([text, el], type, icon = null) => {
    text.textContent = toUpper(type)
    el.classList.remove(el.classList[el.classList.length - 1])
    el.classList.add(`fa-${!icon ? type : icon}`)
  },
  removeClass: (el, className) => el.classList.remove(className),
  addClass: (el, className) => el.classList.add(className),
  setContent: (el, content) => (el.textContent = content),
  setState: (el, newState) => (el.dataset.state = newState),
  setAttr: (el, attr, val) => el.setAttribute(attr, val),
  eventType: d => (d.ontouchstart !== null ? CLICK : TOUCHSTART),
}

export const LS = {
  get: (item = 'hiScore') => {
    if (!window.localStorage) return

    let parsedVal = 0
    try {
      parsedVal = JSON.parse(localStorage.getItem(item))
    } catch (err) {
      console.error(err)
      console.warn('Failed to parse prior high score')
    }

    return parsedVal
  },
  set: (item = { hiScore: 0 }) => {
    if (!window.localStorage) return
    const [key, val] = Object.entries(item)[0]

    let stringifiedVal = false
    try {
      stringifiedVal = JSON.stringify(val)
    } catch (err) {
      console.error(err)
      console.warn(`Failed to stringify new high score of ${val}`)
    }

    // only set if real value as to not overwrite previous value
    if (stringifiedVal) {
      localStorage.setItem(key, stringifiedVal)
    }
  },
}
