/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
FB LeadJacker - Facebook Graph Search Scraper
Copyright 2014 Pat Friedl
http://www.fbleadjacker.com
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
var j = jQuery.noConflict();
var fbljVersion = '1.3.0';
var fbljIsFetching = false;
var fbljIsBatching = false;
var fbljUIDs = new Array();
var fbljScrollTimer = null;
var fbljSavedSearches = { searches: [] };
var fbljOptions = { emails: false, names: false, random: false, timer: 2000, btimer: 10000 };
var fbljBatches = { batches: [] };
var fbljMaxChecks = 600; // check time of 50ms*600=30sec
var fbljNumChecks = 0;
var fbljLoadWaitTime = fbljOptions.timer;
var fbljBatchWaitTime = fbljOptions.btimer;
var fbljMinTime = 350;
var fbljMaxTime = 10000;
var fbljMinBatchTime = 5000;
var fbljMaxBatchTime = 120000;
var fbljLoaderTimer = 100;
var fbljMaxPages = 24;
var fbljPgCont = 0;

var $fbljContainer;
var $fbljStatus;
var fbljLoadingResults = 'Loading more results...';
var fbljNoMoreResults = 'End of results';
var fbljNoResults = "Sorry, we couldn't find any results for this search";
var fbljLoadingSpanPath = '#browse_result_area div._akp span._akq:contains('+fbljLoadingResults+')';
var fbljNoResultsSpanPath = '#browse_result_area span:contains('+fbljNoResults+')';
var $fbljLoadingEl;
var fbljNoMoreSpanPath = '#browse_result_area div.phm:contains('+fbljNoMoreResults+')';
var $fbljNoMoreEl;

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Alerts, Messages & Button Text
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
var fbljSiteLink = 'http://www.fbleadjacker.com';

var fbljMsgStartMining = 'Start Mining';
var fbljMsgStopMining = 'Stop Mining';
var fbljMsgBatch = 'Add to Batch';
var fbljMsgBatchStates = 'Add State Batches';
var fbljMsgAddStates = "Ok";
var fbljMsgAddAllStates = "Add All";
var fbljMsgClearStates = "Clear";
var fbljMsgDownload = 'Download IDs';
var fbljMsgWorking = 'Working...';
var fbljMsgOptions = 'Options';
var fbljMsgEmails = 'Collect FB Emails';
var fbljMsgNames = 'Collect Names';
var fbljMsgRandom = 'Randomize Scroll Time';
var fbljMsgWaitTime = 'Wait Time: ';
var fbljMsgBatchWaitTime = 'Batch Wait Time: ';
var fbljMsgSaveSearch = 'Save This Search';
var fbljMsgSavedSearches = 'Saved Searches';
var fbljMsgLikePages = 'Like Pages';
var fbljMsgBulkLike = 'Post/Comment Like';
var fbljMsgReset = 'Reset';
var fbljMsgDoneMining = 'Done Fetching User IDs!';
var fbljMsgHideFBLJ = 'Hide FB LeadJacker';
var fbljMsgShowFBLJ = 'Show FB LeadJacker';
var fbljMsgFetched = ' IDs fetched';
var fbljMsgSavePrompt = 'Enter a Name for Your Search';
var fbljMsgBatchPrompt = 'Enter a Nickname for This Search';
var fbljMsgNoSearches = 'No saved searches';
var fbljMsgNothingToLike = 'No Posts or Comments to Like';

var fbljMsgConfirmReset  = 'Are you sure you want to reset?\n';
    fbljMsgConfirmReset += 'The IDs you\'ve fetched will be cleared!';

var fbljMsgLikedEnough  = 'You\'ve already reached a safe number of\n';
    fbljMsgLikedEnough += 'page likes for this session. Let\'s take it easy.';

