export const timeflow = {
  back (timing) {
    return (x) => 1 - timing(1 - x)
  },
  backAndForth (timing) {
    return (x) => {
      if (x < 0.5) return timing(2 * x) / 2
      else return (2 - timing(2 * (1 - x))) / 2
    }
  },
  forthAndBack (timing) {
    return (x) => {
      if (x < 0.5) return (2 - timing(2 * (1 - x))) / 2
      else return timing(2 * x) / 2
    }
  }
}

export const timings = {
  linear: (a) => {
    return (x) => a * x
  },
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
    callback(progress)
    if (timeFraction < 1) requestAnimationFrame(anim)
  })
}

export const animateV = (
  callback,
  duration = 1000,
  timing1 = timings.power(2),
  timing2 = timings.power(4)
) => {
  let start = performance.now()
  requestAnimationFrame(function anim (timestamp) {
    let timeFraction = (timestamp - start) / duration
    if (timeFraction > 1) timeFraction = 1
    let progress = timeFraction < 0.5
      ? timing1(2 * timeFraction) / 2
      : (2 - timing2(2 * (1 - timeFraction))) / 2
    callback(progress)
    if (timeFraction < 1) requestAnimationFrame(anim)
  })
}
