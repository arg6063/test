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

// Function to filter app suggestions based on user input
function filterApps(input) {
    input = input.toLowerCase();
    const filteredApps = appList.applist.apps.filter(app => app.name.toLowerCase().includes(input));
    return filteredApps.slice(0, 5); // Limit suggestions to the first 5 matches
}

// Function to update the dropdown suggestions
function updateSuggestions(input) {
    const filteredApps = filterApps(input);
    const suggestionList = document.getElementById('search-results');
    suggestionList.innerHTML = ''; // Clear previous suggestions
    filteredApps.forEach(app => {
        const listItem = document.createElement('li');
        listItem.textContent = app.name;
        listItem.setAttribute('data-appid', app.appid);
        suggestionList.appendChild(listItem);
    });
    if (filteredApps.length > 0) {
        document.getElementById('search-results').style.display = 'block'; // Show dropdown
    } else {
        document.getElementById('search-results').style.display = 'none'; // Hide dropdown if no matches
    }
}

// Event listener for search input
document.getElementById('search-input').addEventListener('input', function(event) {
    const userInput = event.target.value.trim();
    if (userInput.length > 0) {
        updateSuggestions(userInput);
    } else {
        document.getElementById('search-results').style.display = 'none'; // Hide dropdown if input is empty
    }
});

// Event listener for selecting an app from the dropdown
document.getElementById('search-results').addEventListener('click', function(event) {
    const selectedApp = event.target.closest('li');
    if (selectedApp) {
        const appid = selectedApp.dataset.appid;
        fetchAppDetails(appid);
        document.getElementById('search-results').style.display = 'none'; // Hide dropdown after selection
    }
});
