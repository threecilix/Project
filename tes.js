// ==UserScript==
// @name        OnlineVideoConverter.com
// @namespace   https://www.onlinevideoconverter.com/
// @version     1.2.2
// @description This userscript assists OnlineVideoConverter to convert video links.
// @copyright   2016, OnlineVideoConverter.com
// @icon        https://www.onlinevideoconverter.com/assets/images/ovc-icon.png
// @icon64      https://www.onlinevideoconverter.com/assets/images/ovc-icon64.png
// @homepage    https://www.onlinevideoconverter.com/extension
// @downloadURL https://www.onlinevideoconverter.com/assets/javascript/ovc.user.js
// @match       *://www.youtube.com/*
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// ==/UserScript==


if("undefined" == typeof (onlinevideoconverter)) {
	var onlinevideoconverter = {

		currentMediaUrl: null,
		currentId: null,
        userUrl: 'https://www.onlinevideoconverter.com/video-converter?ref=addon&version=121',

		getParam : function (document, variable){
			var query = document.location.search.substring(1);
			var vars = query.split("&");
			for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				if(pair[0] == variable){return pair[1];}
			}       return(false);
		},

		addButtons: function() {
			var icon = 'data:image/png;base64,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';
            var onlinevideoconverterpath = onlinevideoconverter.userUrl + "&url=" + encodeURIComponent(document.URL);
			var div_embed = null;
			var spanclass="";
			var buttonclass = "";

			if(document.getElementById('watch-like-dislike-buttons')) {
				var div_embed = document.getElementById('watch-like-dislike-buttons');
				var buttonclass = "yt-uix-button yt-uix-button-text yt-uix-tooltip";
				var spanclass="";
			} else if(document.getElementById('watch-headline-user-info')) {
				var div_embed = document.getElementById('watch-headline-user-info');
				var buttonclass = "yt-uix-button yt-uix-button-default yt-uix-tooltip";
				var spanclass="yt-uix-button-group";
			} else if(document.getElementById('watch8-sentiment-actions')) {
				var div_embed = document.getElementById('watch8-sentiment-actions');
				var buttonclass = "yt-uix-button yt-uix-button-default yt-uix-tooltip";
				var spanclass="yt-uix-button-group";
			}

			var target= '_blank';

			if(div_embed) {
				var tmp = div_embed.innerHTML;
				div_embed.innerHTML = ' <span id="onlinevideoconverter" class="' + spanclass + '">';
				div_embed.innerHTML += '<a href="' + onlinevideoconverterpath + '" target="' + target + '"><button class="start ' + buttonclass + '" type="button" title="Convert with OnlineVideoConverter.com"><img alt="" class="" style="" src="' + icon + '"></button></a>';
				div_embed.innerHTML += '</span>';
				div_embed.innerHTML += tmp;
				document.querySelector('#convertButton').onclick = function() {
					var e = document.getElementById("conversionFormat");
					var strUser = e.options[e.selectedIndex].value;
					window.open(onlinevideoconverterpath + "&format="+strUser);
				};
			}
		},

		onPageLoad : function() {
			if(document.body && document.domain == 'www.youtube.com') {
				setInterval(onlinevideoconverter.check, 1500);
				onlinevideoconverter.check();
			}
		},

		check: function() {
			var ytplayer = unsafeWindow.ytplayer;

			if(onlinevideoconverter.currentMediaUrl != document.URL && ytplayer && ytplayer.config &&  ytplayer.config.args && onlinevideoconverter.currentId != ytplayer.config.args.video_id) {
				onlinevideoconverter.currentId = ytplayer.config.args.video_id;
				onlinevideoconverter.currentMediaUrl = document.URL;
				onlinevideoconverter.addButtons(document);
			}
		}
	};

	onlinevideoconverter.onPageLoad();

}