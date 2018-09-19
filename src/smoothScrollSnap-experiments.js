import { isMobile, onWindowChange, qs, qsAll, scrollTo, EventObserver } from './helpers'

import { animate, animateV, timeflow, timings } from './animate'

/**
 * sets smooth page scroll behaviour that scrolls
 * to the next DOM element indicated by conf.selectors argument
 * @param {object} conf - configuration object
 * conf.selectors - array of selectors valid in document.querySelectorAll
 * conf.exclude - array of class names ofDOM elements
 * that should reatin standard scrolling possiblity
 */
export const smoothScrollSnap = (conf = {
  selectors: ['section', 'nav', 'header'],
  exclude: []
}) => {
  const sections = conf.selectors
    ? [...qsAll(`${conf.selectors.join()}`)]
    : [...qsAll('section, nav, header')]
  const exclude = conf.exclude || []
  const alignmentAberration = 5
  let totalScroll = 0
  let timeout

  let blockScroll
  let previousDeltaY = null

  let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  let minScroll = 1 / 2 * viewportHeight - 1 / 2 * (viewportHeight / 900 - 1)

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
      return end <= viewportBottom
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
    }, {
      duration: 700 + 1000 * distance / 4000,
      callbackAfter () {
        //blockScroll = false
        //previousDeltaY = null
      }
    }
    /* 700 + 1000 * distance / 4000 */)
  }

  // function smoothScroll (distance, callback, duration = 200, power = 4) {
  //   const start = window.pageYOffset
  //   animateV(p => {
  //     window.scrollTo(0, p * distance + start)
  //   }, {
  //     duration: 700 + 700 * distance / 4000,
  //     timing1: timings.power(2),
  //     timing2: timings.power(power),
  //     callbackAfter () {
  //       setTimeout(() => { blockScroll = false }, 500)
  //       //blockScroll = false
  //     }
  //   }
  //   /* 700 + 700 * distance / 4000,
  //   timings.power(2),
  //   timings.power(power) */)
  //   const end = start + distance
  //   if (callback) {
  //     setTimeout(() => { callback(end) }, duration)
  //   }
  // }

  /* function isDeltaYConstant (e) {
    if (previousDeltaY === e.deltaY) return true
    previousDeltaY = e.deltaY
  } */

  function isDeltaYAfterMax (e) {
    //const delta = Math.abs(e.deltaY)
    
    /* if (!previousDeltaY) {
      setTimeout(() => {
        previousDeltaY = Math.abs(e.deltaY)
      }, 10)
      return false
    } else {
      if (Math.abs(e.deltaY) <= Math.abs(previousDeltaY)) {
        previousDeltaY = Math.abs(e.deltaY)
        return 'yes'
      } else {
        previousDeltaY = Math.abs(e.deltaY)
        return 'no'
      }
    } */

    if (previousDeltaY) {
      if (Math.abs(e.deltaY) <= Math.abs(previousDeltaY)) {
        //previousDeltaY = Math.abs(e.deltaY)
        return 'yes'
      } else {
        //previousDeltaY = Math.abs(e.deltaY)
        return 'no'
      }
    }
  }

  function unblockScroll (time = 1000) {
    setTimeout(() => { blockScroll = false }, time)
  }

  function scrollCounter (e, callback, interval = 70) {
    e.preventDefault()
    // if (previousDeltaY !== e.deltaY) e.preventDefault()
    /* appleTimeout = setTimeout(() => {
      blockScroll = true
    }, 100) */

    //if (!blockScroll) {
      /* if (isDeltaYAfterMax(e) === 'yes') {
        console.log('yes')
        total = totalScroll
        if (callback) callback(total)
        totalScroll = 0
        blockScroll = true
        previousDeltaY = e.deltaY
      } else  */
    console.log('e.deltaY')
    console.log(e.deltaY)
    console.log('previousDeltaY')
    console.log(previousDeltaY)
      
    if (!previousDeltaY || isDeltaYAfterMax(e) === 'no') {
      let total
      clearTimeout(timeout)
      totalScroll += e.deltaY
      console.log('no')
      console.log(!previousDeltaY)
      timeout = setTimeout(() => {
        total = totalScroll
        if (callback) callback(total)
        totalScroll = 0
        //previousDeltaY = null
      }, interval)
    }
    previousDeltaY = e.deltaY

    //}
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

  function scrollDescisions (
    e, scrollAmount,
    current, closest,
    previous, next,
    direction
  ) {
    if (e.deltaY > 0 &&
      !isSectionEndInView(current.element) &&
      Math.abs(scrollAmount) <= minScroll
    ) {
      if (scrollAmount !== e.deltaY) {
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
        if (scrollAmount !== e.deltaY) {
          scrollAmount = direction * minScroll
        }
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
    })) { return false }

    const current = currentSection(sections)
    const closest = closestSection(sections)
    const previous = previousSection(current, closest).element
    const next = nextSection(current, sections)
    const direction = findDirection(e, current.element)

    //if (isDeltaYConstant) {
    scrollCounter(e, scrollAmount => {
      scrollDescisions(
        e, scrollAmount,
        current, closest,
        previous, next,
        direction
      )
    })
    //} else {

      /* appleTimeout = setTimeout(() => {
        appleTimeout = null
      }, appleWait) */
    }

  

  window.addEventListener('wheel', main)
  window.addEventListener('keydown', (e) => {
    if (
      e.which === 33 || e.keyCode === 33 ||
      e.which === 34 || e.keyCode === 34
    ) { main(e) }
  })
}

/* scrollCounter(e, scrollAmount => {
      if (e.deltaY > 0 &&
        !isSectionEndInView(current.element) &&
        Math.abs(scrollAmount) <= minScroll
      ) {
        if (scrollAmount !== e.deltaY) {
          scrollAmount = direction * minScroll
          //scrollAmount = Math.abs(scrollAmount) <= minScroll
          //  ? direction * minScroll
          //  : direction * viewportHeight
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
            // console.log('previous is NOT taller than viewport')
            alignToViewportTop(previous)
          } else {
            // console.log('previous is taller than viewport')
            alignToViewportBottom(previous)
          }
        } else {
          if (scrollAmount !== e.deltaY) {
            scrollAmount = direction * minScroll
          }
          if (doesScrollGoBeyondElementStart(scrollAmount, current.element)) {
            alignToViewportTop(current.element)
          } else {
            smoothScroll(scrollAmount)
          }
        }
      } else {
        console.log('standard behaviour')
        e.preventDefault()
        if (
          direction < 0 &&
          Math.abs(scrollAmount) > minScroll
        ) {
          // todo
        }
        const destination = findDestination(
          direction,
          sections,
          current.index,
          closest.index
        )
        smoothScrollTo(window.pageYOffset, destination.offsetTop)
      }
    }) */

/* function findDestination (direction, sections, indexOfCurrent, indexOfClosest) {
  let destination
  if (direction > 0) {
    destination = sections[indexOfCurrent + 1] || sections[sections.length - 1]
  }
  if (direction < 0) {
    destination = indexOfCurrent === indexOfClosest
      ? sections[indexOfClosest - 1] || sections[0]
      : sections[indexOfCurrent] || sections[0]
  }
  return destination
} */