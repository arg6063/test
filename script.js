const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const appDetailsContainer = document.getElementById('appDetails');

let appList; // Variable to store the loaded app list

// Fetch the app list JSON file
fetch('appList.json')
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

// Function to fetch app details from Steam API
function fetchAppDetails(appid) {
    fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`)
        .then(response => response.json())
        .then(data => {
            const appData = data[appid].data; // Extract app data from the response
            // Update HTML content to display app details
            document.getElementById('app-details').innerHTML = `
                <h2>${appData.name}</h2>
                <p>${appData.short_description}</p>
                <img src="${appData.header_image}" alt="${appData.name}">
                <!-- Add more details as needed -->
            `;
        })
        .catch(error => {
            console.error('Error fetching app details:', error);
        });
}

// Event listener for selecting an app from the search results
document.getElementById('search-results').addEventListener('click', function(event) {
    const selectedApp = event.target.closest('li'); // Get the closest <li> element
    if (selectedApp) {
        const appid = selectedApp.dataset.appid; // Get the appid from the data attribute
        fetchAppDetails(appid); // Fetch and display app details
    }
});
}
