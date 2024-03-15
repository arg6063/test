const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const appDetailsContainer = document.getElementById('appDetails');

let appList; // Variable to store the loaded app list

// Fetch the app list JSON file
fetch('https://raw.githubusercontent.com/arg6063/test/main/appList.json')
    .then(response => response.json())
    .then(data => {
        appList = data.applist.apps; // Store the app list data
    })
    .catch(error => {
        console.error('Error fetching app list:', error);
    });

searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.toLowerCase();
    const matchingApps = appList.filter(app => {
        return app.name.toLowerCase().includes(searchText) || app.appid.toString().includes(searchText);
    });

    // Display search suggestions
    displaySearchSuggestions(matchingApps.slice(0, 5));
});

function displaySearchSuggestions(apps) {
    searchSuggestions.innerHTML = ''; // Clear previous suggestions

    if (apps.length === 0) {
        return; // No suggestions to display
    }

    apps.forEach(app => {
        const suggestion = document.createElement('div');
        suggestion.classList.add('suggestion');
        suggestion.dataset.appid = app.appid;
        suggestion.textContent = app.name;
        suggestion.addEventListener('click', () => {
            const appId = suggestion.dataset.appid;
            fetchAppDetails(appId);
        });
        searchSuggestions.appendChild(suggestion);
    });
}

function fetchAppDetails(appId) {
    fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`)
        .then(response => response.json())
        .then(data => {
            const appData = data[appId].data;
            appDetailsContainer.innerHTML = `
                <h3>${appData.name}</h3>
                <p>${appData.detailed_description}</p>
                <p>Supported Languages: ${appData.supported_languages}</p>
                <img src="${appData.header_image}" alt="Header Image">
            `;
            // You can add more details as needed
        })
        .catch(error => {
            console.error('Error fetching app details:', error);
        });
}
