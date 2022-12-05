'use strict'

const PAGE_SIZE = 6
const STORAGE_KEY = 'booksDB'
const STORAGE_FAV_LAYOUT_KEY = 'favLayout'
var gBooks
var gCurrBook
var gFilterBy
var gSearchQuery
var gPageIdx = 0

_createBooks()

function _createBook(
    name,
    price,
    imgUrl = 'https://m.media-amazon.com/images/I/51LmgiCLvZL.jpg'
) {
    return {
        id: getRandomId(),
        name,
        price,
        imgUrl,
        rating: 0,
    }
}

function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY)
    if (!gBooks || gBooks.length === 0) {
        gBooks = [
            _createBook(
                'The Theory of Poker',
                '69.90',
                'https://m.media-amazon.com/images/I/81x5VBMKSIL.jpg'
            ),
            _createBook(
                'The Mathematics Of Poker',
                '99.90',
                'https://m.media-amazon.com/images/I/51yepflr2QL._AC_SY780_.jpg'
            ),
            _createBook(
                "No Limit Hold 'em",
                '59.90',
                'https://m.media-amazon.com/images/I/51GbHxa+fUL._AC_SY780_.jpg'
            ),
            _createBook(
                "Harrington on Hold 'em Vol I",
                '99.90',
                'https://m.media-amazon.com/images/I/51Mhy38wxOL._AC_SY780_.jpg'
            ),
            _createBook(
                'Poker Plays You Can Use',
                '29.90',
                'https://m.media-amazon.com/images/I/51UeYhIZ0RL._AC_SY780_.jpg'
            ),
            _createBook(
                "Small Stakes No-Limit Hold'em",
                '99.90',
                'https://m.media-amazon.com/images/I/41l8wmHomnL.jpg'
            ),
        ]
    }
    saveToStorage(STORAGE_KEY, gBooks)
}

function getBooks() {
    var resBooks = JSON.parse(JSON.stringify(gBooks)) // Deep copy
    if (gSearchQuery != null) {
        resBooks = resBooks.filter(book => {
            return book.name.toLowerCase().includes(gSearchQuery)
        })
    }
    if (gFilterBy === 'price') {
        resBooks.sort((book1, book2) => book1.price - book2.price)
    }

    if (gFilterBy === 'rating') {
        resBooks.sort((book1, book2) => book2.rating - book1.rating)
    }
    var startIdx = gPageIdx * PAGE_SIZE
    return resBooks.slice(startIdx, startIdx + PAGE_SIZE)
}

function removeBook(id) {
    gBooks.splice(
        gBooks.findIndex(book => book.id === id),
        1
    )
    saveToStorage(STORAGE_KEY, gBooks)
    renderBooks()
}

function addBook(name, price) {
    gBooks.push(_createBook(name, price))
    saveToStorage(STORAGE_KEY, gBooks)
}

function updateBook(id, price) {
    const book = gBooks.find(book => book.id === id)
    book.price = price
    saveToStorage(STORAGE_KEY, gBooks)
    renderBooks()
}

function updateBookScore(inc) {
    if ((gCurrBook.rating >= 10 && inc >= 0) || (gCurrBook.rating <= 0 && inc <= 0)) {
        return
    }
    gCurrBook.rating += inc
    saveToStorage(STORAGE_KEY, gBooks)
}

function setCurrBook(book) {
    gCurrBook = book
}

function getCurrBook(book) {
    return gCurrBook
}

function setBookFilter(sortMethod) {
    gFilterBy = sortMethod
}

function searchBook(searchWord) {
    gSearchQuery = searchWord
}

function getCurrPageIdx() {
    return gPageIdx
}

function updatePage(inc) {
    gPageIdx += inc
    return gPageIdx
}

function getFavoriteLayoutOption() {
    return loadFromStorage(STORAGE_FAV_LAYOUT_KEY)
}

function saveFavoriteLayoutOption(idx) {
    saveToStorage(STORAGE_FAV_LAYOUT_KEY, idx)
}
