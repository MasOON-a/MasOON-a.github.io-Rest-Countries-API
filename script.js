// initial fetch call to get all country data
fetch(`https://restcountries.eu/rest/v2/all`)
.then(response => response.json())
.then(data => {
    let x = 0;
    // iterate through country list in JSON and create new country cell for each
    data.forEach((country) => {
        const countryGrid = document.getElementById('country-grid');
        const countryCell = document.createElement('div'); //div that holds all countries information
        countryCell.id = x;
        countryCell.classList.add('country-cell');
        countryGrid.appendChild(countryCell);
        x++; //incriment iterator

        // give each a click function to call modal
        countryCell.onclick = (click) => {
            modalOpen(data[click.target.id]);
        }

        // creating actual country element
        const countryFlag = document.createElement('div'); //div with background-img of flag
        countryFlag.classList.add('country-flag');
        // country flag
        const countryFlagImg = document.createElement('img'); // img inside of flag div
        countryFlagImg.classList.add('country-flag-img');
        countryFlagImg.src = country.flag;
        countryFlagImg.alt = country.name + 'flag';
        // appending img and info containers into main cont
        const countryInfo = document.createElement('div'); //div that holds all text info
        countryInfo.classList.add('country-info');
        countryCell.appendChild(countryFlag);
        countryCell.appendChild(countryInfo);
        countryFlag.appendChild(countryFlagImg);
        // filling info container
        const countryName = document.createElement('h2'); // country name (parent country Info)
        const countryPopulation = document.createElement('p'); // country population (parent country info)
        const countryRegion = document.createElement('p'); // country region (parent country info)
        const countryCapital = document.createElement('p'); // country capital (parent country info)
        countryName.innerHTML = country.name;
        countryPopulation.innerHTML = '<strong>Population: </strong>' + country.population;
        countryRegion.innerHTML = '<strong>Region: </strong>' + country.region; 
        countryCapital.innerHTML = '<strong>Capital: </strong>' + country.capital;
        countryInfo.appendChild(countryName);
        countryInfo.appendChild(countryPopulation);
        countryInfo.appendChild(countryRegion);
        countryInfo.appendChild(countryCapital);
        // country borders    
    });

})
.catch(err => console.log('Error: ' + err));

// Event Listeners

const borderCountriesCont = document.getElementById('border-cont');
borderCountriesCont.addEventListener('click', (click) => {
    if(click.target.id != 'border-cont'){
        const query = click.target.innerText;
        const endPoint = 'https://restcountries.eu/rest/v2/name/' + query;
        fetch(endPoint)
        .then((response) => {return response.json()})
        .then((data) => {
            modalClose();
            modalOpen(data[0]);
        })
        .catch((error) => {console.log('Error: ' + error)})
    }
});

const searchInput = document.querySelector('#search-input input');
searchInput.addEventListener('keyup', (e) => {
    if(e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode == 8){
        const countryGrid = document.getElementById('country-grid');
        for(let x = 0; x < countryGrid.childNodes.length; x++){
            const countryName = countryGrid.childNodes[x].querySelector('div h2').innerText;
            let inputLength = searchInput.value.length;
            if (countryName.toLowerCase().slice(0, inputLength) != searchInput.value.toLowerCase()){
                countryGrid.childNodes[x].style.display = 'none';
            }
            else{
                countryGrid.childNodes[x].style.display = 'flex';;
            }
        }
    }else if(e.keyCode === 13){
        searchInput.value = '';
    }
});

const dropdownContainer = document.querySelector('.dropdown-container');
dropdownContainer.addEventListener('click', (e) => {
    if(e.target.classList.length === 0){
        regionDropClose();
        const countryGrid = document.getElementById('country-grid');
        for (let x = 0; x < countryGrid.childNodes.length; x++){
            const region = countryGrid.childNodes[x].querySelector('.country-info').childNodes[2].innerText.slice(8);
            if(e.target.innerText != region){
                countryGrid.childNodes[x].style.display = 'none';
            }else{
                countryGrid.childNodes[x].style.display = 'flex';
            }
        }
    }
});


