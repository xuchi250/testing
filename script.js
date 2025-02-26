document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const aiBtn = document.getElementById('aiBtn');
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    const searchResults = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    const loading = document.getElementById('loading');
    const languageSelector = document.getElementById('languageSelector');
    let currentLanguage = 'en';

    // Perform search
    const performSearch = async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        showLoading();
        hideSections();

        const results = await fetchResults();
        const filteredResults = results.filter(result =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase())
        );

        hideLoading();

        if (filteredResults.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            displayResults(filteredResults);
        }
    };

    // Fetch results from JSON file
    const fetchResults = async () => {
        try {
            const response = await fetch('./results.json');
            const data = await response.json();
            return data[currentLanguage] || [];
        } catch (err) {
            console.error('Error fetching results:', err);
            return [];
        }
    };

    // Display results
    const displayResults = (results) => {
        searchResults.innerHTML = '';
        results.forEach(result => {
            const resultCard = document.createElement('div');
            resultCard.className = 'p-4 border rounded-lg';
            resultCard.innerHTML = `
                <h3 class="text-lg font-bold">
                    <a href="${result.url}" target="_blank" class="text-blue-600 hover:underline">${result.title}</a>
                </h3>
                <p class="text-sm text-gray-500">${result.source}</p>
                <p>${result.description}</p>
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
    languageSelector.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        searchInput.placeholder = `Search in ${currentLanguage}`;
    });
});
