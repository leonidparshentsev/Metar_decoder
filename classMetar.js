

// Пофиксить регулярку, которая ловит смену направоения ветра в блоке RMK

export class Metar {
    constructor(obj) {
        this.airportData = {
            icao : obj.icao,
            observed : obj.observed ? obj.observed : '',
            airportName : obj.station.name,
            airportLocation : obj.station.location,
            metarCode : obj.raw_text,
            flightCategory : obj.flight_category ? obj.flight_category : '',
        }

        this.windData = {
            windDirection : obj.wind?.degrees ? obj.wind.degrees : '',
            windSpeedKts : obj.wind?.speed_kts ? obj.wind.speed_kts : '',
            windSpeedMps : obj.wind?.speed_mps ? obj.wind.speed_mps : '',
            windGustKts : obj.wind?.gust_kts ? obj.wind.gust_kts : '',
            windGustMps : obj.wind?.gust_mps ? obj.wind.gust_mps : '',
        }

        this.visibilityMeters = obj.visibility?.meters ? obj.visibility.meters : '',

        this.cloudsData = {
            ceilingText : obj.ceiling?.text ? obj.ceiling.text : '', //Broken
            ceilingFeet : obj.ceiling?.feet ? obj.ceiling.feet : '', // 1100
            cloudsList : obj.clouds ? obj.clouds : [], //List with clouds
        }

        this.conditionsData = {
            conditions : obj.conditions ? obj.conditions : [],//RA
            tempCels : obj.temperature?.celsius ? obj.temperature.celsius : '',
            dewpointCels : obj.dewpoint?.celsius ? obj.dewpoint.celsius : '',
            humidity : obj.humidity?.percent ? obj.humidity.percent : '',
            baroHpa : obj.barometer?.hpa ? obj.barometer.hpa : '', //1012 hPa
            baroHg : obj.barometer?.hg ? obj.barometer.hg : '' //29.88 inch
        }
    }

    appendMetar(parentNode) {
        let metarTitle = this.makeMetarTitleNode();
        let metarObservation = this.makeObservationNode();
        
        parentNode.innerHTML = ``;
        parentNode.appendChild(metarTitle);
        parentNode.appendChild(metarObservation);
    }

    makeMetarTitleNode() {
        let data = this.airportData;
        let container = this.createElement('div', 'output__header_container container');
        let headerBlock = this.createElement('h2', 'header__output_title output_title title');
        let metarBlock = this.createElement('p', 'header__output_text output_text text metar');
        let textBlock = this.createElement('p', 'header__output_text output_text text');

        let [date, time] = data.observed.match(/[^T]+/g);
        time = time.match(/\d\d:\d\d/)[0];
        


        headerBlock.innerHTML = `${data.icao} · ${data.airportName} · ${data.flightCategory}`;
        metarBlock.innerHTML = `METAR: ${data.metarCode}`;

        textBlock.innerHTML = `This aviation weather observation was made for ${data.airportName} on ${date}, ${time} UTC.`;

        container.appendChild(headerBlock);
        container.appendChild(metarBlock);
        container.appendChild(textBlock);

        return container;
    }

    makeObservationNode() {
        let container = this.createElement('div', 'output__main_container container');
        let headerBlock = this.createElement('h2', 'main__output_title output_title title');

        headerBlock.innerHTML = `Airport observations`;

        let windBlock = this.prepareWindBlock();
        let visibilityBlock = this.prepareVisibilityBlock(); 
        let cloudsBlock = this.prepareCloudsBlock();
        let conditionsBlock = this.prepareConditionsBlock();
        
        container.appendChild(headerBlock);
        container.appendChild(windBlock);

        if(visibilityBlock) container.appendChild(visibilityBlock);

        container.appendChild(cloudsBlock);
        container.appendChild(conditionsBlock);

        return container;
    }

    prepareWindBlock() {
        let data = this.windData;
        let textBlock = this.createElement('p', 'main__output_text output_text text');
        let windText = '';

        // убираем из выборки порывы ветра в RMK, забираем только общие на данный момент
        let variesWind = this.airportData.metarCode.slice(0,32).match(/\d{3}V\d{3}/);

        if(data.windSpeedKts > 2 && data.windDirection !== 0) {
            if(data.windGustKts !== '') {
                windText = `The wind is from direction ${data.windDirection}° with a speed of ${data.windSpeedKts} kt. Wind gusts of ${data.windGustKts} kt have been measured. `;
            } else {
                windText = `The wind is from direction ${data.windDirection}° with a speed of ${data.windSpeedKts} kt. `;
            }
        } else {
            windText = `There is little or no wind from a variable direction. `;
        }

        if(variesWind !== null) {
            let [from, to] = variesWind[0].match(/\d{3}/g);
            windText += `The wind direction varies between ${from}° and ${to}°.`
        }

        textBlock.innerHTML = windText;

        return textBlock;
    }

