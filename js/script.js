var data = {
	link:	[],
	started: true
};
var run;
var send_back;
/*var process = setInterval(function(){
	window.scrollTo(0, 1000 + document.body.offsetHeight);
	//getImage();
},1000);
		//fbuidg.started = true;*/

/*setInterval(function(){
	window.scrollTo(0, 2000 + document.body.scrollHeight);
	getImgSrc();
},3000);*/
///alert('aaa');


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "start"){
		getData();
		sendResponse({data: data.started});
	}else if(request.method == "getStatus"){
		sendResponse({data: data.started});
	}else if(request.method == "recheck"){
		window.scrollTo(0, 2000 + document.body.scrollHeight);
		getData();
		//sendResponse({data: data.started});
	}else if(request.method == "max"){
		clearInterval(run);
		clearInterval(send_back);
		data.started = true;
	}else sendResponse({});
});
function getData(){
	if(data.started){
		//run = setInterval(function(){
			//console.log(window.location.href);
			//window.scrollTo(0, 2000 + document.body.scrollHeight);
			getImgSrc();
		//},1000);
		send_back = setInterval(function(){
			if (data.link.length)
			{
				chrome.runtime.sendMessage({
				from: "content",
				method: "send",
				url:	window.location.href,
				data:	data.link
				});
			}
		},1000);
		data.started = false;
	}else{
		clearInterval(run);
		clearInterval(send_back);
		data.started = true;
	}
}

function getImgSrc(){
	data.link = [];
	$(".fadeContainer").each(function(){
		//console.log($(this).find('img').attr('src').replace("236x", "736x"));
		var img_url = $(this).find('img').attr('src').replace("236x", "736x");
		data.link.push(img_url);
	});
}

//getData();

