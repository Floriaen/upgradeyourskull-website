/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////

function StatisticsSender() {};

StatisticsSender.prototype.send = function(itemsFound, eatenCarrots, startTime, endTime) {
	var params = "pattern=save&itemsFound=" + itemsFound + "&eatenCarrots=" + eatenCarrots + "&startTime=" + startTime + "&endTime=" + endTime;
	Ajax.request(Ajax.POST, true, "stats.php", params, null, null);
};

StatisticsSender.getInstance = function() {
	if (!StatisticsSender.hasOwnProperty("__instance")) {
		StatisticsSender.__instance = new StatisticsSender();
	}
	return StatisticsSender.__instance;
};