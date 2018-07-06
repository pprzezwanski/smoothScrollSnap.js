/**
 * set fallbacks for older systems and devices
 */
const headerFallbacks = (() => {
    const initFullViewHieght = (() => {
        const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        document.querySelector('.header').style.height = `${viewportHeight}px`
        document.querySelector('.header__buttons').style.marginTop = `${0.02 * viewportHeight}px`
    })()
    const initHideQutations = (() => {
        if (navigator.userAgent.match(/Android/i) && navigator.platform.match(/Linux armv7l/i)) {
            document.querySelector('.header__quotations').style.visibility = 'hidden'
            document.querySelector('.header__heading').style.top = '42%'
            document.querySelector('.header__heading').style.left = '6%'
        }
    })()  
})()