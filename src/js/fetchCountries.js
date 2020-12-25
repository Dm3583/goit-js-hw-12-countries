
function status(response) {
    if (response.ok) {
        return response;
    }
    return response.json().then(res => Promise.reject(res.message));
};

export default function fetchCountries(searchQuery) {
    return fetch(`https://restcountries.eu/rest/v2/name/${searchQuery}`)
        .then(status)
        .then(response => response.json())
};