j(document).ready(function(){

    // shorten that annoying ads manager search input!
    if(String(document.location).indexOf('ads/manage') != -1) {
        j('.inputtext.UIAdmgrSearch.DOMControl_placeholder').css({'width':'160px'});
    }

    // add the interface to fb
    j('body').prepend('<div id="fblj-container"></div>');
    $fbljContainer = j('#fblj-container');
    fbljHTML  = '';
    fbljHTML += '<button id="fblj-btn-scrape" class="fblj-btn fblj-start">'+fbljMsgStartMining+'</button>';
    fbljHTML += '<button id="fblj-btn-batch" class="fblj-btn hide-on-fetch">'+fbljMsgBatch+'</button>';
    fbljHTML += '<div id="fblj-div-batches"></div>';
    fbljHTML += '<button id="fblj-btn-batch-states" class="fblj-btn hide-on-fetch">'+fbljMsgBatchStates+'</button>';
    fbljHTML += '<button id="fblj-btn-options" class="fblj-btn hide-on-fetch">'+fbljMsgOptions+'</button>';
    fbljHTML += '<div id="fblj-div-options" class="hide-on-fetch">';
    fbljHTML += '<div><input type="checkbox" id="fblj-emails"> <label for="fblj-emails">'+fbljMsgEmails+'</label></div>';
    fbljHTML += '<div><input type="checkbox" id="fblj-names"> <label for="fblj-names">'+fbljMsgNames+'</label></div>';
    fbljHTML += '<div><input type="checkbox" id="fblj-random"> <label for="fblj-random">'+fbljMsgRandom+'</label></div>';
    fbljHTML += '<div id="fblj-slide-container">';
    fbljHTML += '<label for="fblj-timer-slide">'+fbljMsgWaitTime;
    fbljHTML += '<span id="fblj-timer-span">'+fbljLoadWaitTime/1000+' sec.</span>';
    fbljHTML += '</label>';
    fbljHTML += '<input type="range" id="fblj-timer-slide" min="'+fbljMinTime+'" max="'+fbljMaxTime+'" value="'+fbljLoadWaitTime+'" step="10">';
    fbljHTML += '</div>';
    fbljHTML += '<div id="fblj-bslide-container">';
    fbljHTML += '<label for="fblj-btimer-slide">'+fbljMsgBatchWaitTime;
    fbljHTML += '<span id="fblj-btimer-span">'+fbljBatchWaitTime/1000+' sec.</span>';
    fbljHTML += '</label>';
    fbljHTML += '<input type="range" id="fblj-btimer-slide" min="'+fbljMinBatchTime+'" max="'+fbljMaxBatchTime+'" value="'+fbljBatchWaitTime+'" step="1000">';
    fbljHTML += '</div>';
    fbljHTML += '</div>';
    fbljHTML += '<button id="fblj-btn-save" class="fblj-btn hide-on-fetch">'+fbljMsgSaveSearch+'</button>';
    fbljHTML += '<button id="fblj-btn-saved" class="fblj-btn hide-on-fetch">'+fbljMsgSavedSearches+'</button>';
    fbljHTML += '<div id="fblj-div-saved-searches" class="hide-on-fetch"></div>';
    fbljHTML += '<button id="fblj-btn-download" class="fblj-btn hide-on-fetch hide-if-empty">'+fbljMsgDownload+'</button>';
    fbljHTML += '<button id="fblj-btn-reset" class="fblj-btn hide-on-fetch hide-if-empty">'+fbljMsgReset+'</button>';
    fbljHTML += '<button id="fblj-btn-liker" class="fblj-btn hide-on-fetch last-btn">'+fbljMsgLikePages+'</button>';
    /*fbljHTML += '<button id="fblj-btn-bulk-liker" class="fblj-btn hide-on-fetch last-btn">'+fbljMsgBulkLike+'</button>';*/
    fbljHTML += '<div id="fblj-status">'+fbljUIDs.length+fbljMsgFetched+'</div>';
    fbljHTML += '<div id="fblj-version"><a href="'+fbljSiteLink+'" target="_blank">FB LeadJacker v'+fbljVersion+'</div>';
    $fbljContainer.html(fbljHTML);

    fbljAddStates();

    // get the reference to the status div
    $fbljStatus = j('#fblj-status');

    // append the user settings menu
    j('#userNavigation').append('<li class="menuDivider"></li>');
    j('#userNavigation').append('<li role="menuitem"><a id="fbljShowHideFBLJ" class="navSubmenu" href="#">'+fbljMsgShowFBLJ+'</a></li>');

    // see if we came from a non search page and show if the session is set
    if(sessionStorage.fbljShow == 1){
        j('#fblj-container').show();
        sessionStorage.fbljShow = 0;
    }
    if(j('#fblj-container').is(':visible')){
        j('#fbljShowHideFBLJ').html(fbljMsgHideFBLJ);
    }

    // show/hide button action
    j('#fbljShowHideFBLJ').on('click',function(){
        j('#fbljStateContainer').hide();
        isVisible = j('#fblj-container').is(':visible');
        if(isVisible){
            j('#fblj-container').hide();
            j('#fbljShowHideFBLJ').html(fbljMsgShowFBLJ);
        } else {
            j('#fblj-container').show();
            j('#fbljShowHideFBLJ').html(fbljMsgHideFBLJ);
        }
    });

    // start/stop button
    j('#fblj-btn-scrape').on('click',function(){
        j('#fbljStateContainer').hide();
        fbljToggleFetching();
    });

    // add to batch function
    j('#fblj-btn-batch').on('click',function(){
        if(fbljOnSearchPage()){
            batchName = j.trim(prompt(fbljMsgBatchPrompt));
            if(batchName != ''){
                srchLink = String(document.location);
                fbljBatches.batches.push({'batchName':batchName, 'srchLink': srchLink});
                fbljSaveBatches();
            }
        } else {
            fbljGoToSearch();
        }
    });

    j('#fblj-btn-batch-states').on('click',function(){
        thisY = j(this).offset().top+2+'px';
        j('#fbljStateContainer').css({'top':thisY});
        j('#fbljStateContainer').toggle();
    });

    // search options button
    j('#fblj-btn-options').on('click',function(){
        j('#fbljStateContainer').hide();
        j('#fblj-div-options').slideToggle('fast');
    });

    // clear state checkboxes
    j('#fblj-btn-clear').on('click',function(){
        j('#fbljStateContainer input[type="checkbox"]').attr('checked',false);
    });

    // bulk add state searches
    j('#fblj-btn-ok').on('click',function(){
        if(fbljOnSearchPage()){
            batchName = j.trim(prompt(fbljMsgBatchPrompt));
            if(batchName != ''){
                srchLink = String(document.location);
                srchLink = srchLink.replace('/intersect','');
                states = j('#fbljStateContainer input:checked');
                if(states.length > 0){
                    states.each(function(){
                        $this = j(this);
                        theId = $this.data('id');
                        theName = $this.attr('id').split('-')[1];
                        stateBatch = batchName+'-'+theName;
                        stateSearch = srchLink + '/'+theId+'/residents/present/intersect';
                        fbljBatches.batches.push({'batchName':stateBatch, 'srchLink': stateSearch});
                        fbljSaveBatches();
                    });
                }
                j('#fblj-btn-clear').trigger('click');
                j('#fbljStateContainer').hide();
            }
        } else {
            fbljGoToSearch();
        }
    });

    j('#fblj-btn-add-all').on('click',function(){
        j('#fbljStateContainer input[type=checkbox]').attr('checked','checked');
        j('#fblj-btn-ok').trigger('click');
    });

    // set options function
    j('#fblj-emails, #fblj-names, #fblj-random').on('click',function(){
        j('#fbljStateContainer').hide();
        fbljSetOptions();
    });

    // timer slider
    j('#fblj-timer-slide').on('mousemove change',function(e){
        fbljLoadWaitTime = j(this).val();
        j('#fblj-timer-span').html(fbljLoadWaitTime/1000+' sec.');
        fbljSetOptions();
    });

    j('#fblj-btimer-slide').on('mousemove change',function(e){
        fbljBatchWaitTime = j(this).val();
        j('#fblj-btimer-span').html(fbljBatchWaitTime/1000+' sec.');
        fbljSetOptions();
    });

    // save search button
    j('#fblj-btn-save').on('click',function(){
        j('#fbljStateContainer').hide();
        if(fbljOnSearchPage()){
            srchName = j.trim(prompt(fbljMsgSavePrompt));
            if(srchName != ''){
                srchLink = String(document.location);
                if(!fbljSavedSearches){
                    fbljSavedSearches = { searches: [] };
                }
                fbljSavedSearches.searches.push({'srchName':srchName, 'srchLink': srchLink});
                fbljSaveSearches();
            }
        } else {
            fbljGoToSearch();
        }
    });

    // saved search toggle
    j('#fblj-btn-saved').on('click',function(){
        j('#fbljStateContainer').hide();
        if(fbljSavedSearches){
            j('#fblj-div-saved-searches').slideToggle('fast');
        } else {
            alert(fbljMsgNoSearches);
        }
    });

    // scrape reset button
    j('#fblj-btn-reset').on('click',function(){
        if(confirm(fbljMsgConfirmReset)){
            fbljReset();
        }
    });

    j('#fblj-btn-liker').on('click',function(){
        j('#fbljStateContainer').hide();
        numLiked = sessionStorage.numLiked;
        numLiked = (numLiked == null)? 0 : numLiked;
        numLeftToLike = fbljMaxPages - numLiked;
        if(numLiked < fbljMaxPages && String(document.location).indexOf('/pages') != -1){
            likeButtons = document.querySelectorAll('label.PageLikeButton input[value="Like"]');
            numToLike = (numLeftToLike > likeButtons.length)? likeButtons.length : numLeftToLike;
            for(i = 0; i < numToLike; i++){
                likeButtons[i].click();
                numLiked++;
            }
            sessionStorage.numLiked = numLiked;
            if(numLiked < fbljMaxPages){
                window.scrollTo(0, 1000 + document.body.offsetHeight);
            }
        } else {
            if(String(document.location).indexOf('/pages') == -1){
                fbljGoToSearch('https://www.facebook.com/pages');
            } else if(numLiked >= fbljMaxPages){
                alert(fbljMsgLikedEnough);
            }
        }
    });

    j('#fblj-btn-bulk-liker').on('click',function(){
        j('#fbljStateContainer').hide();
        likes = document.querySelectorAll('.UFILikeLink[title*="Like this"]');
        if(likes.length > 0){
            fbljBulkLike(likes);
        } else {
            alert(fbljMsgNothingToLike);
        }
    });

    // uid download button
    j('#fblj-btn-download').on('click',function(){
        fbljDownloadIDs();
    });

    fbljInit();

});

