export function loadData() {
    fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json").then(response => response.json()).then(createPage)
}

let allJson = []
let tableJson = []
let matchingJson = []
let currentPage = 1

function createPage(json) {
    allJson = json
   
    // window.allJson = json


    const page = document.getElementById('page')

    function updatePage(tableJson) {
        let size;
        if (pageSizeElement.value === 'all') {
            tableJson = matchingJson
            size = matchingJson.length
        } else {
            size = parseInt(pageSizeElement.value)
            // page = 1
            // pageSize = 10
            // heroes = 100
            // page1 => slice(0, 10)
            // page2 => slice(10, 20)
            tableJson = matchingJson.slice((currentPage-1)*size, currentPage*size)
        }

        console.log('length:', matchingJson.length, " size:", size)

        const lastPage = Math.ceil(matchingJson.length/size)

        page.textContent = currentPage.toString() + ' of ' + lastPage
        if (currentPage === 1) {
            document.getElementById('previous').disabled = true
        } else {
            document.getElementById('previous').disabled = false
        }
        
        if (currentPage === lastPage) {
            document.getElementById('next').disabled = true
        } else {
            document.getElementById('next').disabled = false
        }

        if (currentPage > lastPage || currentPage < 1) {
            currentPage = lastPage
            setTimeout(() => {
                updatePage(tableJson)
            }, 1);
        }
    
        updateTable(tableJson)
    }

    // Listen for search events
    const searchElement = document.getElementById('search');
    searchElement.addEventListener('input', (e) => {

        console.log('searching:', searchElement.value)

        const search = searchElement.value;
        const tableJson = allJson.filter(hero => {
            return hero.name.includes(search)
        })

        matchingJson = tableJson
        // updateTable(tableJson)
        updatePage(tableJson)

    })

    const previousbuttonElement = document.getElementById('previous')
    previousbuttonElement.addEventListener('click', (e) => {

        currentPage--
        updatePage(matchingJson)
    })

    const nextButtonElement = document.getElementById('next')
    nextButtonElement.addEventListener('click', (e) => {
        
        currentPage++
        updatePage(matchingJson)
    })

    const pageSizeElement = document.getElementById('pageSize')
    pageSizeElement.addEventListener('change', (e) => {
        console.log('elements per page:', pageSizeElement.value)
        // updateTable(tableJson)
        // updatePage(tableJson)

        const search = searchElement.value;
        const tableJson = allJson.filter(hero => {
            return hero.name.includes(search)
        })
        matchingJson = tableJson

        // updateTable(tableJson)
        updatePage(tableJson)

    })

    // updateTable(allJson)
    matchingJson = allJson
    updatePage(allJson)
}

function updateTable(json) {
    json.sort((a, b) => {
        if(a.name > b.name){
            return 1
        } else if (a.name < b.name) {
            return -1
        } else {
            return 0;
        }
    })
    
    const tableBody = document.querySelector('#superhero-table > tbody')
    tableBody.innerHTML = ''

    json.map(data => {
        const row = document.createElement('tr')
        const arrShow = [".images.xs", ".name", ".biography.fullName", ".powerstats", ".appearance.race", ".appearance.gender", ".appearance.height", ".appearance.weight", ".biography.placeOfBirth", ".biography.alignment"]
        arrShow.map(show => {
            const col = document.createElement('td')
            const key = show.split('.')
            if (show === ".images.xs") {
                const img = document.createElement('img')
                img.src = data[`${key[1]}`][`${key[2]}`]
                row.append(img)
            } else if (show === ".powerstats") {
                // need reform
                for (const [stat, value] of Object.entries(data[`${key[1]}`])) {
                    // console.log(data.name, stat, value)
                    col.textContent += `${stat}: ${value}\n`
                }
                row.append(col)
            } else {
                col.textContent = key.length === 2 ? data[`${key[1]}`] : data[`${key[1]}`][`${key[2]}`]
                row.append(col)
            }
        })
        tableBody.append(row)
    })

    tableJson = json
}