    prepareVisibilityBlock() {
        let textBlock = this.createElement('p', 'main__output_text output_text text');
        let isCAVOK = this.checkCAVOK();
        let visibility = this.visibilityMeters;

        if(!isCAVOK) {
            if(visibility === '10,000+') {
                textBlock.innerHTML = `Visibility is 10,000 meters or more.`;
                return textBlock;
            } else {
                textBlock.innerHTML = `Visibility is ${visibility} meters.`;
                return textBlock;                
            }

        } else return false;
    }

    prepareCloudsBlock() {
        let textBlock = this.createElement('p', 'main__output_text output_text text');
        let isCAVOK = this.checkCAVOK();
        let cloudsText = this.prepareCloudsText();

        if(isCAVOK) {
            textBlock.innerHTML = this.textCAVOK;
        } else {
            textBlock.innerHTML = cloudsText;
        }

        return textBlock;
    }

    prepareCloudsText() {
        let data = this.cloudsData;
        let cloudsArr = data.cloudsList;
        let text = 'There are ';

        switch (cloudsArr.length) {
            case 1:
                text += `${returnCloudsTextSample(cloudsArr[0])}. `
                break;
            default:
                text += cloudsArrayIterate(cloudsArr);
                break;
        }

        if(data.ceilingText.length > 0) {
            text += `The ceiling, ${data.ceilingText.toLowerCase()}, is ${data.ceilingFeet} ft.`
        } else {
            text += `No ceiling has been observed.`
        }

        return text;

        function returnCloudsTextSample(clouds) {

            if(clouds.text === 'Clear skies') {
                return `${clouds.text.toLowerCase()}`;
            } else {
                return `${clouds.text.toLowerCase()} clouds at an altitude of ${clouds.feet} ft`;
            }


        }

        function cloudsArrayIterate(arr) {
            let text = '';

            for(let i = 0; i < arr.length; i++) {
                if(i === arr.length - 2) {
                    text += `${returnCloudsTextSample(arr[i])} and `; 
                } else if(i === arr.length - 1) {
                    text += `${returnCloudsTextSample(arr[i])}. `;
                } else {
                    text += `${returnCloudsTextSample(arr[i])}, `;
                }
            }

            return text;
        }

    }

    prepareConditionsBlock() {
        let textBlock = this.createElement('p', 'main__output_text output_text text');
        let conditionsText = this.prepareConditionsText();

        textBlock.innerHTML = conditionsText;
        return textBlock;
    }

    prepareConditionsText() {
        let data = this.conditionsData;
        let conditionsArr = data.conditions;
        let text = '';

        if(conditionsArr.length > 0) {
            text += conditionsArrayIterate(conditionsArr);
        }

        text += `The temperature is ${data.tempCels}°C. The dew point is ${data.dewpointCels}°C`;
        
        if(data.humidity !== '') {
            text += `, the relative humidity is ${data.humidity}%`;
        }

        text += `. The air pressure at sea level is ${data.baroHpa} hPa (QNH).`;

        return text;

        function conditionsArrayIterate(arr) {
            let text = 'Current weather is ';

            for(let i = 0; i < arr.length; i++) {
                if(i === arr.length - 1) {
                    text += `${arr[i].text.toLowerCase()}. `;
                } else {
                    text += `${arr[i].text.toLowerCase()}, `;
                }
            }

            return text;
        }
    }

    checkCAVOK() {
        let data = this.cloudsData;
        if(data.cloudsList[0]?.code === 'CAVOK') return true
        else false
    }

    textCAVOK = `The weather is CAVOK. That means there are no clouds below 5,000 ft or the MSA (minimum safe altitude), whichever is higher. This also means that no cumulonimbus or towering cumulus clouds have been observed and the visibility is 10 km or more or more. Furthermore, there can't be fog, precipitation nor other significant weather.`;

    createElement(tagName, className) {
        let element = document.createElement(tagName);
        element.className = className;
        return element;
    }
}