function fbljInit(){
    fbljShowHideButtons();
    fbljPopulateBatches();
    fbljPopulateSearches();
    fbljGetOptions();
    if(fbljBatches.batches.length <= 0){
        sessionStorage.fbljIsBatching = 0;
        sessionStorage.fbljStartBatch = 0;
    }
    if(
        sessionStorage.fbljIsBatching == 1 &&
        sessionStorage.fbljStartBatch == 1
    ){
        sessionStorage.fbljStartBatch = 0;
        fbljToggleFetching();
    }
}

function fbljGetWaitTime(){
    if(fbljOptions.random){
        return Math.floor(Math.random()*(fbljMaxTime-fbljMinTime+1))+fbljMinTime;
    } else {
        return fbljLoadWaitTime;
    }
}

function fbljBulkLike(a){
    if(a.length > 0){
        a[0].click();
        a.shift();
        setTimeout(function(){
            fbljBulkLikes(a);
        },2000);
    }
}

function fbljDownloadIDs(n){
    $fbljContainer.find('button').attr('disabled','disabled');
    j('#fblj-div-options, #fblj-div-saved-searches').hide();
    j('#fblj-btn-download').html(fbljMsgWorking);

    uidFile = new Blob([fbljUIDs.join('\r\n')], {type:'text/plain'});

    d = new Date();
    linkName = 'fblj-download-'+d.getTime();
    uidFileName  = (n == null)? 'user-ids-' : n+'-';
    uidFileName += d.getFullYear();
    uidFileName += ((d.getMonth()+1)<10)? '0'+(d.getMonth()+1) : (d.getMonth()+1);
    uidFileName += (d.getDate()<10)? '0'+d.getDate()+'-' : d.getDate()+'-';
    uidFileName += (d.getHours()<10)? '0'+d.getHours() : d.getHours();
    uidFileName += (d.getMinutes()<10)? '0'+d.getMinutes() : d.getMinutes();
    uidFileName += (d.getSeconds()<10)? '0'+d.getSeconds()+'.txt' : d.getSeconds()+'.txt';

    j('#fblj-container').append(
        '<a id="'+linkName+'" '+
        'download="'+uidFileName+'" '+
        'href="'+window.webkitURL.createObjectURL(uidFile)+'"'+
        '>DOWNLOAD USER IDS</a>'
    );

    downloadLink = document.getElementById(linkName);
    downloadLink.click();
    j('#'+linkName).remove();

    j('#fblj-btn-download').html(fbljMsgDownload);
    $fbljContainer.find('button').removeAttr('disabled');
}

