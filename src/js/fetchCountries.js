import PNotify from 'pnotify/dist/es/PNotify.js';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons.js';
import refs from './refs';
import countriesListTpl from '../templates/countriesList.hbs';
import countryTpl from '../templates/countryInf.hbs';



// console.log(refs);
console.log(countriesListTpl);
const debounce = require('lodash.debounce');

const debouncedSearch = debounce(searchForQuery, 1000)

function searchForQuery(e) {
    let query = e.target.value;
    if (query != '') {
        fetchCountries(query);
    };
};


refs.input.addEventListener('input', debouncedSearch);


function fetchCountries(searchQuery) {
    return fetch(`https://restcountries.eu/rest/v2/name/${searchQuery}`)
        .then(status)
        .then(response => response.json())
        .then(data => {
            if (data.length > 10) {
                return PNotify.error({
                    text: "Too many matches found. Please enter a more specific query!",
                    delay: 4000,
                    shadow: true
                });
            }
            if (data.length >= 2) {
                console.log(data);
                const country = data.map(el => el.name)
                const countriesListMarkup = countriesListTpl(country);
                console.log(countriesListMarkup);
                refs.root.insertAdjacentHTML('afterbegin', countriesListMarkup)
            }
            const country = countryTpl(data[0])
            console.log(data);

            refs.root.insertAdjacentHTML('afterbegin', country)
        })

        .catch(e => {
            console.log("CATCH", e);
            PNotify.error({
                text: e,
                delay: 4000,
                shadow: true
            });
            return e;
        });

};

function status(response) {
    if (response.ok) {
        return response;
    }
    return response.json().then(res => Promise.reject(res.message));
}
// refs.input.removeEventListener('input', searchForQuery);
// console.log(debounce);

// fetchCountries('switz')