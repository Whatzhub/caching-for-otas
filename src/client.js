// Define Globals
var text1 = document.getElementById("text1");
var text2 = document.getElementById("text2");
var text3 = document.getElementById("text3");
var statusText1 = document.getElementById("statusText1");
var pollStart = document.getElementById('pollingStart');
var pImg1 = document.getElementById("progressImg1");
var stressTestChart = null;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

pollStart.addEventListener('click', async function () {
    console.log('stress-test start');
    pImg1.classList.remove('hidden');
    statusText1.innerHTML = 'Generating stress test figures...';
    pollStart.disabled = true;
    let n = 0
    while (n < 30) {
        await stressTest()
        n++
    }
});

var counter = 0

async function stressTest() {
    var config = {
        method: 'post',
        url: '/stresstest',
        timeout: 30000,
        data: {
            totalTradingVol: 100000000, // 100M USD
            totalDebt: 50000000 // 50M USD
        }
    };
    await axios.request(config)
        .then(async function (res) {

            console.log(res);
            if (res.data.success) {
                // Hide loader
                pImg1.classList.add('hidden');

                // stressTest results & stats
                // var delay = res.headers['x-response-time'];
                counter++
                var results = res.data.data;
                console.log(40, results)

                // Write to View
                text1.innerHTML = 'Simulation Runs ' + counter;
                // text2.innerHTML = 'Slippage: ' + results.message;
                // text3.innerHTML = 'Total air segments returned: ' + results.data.totalSegments;

                // Update Chart

                _4ChartConfig.data.labels.push(_4ChartConfig.data.labels.length);
                _4ChartConfig.data.datasets[0].data.push(results.scenarioA.generatedSlippage); // slippage
                _4ChartConfig.data.datasets[1].data.push(results.scenarioA.generatedVolatility); // volatility
                _4ChartConfig.data.datasets[2].data.push(results.scenarioA.totalDebtSuccessLiqPct); // incentives liq
                _4ChartConfig.data.datasets[3].data.push(results.scenarioA.totalDebtRemainingPct); // reserve liq
                _4Chart.update();
            
                _20ChartConfig.data.labels.push(_20ChartConfig.data.labels.length);
                _20ChartConfig.data.datasets[0].data.push(results.scenarioB.generatedSlippage); // slippage
                _20ChartConfig.data.datasets[1].data.push(results.scenarioB.generatedVolatility); // volatility
                _20ChartConfig.data.datasets[2].data.push(results.scenarioB.totalDebtSuccessLiqPct); // incentives liq
                _20ChartConfig.data.datasets[3].data.push(results.scenarioB.totalDebtRemainingPct); // reserve liq
                _20Chart.update();
            
                _40ChartConfig.data.labels.push(_40ChartConfig.data.labels.length);
                _40ChartConfig.data.datasets[0].data.push(results.scenarioC.generatedSlippage); // slippage
                _40ChartConfig.data.datasets[1].data.push(results.scenarioC.generatedVolatility); // volatility
                _40ChartConfig.data.datasets[2].data.push(results.scenarioC.totalDebtSuccessLiqPct); // incentives liq
                _40ChartConfig.data.datasets[3].data.push(results.scenarioC.totalDebtRemainingPct); // reserve liq
                _40Chart.update();


            }
            else throw new Error('API Request Failed from Server.');

            // Reset state
            pollStart.disabled = false;
            statusText1.innerHTML = '';
            await sleep(400)
        })
        .catch(function (err) {
            console.log(err);
            pImg1.classList.add('hidden');
            pollStart.disabled = false;
            statusText1.innerHTML = 'A Network Error has occurred. Try restarting your local server.'
        });
}

var _4ChartConfig = {
    type: 'line',
    data: {
        labels: [0],
        datasets: [{
            label: "Slippage",
            backgroundColor: 'rgba(106, 188, 106, 0.1)',
            borderColor: 'rgb(106, 188, 106)',
            data: [0],
            fill: true,
        },{
            label: "Market Volatility",
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0],
            fill: true,
        }, {
            label: "Incentives-based Liquidations",
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderColor: 'rgb(54, 162, 235)',
            data: [0],
            fill: true,
        }, {
            label: "Reserves-based Liquidations",
            backgroundColor: 'rgba(255, 165, 86, 0.1)',
            borderColor: 'rgb(255, 165, 86)',
            data: [0],
            fill: true,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: '2-4% market volatility Simulation Chart'
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
                    labelString: 'Simulated Runs'
                }
            }],
            yAxes: [{
                display: true,
                type: 'linear',
                scaleLabel: {
                    display: true,
                    labelString: 'Percentage (%)'
                },
                // ticks: {
                //     max: 0.1,
                //     min: 0,
                //     stepSize: 0.02
                // }
            }]
        }
    }
};

var _20ChartConfig = {
    type: 'line',
    data: {
        labels: [0],
        datasets: [{
            label: "Slippage",
            backgroundColor: 'rgba(106, 188, 106, 0.1)',
            borderColor: 'rgb(106, 188, 106)',
            data: [0],
            fill: true,
        },{
            label: "Market Volatility",
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0],
            fill: true,
        }, {
            label: "Incentives-based Liquidations",
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderColor: 'rgb(54, 162, 235)',
            data: [0],
            fill: true,
        }, {
            label: "Reserves-based Liquidations",
            backgroundColor: 'rgba(255, 165, 86, 0.1)',
            borderColor: 'rgb(255, 165, 86)',
            data: [0],
            fill: true,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: '10-20% market volatility Simulation Chart'
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
                    labelString: 'Simulated Runs'
                }
            }],
            yAxes: [{
                display: true,
                type: 'linear',
                scaleLabel: {
                    display: true,
                    labelString: 'Percentage (%)'
                }
            }]
        }
    }
};

var _40ChartConfig = {
    type: 'line',
    data: {
        labels: [0],
        datasets: [{
            label: "Slippage",
            backgroundColor: 'rgba(106, 188, 106, 0.1)',
            borderColor: 'rgb(106, 188, 106)',
            data: [0],
            fill: true,
        },{
            label: "Market Volatility",
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0],
            fill: true,
        }, {
            label: "Incentives-based Liquidations",
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderColor: 'rgb(54, 162, 235)',
            data: [0],
            fill: true,
        }, {
            label: "Reserves-based Liquidations",
            backgroundColor: 'rgba(255, 165, 86, 0.1)',
            borderColor: 'rgb(255, 165, 86)',
            data: [0],
            fill: true,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: '20-40% market volatility Simulation Chart'
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
                    labelString: 'Simulated Runs'
                }
            }],
            yAxes: [{
                display: true,
                type: 'linear',
                scaleLabel: {
                    display: true,
                    labelString: 'Percentage (%)'
                }
            }]
        }
    }
};

window.onload = function () {
    var ctx1 = document.getElementById("canvas1").getContext("2d");
    var ctx2 = document.getElementById("canvas2").getContext("2d");
    var ctx3 = document.getElementById("canvas3").getContext("2d");
    _4Chart = new Chart(ctx1, _4ChartConfig);
    _20Chart = new Chart(ctx2, _20ChartConfig);
    _40Chart = new Chart(ctx3, _40ChartConfig);
};