function fbljOnSearchPage(){
    if(String(document.location).indexOf('/search') != -1){
        return true;
    } else {
        return false;
    }
}

function fbljGoToSearch(s){
    if(s == null) { s = 'https://www.facebook.com/search/me/friends'; }
    sessionStorage.fbljShow = 1;
    document.location = s;
}

function fbljToggleFetching(){
    clearTimeout(fbljScrollTimer);
    if(fbljIsFetching){
        fbljIsFetching = false;
        j('#fblj-btn-scrape').removeClass('fblj-stop').addClass('fblj-start').html(fbljMsgStartMining);
    } else {

        if(fbljBatches.batches.length > 0){
            sessionStorage.fbljIsBatching = 1;
            fbljIsBatching = true;
            fbljGetOptions();
            if(String(document.location) != fbljBatches.batches[0].srchLink){
                sessionStorage.fbljStartBatch = 1;
                fbljStartBatch = true;
                fbljGoToSearch(fbljBatches.batches[0].srchLink);
                return false;
            }
        } else {
            sessionStorage.fbljIsBatching = 0;
            sessionStorage.fbljStartBatch = 0;
            fbljIsBatching = false;
        }

        if(fbljOnSearchPage()){
            fbljIsFetching = true;
            j('#fblj-btn-scrape').removeClass('fblj-start').addClass('fblj-stop').html(fbljMsgStopMining);
            $fbljLoadingEl = j(fbljLoadingSpanPath);
            fbljGetIdsFromSearch();
        } else {
            fbljGoToSearch();
        }
    }
    fbljShowHideButtons();
}