// Functions
function modalOpen (countryObject) {
    // toggle display none for other page elements
    const searchContainer = document.querySelector('.search-container');
    searchContainer.style.display = 'none';
    const countryGrid = document.getElementById('country-grid');
    countryGrid.style.display = 'none';
    // modal whole
    const modal = document.getElementById('modal');
    // modal info entries
    const nam = document.getElementById('nam');
    const nat = document.getElementById('nat');
    const pop = document.getElementById('pop');
    const reg = document.getElementById('reg');
    const sub = document.getElementById('sub');
    const cap = document.getElementById('cap');
    const top = document.getElementById('top');
    const cur = document.getElementById('cur');
    const lan = document.getElementById('lan');
    // flag container
    const modalFlag = document.querySelector('.modal-img-cont img');
    // modal border countries
    const countryBorders = document.getElementById('border-cont');

    modal.style.display = 'flex'; // make modal visible
    // fill country flag
    modalFlag.src = countryObject.flag;
    modalFlag.alt = countryObject.name;
    // fill out country info fields
    nam.innerText = countryObject.name;
    nat.innerHTML = '<strong>Native Name: </strong>' + countryObject.nativeName;
    pop.innerHTML = '<strong>Population: </strong>' + countryObject.population;
    reg.innerHTML = '<strong>Region: </strong>' + countryObject.region;
    sub.innerHTML = '<strong>Sub Region: </strong>' + countryObject.subregion;
    cap.innerHTML = '<strong>Capital: </strong>' + countryObject.capital;
    top.innerHTML = '<strong>Top Level Domain: </strong>' + countryObject.topLevelDomain;
    cur.innerHTML = '<strong>Currency: </strong>' + countryObject.currencies[0].name;
    lan.innerHTML = '<strong>Language: </strong>' + countryObject.languages[0].name;
    // add cells for border countries
    for(let x = 0; x < countryObject.borders.length; x++){
        // querying api
        const query = 'alpha/' + countryObject.borders[x];
        const baseURL = `https://restcountries.eu/rest/v2/`;
        const endpoint = baseURL + query;
        fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            newBorderCell.innerText = data.name;
        })
        .catch(err => console.log('Error: ' + err));

        // creating element
        const newBorderCell = document.createElement('p');
        countryBorders.appendChild(newBorderCell);
    }
}

function modalClose () {
    // toggle display none for other page elements
    const searchContainer = document.querySelector('.search-container');
    searchContainer.style.display = 'flex';
    const countryGrid = document.getElementById('country-grid');
    countryGrid.style.display = 'grid';
    // toggle display of modal elem
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    // reset country borders
    const countryBorders = document.getElementById('border-cont');
    countryBorders.innerHTML = '<span><strong>Border Countries: </strong></span>';
}

function regionDrop (){ //toggle height for region search drop down
    const regionDrop = document.getElementById('region-drop');
    const downArrow = document.querySelector('.region-filter i');
    if(regionDrop.style.height === '180px'){
        regionDrop.style.height = '0px';
        downArrow.style.transform = 'rotate(0deg)';
    }else{
        regionDrop.style.height = '180px';
        downArrow.style.transform = 'rotate(180deg)';
    }
}

function regionDropClose () {
    const regionDrop = document.getElementById('region-drop');
    const downArrow = document.querySelector('.region-filter i');
    if(regionDrop.style.height === '180px'){
        regionDrop.style.height = '0px';
        downArrow.style.transform = 'rotate(0deg)';
    }
}

// close dropdown if its open on click outside dropdown
window.onclick = (click) => {
    const regionDrop = document.getElementById('region-drop');
    const downArrow = document.querySelector('.region-filter i');
    if(regionDrop.style.height === '180px'){ // detects if region dropdown is already open
        if(click.target.parentElement.classList[0] != 'dropdown-container' && click.target.parentElement.id != 'region-drop'){
            regionDrop.style.height = '0px';
            downArrow.style.transform = 'rotate(0deg)';

        }
    }
}