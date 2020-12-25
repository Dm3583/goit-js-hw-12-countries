import PNotify from 'pnotify/dist/es/PNotify.js';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons.js';
import refs from './refs';
import countriesListTpl from '../templates/countriesList.hbs';
import countryTpl from '../templates/countryInf.hbs';
import fetchCountries from './fetchCountries';

const debounce = require('lodash.debounce');

const debouncedSearch = debounce(searchForQuery, 500);

function notificationClose() {
    const closeNotifyBtn = document.querySelectorAll('.ui-pnotify-closer');
    if (closeNotifyBtn) {
        closeNotifyBtn.forEach(e => e.click());
    }
};

function clearResults() {
    refs.root.innerHTML = '';
};

function renderElements(data, template) {
    const markup = template(data);
    refs.root.insertAdjacentHTML('afterbegin', markup);
}

function searchForQuery(e) {
    let query = e.target.value;
    if (query != '') {
        fetchCountries(query)
            .then(data => {
                if (data.length > 10) {
                    PNotify.error({
                        text: "Too many matches found. Please enter a more specific query!",
                        delay: 4000,
                        shadow: true
                    });
                    clearResults();
                    return;
                }
                if (data.length >= 2) {
                    notificationClose();
                    clearResults();
                    renderElements(data, countriesListTpl);
                    data.forEach(el => {
                        if (query.toLowerCase() === el.name.toLowerCase()) {
                            renderElements(el, countryTpl);
                        }
                    });
                } else {
                    notificationClose();
                    clearResults();
                    renderElements(data[0], countryTpl)
                }
            })
            .catch(e => {
                notificationClose();
                clearResults();
                PNotify.error({
                    text: e,
                    delay: 4000,
                    shadow: true
                });
            });
    } else {
        notificationClose();
        clearResults();
    }
};

refs.input.addEventListener('input', debouncedSearch);