function fbljPopulateBatches(){
    fbljBatches = JSON.parse(localStorage.getItem('fbljBatches'));
    if(fbljBatches == null){
        fbljBatches = { batches: [] };
    }
    j('#fblj-div-batches').html('');
    if(fbljBatches.batches.length > 0){
        batches = '<p><b>Batches to Process</b></p>';
        savedBatches = fbljBatches.batches;
        for(i = 0; i < savedBatches.length; i++){
            batches += '<div class="saved-search">';
            batches += '<div class="delete-batch" data-batch="'+i+'"></div>';
            batches += '<div class="do-batch">'+savedBatches[i].batchName+'</div>';
            batches += '</div>';
        }
        if(savedBatches.length > 0){
            j('#fblj-div-batches').html(batches);
            j('.delete-batch').on('click',function(){
                $this = j(this);
                idx = $this.attr('data-batch');
                fbljBatches.batches.splice(idx, 1);
                fbljSaveBatches();
            });
        }
    }
}

function fbljSaveBatches(){
    localStorage.setItem('fbljBatches',JSON.stringify(fbljBatches));
    fbljPopulateBatches();
}

function fbljPopulateSearches(){
    fbljSavedSearches = JSON.parse(localStorage.getItem('fbljSavedSearches'));
    j('#fblj-btn-saved').hide();
    if(fbljSavedSearches){
        searches = '';
        savedSearches = fbljSavedSearches.searches;
        for(i = 0; i < savedSearches.length; i++){
            searches += '<div class="saved-search">';
            searches += '<div class="delete-search" data-search="'+i+'"></div>';
            searches += '<a class="do-search" href="'+savedSearches[i].srchLink+'">'+savedSearches[i].srchName+'</a>';
            searches += '</div>';
        }
        j('#fblj-div-saved-searches').html(searches);
        if(savedSearches.length > 0){
            j('#fblj-btn-saved').show();
            j('.delete-search').on('click',function(){
                $this = j(this);
                idx = $this.attr('data-search');
                fbljSavedSearches.searches.splice(idx, 1);
                fbljSaveSearches()
            });
        } else {
            j('#fblj-btn-saved').hide();
        }
    }
}

function fbljSaveSearches(){
    localStorage.setItem('fbljSavedSearches',JSON.stringify(fbljSavedSearches));
    fbljPopulateSearches();
}

function fbljReset(){
    fbljIsFetching = false;
    fbljPgCont = 0;
    fbljUIDs = new Array();
    $fbljStatus.html(fbljUIDs.length+fbljMsgFetched);
    fbljShowHideButtons();
    window.scrollTo(0, 0);
}

function fbljGetOptions(){
    tmpOptions = JSON.parse(localStorage.getItem('fbljOptions'));
    if(tmpOptions){
        fbljOptions.emails = tmpOptions.emails;
        fbljOptions.names = tmpOptions.names;
        fbljOptions.random = tmpOptions.random;
        fbljOptions.timer = tmpOptions.timer;
        fbljOptions.btimer = tmpOptions.btimer;
    }
    fbljLoadWaitTime = (fbljOptions.timer != null)? fbljOptions.timer : fbljMaxTime;
    fbljLoadWaitTime = (fbljLoadWaitTime < fbljMinTime)? fbljMinTime : fbljLoadWaitTime;
    fbljBatchWaitTime = (fbljOptions.btimer != null)? fbljOptions.btimer : fbljMaxBatchTime;
    fbljBatchWaitTime = (fbljBatchWaitTime < fbljMinBatchTime)? fbljMinBatchTime : fbljBatchWaitTime;
    j('#fblj-timer-span').html(fbljLoadWaitTime/1000+' sec.');
    j('#fblj-timer-slide').val(fbljLoadWaitTime);
    j('#fblj-btimer-span').html(fbljBatchWaitTime/1000+' sec.');
    j('#fblj-btimer-slide').val(fbljBatchWaitTime);
    document.getElementById('fblj-emails').checked = fbljOptions.emails;
    document.getElementById('fblj-names').checked = fbljOptions.names;
    document.getElementById('fblj-random').checked = fbljOptions.random;
    j('#fblj-timer-slide').trigger('change');
}

