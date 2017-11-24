// Define Globals
var text1 = document.getElementById("text1");
var text2 = document.getElementById("text2");
var text3 = document.getElementById("text3");
var statusText1 = document.getElementById("statusText1");
var pollStart = document.getElementById('pollingStart');
var pImg1 = document.getElementById("progressImg1");

pollStart.addEventListener('click', function () {
    console.log('faresearch start');
    pImg1.classList.remove('hidden');
    statusText1.innerHTML = '';
    pollStart.disabled = true;
    fareSearch();
});

function fareSearch() {

    var config = {
        method: 'post',
        url: '/faresearch',
        timeout: 30000,
        data: {
            origin: 'HKG',
            destination: 'LON',
            from: '20180323',
            to: '20180330',
            adults: '1'
        }
    };
    axios.request(config)
        .then(function (res) {
            
            console.log(res);
            if (res.data.success) {
                // Hide loader
                pImg1.classList.add('hidden');
    
                // Faresearch results & stats
                var delay = res.headers['x-response-time'];
                var results = res.data;

                // Write to View
                text1.innerHTML = 'Total time to get results: ' + delay;
                text2.innerHTML = 'Data source: ' + results.message;
                text3.innerHTML = 'Total air segments returned: ' + results.data.totalSegments;
                
            }
            else throw new Error('API Request Failed from Server.');
            // Reset Button state
            pollStart.disabled = false;
        })
        .catch(function (err) {
            console.log(err);
            pImg1.classList.add('hidden');
            pollStart.disabled = false;
            statusText1.innerHTML = 'A Network Error has occurred. Try restarting your local server.'
        });
}