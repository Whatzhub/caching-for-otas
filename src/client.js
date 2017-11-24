// Define Globals
var text1 = document.getElementById("text1");
var text2 = document.getElementById("text2");
var text3 = document.getElementById("text3");
var statusText1 = document.getElementById("statusText1");
var pollStart = document.getElementById('pollingStart');
var pImg1 = document.getElementById("progressImg1");
var fareSearchChart = null;

pollStart.addEventListener('click', function () {
    console.log('faresearch start');
    pImg1.classList.remove('hidden');
    statusText1.innerHTML = 'Requesting air segments...';
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

                // Update Chart
                var delayNum = +delay.substring(0, delay.length - 2);
                if (results.type == 'cache') {
                    cacheChartConfig.data.labels.push(cacheChartConfig.data.labels.length);
                    cacheChartConfig.data.datasets[0].data.push(delayNum);
                    cacheChart.update();
                }
                else {
                    noCacheChartConfig.data.labels.push(noCacheChartConfig.data.labels.length);
                    noCacheChartConfig.data.datasets[0].data.push(delayNum);
                    noCacheChart.update();
                }


            }
            else throw new Error('API Request Failed from Server.');

            // Reset state
            pollStart.disabled = false;
            statusText1.innerHTML = '';
        })
        .catch(function (err) {
            console.log(err);
            pImg1.classList.add('hidden');
            pollStart.disabled = false;
            statusText1.innerHTML = 'A Network Error has occurred. Try restarting your local server.'
        });
}

var cacheChartConfig = {
    type: 'line',
    data: {
        labels: [0],
        datasets: [{
            label: "Redis Cache",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0],
            fill: true,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Fare Search Responsiveness Chart'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Requests'
                }
            }],
            yAxes: [{
                display: true,
                type: 'linear',
                scaleLabel: {
                    display: true,
                    labelString: 'Response Time (ms)'
                }
            }]
        }
    }
};

var noCacheChartConfig = {
    type: 'line',
    data: {
        labels: [0],
        datasets: [{
            label: "No Cache",
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            data: [0],
            fill: true,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Fare Search Responsiveness Chart'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Requests'
                }
            }],
            yAxes: [{
                display: true,
                type: 'linear',
                scaleLabel: {
                    display: true,
                    labelString: 'Response Time (ms)'
                }
            }]
        }
    }
};

window.onload = function () {
    var ctx1 = document.getElementById("canvas1").getContext("2d");
    var ctx2 = document.getElementById("canvas2").getContext("2d");
    cacheChart = new Chart(ctx1, cacheChartConfig);
    noCacheChart = new Chart(ctx2, noCacheChartConfig);
};