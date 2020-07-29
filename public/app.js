const init = () => {

    updateUrlsList();
};

const updateUrlsList = async () => {
    const urls = await getAppliedCorsUrls();

    if (urls.length > 0) {
        const ul = document.getElementById('listUrls');
        ul.innerHTML = '';

        urls.map(url => {
            const li = document.createElement('li');
            const liText = document.createTextNode(url.original);
            li.appendChild(liText);

            ul.appendChild(li);
        });
    }
};

const getAppliedCorsUrls = async () => {
    return fetch('/api/getUrls').then(response => response.json());
};

init();