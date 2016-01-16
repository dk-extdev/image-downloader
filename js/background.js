//var static_url;
//var count = 0;
localStorage.clear();
chrome.runtime.onMessage.addListener(function(msg, sender,sendResponse) {
        if(msg.from==="content" && sender.tab.id){
            switch(msg.method){
                case "send":{
					//console.log('aaa');
					if (msg.data.length){
						//console.log(msg.data);
						var max_count = localStorage.getItem('max_count');
						var info = JSON.parse(localStorage.getItem('info'));
						var flg = true;
						var parallel = localStorage.getItem('parallel');
						if (parseInt(parallel)>1)
						{
							if (info)
							{
								for (var i=0; i<info.length; i++)
									{
										if (String(info[i].url)==String(msg.url))
										{
											var static_url = info[i].static_url;
											var curr = msg.data.indexOf(static_url);
											if (curr!=-1)
											{
												if (msg.data[parseInt(curr)+1])
												{
													if (parseInt(max_count)>parseInt(curr)+2 || !max_count)
													{
														var dllink = document.createElement('a');
														dllink.setAttribute('href', msg.data[parseInt(curr)+1]);
														dllink.setAttribute('download', (parseInt(curr)+1)+'-'+makeid() );
														document.body.appendChild(dllink);
														dllink.click();
														document.body.removeChild(dllink);
														//static_url = msg.data[parseInt(curr)+1];
														//localStorage.setItem('static_url', msg.data[parseInt(curr)+1]);
														//localStorage.setItem('current_count',parseInt(curr)+2);
														//tmp[i].data = msg.data;
														info[i].static_url = msg.data[parseInt(curr)+1];
														info[i].current_count = parseInt(curr)+2;
														localStorage.setItem('info',JSON.stringify(info));
														flg = false;
													}else if (parseInt(max_count)==parseInt(curr)+2)
													{
														var dllink = document.createElement('a');
														dllink.setAttribute('href', msg.data[parseInt(curr)+1]);
														dllink.setAttribute('download', (parseInt(curr)+1)+'-'+makeid() );
														document.body.appendChild(dllink);
														dllink.click();
														document.body.removeChild(dllink);
														//static_url = msg.data[parseInt(curr)+1];
														info[i].static_url = msg.data[parseInt(curr)+1];
														info[i].current_count = parseInt(curr)+2;
														localStorage.setItem('info',JSON.stringify(info));
														chrome.tabs.getSelected(null, function(tab) {
															chrome.tabs.sendRequest(tab.id, {method: "max"}, function (response) {
															
															});
														});
														flg = false;
													}
													if (parseInt(max_count)==parseInt(info[i].current_count))
													{
														chrome.tabs.getSelected(null, function(tab) {
															chrome.tabs.sendRequest(tab.id, {method: "max"}, function (response) {
															
															});
														});
														flg = false;
													}
													
													break;
												}else{
													chrome.tabs.getSelected(null, function(tab) {
															chrome.tabs.sendRequest(tab.id, {method: "max"}, function (response) {
															});
															chrome.tabs.sendRequest(tab.id, {method: "recheck"}, function (response) {
															});
														});
													flg = false;
													break;
												}
												break;
												
											}
											break;
										}
									}
									if(flg){
										//var tmp=[];
										if (parseInt(max_count)>1 || !max_count)
										{
											var dllink = document.createElement('a');
											dllink.setAttribute('href', msg.data[0]);
											dllink.setAttribute('download', '0'+'-'+makeid());
											document.body.appendChild(dllink);
											dllink.click();
											document.body.removeChild(dllink);
											//static_url=msg.data[0];
											info.push({
												static_url:msg.data[0],
												current_count:1,
												url:msg.url
											});
											localStorage.setItem('info',JSON.stringify(info));
											//localStorage.setItem('static_url', msg.data[0]);
											//localStorage.setItem('current_count',1);

										}else if (parseInt(max_count)==1)
										{
											//var tmp=[];
											var dllink = document.createElement('a');
											dllink.setAttribute('href', msg.data[0]);
											dllink.setAttribute('download', '0'+'-'+makeid());
											document.body.appendChild(dllink);

											dllink.click();
											document.body.removeChild(dllink);
											//static_url=msg.data[0];
											info.push({
												static_url:msg.data[0],
												current_count:1,
												url:msg.url
											});
											localStorage.setItem('info',JSON.stringify(info));
											chrome.tabs.getSelected(null, function(tab) {
												chrome.tabs.sendRequest(tab.id, {method: "max"}, function (response) {
												
												});
											});
										}
										if (parseInt(max_count)==parseInt(info[i].current_count))
										{
											chrome.tabs.getSelected(null, function(tab) {
												chrome.tabs.sendRequest(tab.id, {method: "max"}, function (response) {
												
												});
											});
										}
										break;
									}
									break;
							}else {
								var tmp=[];
								if (parseInt(max_count)>parseInt(parallel) || !max_count)
								{
									//alert('test');
									//for (var j=0; j<Math.floor(parseInt(max_count)/parseInt(parallel)); j+parseInt(parallel))
									for (var j=0; j<1; j+parseInt(parallel))
									{
										//var dllink = [];
										alert('test');
										var dllink0 = document.createElement('a');
										var dllink1 = document.createElement('a');
										var dllink2 = document.createElement('a');
										var dllink3 = document.createElement('a');
										var dllink4 = document.createElement('a');
										dllink0.setAttribute('href', msg.data[j]);
										dllink1.setAttribute('href', msg.data[j+1]);
										dllink2.setAttribute('href', msg.data[j+2]);
										dllink3.setAttribute('href', msg.data[j+3]);
										dllink4.setAttribute('href', msg.data[j+4]);
										dllink0.setAttribute('download', j+'-'+makeid());
										dllink1.setAttribute('download', j+1+'-'+makeid());
										dllink2.setAttribute('download', j+2+'-'+makeid());
										dllink3.setAttribute('download', j+3+'-'+makeid());
										dllink4.setAttribute('download', j+4+'-'+makeid());
										document.body.appendChild(dllink0);
										document.body.appendChild(dllink1);
										document.body.appendChild(dllink2);
										document.body.appendChild(dllink3);
										document.body.appendChild(dllink4);
										//dllink0.click();dllink1.click();dllink2.click();dllink3.click();dllink4.click();
										/*document.body.removeChild(dllink0);document.body.removeChild(dllink1);document.body.removeChild(dllink2);document.body.removeChild(dllink3);document.body.removeChild(dllink4);*/
									}
								}
								
								/*if (parseInt(max_count)>1 || !max_count)
								{
									var dllink = document.createElement('a');
									dllink.setAttribute('href', msg.data[0]);
									dllink.setAttribute('download', '0'+'-'+makeid());
									document.body.appendChild(dllink);
									dllink.click();
									document.body.removeChild(dllink);
									//static_url=msg.data[0];
									tmp.push({
										static_url:msg.data[0],
										current_count:1,
										url:msg.url
									});
									localStorage.setItem('info',JSON.stringify(tmp));
								}else if (parseInt(max_count)==1)
								{
									var tmp=[];
									var dllink = document.createElement('a');
									dllink.setAttribute('href', msg.data[0]);
									dllink.setAttribute('download', '0'+'-'+makeid());
									document.body.appendChild(dllink);
									dllink.click();
									document.body.removeChild(dllink);
									//static_url=msg.data[0];
									tmp.push({
										static_url:msg.data[0],
										current_count:1,
										url:msg.url
									});
									localStorage.setItem('info',JSON.stringify(tmp));
									chrome.tabs.getSelected(null, function(tab) {
										chrome.tabs.sendRequest(tab.id, {method: "max"}, function (response) {
										
										});
									});
								}*/
								break;
							}
						}
						else if (!parallel || parseInt(parallel)==1){
							if (info)
							{
								for (var i=0; i<info.length; i++)
									{
										if (String(info[i].url)==String(msg.url))
										{
											var static_url = info[i].static_url;
											var curr = msg.data.indexOf(static_url);
											if (curr!=-1)
											{
												if (msg.data[parseInt(curr)+1])
												{
													if (parseInt(max_count)>parseInt(curr)+2 || !max_count)
													{
														var dllink = document.createElement('a');
														dllink.setAttribute('href', msg.data[parseInt(curr)+1]);
														dllink.setAttribute('download', (parseInt(curr)+1)+'-'+makeid() );
														document.body.appendChild(dllink);
														dllink.click();
														document.body.removeChild(dllink);
														//static_url = msg.data[parseInt(curr)+1];
														//localStorage.setItem('static_url', msg.data[parseInt(curr)+1]);
														//localStorage.setItem('current_count',parseInt(curr)+2);
														//tmp[i].data = msg.data;
														info[i].static_url = msg.data[parseInt(curr)+1];
														info[i].current_count = parseInt(curr)+2;
														localStorage.setItem('info',JSON.stringify(info));
														flg = false;
													}else if (parseInt(max_count)==parseInt(curr)+2)
													{
														var dllink = document.createElement('a');
														dllink.setAttribute('href', msg.data[parseInt(curr)+1]);
														dllink.setAttribute('download', (parseInt(curr)+1)+'-'+makeid() );
														document.body.appendChild(dllink);
														dllink.click();
														document.body.removeChild(dllink);
														//static_url = msg.data[parseInt(curr)+1];
														info[i].static_url = msg.data[parseInt(curr)+1];
														info[i].current_count = parseInt(curr)+2;
														localStorage.setItem('info',JSON.stringify(info));
														chrome.tabs.getSelected(null, function(tab) {
															chrome.tabs.sendRequest(tab.id, {method: "max"}, function (response) {
															
															});
														});
														flg = false;
													}
													if (parseInt(max_count)==parseInt(info[i].current_count))
													{
														chrome.tabs.getSelected(null, function(tab) {
															chrome.tabs.sendRequest(tab.id, {method: "max"}, function (response) {
															
															});
														});
														flg = false;
													}
													
													break;
												}else{
													chrome.tabs.getSelected(null, function(tab) {
															chrome.tabs.sendRequest(tab.id, {method: "max"}, function (response) {
															});
															chrome.tabs.sendRequest(tab.id, {method: "recheck"}, function (response) {
															});
														});
													flg = false;
													break;
												}
												break;
												
											}
											break;
										}
									}
									if(flg){
										//var tmp=[];
										if (parseInt(max_count)>1 || !max_count)
										{
											var dllink = document.createElement('a');
											dllink.setAttribute('href', msg.data[0]);
											dllink.setAttribute('download', '0'+'-'+makeid());
											document.body.appendChild(dllink);
											dllink.click();
											document.body.removeChild(dllink);
											//static_url=msg.data[0];
											info.push({
												static_url:msg.data[0],
												current_count:1,
												url:msg.url
											});
											localStorage.setItem('info',JSON.stringify(info));
											//localStorage.setItem('static_url', msg.data[0]);
											//localStorage.setItem('current_count',1);

										}else if (parseInt(max_count)==1)
										{
											//var tmp=[];
											var dllink = document.createElement('a');
											dllink.setAttribute('href', msg.data[0]);
											dllink.setAttribute('download', '0'+'-'+makeid());
											document.body.appendChild(dllink);

											dllink.click();
											document.body.removeChild(dllink);
											//static_url=msg.data[0];
											info.push({
												static_url:msg.data[0],
												current_count:1,
												url:msg.url
											});
											localStorage.setItem('info',JSON.stringify(info));
											chrome.tabs.getSelected(null, function(tab) {
												chrome.tabs.sendRequest(tab.id, {method: "max"}, function (response) {
												
												});
											});
										}
										if (parseInt(max_count)==parseInt(info[i].current_count))
										{
											chrome.tabs.getSelected(null, function(tab) {
												chrome.tabs.sendRequest(tab.id, {method: "max"}, function (response) {
												
												});
											});
										}
										break;
									}
									break;
							}else {
								var tmp=[];
								if (parseInt(max_count)>1 || !max_count)
								{
									var dllink = document.createElement('a');
									dllink.setAttribute('href', msg.data[0]);
									dllink.setAttribute('download', '0'+'-'+makeid());
									document.body.appendChild(dllink);
									dllink.click();
									document.body.removeChild(dllink);
									//static_url=msg.data[0];
									tmp.push({
										static_url:msg.data[0],
										current_count:1,
										url:msg.url
									});
									localStorage.setItem('info',JSON.stringify(tmp));
									//localStorage.setItem('static_url', msg.data[0]);
									//localStorage.setItem('current_count',1);

								}else if (parseInt(max_count)==1)
								{
									var tmp=[];
									var dllink = document.createElement('a');
									dllink.setAttribute('href', msg.data[0]);
									dllink.setAttribute('download', '0'+'-'+makeid());
									document.body.appendChild(dllink);
									dllink.click();
									document.body.removeChild(dllink);
									//static_url=msg.data[0];
									tmp.push({
										static_url:msg.data[0],
										current_count:1,
										url:msg.url
									});
									localStorage.setItem('info',JSON.stringify(tmp));
									chrome.tabs.getSelected(null, function(tab) {
										chrome.tabs.sendRequest(tab.id, {method: "max"}, function (response) {
										
										});
									});
								}
								/*if (parseInt(max_count)==parseInt(localStorage.getItem('current_count')))
								{
									chrome.tabs.getSelected(null, function(tab) {
										chrome.tabs.sendRequest(tab.id, {method: "max"}, function (response) {
										
										});
									});
								}*/
								break;
							}
						}

						break;
					}
					break;
				}
			}
		}
});
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}