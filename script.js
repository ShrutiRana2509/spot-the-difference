document.addEventListener('DOMContentLoaded', () => {
    let gameData; // Holds the game configuration
    let foundDifferences = 0; // Tracks found differences
    let gameTimer; // Timer to track time
    let seconds = 0; // Time in seconds

    // Fetch the JSON configuration
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            gameData = config; // Store game configuration
            initializeGame(config);
        })
        .catch(error => console.error('Error loading the JSON config:', error));

    // Initialize the game
    function initializeGame(config) {
        document.getElementById('gameTitle').textContent = config.gameTitle;
        document.getElementById('image1').src = config.images.image1;
        document.getElementById('image2').src = config.images.image2;

        // Start the timer
        startTimer();

        // Add differences overlays on the second image
        config.differences.forEach((diff, index) => {
            const diffElement = document.createElement('div');
            diffElement.classList.add('difference');
            diffElement.style.left = `${diff.x}px`;
            diffElement.style.top = `${diff.y}px`;
            diffElement.style.width = `${diff.width}px`;
            diffElement.style.height = `${diff.height}px`;
            diffElement.dataset.index = index;
            document.getElementById('image2').parentElement.appendChild(diffElement);
        });

        // Handle the click event for the second image
        document.getElementById('image2').addEventListener('click', (event) => {
            const rect = event.target.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            console.log(`Clicked at X: ${x}, Y: ${y}`); // Debugging log for coordinates

            // Compare the clicked position with each difference's position
            config.differences.forEach((diff, index) => {
                if (
                    x >= diff.x && x <= diff.x + diff.width &&
                    y >= diff.y && y <= diff.y + diff.height
                ) {
                    const diffElement = document.querySelector(`.difference[data-index='${index}']`);

                    // If the difference hasn't been marked as correct, mark it now
                    if (!diffElement.classList.contains('correct')) {
                        diffElement.classList.add('correct'); // Mark the difference as found
                        foundDifferences++;

                        // Highlight the found difference in the image
                        highlightDifference(diff);

                        alert('Correct!');

                        // Check if all differences have been found
                        if (foundDifferences === config.differences.length) {
                            document.getElementById('message').innerText = 'You found all the differences!';
                            clearInterval(gameTimer); // Stop the timer when game ends
                        }
                    }
                }
            });
        });
    }

    // Highlight the found difference by adding a visual effect (border or background color)
    function highlightDifference(diff) {
    const image2 = document.getElementById('image2');
    const rect = image2.getBoundingClientRect();

    const highlightDiv = document.createElement('div');
    highlightDiv.classList.add('highlight');
    highlightDiv.style.left = `${diff.x}px`;
    highlightDiv.style.top = `${diff.y}px`;
    highlightDiv.style.width = `${diff.width}px`;
    highlightDiv.style.height = `${diff.height}px`;
    highlightDiv.style.position = 'absolute';

    // Ensure the highlightDiv is correctly positioned relative to the parent container
    const parent = image2.parentElement;
    parent.style.position = 'relative'; // Ensure parent container is positioned
    parent.appendChild(highlightDiv); // Add highlight on top of the image
}

    // Start the game timer
    function startTimer() {
        gameTimer = setInterval(() => {
            seconds++;
            document.getElementById('time').textContent = seconds;
        }, 1000);
    }
});
