import {Metar} from "./classMetar.js";

const searchInput = document.querySelector('.input_icao');
const invalidInputMessage = document.querySelector('.search__invalid_input');
const searchForm = document.querySelector('.header__search');

const output = document.querySelector('.output_container');
const loadingBlock = document.querySelector('.output__loading');

document.addEventListener('DOMContentLoaded', async (event) => {
    addMetarDataToHTML('UUEE', output);
});

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    let icaoCode = event.target[0].value;
    addMetarDataToHTML(icaoCode, output);
});

searchInput.addEventListener('keydown', (event) => {
    removeInvalidInputMessage();
});

searchInput.addEventListener('focus', (event) => {
    removeInvalidInputMessage();
});


async function addMetarDataToHTML(icaoCode, parentNode) {
    let metar = await decodeMetar(icaoCode);
    
    if(metar === undefined) {
        console.log('Metar data didn`t recieve');
        return;
    }
    metar.appendMetar(parentNode);
}

async function decodeMetar(icaoCode) {

    setLoadingBlockHeight(loadingBlock);
    loadingBlock.classList.toggle('hidden');
    let fetchResult = await fetchMetarData(icaoCode);
    loadingBlock.classList.toggle('hidden');

    if(fetchResult === undefined) {
        showInvalidInputMessage();
        return;
    }

    return new Metar(fetchResult);
}

async function fetchMetarData(icaoCode) {

    icaoCode = icaoCode.toUpperCase();

    let fetchUrl = `https://api.checkwx.com/metar/${icaoCode}/decoded`;
    let fetchOptions = {
        method: 'GET',
        headers: { 'X-API-Key': 'b15c0357fd1f447184452fe23a',},
    }
    
    try {
        let response = await fetch(fetchUrl, fetchOptions);
        let result = await response.json(); 

        return result.data[0];
    } catch (error) {
        console.log('Fetch error:', error);
    }
}

function setLoadingBlockHeight(elem) {
    const outputHeader = document.querySelector('.output__header_container');
    const outputMain = document.querySelector('.output__main_container');
    
    if(!outputHeader || !outputMain) return;

    let height = outputHeader.offsetHeight + outputMain.offsetHeight;
    elem.style = `height: ${height}px;`;
}

function showInvalidInputMessage() {
    searchForm.classList.toggle('invalid_icao');
        
    invalidInputMessage.classList.remove('hidden');
    setTimeout(() => invalidInputMessage.classList.add('hidden'), 3000);
}

function removeInvalidInputMessage() {
    searchForm.classList.remove('invalid_icao');
    invalidInputMessage.classList.add('hidden');
}