function fbljSetOptions(){
    fbljOptions.emails = document.getElementById('fblj-emails').checked;
    fbljOptions.names = document.getElementById('fblj-names').checked;
    fbljOptions.random = document.getElementById('fblj-random').checked;
    fbljOptions.timer = j('#fblj-timer-slide').val();
    fbljOptions.btimer = j('#fblj-btimer-slide').val();
    fbljLoadWaitTime = j('#fblj-timer-slide').val();
    fbljBatchWaitTime = j('#fblj-btimer-slide').val();
    localStorage.setItem('fbljOptions',JSON.stringify(fbljOptions));
}

function fbljGetIdsFromSearch(){

    /* BEGIN TESTING FOR FACEBOOK HANGUP */
    pageContainers = document.querySelectorAll('div[id*="fbBrowseScrollingPagerContainer"] div._1yt div.fbljDelete');
    for(i = fbljPgCont; i < pageContainers.length; i++){
        pageContainers[i].innerHTML = '';
    }
    fbljPgCont = pageContainers.length;
    /* END TESTING FOR FACEBOOK HANGUP */

    if(fbljIsFetching){

        var gotResults = (j(fbljNoResultsSpanPath).length <= 0)? true : false;

        if(gotResults){
            if(fbljUIDs.length <=0){
                $uidBatch = j('#browse_result_area div[data-bt*="{\\"id"]');
            } else {
                $uidBatch = j('div[id*="fbBrowseScrollingPagerContainer"] div[data-bt*="{\\"id"]');
            }
        } else {
            $uidBatch = new Array();
        }

        for(i = 0; i < $uidBatch.length; i++){

            userName = '';
            userEmail = '';
            userJSON = JSON.parse($uidBatch[i].getAttribute('data-bt'));

            $uidBatch[i].parentNode.className += ' fbljDelete'; // mark for deletion!

            if(fbljOptions.emails || fbljOptions.names){
                userInfo = $uidBatch[i].querySelectorAll('div[data-bt*="\\"title"] a');

                if(fbljOptions.names) {
                    userName = userInfo[0].innerHTML;
                    if(userName.indexOf(' <span') != -1){
                        userName = userName.substring(0,userName.indexOf(' <span'));
                    }
                    userName = ',"'+userName+'"';
                }

                if(fbljOptions.emails){
                    userEmail = userInfo[0].getAttribute('href');
                    userEmail = ',"'+userEmail.substring(userEmail.indexOf('.com/')+5,userEmail.indexOf('?'))+'@facebook.com"';
                }

            }

            fbljUIDs.push(userJSON.id+userName+userEmail);
            $fbljStatus.html(fbljUIDs.length+fbljMsgFetched);
        }

        $fbljNoMoreEl = j(fbljNoMoreSpanPath);
        if($fbljNoMoreEl.length > 0 || fbljNumChecks > fbljMaxChecks || !gotResults){

            fbljNumChecks = 0;

            if(fbljIsFetching){

                if(fbljIsBatching){

                    if(gotResults){
                        fbljDownloadIDs(fbljBatches.batches[0].batchName);
                    }
                    fbljBatches.batches.shift();
                    fbljSaveBatches();
                    fbljReset();

                    setTimeout(function(){
                        if(fbljBatches.batches.length > 0){
                            sessionStorage.fbljStartBatch = 1;
                            sessionStorage.fbljShow = 1;
                            fbljIsBatching = true;
                        } else {
                            sessionStorage.fbljStartBatch = 0;
                            sessionStorage.fbljShow = 0;
                            fbljIsBatching = false;
                            fbljIsFetching = true;
                        }
                        fbljToggleFetching();
                    }, fbljOptions.btimer);

                } else {

                    sessionStorage.fbljStartBatch = 0;
                    sessionStorage.fbljShow = 0;
                    fbljIsBatching = false;
                    fbljToggleFetching();
                    alert(fbljMsgDoneMining);

                }
            }

        } else {
            fbljStartNextBatch();
        }

        // clear cache if need be
        /*
        if(fbljPgCont%240 == 0){
            lastHour = (new Date()).getTime() - 1000 * 60 * 60;
            chrome.browsingData.remove({ "since" : lastHour }, {
                "appcache": false,
                "cache": true,
                "cookies": false,
                "downloads": false,
                "fileSystems": false,
                "formData": false,
                "history": false,
                "indexedDB": false,
                "localStorage": false,
                "serverBoundCertificates": false,
                "pluginData": false,
                "passwords": false,
                "webSQL": false
            }, function(){
                console.log('cache cleared!');
            });
        }
        */

        pageContainers = null;
        $uidBatch = null;
        $fbljNoMoreEl = null;
    }
}

