'use strict'

function onInit() {
    renderFilterByQueryStringParams()
    onChangeLayout(getFavoriteLayoutOption())
    renderBooks()
    updateUI()
}

function renderBooks() {
    if (document.querySelector('.presentation-button-1').classList.contains('active')) {
        renderBooksCards()
    } else {
        renderBooksTable()
    }
}

function renderBooksTable() {
    const books = getBooks()
    var strHTML = books.map(book => {
        return `
        <tr>
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${book.price}₪</td>
            <td class="action-buttons"><button class="btn read" onclick="onReadBook(${book.id})">Read</button>
            <button class="btn update" onclick="onUpdateBook(${book.id})">Update</button>
            <button class="btn delete" onclick="onRemoveBook(${book.id})">Delete</button>
            </td>
        </tr> 
        `
    })
    strHTML.unshift(`<table>
    <thead>
        <tr class="headings">
            <th>Id</th>
            <th>Title</th>
            <th>Price</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>`)
    strHTML.push(`</tbody>
    </table>`)
    document.querySelector('section.books').innerHTML = strHTML.join('')
}

function renderBooksCards() {
    const books = getBooks()
    var strHTML = ``
    var index = 0
    books.forEach(book => {
        if (index % 3 === 0) strHTML += `<div class="row">`
        strHTML += `
        <div class="card" onclick="onReadBook(${book.id})">
            <div class="book-name">${book.name}</div>
            <img src=${book.imgUrl} onerror="this.src='https://m.media-amazon.com/images/I/51LmgiCLvZL.jpg'">
            <div class="action-buttons"><button class="btn read" onclick="onReadBook(${book.id})">Read</button>
            <button class="btn update" onclick="onUpdateBook(event,${book.id})">Update</button>
            <button class="btn delete" onclick="onRemoveBook(event,${book.id})">Delete</button>
            </div>
            <div class="book-price">${book.price}₪</div>
        </div>`
        if (index % 3 === 2) strHTML += '</div>'
        index++
    })
    strHTML += '</div>'
    document.querySelector('section.books').innerHTML = strHTML
}

function onRemoveBook(ev, id) {
    ev.stopPropagation()
    removeBook(id)
}

function onAddBook() {
    const bookName = document.querySelector('.modal-content  input[name=name]').value
    const bookPrice = document.querySelector('.modal-content  input[name=price]').value
    addBook(bookName, bookPrice)
    renderBooks()
    updateUI()
    onCloseModal()
}

function onCreateBookModal() {
    var strHTML = `<button class="x" onclick="onCloseModal()">✖</button>
    <h2>Adding a new book!</h2>
    <label for="name">Enter Book Name:</label>
    <br>
    <input type="text" name="name" placeholder="The Theory Of Poker">
    <br>
    <label for="price">Enter Book Price: </label>
    <br>
    <input type="text" name="price" placeholder="99.90">
    <button class="btn add-book" onclick="onAddBook()">Add</button>`
    document.querySelector('.modal-content').innerHTML = strHTML

    showElem(`.modal-container`)
    showElem(`.black-tainer`)
}

function onUpdateBook(ev, id) {
    ev.stopPropagation()
    const book = getBooks().find(book => book.id === id)
    const newBookPrice = prompt(`What is the updated price of ${book.name}`)
    updateBook(id, newBookPrice)
}

function onCloseModal() {
    hideElem(`.modal-container`)
    hideElem(`.black-tainer`)
}

function onReadBook(id) {
    const book = getBooks().find(book => book.id === id)
    setCurrBook(book)

    var strHTML = `<h2 class="title">${book.name}</h2>
    <button class="x" onclick="onCloseModal()">✖</button>

    <img src="${book.imgUrl}" alt="" srcset="" class="book-image"
        onerror="this.src='https://m.media-amazon.com/images/I/51LmgiCLvZL.jpg'">
    <p class="content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem quam voluptatum
        magnam sunt corporis sit earum illo laudantium in! Veritatis officiis non est architecto ut asperiores
        aliquam repellat delectus illum provident ab consectetur autem aspernatur eligendi voluptatem, ipsa
        beatae dolore vero obcaecati aperiam maiores? Molestias optio dolores consectetur odio odit minima
        repudiandae dicta quae doloremque quo nihil aperiam atque iusto, est quod, asperiores eveniet dolorum
        quos officiis sapiente! Sint nostrum ea nam excepturi dolore eligendi a, atque exercitationem ullam,
        quas dolorum aspernatur perspiciatis tempore quam voluptate suscipit facere in animi beatae laudantium
        fuga odit! Ex dicta quia laborum esse amet.</p>
    <div class="clear-float"></div>
    <div class="stars-container">
        <button class="btn minus" onclick="reduceRating()">⚊</button>
        <div class="stars">${book.rating}</div>
        <button class="btn plus" onclick="addRating()">╋</button>
    </div>`

    document.querySelector('.modal-content').innerHTML = strHTML

    showElem(`.modal-container`)
    showElem(`.black-tainer`)
}

function addRating() {
    updateBookScore(1)
    updateUI()
}

function reduceRating() {
    updateBookScore(-1)
    updateUI()
}

function updateUI() {
    const nextBtn = document.querySelector('.btn.next')
    const backBtn = document.querySelector('.btn.back')
    nextBtn.disabled = false
    backBtn.disabled = false
    if (getCurrBook()) {
        document.querySelector('.modal-container .stars').innerText = getCurrBook().rating
    }
    const pageIdx = getCurrPageIdx()
    if (pageIdx === 0) {
        backBtn.disabled = true
    }
    // console.log(pageIdx * PAGE_SIZE + PAGE_SIZE, getBooks().length)
    if (pageIdx * PAGE_SIZE + PAGE_SIZE > getBooks().length) {
        nextBtn.disabled = true
    }
}

function onSetSortBy(sortMethod) {
    setBookFilter(sortMethod)
    renderBooks()
    updateURL()
}

function onSearch(searchWord) {
    searchBook(searchWord)
    renderBooks()
    updateURL()
}

function updateURL() {
    const queryStringParams = `?sortBy=${gFilterBy}&search=${gSearchQuery}`
    const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    gSearchQuery = queryStringParams.get('search') || ''
    gFilterBy = queryStringParams.get('sortBy') || ''

    if (!gSearchQuery && !gFilterBy) return

    document.querySelector('.sort-by').value = gFilterBy
    document.querySelector('.search').value = gSearchQuery
}

function onPageNav(inc) {
    updatePage(inc)
    updateUI()
    renderBooks()
}

function onChangeLayout(idx) {
    if (!idx) return
    document
        .querySelectorAll('.presentation-buttons button')
        .forEach(btn => btn.classList.remove('active'))
    document.querySelector(`.presentation-button-${idx}`).classList.add('active')

    saveFavoriteLayoutOption(idx)
    renderBooks()
}
