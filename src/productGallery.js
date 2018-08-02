
import { qs, qsAll, onWindowChange } from './helpers'
import { animate, animateV, timeflow, timings } from './animate'

export const productGallery = (animationDuration) => {
  const overline = qs('[data-js="products-nav-hover"]')

  function idFromHref (href) {
    return href.replace(/.+#(.+)/g, '$1')
    // return href.match(/(?<=#).*/g) // alternative
  }

  const productsIDs = [...qsAll('.products-nav__ul a')]
    .map(c => idFromHref(c.href))

  function elementLeft (htmlEl) {
    if (!htmlEl) throw new Error('invalid or no input')
    const rect = htmlEl.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    return rect.left + scrollLeft
  }

  const images = qs('[data-js="product-images"]')
  const frameWidth = 25
  const screenWidth = qs('[data-js="screen-width"]').offsetWidth - 2 * frameWidth
  const productsTabs = [...qsAll('[data-js="product-data"]')]
  let nextTab

  function changeProduct (e) {
    
  }
  

  qs('.products-nav__ul').addEventListener('click', (e) => {
    e.preventDefault()
    if (e.target.classList.contains('products-nav__ul')) { return false }

    overline.style.left = `${e.target.offsetLeft - elementLeft(qs('.products-nav__ul'))}px`
    overline.style.width = `${e.target.offsetWidth}px`

    const nextIndex = productsIDs
      .findIndex(id => id === idFromHref(e.target.href))

    images.style.left = `${-(productsIDs.length - nextIndex - 1) * screenWidth + frameWidth}px`

    /**
     * animation of left column
     */
    nextTab = productsTabs[nextIndex]
    const otherTabs = productsTabs.filter(t => t !== nextTab)
    animate(p => {
      nextTab.style.opacity = p
      otherTabs.forEach(t => {
        t.style.opacity = t.style.opacity > 0.01 ? 1 - p : 0 
      })
    }, animationDuration, timeflow.backAndForth(timings.power(1)))
  })

  qs('[data-js="btn-next-product"]').addEventListener(() => {

  })

  qs('[data-js="btn-previous-product"]').addEventListener(() => {

  })

  ;(() => {
    overline.style.width = `${qs('.products-nav__ul li').offsetWidth}px`
    images.style.left = `${frameWidth}px`
    productsTabs[0].style.opacity = '1'
  })()
}
