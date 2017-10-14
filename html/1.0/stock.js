String.prototype.format = function () {
	var s = this,
		i = arguments.length;
	while (i--) {
		s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
	}
	return s;
};

$.fn.fade = function () {
	var src = arguments[0];
	this.fadeOut('slow', function () {
		$(this).attr("src", src).fadeIn('slow');
	});
};

function createCharts(row, stockNum, scheme) {
	var output = "<tr>";
	var newUrl;
	var id;
	if (stockNum != undefined) {
		$.each(CHARTTYPES, function (key, chart) {
			id = row + "_" + key;
			newUrl = chart.url.format(stockNum, scheme) + '&chartwidth=' + CONFIG.imgWidth + '&chartheight=' + CONFIG.imgHeight + '&ttt=' + new Date().getTime();
			if (chart.active) {
				output = output + TEMPLATES.img_holder.format(id, newUrl, id);
			}
		})
		console.log("Stock " + stockNum + " added.");
	} else {
		output = output + TEMPLATES.separater.format(CONFIG.separatorColor);
	}
	output = output + "</tr>";
	return output;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function reload(id) {
	var imgTag = $("#" + id);
	newUrl = imgTag.attr("src").replace(/&ttt=.*$/g, '&ttt=' + new Date().getTime());
	imgTag.fade(newUrl);
};

var TEMPLATES = {
	separater: '<td colspan="99" bgcolor="{0}">&nbsp;</td>',
	img_holder: "<td><img id='stockImage_{0}' src='{1}' onclick=\"javascript:reload('stockImage_{2}')\"/></td>"
};

var CHARTTYPES = {
	// charts are ordered
	three_month_with_sma: {
		active: true,
		url: "https://charts.aastocks.com/servlet/Charts?fontsize=12&15MinDelay=T&lang=1&titlestyle=1&vol=1&Indicator=2&indpara1=10&indpara2=20&indpara3=50&indpara4=0&indpara5=0&scheme={1}&com=100&stockid={0}.HK&period=7&type=1&logoStyle=1&",
	},
	three_month: {
		active: false,
		url: "https://charts.aastocks.com/servlet/Charts?fontsize=11&15MinDelay=T&lang=1&titlestyle=1&vol=1&scheme={1}&com=100&stockid={0}.HK&period=7&type=1&logoStyle=1",
	},
	ten_day_per_one_hr: {
		active: true,
		url: "https://charts.aastocks.com/servlet/Charts?fontsize=11&15MinDelay=T&lang=1&titlestyle=1&vol=1&scheme={1}&com=100&stockid={0}.HK&period=4&type=1&logoStyle=1",
	},
	one_day_per_one_min: {
		active: true,
		url: "https://charts.aastocks.com/servlet/Charts?fontsize=11&15MinDelay=F&lang=1&titlestyle=1&vol=1&scheme={1}&com=100&stockid={0}.HK&period=5000&type=1&logoStyle=1",
	}
};

var NIGHTMODE_SCHEME = {
	ON: '3',
	OFF: '1'
}

$(document).ready(function () {
	if (!CONFIG.logEnable) {
		console.log = function () {};
	}

	var scheme;
	var container = $('.default');
	console.log(container);
	if (CONFIG.nightMode) {
		scheme = NIGHTMODE_SCHEME.ON;
		container.toggleClass('darkSwitch');
		console.log('1 ' + CONFIG.nightMode);
	} else {
		scheme = NIGHTMODE_SCHEME.OFF;
		container.toggleClass('lightSwitch');
		console.log('2 ' + CONFIG.nightMode);
	}
	console.log(scheme);

	$.each(WATCH_LIST, function (row, stockNum) {
		$('#stockList > tbody:last-child').append(createCharts(row, stockNum, scheme));
	});

	setInterval(function () {
		interval = getRandomInt(0, $('img').length);
		$.each($('img'), function (index, value) {
			if (!CONFIG.randomRefresh || index == interval) {
				reload($(this).attr("id"));
			}
		});
	}, CONFIG.reloadIntervalInSecond * 1000);
});
