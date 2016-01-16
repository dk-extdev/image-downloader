$(document).ready(function(){
	//localStorage.setItem('max_count', $('#max_count').val());
	if (localStorage.getItem('max_count'))
	{
		$('#max_count').val(localStorage.getItem('max_count'));
	}
	chrome.tabs.getSelected(null, function(tab) {
		var curr_status = setInterval(function(){
				var curr_info = JSON.parse(localStorage.getItem('info'));
				if (curr_info)
				{
					for (var i=0; i<curr_info.length; i++)
					{
						//console.log('tab-url'+tab.url);
						//console.log('curr_info'+curr_info[i].url);
						if (curr_info[i].url==tab.url)
						{
							document.getElementById('uidcount').innerHTML = curr_info[i].current_count;		
						}
					}
				}else{
					document.getElementById('uidcount').innerHTML = 0;
				}
				chrome.tabs.sendRequest(tab.id, {method: "getStatus"}, function (response) {
					if(response.data==false){
						document.getElementById('doclick').innerHTML = "<b>Stop</b>";
					}else{
						document.getElementById('doclick').innerHTML = "<b>Start</b>";
					}
				});
				/*if (localStorage.getItem('current_count'))
				{
					document.getElementById('uidcount').innerHTML = localStorage.getItem('current_count');
				}else{
					document.getElementById('uidcount').innerHTML = 0;
				}
				chrome.tabs.sendRequest(tab.id, {method: "getStatus"}, function (response) {
					if(response.data==false){
						document.getElementById('doclick').innerHTML = "<b>Stop</b>";
					}else{
						document.getElementById('doclick').innerHTML = "<b>Start</b>";
					}
				});*/
			},500);
	});
	$("#doclick").click(function(){
		if ($('#max_count').val())
		{
			localStorage.setItem('max_count', $('#max_count').val());
		}
		if ($('#parallel').val())
		{
			localStorage.setItem('parallel', $('#parallel').val());
		}
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {method: "start"}, function (response) {
				if(response.data==false){
					document.getElementById('doclick').innerHTML = "<b>Stop</b>";
				}else{
					document.getElementById('doclick').innerHTML = "<b>Start</b>";
				}
			});
		});
	});
	$("#clear").click(function(){
		localStorage.clear();
	});
});