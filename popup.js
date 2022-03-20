window.onload = function(ev) {
    var value
    var min
    var max
    var diff
    var url
    var data = []
    document.getElementById("btn-submit").onclick = function(ev) {
        ev.preventDefault();
        min = document.getElementById("min").value;
        max = document.getElementById("max").value;
        console.log(min);
        console.log(max);
        diff = max - min;
        value = parseInt(Math.floor(Math.random() * diff)) + parseInt(min);
        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        }, function(tabs) {
            // and use that tab to fill in out title and url
            var tab = tabs[0];
            if (tab.url !== undefined)
                url = tab.url;
            // console.log(tab.url);

            // url_display(url);
        });
        // alert(url)
        if (url !== undefined) {
            var obj = {
                min: min,
                max: max,
                diff: diff,
                value: value,
                url: url,
                update: update,
            };
            if (!obj.update()) {
                chrome.storage.sync.get(['data_string'], function(result) {
                    if (result.data_string !== null) {
                        data = JSON.parse(result.data_string);
                    }
                });


                data.push(obj);

                chrome.storage.sync.set({
                    data_string: JSON.stringify(data)
                }, function() {
                    // console.log('Value is set to ' + i);
                });

                // localStorage.data_string = JSON.stringify(data)
            }
            // document.getElementById("output").innerHTML = value;
            document.getElementById("output").innerHTML = "active";
        }
    }
    document.getElementById("btn-stop").onclick = function(ev) {
        ev.preventDefault();
        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        }, function(tabs) {
            // and use that tab to fill in out title and url
            var tab = tabs[0];
            // console.log(tab.url);
            // alert(tab.url);

            chrome.storage.sync.get(['data_string'], function(result) {
                if (result.data_string !== null) {
                    var data = JSON.parse(result.data_string);
                    data = data.filter(n => n.url !== tab.url);
                    chrome.storage.sync.set({
                        data_string: JSON.stringify(data)
                    }, function() {
                        // console.log('Value is set to ' + i);
                    });
                }
            });

        });
        document.getElementById("output").innerHTML = "stopped";
    }

    var x = setInterval(function() {

        chrome.storage.sync.get(['data_string'], function(result) {
            if (result.data_string !== null) {
                chrome.tabs.query({
                    active: true,
                    lastFocusedWindow: true
                }, function(tabs) {
                    // and use that tab to fill in out title and url
                    var tab = tabs[0];
                    if (tab) {
                        if (tab.url !== undefined)
                            url = tab.url;
                    }
                });
                // console.log(tab.url);
                // alert(tab.url);
                if (url) {
                    var json = JSON.parse(result.data_string);
                    for (var index = 0; index < json.length; ++index) {
                        var data = json[index];
                        if (data.url == url) {
                            // document.getElementById("output").innerHTML = data.value;
                            document.getElementById("output").innerHTML = data.value;
                            break;
                        }
                    }
                }
            }
        });
    }, 1);

    function url_display(url) {

        document.getElementById("url").innerHTML = url;
    }

    function update() {
        chrome.storage.sync.get(['data_string'], function(result) {
            if (result.data_string !== null) {
                var json = JSON.parse(result.data_string);
                for (var index = 0; index < json.length; ++index) {

                    var animal = json[index];

                    if (animal.url == this.url) {
                        animal.min = this.min;
                        animal.max = this.max;
                        animal.diff = this.diff;
                        animal.url = this.url;
                        animal.value = this.value;
                        // localStorage.data_string = JSON.stringify(json)
                        chrome.storage.sync.set({
                            data_string: JSON.stringify(json)
                        }, function() {
                            // console.log('Value is set to ' + i);
                        });
                        return true;
                    }
                }
                return false;
            }
        });
    }
}