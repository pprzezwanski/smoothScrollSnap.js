/* import $ from 'jquery'
window.jQuery = $
window.$ = $ */

//import { Waypoint } from 

//require('./../js/vendor/waypoints/noframework.waypoints')
//require('./../js/vendor/waypoints/jquery.waypoints')
//require('./../js/vendor/hammer/hammer.min')
//require('./../js/vendor/hammer/jquery-hammer')

import { onWindowChange } from './helpers'
//import { fullVhFix } from './fixes'
//import { animations } from './animations'

//import { scrollAnimations } from './scrollAnimations'
import { smoothScrollSnap } from './smoothScrollSnap-experiments'
//import { smoothScrollSnap } from './smoothScrollSnap'
import { productGallery } from './productGallery'
//import { newsApp } from './newsApp'
//import { ftcpApp } from './ftcpApp'

import "./../css/style.css"
import "./../css/vendor/ionicons.css"

//onWindowChange(fullVhFix)

import { stickyNav, mobileNav } from './navigation'
// import { productsGallery } from './productGallery'
mobileNav()
//stickyNav()

//scrollAnimations()
smoothScrollSnap()
productGallery(500)
//newsApp()
//ftcpApp()
//animations()

if (module.hot) { module.hot.accept() }

/* const mobileNav = (() => {
    $('.js--mobile-nav').click(() => {
      var nav = $('.js--main-nav')
      nav.slideToggle(200)
    })
  })() */
