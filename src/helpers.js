import { breakpointPhone } from './config'
//import { animate, timeflow, timings } from './animate'

export class EventObserver {
  constructor () {
    // this.sender = sender
    this.listeners = []
  }
  attach (method) { this.listeners.push(method) }
  notify (args) {
    this.listeners.forEach(
      (c, i) => this.listeners[i](args)
    )
  }
}

/**
 * sets up listeners that will fire the callback
 * on every window size or orientation change
 * @param {function} callback to run
 */
export const onWindowChange = (callback) => {
  window.addEventListener('resize', () => {
    // This will fire each time the window is resized
    // Usually a good idea to wrap this in a debounce method, like http://underscorejs.org/#debounce
    callback(arguments[1], arguments[2])
  },
  false)
  window.addEventListener(
    'orientationchange', () => {
      callback(arguments[1], arguments[2])
    },
    false
  )
}

export const qs = (selector) => {
  return document.querySelector(selector)
}

export const qsAll = (selector) => {
  return document.querySelectorAll(selector)
}

export const id = (id) => {
  return document.getElementById(id)
}

export const scrollTo = (selector, offset) => {
  offset = offset || 0
  const position = $(selector).offset().top - offset
  $('html, body').animate({ scrollTop: position }, 500)
}

/* export const scrollTo = (
  selector, 
  offset = 0, 
  duration = 2000, 
  timing = timings.power(4), 
  flow = timeflow.backAndForth) => {   
    animate(p => {
      const start = window.pageYOffset
      window.scrollTo(0, p * (qs('.smth').offsetTop - start) + start)
    }, duration, timeflow.backAndForth(timings.power(4)))


    const origin = window.pageYOffset
    window.scrollTo(0, p * (qs(`${selector}`).offsetTop - origin) + origin - offset)
  }, 2000, timeflow.backAndForth(timings.power(4)))
} */

/* export const fullVH = () => {
  return Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  )
} */

export const isMobile = (
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth
) <= breakpointPhone
