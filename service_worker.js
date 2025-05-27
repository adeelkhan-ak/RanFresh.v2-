// Set up data checking interval
const CHECK_INTERVAL_MS = 1000;

// Check for refresh intervals every second
setInterval(async () => {
    try {
        const result = await chrome.storage.sync.get(['data_string']);
        if (!result.data_string) return;

        const json = JSON.parse(result.data_string);
        for (let index = 0; index < json.length; ++index) {
            const data = json[index];
            updateRefreshTimer(data);
        }
        
        // Save updated timers back to storage
        await chrome.storage.sync.set({
            data_string: JSON.stringify(json)
        });
    } catch (error) {
        console.error('Error checking refresh timers:', error);
    }
}, CHECK_INTERVAL_MS);

/**
 * Update a refresh timer and reload tab if needed
 * @param {Object} data - The refresh timer data
 */
function updateRefreshTimer(data) {
    // Decrement timer
    data.value = data.value - 1;
    
    // If timer reaches zero, reset it and refresh the tab
    if (data.value < 0) {
        // Calculate new random value between min and max
        data.value = parseInt(Math.floor(Math.random() * data.diff)) + parseInt(data.min);
        
        // Find and reload matching tabs
        chrome.tabs.query({
            url: data.url
        }).then(tabs => {
            tabs.forEach(tab => {
                chrome.tabs.reload(tab.id);
            });
        }).catch(error => {
            console.error('Error reloading tab:', error);
        });
    }
}

// Create an alarm to keep service worker alive
chrome.alarms.create('keepAlive', {
    periodInMinutes: 4.9
});

// Listen for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
        console.log('Keeping service worker alive');
    }
});

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('RanFresh extension installed');
});