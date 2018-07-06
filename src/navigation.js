import { qs, isMobile } from './helpers'

/**
 * sets sticky navigation
 */
/* export const stickyNav = () => {
  new Waypoint({ // eslint-disable-line
    element: document.querySelector('.js--section-news'),
    handler: (direction) => {
      if (direction === 'down') {
        qs('nav').classList.add('sticky')
        //$('nav').addClass('sticky')
      } else {
        qs('nav').classList.remove('sticky')
        //$('nav').removeClass('sticky')
      }
    },
    offset: '60px'
  })
} */

/**
 * sets mobile navigation
 */
export const mobileNav = () => {
  if (isMobile) {
    $('.js--mobile-nav').click(() => {
      var nav = $('.js--main-nav')
      nav.slideToggle(200)
    })
    $('.js--mobile-nav').click()
  }
}

/**
 * mobile behaviour: closes navigation panel after choosing menu item
 */
/* document.addEventListener("DOMContentLoaded", () => {
  if (isMobile) {
    document.querySelector('.js--main-nav')
    .addEventListener('click', () => {
      setTimeout(() => {
        document.querySelector(`.js--mobile-nav`).click()
      }, 300)
    })
  } 
}) */