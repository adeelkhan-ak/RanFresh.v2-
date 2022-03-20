var x = setInterval(function() {
    chrome.storage.sync.get(['data_string'], function(result) {
        if (result.data_string == null) {

        } else {

            var json = JSON.parse(result.data_string);
            for (var index = 0; index < json.length; ++index) {

                var data = json[index];
                change(data);
            }
            chrome.storage.sync.set({
                data_string: JSON.stringify(json)
            }, function() {
                // console.log('Value is set to ' + i);
            });
        }
    });



}, 1000);


function change(data) {

    data.value = data.value - 1;
    //document.getElementById("output").innerHTML = value;
    if (data.value < 0) {
        // clearInterval(x);
        data.value = parseInt(Math.floor(Math.random() * data.diff)) + parseInt(data.min);
        //document.getElementById("output").innerHTML = value;

        chrome.tabs.query({
            url: data.url
        }, function(tabs) {
            tabs.forEach((tab) => {
                    chrome.tabs.reload(tab.id)
                })
                // reload tab with one of the methods from linked answer
        })

    }

}

chrome.alarms.create({
    periodInMinutes: 4.9
})
var y = setInterval(function() {
    //to keep worker running :D


}, 5000);

chrome.alarms.onAlarm.addListener(() => {
    console.log('log for debug')
});