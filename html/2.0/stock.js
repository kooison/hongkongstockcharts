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

function addUrlToList(inputList) {
	var newJson = [];
	$.each(inputList, function(key, stockNumList) {
		var list = [];
		$.each(stockNumList, function(i, stockNum) {
			var s = {
					"stockNum" : stockNum,
					"imgs" : createImgArray(stockNum)
			}
			list.push(s);
		})
		newJson.push(list);
	})

	return {
		list : newJson
	};
}

function createImgArray(stockNum) {
	var imgTags = [];
	var newUrl;
	var scheme = 3;
	var img = $('#img').html().trim();
	$.each(CHARTTYPES, function(key, chart) {
		if (chart.active) {
			var newUrl = chart.url.format(stockNum, scheme) + '&chartwidth=' + CONFIG.imgWidth + '&chartheight=' + CONFIG.imgHeight + '&ttt=' + new Date().getTime();
			// console.log("newUrl: " + newUrl);
			var textImg = Mustache.render(img, {
					"id": stockNum + "_" + key,
					"url": newUrl
			});
			imgTags.push(textImg);	
		}
	})
	return imgTags;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function reload(id) {
	var imgTag = $("#" + id);
	newUrl = imgTag.attr("src").replace(/&ttt=.*$/g, '&ttt=' + new Date().getTime());
	imgTag.fade(newUrl);
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

	var newObj = addUrlToList(WATCH_JSON_LIST);
	var template = $('#img_holder').html();
	var text = Mustache.render(template, newObj);
	$('#card').append(text);

	setInterval(function () {
		interval = getRandomInt(0, $('img').length);
		$.each($('img'), function (index, value) {
			if (!CONFIG.randomRefresh || index == interval) {
				reload($(this).attr("id"));
			}
		});
	}, CONFIG.reloadIntervalInSecond * 1000);
});
