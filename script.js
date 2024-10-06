document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const colorForm = document.getElementById('colorForm');
    const dateInput = document.getElementById('dateInput');
    const colorDisplay = document.getElementById('colorDisplay');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');

    // Initialize search history
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Function to display search history
    function displayHistory() {
        historyList.innerHTML = '';
        searchHistory.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.date;
            historyList.appendChild(li);
        });
    }

    // Initial display of search history
    displayHistory();

    // Function to fetch color data
    async function fetchColor(date) {
        try {
            const response = await fetch(`https://colors.zoodinkers.com/api?date=${date}`);
            if (!response.ok) {
                throw new Error('Color not found');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error.message);
        }
    }

    // Function to display color
    function displayColor(colorData) {
        const colorDiv = document.createElement('div');
        colorDiv.style.backgroundColor = colorData.hex;
        colorDiv.style.width = '100px';
        colorDiv.style.height = '100px';
        colorDiv.style.marginTop = '10px';
        colorDiv.textContent = `Color: ${colorData.hex}, Date: ${colorData.date}`;
        colorDisplay.innerHTML = '';
        colorDisplay.appendChild(colorDiv);
    }

    // Event listener for color form submission
    colorForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const date = dateInput.value;
        const colorData = await fetchColor(date);
        displayColor(colorData);
        
        searchHistory.push({ date: colorData.date, hex: colorData.hex });
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        displayHistory();
    });

    // Event listener for clearing search history
    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('searchHistory');
        searchHistory = [];
        displayHistory();
    });
});