function fbljShowHideButtons(){
    if(!fbljIsFetching){
        j('#fblj-btn-options').show();
        j('#fblj-emails, #fblj-names').removeAttr('disabled');
        j('#fblj-btn-save').show();
        j('#fblj-btn-batch').show();
        j('#fblj-btn-batch-states').show();
        if(fbljUIDs.length > 0){
            j('#fblj-btn-download').show();
            j('#fblj-btn-reset').show();
        } else {
            j('#fblj-btn-download').hide();
            j('#fblj-btn-reset').hide();
        }
        if(fbljSavedSearches && fbljSavedSearches.searches.length > 0){
            j('#fblj-btn-saved').show();
        }
        j('#fblj-btn-liker').show();
        j('#fblj-btn-bulk-liker').show();
    } else {
        j('#fblj-btn-batch').hide();
        j('#fblj-btn-batch-states').hide();
        j('#fblj-emails, #fblj-names').attr('disabled','disabled');
        j('#fblj-btn-save').hide();
        j('#fblj-btn-saved').hide();
        j('#fblj-div-saved-searches').hide();
        j('#fblj-btn-liker').hide();
        j('#fblj-btn-download').hide();
        j('#fblj-btn-reset').hide();
        j('#fblj-btn-liker').hide();
        j('#fblj-btn-bulk-liker').hide();
    }
}

function fbljStartNextBatch(){
    if(fbljIsFetching){
        fbljNumChecks = 0;
        window.scrollTo(0, 0);
        window.scrollTo(0, 1000 + document.body.offsetHeight);
        fbljScrollTimer = setTimeout(function(){
            fbljWaitForUserLoad();
        },fbljGetWaitTime());
    }
}

function fbljWaitForUserLoad(){
    clearTimeout(fbljScrollTimer);
    if(fbljIsFetching){
        fbljNumChecks++;
        if(fbljNumChecks > fbljMaxChecks){
            fbljGetIdsFromSearch();
        }
        if($fbljLoadingEl.is(':visible')){
            fbljScrollTimer = setTimeout(function(){ fbljWaitForUserLoad(); },fbljLoaderTimer);
        } else {
            fbljGetIdsFromSearch();
        }
    }
}

