'use strict'
const STORAGE_KEY = 'carDB'
const gVendors = ['audi', 'fiat', 'suzuki', 'honda']
const PAGE_SIZE = 5

var gPageIdx = 0
var gCars
var gFilterBy = { vendor: '', minSpeed: 0 }

_createCars()

function getVendors() {
    return gVendors
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gCars.length) {
        gPageIdx = 0
    }
}

function getCars() {
    var cars = gCars.filter(
        car => car.vendor.includes(gFilterBy.vendor) && car.maxSpeed >= gFilterBy.minSpeed
    )

    var startIdx = gPageIdx * PAGE_SIZE
    return cars.slice(startIdx, startIdx + PAGE_SIZE)
}

function deleteCar(carId) {
    const carIdx = gCars.findIndex(car => carId === car.id)
    gCars.splice(carIdx, 1)
    _saveCarsToStorage()
}

function addCar(vendor) {
    const car = _createCar(vendor)
    gCars.unshift(car)
    _saveCarsToStorage()
    return car
}

function getCarById(carId) {
    const car = gCars.find(car => carId === car.id)
    return car
}

function updateCar(carId, newSpeed) {
    const car = gCars.find(car => car.id === carId)
    car.maxSpeed = newSpeed
    _saveCarsToStorage()
    return car
}

function setCarFilter(filterBy = {}) {
    gPageIdx = 0
    if (filterBy.vendor !== undefined) gFilterBy.vendor = filterBy.vendor
    if (filterBy.minSpeed !== undefined) gFilterBy.minSpeed = filterBy.minSpeed
    return gFilterBy
}

function setCarSort(sortBy = {}) {
    gPageIdx = 0
    if (sortBy.maxSpeed !== undefined) {
        gCars.sort((c1, c2) => (c1.maxSpeed - c2.maxSpeed) * sortBy.maxSpeed)
    } else if (sortBy.vendor !== undefined) {
        gCars.sort((c1, c2) => c1.vendor.localeCompare(c2.vendor) * sortBy.vendor)
    }
}

function _createCar(vendor) {
    return {
        id: makeId(),
        vendor,
        maxSpeed: getRandomIntInclusive(50, 250),
        desc: makeLorem(),
    }
}

function _createCars() {
    var cars = loadFromStorage(STORAGE_KEY)
    // Nothing in storage - generate demo data
    if (!cars || !cars.length) {
        cars = []
        for (let i = 0; i < 21; i++) {
            var vendor = gVendors[getRandomIntInclusive(0, gVendors.length - 1)]
            cars.push(_createCar(vendor))
        }
    }
    gCars = cars
    _saveCarsToStorage()
}

function _saveCarsToStorage() {
    saveToStorage(STORAGE_KEY, gCars)
}
