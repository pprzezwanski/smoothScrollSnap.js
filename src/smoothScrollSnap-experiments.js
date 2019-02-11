import { onWindowChange, qsAll } from './helpers'
import { animateV, timings } from './animate'

/**
 * sets smooth page scroll behaviour that scrolls
 * to the next DOM element indicated by conf.selectors argument
 * @param {object} conf - configuration object
 * conf.selectors - array of selectors valid in document.querySelectorAll
 * conf.exclude - array of class names ofDOM elements
 * that should reatin standard scrolling possiblity
 */
export const smoothScrollSnap = (conf = {
  selectors: ['section', 'body > nav', 'header'],
  exclude: []
}) => {
  const sections = conf.selectors
    ? [...qsAll(`${conf.selectors.join()}`)]
    : [...qsAll('section, body > nav, header')]
  const exclude = conf.exclude || []
  const alignmentAberration = 5
  let totalScroll = 0
  let timeout

  let previousDeltaY = null
  let previousPreviousDeltaY = null
  let previousPreviousPreviousDeltaY = null

  let previousDeltaYs = [null, null, null, null, null, null]

  let appleScroll = false
  let appleTotalScroll = 0
  let appleBlock = false
  let appleTimeout

  let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  //let minScroll = 1 / 2 * viewportHeight - 1 / 2 * (viewportHeight / 900 - 1)
  let minScroll = 1 / 3 * viewportHeight - 1 / 3 * (viewportHeight / 900 - 1)
  const minDeltaY = 60

  onWindowChange(() => {
    viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    minScroll = 1 / 2 * viewportHeight - 1 / 2 * (viewportHeight / 900 - 1)
  })

  function elementTop (htmlEl) {
    if (!htmlEl) throw new Error('invalid or no input')
    const rect = htmlEl.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    return rect.top + scrollTop
  }

  function isSectionEndInView (htmlEl) {
    if (htmlEl) {
      const end = elementTop(htmlEl) + htmlEl.offsetHeight
      const viewportBottom = window.pageYOffset + viewportHeight
      return end - viewportBottom <=  5 // 5 because of precision problems
    }
  }

  function isSectionStartInView (htmlEl) {
    if (!htmlEl) throw new Error('invalid or no input')
    return (window.pageYOffset - elementTop(htmlEl) <= 5) // 5 because of precision problems
  }

  function isSectionTallerThanViewport (htmlEl) {
    if (!htmlEl) throw new Error('invalid or no input')
    return (htmlEl.offsetHeight - viewportHeight > -1)
  }

  function currentSection (sections) {
    let min, current, index
    sections.forEach((c, i) => {
      const x = window.pageYOffset - c.offsetTop
      if (!current || (x >= 0 && x < min)) {
        min = x
        current = c
        index = i
      }
    })
    // alignment bug fix
    const currentEnd = elementTop(current) + current.offsetHeight
    if (currentEnd - window.pageYOffset < alignmentAberration) {
      current = sections[index + 1] ||
        sections[sections.length - 1]
      index += 1
    }
    return {
      element: current,
      index
    }
  }

  function closestSection (sections) {
    let min, closest, index
    const current = window.pageYOffset
    sections.forEach((c, i) => {
      const x = Math.abs(c.offsetTop - current)
      if (!closest || x < min) {
        min = x
        closest = c
        index = i
      }
    })
    return {
      element: closest,
      index
    }
  }

  function smoothScrollTo (current, destination) {
    const distance = Math.abs(destination - current)
    animateV(p => {
      window.scrollTo(0, p * (destination - current) + current)
    }, { duration: 700 + 1000 * distance / 4000 })
  }

  function smoothScroll (distance, callback, duration = 200, power = 4) {
    const start = window.pageYOffset
    animateV(p => {
      window.scrollTo(0, p * distance + start)
    }, {
      duration: 700 + 700 * distance / 4000,
      timing1: timings.power(2),
      timing2: timings.power(power)
    })
    const end = start + distance
    if (callback) {
      setTimeout(() => { callback(end) }, duration)
    }
  }

  function isDeltaYAfterMax (e) {
    if (previousDeltaY) {

      return (
        Math.abs(e.deltaY + previousDeltaYs[0]) < Math.abs(previousDeltaYs[1] + previousDeltaYs[2])
      )
    }
  }

  function isNextScrollOverlappingCurrentScroll (e) {
    if (!(
      previousDeltaYs[0] && previousDeltaYs[1] && previousDeltaYs[2]
      && previousDeltaYs[3] && previousDeltaYs[4] && previousDeltaYs[5]
    )) return

    return (
      (
        Math.abs(e.deltaY) - Math.abs(previousDeltaYs[0]) >= 10
        && (
          Math.abs(previousDeltaYs[0]) < Math.abs(previousDeltaYs[1]) 
          || Math.abs(previousDeltaYs[0]) === Math.abs(previousDeltaYs[1])
        )
        && (
          Math.abs(previousDeltaYs[1]) < Math.abs(previousDeltaYs[2]) 
          || Math.abs(previousDeltaYs[1]) === Math.abs(previousDeltaYs[2]) === 1
        )
      ) || (
        previousDeltaYs[3] && previousDeltaYs[4] && previousDeltaYs[5]
        && Math.abs(previousDeltaYs[1]) - Math.abs(previousDeltaYs[2]) < 10
        && Math.abs(e.deltaY + previousDeltaYs[0]) > Math.abs(previousDeltaYs[1] + previousDeltaYs[2])
        && (
          Math.abs(previousDeltaYs[2] + previousDeltaYs[3]) < Math.abs(previousDeltaYs[4] + previousDeltaYs[5])
          || (
            Math.abs(previousDeltaYs[2]) === Math.abs(previousDeltaYs[3]) 
            && Math.abs(previousDeltaYs[3]) === Math.abs(previousDeltaYs[4])
            && Math.abs(previousDeltaYs[4]) === Math.abs(previousDeltaYs[5])
          )
        )
      )
    )
  }

  function scrollCounter (e, callback, interval = 70) {
    e.preventDefault()
    let total
    clearTimeout(timeout)
    totalScroll += e.deltaY
    timeout = setTimeout(() => {
      total = totalScroll
      if (callback) callback(total)
      totalScroll = 0
    }, interval)
  }

  function findDirection (e, currentElement) {
    let direction
    if (e.which === 33 || e.keyCode === 33) {
      direction = -1
    } else if (e.which === 34 || e.keyCode === 34) {
      direction = 1
    } else if (e.deltaY) {
      direction = Math.sign(e.deltaY)
    } else {
      return false
    }
    return direction
  }

  const hasDirectionChanged = e => previousDeltaY * e.deltaY < 0

  function alignToViewportBottom (htmlEl) {
    if (!htmlEl) { throw new Error('falsy input. should be html element') }
    const end = elementTop(htmlEl) + htmlEl.offsetHeight
    smoothScrollTo(window.pageYOffset, end - viewportHeight)
  }

  function alignToViewportTop (htmlEl) {
    if (!htmlEl) { throw new Error('falsy input. should be html element') }
    smoothScrollTo(window.pageYOffset, elementTop(htmlEl))
  }

  function doesScrollGoBeyondHtmlEl (scrollAmount, htmlEl) {
    const viewportEnd = window.pageYOffset + viewportHeight
    const htmlElEnd = elementTop(htmlEl) + htmlEl.offsetHeight
    if (
      scrollAmount >= (htmlElEnd - viewportEnd) ||
      htmlElEnd - viewportEnd <= viewportHeight / 2
    ) {
      return true
    } else {
      return false
    }
  }

  function doesScrollGoBeyondElementStart (scrollAmount, htmlEl) {
    const viewportStart = window.pageYOffset
    const htmlElStart = elementTop(htmlEl)
    if (
      scrollAmount >= Math.abs(htmlElStart - viewportStart) ||
      Math.abs(htmlElStart - viewportStart) <= viewportHeight / 2
    ) {
      return true
    } else {
      return false
    }
  }

  function previousSection (current, closest) {
    if (!current) { throw new Error('falsy input 1') }
    if (!closest) { throw new Error('falsy input 2') }
    let previous
    if (isSectionStartInView(current.element)) {
      previous = {
        element: sections[current.index - 1] || sections[0],
        index: current.index - 1 < 0 ? current.index - 1 : 0
      }
    } else {
      previous = current
    }
    if (exclude.find(exc => previous.element.classList.contains(exc.replace('.', ''))
    )) {
      previous = {
        element: sections[previous.index - 1] ||
        sections[0],
        index: previous.index - 1 < 0 ? previous.index - 1 : 0
      }
    }
    return previous
  }

  function nextSection (current, sections) {
    if (!current) { throw new Error('falsy input') }
    return (sections[current.index + 1] || sections[sections.length - 1])
  }

  function appleReset () {
    appleScroll = false
    previousDeltaY = null
    previousPreviousDeltaY = null
    previousDeltaYs = [null, null, null, null, null, null]
    appleBlock = false
  }

  function scrollDecisions (e, scrollAmount) {

    const current = currentSection(sections)
    const closest = closestSection(sections)
    const previous = previousSection(current, closest).element
    const next = nextSection(current, sections)
    const direction = findDirection(e, current.element)

    if (Math.abs(scrollAmount) < minDeltaY) {
      scrollAmount = minDeltaY * direction
    }
    if (e.deltaY > 0 &&
      !isSectionEndInView(current.element) &&
      Math.abs(scrollAmount) <= minScroll
    ) {
      if (scrollAmount === minDeltaY) {
        scrollAmount = direction * minScroll
      }
      if (doesScrollGoBeyondHtmlEl(scrollAmount, current.element)) {
        alignToViewportBottom(current.element)
      } else {
        smoothScroll(scrollAmount)
      }
    } else if (
      e.deltaY < 0 &&
      Math.abs(scrollAmount) <= minScroll
    ) {
      if (
        isSectionStartInView(current.element)
      ) {
        if (!isSectionTallerThanViewport(previous)) {
          alignToViewportTop(previous)
        } else {
          alignToViewportBottom(previous)
        }
      } else {
        if (doesScrollGoBeyondElementStart(scrollAmount, current.element)) {
          alignToViewportTop(current.element)
        } else {
          smoothScroll(scrollAmount)
        }
      }
    } else {
      e.preventDefault()
      if (!direction) { return false }
      const target = direction > 0 ? next : previous
      smoothScrollTo(window.pageYOffset, elementTop(target))
    }
  }

  function main (e) {
    if (exclude.find(exc => {
      return e.target.classList.contains(exc.replace('.', ''))
    })) {
      return false
    }
    e.preventDefault()
    
    if (hasDirectionChanged(e)) appleReset()

    if (isNextScrollOverlappingCurrentScroll(e)) {
      appleReset()
      appleScroll = true
    }

    /* if (appleScroll && 
      Math.abs(previousDeltaY) > 1 &&
      Math.abs(previousDeltaY) - Math.abs(e.deltaY) <= 10 &&
      Math.abs(e.deltaY) === 1) {
      console.log('DELAYED APPLE RESET')
      setTimeout(appleReset, 200)
    } */

    if (
      Math.abs(e.deltaY) <= 4
      && !previousDeltaY
    ) 
    {
      appleScroll = true
    }

    clearTimeout(appleTimeout)
    appleTimeout = setTimeout(appleReset, 300)

    if (appleScroll && !appleBlock) {
      e.preventDefault()
      if (!isDeltaYAfterMax(e)) {
        appleTotalScroll += e.deltaY
      } else {
        //scrollDecisions(e, appleTotalScroll)
        let appleScrollSum = previousPreviousPreviousDeltaY + previousPreviousDeltaY + previousDeltaY + e.deltaY
        //let appleScrollSum = previousDeltaYs[0] + previousDeltaYs[1] + previousDeltaYs[2] + e.deltaY
        if (isNextScrollOverlappingCurrentScroll(e) && Math.abs(appleScrollSum) < minScroll) {
          appleScrollSum = viewportHeight /* minScroll */ 
        }
        scrollDecisions(e, appleScrollSum)
        appleTotalScroll = 0
        appleScrollSum = 0
        appleBlock = true
      }
    }

    if (!appleScroll) {
      scrollCounter(e, scrollAmount => {
        scrollDecisions(e, scrollAmount)
      })
    }

    previousPreviousPreviousDeltaY = previousPreviousDeltaY
    previousPreviousDeltaY = previousDeltaY
    previousDeltaY = e.deltaY

    previousDeltaYs[5] = previousDeltaYs[4]
    previousDeltaYs[4] = previousDeltaYs[3]
    previousDeltaYs[3] = previousDeltaYs[2]
    previousDeltaYs[2] = previousDeltaYs[1]
    previousDeltaYs[1] = previousDeltaYs[0]
    previousDeltaYs[0] = e.deltaY
  }

  window.addEventListener('wheel', main)
  window.addEventListener('keydown', (e) => {
    if (
      e.which === 33 || e.keyCode === 33 ||
      e.which === 34 || e.keyCode === 34
    ) { main(e) }
  })
}