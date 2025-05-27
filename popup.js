window.onload = function() {
    let value;
    let min;
    let max;
    let diff;
    let url;
    let data = [];

    // Load any existing data
    loadStoredData();

    // Start button functionality
    document.getElementById("btn-submit").addEventListener("click", async function(ev) {
        ev.preventDefault();
        min = document.getElementById("min").value;
        max = document.getElementById("max").value;
        diff = max - min;
        value = parseInt(Math.floor(Math.random() * diff)) + parseInt(min);
        
        // Get current tab
        try {
            const tabs = await chrome.tabs.query({
                active: true,
                lastFocusedWindow: true
            });
            
            const tab = tabs[0];
            if (tab && tab.url) {
                url = tab.url;
                
                const obj = {
                    min: min,
                    max: max,
                    diff: diff,
                    value: value,
                    url: url
                };
                
                // Check if we need to update an existing entry or add a new one
                if (!await updateExistingEntry(obj)) {
                    // Get existing data
                    const result = await chrome.storage.sync.get(['data_string']);
                    if (result.data_string) {
                        data = JSON.parse(result.data_string);
                    }
                    
                    // Add new entry
                    data.push(obj);
                    
                    // Save updated data
                    await chrome.storage.sync.set({
                        data_string: JSON.stringify(data)
                    });
                }
                
                document.getElementById("output").innerHTML = "active";
            }
        } catch (error) {
            console.error('Error starting timer:', error);
        }
    });

    // Stop button functionality
    document.getElementById("btn-stop").addEventListener("click", async function(ev) {
        ev.preventDefault();
        
        try {
            const tabs = await chrome.tabs.query({
                active: true,
                lastFocusedWindow: true
            });
            
            const tab = tabs[0];
            if (tab && tab.url) {
                const result = await chrome.storage.sync.get(['data_string']);
                
                if (result.data_string) {
                    let data = JSON.parse(result.data_string);
                    data = data.filter(n => n.url !== tab.url);
                    
                    await chrome.storage.sync.set({
                        data_string: JSON.stringify(data)
                    });
                    
                    document.getElementById("output").innerHTML = "stopped";
                }
            }
        } catch (error) {
            console.error('Error stopping timer:', error);
        }
    });

    // Update timer display
    setInterval(async function() {
        try {
            const result = await chrome.storage.sync.get(['data_string']);
            
            if (result.data_string) {
                const tabs = await chrome.tabs.query({
                    active: true,
                    lastFocusedWindow: true
                });
                
                const tab = tabs[0];
                if (tab && tab.url) {
                    url = tab.url;
                    
                    const json = JSON.parse(result.data_string);
                    for (let index = 0; index < json.length; ++index) {
                        const data = json[index];
                        if (data.url === url) {
                            document.getElementById("output").innerHTML = data.value;
                            break;
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error updating display:', error);
        }
    }, 1000);

    /**
     * Load data from storage
     */
    async function loadStoredData() {
        try {
            const result = await chrome.storage.sync.get(['data_string']);
            if (result.data_string) {
                data = JSON.parse(result.data_string);
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    }

    /**
     * Update an existing entry if it exists
     * @param {Object} newData - The new data to update with
     * @returns {Promise<boolean>} - Whether an update was performed
     */
    async function updateExistingEntry(newData) {
        try {
            const result = await chrome.storage.sync.get(['data_string']);
            
            if (result.data_string) {
                const json = JSON.parse(result.data_string);
                
                for (let index = 0; index < json.length; ++index) {
                    const entry = json[index];
                    
                    if (entry.url === newData.url) {
                        entry.min = newData.min;
                        entry.max = newData.max;
                        entry.diff = newData.diff;
                        entry.value = newData.value;
                        
                        await chrome.storage.sync.set({
                            data_string: JSON.stringify(json)
                        });
                        
                        return true;
                    }
                }
            }
            
            return false;
        } catch (error) {
            console.error('Error updating existing entry:', error);
            return false;
        }
    }
}