function fbljAddStates(){
    if(j('#fbljStateContainer').length <= 0){
        states = '<div id="fbljStateContainer">';
        states += '<ul class="fblj-states">';
        states += '<li><input type="checkbox" data-id="104037882965264" id="st-AL"><label for="st-AL">Alabama</label></li>';
        states += '<li><input type="checkbox" data-id="108083605879747" id="st-AK"><label for="st-AK">Alaska</label></li>';
        states += '<li><input type="checkbox" data-id="108296539194138" id="st-AZ"><label for="st-AZ">Arizona</label></li>';
        states += '<li><input type="checkbox" data-id="111689148842696" id="st-AR"><label for="st-AR">Arkansas</label></li>';
        states += '<li><input type="checkbox" data-id="108131585873862" id="st-CA"><label for="st-CA">California</label></li>';
        states += '<li><input type="checkbox" data-id="106153826081984" id="st-CO"><label for="st-CO">Colorado</label></li>';
        states += '<li><input type="checkbox" data-id="112750485405808" id="st-CT"><label for="st-CT">Connecticut</label></li>';
        states += '<li><input type="checkbox" data-id="105643859470062" id="st-DE"><label for="st-DE">Delaware</label></li>';
        states += '<li><input type="checkbox" data-id="109714185714936" id="st-FL"><label for="st-FL">Florida</label></li>';
        states += '<li><input type="checkbox" data-id="103994709636969" id="st-GA"><label for="st-GA">Georgia</label></li>';
        states += '<li><input type="checkbox" data-id="113667228643818" id="st-HI"><label for="st-HI">Hawaii</label></li>';
        states += '<li><input type="checkbox" data-id="108037302558105" id="st-ID"><label for="st-ID">Idaho</label></li>';
        states += '<li><input type="checkbox" data-id="112386318775352" id="st-IL"><label for="st-IL">Illinois</label></li>';
        states += '<li><input type="checkbox" data-id="111957282154793" id="st-IN"><label for="st-IN">Indiana</label></li>';
        states += '<li><input type="checkbox" data-id="104004246303834" id="st-IA"><label for="st-IA">Iowa</label></li>';
        states += '<li><input type="checkbox" data-id="105493439483468" id="st-KS"><label for="st-KS">Kansas</label></li>';
        states += '<li><input type="checkbox" data-id="109438335740656" id="st-KY"><label for="st-KY">Kentucky</label></li>';
        states += '<li><input type="checkbox" data-id="112822538733611" id="st-LA"><label for="st-LA">Louisiana</label></li>';
        states += '<li><input type="checkbox" data-id="108603925831326" id="st-ME"><label for="st-ME">Maine</label></li>';
        states += '<li><input type="checkbox" data-id="108178019209812" id="st-MD"><label for="st-MD">Maryland</label></li>';
        states += '<li><input type="checkbox" data-id="112439102104396" id="st-MA"><label for="st-MA">Massachusetts</label></li>';
        states += '<li><input type="checkbox" data-id="109706309047793" id="st-MI"><label for="st-MI">Michigan</label></li>';
        states += '<li><input type="checkbox" data-id="112577505420980" id="st-MN"><label for="st-MN">Minnesota</label></li>';
        states += '<li><input type="checkbox" data-id="113067432040067" id="st-MS"><label for="st-MS">Mississippi</label></li>';
        states += '<li><input type="checkbox" data-id="103118929728297" id="st-MO"><label for="st-MO">Missouri</label></li>';
        states += '<li><input type="checkbox" data-id="109983559020167" id="st-MT"><label for="st-MT">Montana</label></li>';
        states += '<li><input type="checkbox" data-id="109306932420886" id="st-NE"><label for="st-NE">Nebraska</label></li>';
        states += '<li><input type="checkbox" data-id="109176885767113" id="st-NV"><label for="st-NV">Nevada</label></li>';
        states += '<li><input type="checkbox" data-id="105486989486087" id="st-NH"><label for="st-NH">New Hampshire</label></li>';
        states += '<li><input type="checkbox" data-id="108325505857259" id="st-NJ"><label for="st-NJ">New Jersey</label></li>';
        states += '<li><input type="checkbox" data-id="108301835856691" id="st-NM"><label for="st-NM">New Mexico</label></li>';
        states += '<li><input type="checkbox" data-id="112825018731802" id="st-NY"><label for="st-NY">New York</label></li>';
        states += '<li><input type="checkbox" data-id="104083326294266" id="st-NC"><label for="st-NC">North Carolina</label></li>';
        states += '<li><input type="checkbox" data-id="104131666289619" id="st-ND"><label for="st-ND">North Dakota</label></li>';
        states += '<li><input type="checkbox" data-id="104024609634842" id="st-OH"><label for="st-OH">Ohio</label></li>';
        states += '<li><input type="checkbox" data-id="105818976117390" id="st-OK"><label for="st-OK">Oklahoma</label></li>';
        states += '<li><input type="checkbox" data-id="109564342404151" id="st-OR"><label for="st-OR">Oregon</label></li>';
        states += '<li><input type="checkbox" data-id="105528489480786" id="st-PA"><label for="st-PA">Pennsylvania</label></li>';
        states += '<li><input type="checkbox" data-id="108295552526163" id="st-RI"><label for="st-RI">Rhode Island</label></li>';
        states += '<li><input type="checkbox" data-id="108635949160808" id="st-SC"><label for="st-SC">South Carolina</label></li>';
        states += '<li><input type="checkbox" data-id="112283278784694" id="st-SD"><label for="st-SD">South Dakota</label></li>';
        states += '<li><input type="checkbox" data-id="108545005836236" id="st-TN"><label for="st-TN">Tennessee</label></li>';
        states += '<li><input type="checkbox" data-id="108337852519784" id="st-TX"><label for="st-TX">Texas</label></li>';
        states += '<li><input type="checkbox" data-id="104164412953145" id="st-UT"><label for="st-UT">Utah</label></li>';
        states += '<li><input type="checkbox" data-id="107907135897622" id="st-VT"><label for="st-VT">Vermont</label></li>';
        states += '<li><input type="checkbox" data-id="109564639069465" id="st-VA"><label for="st-VA">Virginia</label></li>';
        states += '<li><input type="checkbox" data-id="110453875642908" id="st-WA"><label for="st-WA">Washington</label></li>';
        states += '<li><input type="checkbox" data-id="112083625475436" id="st-WV"><label for="st-WV">West Virginia</label></li>';
        states += '<li><input type="checkbox" data-id="109146809103536" id="st-WI"><label for="st-WI">Wisconsin</label></li>';
        states += '<li><input type="checkbox" data-id="104039182964473" id="st-WY"><label for="st-WY">Wyoming</label></li>';
        states += '</ul>';
        states += '<button id="fblj-btn-ok" class="fblj-btn hide-on-fetch">'+fbljMsgAddStates+'</button>';
        states += '<button id="fblj-btn-add-all" class="fblj-btn hide-on-fetch">'+fbljMsgAddAllStates+'</button>';
        states += '<button id="fblj-btn-clear" class="fblj-btn hide-on-fetch">'+fbljMsgClearStates+'</button>';
        states += '</div>';
        $fbljContainer.after(states);
    }
}