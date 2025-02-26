document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    const loading = document.getElementById('loading');
    const noResults = document.getElementById('noResults');

    // Bing Search API Configuration
    const API_KEY = 'YOUR_BING_API_KEY'; // Replace with your Bing API Key
    const API_URL = 'https://api.bing.microsoft.com/v7.0/search';

    // Perform search
    const performSearch = async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        showLoading();
        hideSections();

        try {
            const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Ocp-Apim-Subscription-Key': API_KEY
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch results');
            }

            const data = await response.json();
            displayResults(data.webPages?.value || []);
        } catch (error) {
            console.error('Error performing search:', error);
            noResults.classList.remove('hidden');
        } finally {
            hideLoading();
        }
    };

    // Display results
    const displayResults = (results) => {
        searchResults.innerHTML = '';
        if (results.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }

        results.forEach(result => {
            const resultCard = document.createElement('div');
            resultCard.className = 'p-4 border rounded-lg';
            resultCard.innerHTML = `
                <h3 class="text-lg font-bold">
                    <a href="${result.url}" target="_blank" class="text-blue-600 hover:underline">${result.name}</a>
                </h3>
                <p>${result.snippet}</p>
            `;
            searchResults.appendChild(resultCard);
        });
        searchResults.classList.remove('hidden');
    };

    // Helper functions
    const showLoading = () => loading.classList.remove('hidden');
    const hideLoading = () => loading.classList.add('hidden');
    const hideSections = () => {
        searchResults.classList.add('hidden');
        noResults.classList.add('hidden');
    };

    // Event listeners
    searchBtn.addEventListener('click', performSearch);
});
