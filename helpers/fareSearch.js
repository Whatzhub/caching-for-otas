const uapiFareSearch = {
    request: {
        host: 'demo.travelportuniversalapi.com',
        path: '/Api/Air/GetLowFareSearch',
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json; charset=UTF-8',
            "Content-Length": 2091,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
            'Cache-Control': 'no-cache',
            "Connection": "keep-alive"
        }
    },
    body: function (origin, destination, from, to) {
        let o = origin;
        let d = destination;
        let fDate = from;
        let tDate = to;
        console.log(o, d, fDate, tDate);

        return `{"airSearchReqDTO":{},"hotelSearchReqDTO":{},"railSearchReqDTO":{},"vehicleSearchReqDTO":{},"SessionId":"68669663-4d00-4a5b-9561-bdd57f35e139","LogSessionId":"15b67be4-143f-42cc-80ae-92a7ae1ce5c7","Origin":"${o}","OriginCity":"Hong Kong","Destination":"${d}","DestinationCity":"London","From":"${fDate}","To":"${tDate}","Adults":"1","Childrens":"0","ChildrenAge":[],"Infants":"0","InfantAge":[],"Gds":"0","TargetBranch":"","GdsRequested":"","CheckFlights":true,"CheckHotel":false,"CheckVehicle":false,"CheckRail":false,"IsFlexExplore":false,"IsFlexDates":false,"IsFlexPlaces":false,"MetaOption":false,"CurrentSearch":{"Origin":"${o}","Destination":"${d}","From":"${fDate}","To":"${tDate}","HotelLoc":"LON","HotelFrom":"20180323","HotelTo":"20180330","Adults":"1","Childrens":"0","Infants":"0","Gds":"0"},"CurrentAirSearch":{"IsFlexExplore":false,"IsFlexDates":false,"IsFlexPlaces":false},"FlightsFilter":{"Gds":true,"LowCostCarrier":false,"SplitTicketing":false,"SplitTicketingValue":"","RailContent":false,"CheckFlex":false,"CheckAdvanced":false,"RailOnly":false,"RailAggregated":false,"TypeExplore":"Zone","RadioFlexValue":"","FlexExplorer":"1","FlexibleAirport":"2","FlexRadius":"3","FlexibleDates":"4","FlexibleWeekends":"5","isSolutionResult":false,"MiniFareRulesCheck":false,"AirAdvancedOptions":{"Category":"0","MaxJourneyTime":"","AlternateCurrency":"","AccountCode":"","AccountSupplier":"","Stops":"","MaxConnections":"any","MaxStops":"nonstop","ProhibitedCarriersList":"","PreferedCarriersList":"","PermittedCarriersList":"","CarriersOption":true,"AccountCodes":"-"}},"RailFilter":{"Origin":"HKG","Destination":"LON","From":"20180323","To":"20180330","Infants":0,"Hub":false},"HotelFilter":{"Gds":true,"TRM":false,"Location":"LON","LocationCity":"London","From":"20180323","To":"20180330","Rooms":"1","Cribs":"0","RollawayBeds":"0","MaxWait":"16000 ms"},"CarFilter":{"From":"20180323","FromTime":"10:00","To":"20180330","ToTime":"10:00","CarType":"All","SearchCategory":"All","DifferentLocation":false,"MediaLinksSearchId":""},"NumChildrenAge":[],"NumInfantAge":[],"totalPassangers":1}`;
    }
};


module.exports = uapiFareSearch;