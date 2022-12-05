'use strict'

function showElem(querySelector) {
    document.querySelector(querySelector).classList.remove('hide')
}
function hideElem(querySelector) {
    document.querySelector(querySelector).classList.add('hide')
}

function getRandomId() {
    const min = 100000
    const max = 999999
    return Math.floor(Math.random() * (max - min + 1) + min)
}
