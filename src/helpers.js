import { breakpointPhone } from './config'

/**
 * sets up listeners that will fire the callback
 * on every window size or orientation change
 * @param {function} callback to run
 */
/* export const onWindowChange = (callback) => {
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
} */

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

/* export const fullVH = () => {
  return Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  )
} */

export const isMobile = (
  window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth
) <= breakpointPhone


export const timeflow = {
  back (timing) {
    return (x) => 1 - timing(1 - x)
  },
  backAndForth (timing) {
    return (x) => {
      if (x < .5) return timing(2 * x) / 2
      else return (2 - timing(2 * (1 - x))) / 2
    }
  },
  forthAndBack (timing) {
    return (x) => {
      if (x < .5) return (2 - timing(2 * (1 - x))) / 2
      else return timing(2 * x) / 2
    }
  }
}

export const timings = {
  linear (x) { return x },
  arc (x) { return 1 - Math.sin(Math.acos(x))},
  power (power) { 
    return (x) => Math.pow(x, power)
  },
  backBowShoot (a) {
    return (x) => Math.pow(x, 2) * ((a + 1) * x - a) 
  },
  bounce (x) {
    for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
      if (x >= (7 - 4 * a) / 11) {
        return -Math.pow((11 - 6 * a - 11 * x) / 4, 2) + Math.pow(b, 2)
      }
    }
  },
  elastic (a) {
    return (x) => Math.pow(2, 10 * (x - 1)) * Math.cos(20 * Math.PI * a / 3 * x)
  }
}

export const animate = (
  callback, 
  duration = 1000, 
  timing = timeflow.backAndForth(timings.arc)
) => {
  let start = performance.now()
  requestAnimationFrame(function anim (timestamp) {
    let timeFraction = (timestamp - start) / duration
    if (timeFraction > 1) timeFraction = 1
    let progress = timing(timeFraction)
    //console.log(progress)
    callback(progress)
    if (timeFraction < 1) requestAnimationFrame(anim)
  })
}
