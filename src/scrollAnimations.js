import { dom } from './dom'
import { breakpointPhone } from './config'
import { qs, scrollTo, isMobile } from './helpers'

/**
* sets animations on scroll
*/
export const scrollAnimations = () => {
  // NEWS
  new Waypoint({ // eslint-disable-line
    element: document.querySelector('.js--section-news'),
    handler: (direction) => {
      // if (!isMobile) {
        if (direction === 'down') {
          qs(dom.class.newsContent).classList.add(dom.class.animationFadeIn)
        } else {
          qs(dom.class.newsContent).classList.remove(dom.class.animationFadeIn)
        }
      //}
    },
    offset: '50%'
  })

  

  if (!isMobile) {
    // FTCP CATALOG
    new Waypoint({ // eslint-disable-line
      element: document.querySelector('.js--catalog'),
      handler: (direction) => {
        // if (!isMobile) {
          if (direction === 'down') {
            $('.js--catalog').addClass('animation-fade-in-left')
          } else {
            // $('.js--catalog').addClass('animated fadeOutLeft')
            setTimeout(() => {
              // $('.js--catalog').removeClass('animated fadeOutLeft').removeClass('animated fadeInLeftBig')
              $('.js--catalog').removeClass('animation-fade-in-left')
            }, 600)
          }
        //}
      },
      offset: '80%'
    })



    // FTCP CATALOG INSIDE
    new Waypoint({ // eslint-disable-line
      element: document.querySelector('.js--catalog'),
      handler: (direction) => {
        if (direction === 'down') {
          setTimeout(() => {
            // $('.js--wp-play').addClass('animated fadeIn')
            $('.js--catalog-screen').addClass(dom.class.animationFadeIn)
          }, isMobile ? 200 : 1500)
        } else {
          // $('.js--wp-play').removeClass('animated fadeIn')
          $('.js--catalog-screen').removeClass(dom.class.animationFadeIn)
        }
      },
      offset: '80%'
    })

    // FTCP VIEWER
    new Waypoint({ // eslint-disable-line
      element: document.querySelector('.js--viewer'),
      handler: (direction) => {
        if (direction === 'down') {
          $('.js--viewer').addClass('animation-fade-in-right')
        } else {
          // $('.js--viewer').addClass('animated fadeOutRight')
          setTimeout(() => {
            // $('.js--viewer').removeClass('animated fadeOutRight').removeClass('animated fadeInRightBig')
            $('.js--viewer').removeClass('animation-fade-in-right')
          }, 600)
        }
      },
      offset: '80%'
    })

    // FTCP VIEWER INSIDE
    new Waypoint({ // eslint-disable-line
      element: document.querySelector('.js--viewer'),
      handler: (direction) => {
          if (direction === 'down') {
            setTimeout(() => {
              $('.js--viewer-screen').addClass(dom.class.animationFadeIn)
            }, 1500)
          } else {
            $('.js--viewer-screen').removeClass(dom.class.animationFadeIn)
          }
      },
      offset: '80%'
    })

  }

  /* --------------------------------- */
  /* -------- SCROLL TO LINKS -------- */
  /* --------------------------------- */

  /* --- SCROLL ON BUTTONS --- */
  $('#js--scroll-to-catalog').on('click touchstart', (e) => {
    e.preventDefault()
    let offset = $(window).width() <= breakpointPhone ? 0 : 170
    let scrollToPosition = $('#catalog-content').offset().top - offset
    $('html, body').animate({ scrollTop: scrollToPosition }, 1000)
  })

  $('#js--scroll-to-news').on('click touchstart', (e) => {
    e.preventDefault()
    var scrollToPosition = $('.js--section-news').offset().top - 20
    $('html, body').animate({ scrollTop: scrollToPosition }, 1000)
  })

  // menu scroll
  qs('a[href="#catalog"]').addEventListener('click', (e) => {
    e.preventDefault()
    if (isMobile) { 
      scrollTo('#catalog-content')
    } else {
      scrollTo('#catalog', -15)
    }
  })

  /* --- SCROLL ON LINKS --- */
  $('a[href*="#"]') // Select all links with hashes
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#catalog"]')
    //.not('[href="#f-lightbox"]')
    //.not('[href="#f-lightbox-close"]')
    .not('[href="#0"]')
    .click(function (event) {
      // On-page links
      if (
        location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname // eslint-disable-line
      ) {
        // Figure out element to scroll to
        var target = $(this.hash)
        target = target.length
          ? target
          : $('[name=" + this.hash.slice(1) + "]')
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault()
          $('html, body').animate(
            {
              scrollTop: target.offset().top
            },
            1000,
            function () {
              // Callback after animation
              // Must change focus!
              var $target = $(target)
              $target.focus()
              if ($target.is(':focus')) {
                // Checking if the target was focused
                return false
              } else {
                $target.attr('tabindex', '-1') // Adding tabindex for elements not focusable
                $target.focus() // Set focus again
              }
            }
          )
        }
      }
    })
} // )()
