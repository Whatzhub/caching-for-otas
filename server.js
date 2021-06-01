var express = require("express");
var responseTime = require("response-time");
var bodyParser = require("body-parser");
var helpers = require("./helpers/helpers");

var app = express();
var server = require("http").Server(app);

// setup middlewares
app.use(express.static(__dirname + "/src"));
app.use(bodyParser.json());
app.use(responseTime());

// define PORT
var PORT = process.env.PORT || 3000;

// define stress test bounds & ranges
let keyParams = {
  totalTradingVol: 100000000, // 100M USD
  totalDebt: 50000000, // 50M USD
  incentives: 0.01, // 1%
  minCollateralRatio: 1.2, // 120%
  minCollateralHoldersPct: [0.1, 0.5], // 10-50%
  liqThreshold: 1.1, // 110%
  rescueThreshold: 1.03, // 103%
  slippage: {
    a: [0.005, 0.01],
    b: [0.02, 0.05],
    c: [0.05, 0.1],
  },
  volatility: {
    a: [0.02, 0.04],
    b: [0.1, 0.2],
    c: [0.2, 0.4],
  },
  tradingFees: 0.003, // 0.3%

  // to be randomly-generated
  scenarioA: {
    generatedSlippage: 0, // 0.005 - 0.01
    generatedVolatility: 0, // 0.02 - 0.04
    minCollateralHoldersPct: 0, // 0.1 - 0.5
    totalDebtToLiq: 0, // totalDebt * minCollateralHoldersPct * (generatedVolatility - 0.083)
    totalDebtSuccessLiqPct: 0, // if incentives > slippage, then 100% of totalDebtToLiq
    totalDebtRemainingPct: 0, // else 100% of totalDebtToLiq
  },
  scenarioB: {
    generatedSlippage: 0, // 0.02 - 0.05
    generatedVolatility: 0, // 0.1 - 0.2
    minCollateralHoldersPct: 0, // 0.1 - 0.5
    totalDebtToLiq: 0,
    totalDebtSuccessLiqPct: 0,
    totalDebtRemainingPct: 0,
  },
  scenarioC: {
    generatedSlippage: 0, // 0.05 - 0.1
    generatedVolatility: 0, // 0.2 - 0.4
    minCollateralHoldersPct: 0, // 0.1 - 0.5
    totalDebtToLiq: 0,
    totalDebtSuccessLiqPct: 0,
    totalDebtRemainingPct: 0,
  },
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

app.post("/stresstest", (req, res) => {
  var body = req.body;
  console.log(`/stresstest: Received request with body => ${body}`);

  console.log("/stresstest: Generating stress test figures");
  const randomKeyParams = Object.assign(keyParams);

  // Scenario A
  randomKeyParams.scenarioA = {
    generatedSlippage: helpers.getRandomArbitrary(
      keyParams.slippage.a[0],
      keyParams.slippage.a[1]
    ),
    generatedVolatility: helpers.getRandomArbitrary(
      keyParams.volatility.a[0],
      keyParams.volatility.a[1]
    ),
    minCollateralHoldersPct: helpers.getRandomArbitrary(
      keyParams.minCollateralHoldersPct[0],
      keyParams.minCollateralHoldersPct[1]
    ),
    totalDebtToLiq: 0,
    totalDebtSuccessLiqPct: 0,
    totalDebtRemainingPct: 0,
  };
  randomKeyParams.scenarioA.totalDebtToLiq =
    keyParams.totalDebt *
    randomKeyParams.scenarioA.minCollateralHoldersPct *
    (randomKeyParams.scenarioA.generatedVolatility - 0.083);
  if (keyParams.incentives > randomKeyParams.scenarioA.generatedSlippage) {
    randomKeyParams.scenarioA.totalDebtSuccessLiqPct =
      Math.abs(randomKeyParams.scenarioA.totalDebtToLiq / keyParams.totalDebt);
  } else {
    randomKeyParams.scenarioA.totalDebtRemainingPct =
      randomKeyParams.scenarioA.totalDebtToLiq / keyParams.totalDebt;
  }

  // Scenario B
  randomKeyParams.scenarioB = {
    generatedSlippage: helpers.getRandomArbitrary(
      keyParams.slippage.b[0],
      keyParams.slippage.b[1]
    ),
    generatedVolatility: helpers.getRandomArbitrary(
      keyParams.volatility.b[0],
      keyParams.volatility.b[1]
    ),
    minCollateralHoldersPct: helpers.getRandomArbitrary(
      keyParams.minCollateralHoldersPct[0],
      keyParams.minCollateralHoldersPct[1]
    ),
    totalDebtToLiq: 0,
    totalDebtSuccessLiqPct: 0,
    totalDebtRemainingPct: 0,
  };
  randomKeyParams.scenarioB.totalDebtToLiq =
    keyParams.totalDebt *
    randomKeyParams.scenarioB.minCollateralHoldersPct *
    (randomKeyParams.scenarioB.generatedVolatility - 0.083);
  if (keyParams.incentives > randomKeyParams.scenarioB.generatedSlippage) {
    randomKeyParams.scenarioB.totalDebtSuccessLiqPct =
      randomKeyParams.scenarioB.totalDebtToLiq / keyParams.totalDebt;;
  } else {
    randomKeyParams.scenarioB.totalDebtRemainingPct =
      randomKeyParams.scenarioB.totalDebtToLiq / keyParams.totalDebt;;
  }

  // Scenario C
  randomKeyParams.scenarioC = {
    generatedSlippage: helpers.getRandomArbitrary(
      keyParams.slippage.c[0],
      keyParams.slippage.c[1]
    ),
    generatedVolatility: helpers.getRandomArbitrary(
      keyParams.volatility.c[0],
      keyParams.volatility.c[1]
    ),
    minCollateralHoldersPct: helpers.getRandomArbitrary(
      keyParams.minCollateralHoldersPct[0],
      keyParams.minCollateralHoldersPct[1]
    ),
    totalDebtToLiq: 0,
    totalDebtSuccessLiqPct: 0,
    totalDebtRemainingPct: 0,
  };
  randomKeyParams.scenarioC.totalDebtToLiq =
    keyParams.totalDebt *
    randomKeyParams.scenarioC.minCollateralHoldersPct *
    (randomKeyParams.scenarioC.generatedVolatility - 0.083);
  if (keyParams.incentives > randomKeyParams.scenarioC.generatedSlippage) {
    randomKeyParams.scenarioC.totalDebtSuccessLiqPct =
      randomKeyParams.scenarioC.totalDebtToLiq / keyParams.totalDebt;;
  } else {
    randomKeyParams.scenarioC.totalDebtRemainingPct =
      randomKeyParams.scenarioC.totalDebtToLiq / keyParams.totalDebt;;
  }

  // return data in json

  var dataJson = {
    success: true,
    type: "",
    message: "Stress test scenarios. Results from Stress Test Generator v1.",
    data: randomKeyParams,
  };
  console.log(dataJson);
  return res.json(dataJson);
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
  console.log(__dirname);
});
