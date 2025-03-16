const LOCK_TIP = "鎖定後將可以避免誤觸點到，可以搭配「隱藏控制列」功能，分享網址給別人。";
const LEVEL_TIP = "英文字母表示風險等級，數字表示體能等級，顏色為綜合評分。等級參考自HikingBook，難度僅供參考。建議入手順序：藍綠黃橘紅。";

function ShowLockTip()
{
	window.alert(LOCK_TIP);
}
function ShowLevelTip()
{
	window.alert(LEVEL_TIP);
}

function Half2Full(zStr1) {
    var i = 0;
    var aTmp = new Array();
    var zStr2 = "";
    for(i = 0; i < zStr1.length; i++) 
	{
        if(zStr1.charCodeAt(i) >=0 && zStr1.charCodeAt(i) <= 32) {
            aTmp[i] = 0;   //ascii 小於等於 32的字元，都先清為 null
        } else if(zStr1.charCodeAt(i) >=33 && zStr1.charCodeAt(i) <= 126)  {
            aTmp[i] = zStr1.charCodeAt(i) + 65248;   //ascii介於33~126之間的字元，加上65248準備轉為全型unicode
        } else {
            aTmp[i] = zStr1.charCodeAt(i);
        }
        zStr2 += String.fromCharCode(aTmp[i]);    //轉為全型unicode
    }
    return zStr2;
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function toBaseN(num, base) {
  if (num === 0) {
    return '0';
  }
  var digits = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var len = Math.min(digits.length, base);
  var result = ''; 
  while (num > 0) {
    result = digits[num % len] + result;
    num = parseInt(num / len, 10);
  }
  
  return result;
}

function fromBaseN(str, base) {
  if (str === null || str.length === 0) {
    return 0;
  }
  var digits = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var len = Math.min(digits.length, base);
  var result = 0;
  for (var i=0 ; i<str.length ; i++) {
    var p = digits.indexOf(str[i]);
    if (p < 0 || p >= base) {
      return NaN;
    }
    result += p * Math.pow(digits.length, str.length - i - 1);
  }
  return result;
}

function toBase62(n) {
  if (n === 0) {
    return '0';
  }
  var digits = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = ''; 
  while (n > 0) {
    result = digits[n % digits.length] + result;
    n = parseInt(n / digits.length, 10);
  }
  
  return result;
}

function fromBase62(s) {
  var digits = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = 0;
  for (var i=0 ; i<s.length ; i++) {
    var p = digits.indexOf(s[i]);
    if (p < 0) {
      return NaN;
    }
    result += p * Math.pow(digits.length, s.length - i - 1);
  }
  return result;
}

//========================================================================================

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded Unicode,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}
function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function GetShowLevel()
{
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if(urlParams.has('showlevel'))
	{
		var currentState = urlParams.get('showlevel', 'true');
		if(currentState == 'true')
			return true;
	}
	return false;
}

function SetShowLevel()
{
	var currentState = GetShowLevel();
	currentState = !currentState;

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	urlParams.set('showlevel', currentState)
	const url = new URL(window.location.href);
	url.search  = urlParams.toString();
	
	window.history.replaceState( null , null, url);
	Array.from(document.getElementsByClassName("tip")).forEach(
		function(element, index, array) {
			element.style.visibility = currentState ? "visible" : "hidden";
			var c0 = element.innerText[0];
			var c1 = element.innerText[1];
			
			var risk = 0;
			if(c0=='A')risk = 1;
			if(c0=='B')risk = 2;
			if(c0=='C')risk = 3;
			if(c0=='D')risk = 4;
			if(c0=='E')risk = 5;
			risk+=0.25;
			
			var strength = Number(c1);
			var score = Math.round(Math.sqrt(risk*strength));
			
			if(score==1) { element.style.backgroundColor = "#9CE"; }
			if(score==2) { element.style.backgroundColor = "#9F9"; }
			if(score==3) { element.style.backgroundColor = "#EE8"; }
			if(score==4) { element.style.backgroundColor = "#EA8"; }
			if(score==5) { element.style.backgroundColor = "#F33"; }
			
			element.title = LEVEL_TIP;
		}
	);	
}

function GetLock()
{
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if(urlParams.has('lock'))
	{
		var currentState = urlParams.get('lock', 'true');
		if(currentState == 'true')
			return true;
	}
	return false;
}

function SetLock()
{
	var currentState = GetLock();
	currentState = !currentState;

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	urlParams.set('lock', currentState)
	const url = new URL(window.location.href);
	url.search  = urlParams.toString();
	window.history.replaceState( null , null, url);
	document.getElementById("input_name").style.display = currentState ? "none" : "inline";
	document.getElementById("input_name_placeholder").style.display = currentState ? "inline" : "none";
}



function HideControl()
{
	if (confirm("確定要隱藏控制項？\r\n\r\n要重新顯示需自行修改網址列。")) 
	{
		SetHideControl();
	}
}

function GetHideControl()
{
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if(urlParams.has('hidecontrol'))
	{
		var currentState = urlParams.get('hidecontrol', 'true');
		if(currentState == 'true')
			return true;
	}
	return false;
}

function SetHideControl()
{
	var currentState = GetHideControl();
	currentState = !currentState;

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	urlParams.set('hidecontrol', currentState)
	const url = new URL(window.location.href);
	url.search  = urlParams.toString();
	window.history.replaceState( null , null, url);
	document.getElementById("info").style.display = currentState ? "none" : "inline";
}

function SetName(text)
{	
	if(GetLock())
		return;
	document.getElementById("RouteMapTitle").innerHTML = text;
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	urlParams.set('name', b64EncodeUnicode(text))
	const url = new URL(window.location.href);
	url.search  = urlParams.toString();
	window.history.replaceState( null , null, url);
	document.getElementById("input_name_placeholder").value = text;
}
function GetName(text)
{
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if(urlParams.has('name'))
		return b64DecodeUnicode(urlParams.get('name', text));
	return "";
}

function AddQueryString(text)
{
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if(urlParams.has('list'))
	{
		var list = urlParams.get('list');
		var els = list.split('_');
		var alreadyHas = false;
		for(var i=0; i< els.length; i++)
		{
			if(els[i]==text)
				return;
		}
		list+="_"+text;
		urlParams.set('list', list)
	}
	else
	{
		urlParams.set('list', "_"+text);
	}
	var list = urlParams.get('list');
	var selection_count = list.length==0 ? 0 : list.split('_').length-1;
	document.getElementById("SelectionCount").innerText = Half2Full(pad(selection_count.toString(), 3));
	const url = new URL(window.location.href);
	url.search  = urlParams.toString();
	window.history.replaceState( null , null, url);
}
function RemoveQueryString(text)
{
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if(urlParams.has('list'))
	{
		var list = urlParams.get('list');
		var els = list.split('_');
		var newList = "";
		for(var i=0; i< els.length; i++)
		{
			if(els[i]!=text && els[i]!="")
			{
				newList+= "_"+els[i];
			}
		}
		urlParams.set('list', newList)
		var selection_count = newList.length==0 ? 0 : newList.split('_').length-1;
		document.getElementById("SelectionCount").innerText = Half2Full(pad(selection_count.toString(), 3));
	}
	else
	{
		document.getElementById("SelectionCount").innerText = "０００";
	}
	const url = new URL(window.location.href);
	url.search  = urlParams.toString();
	window.history.replaceState( null , null, url);
}
function HasQueryString(text)
{
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if(urlParams.has('list'))
	{
		const list = urlParams.get('list');
		var els = list.split('_');
		for(var i=0; i< els.length; i++)
		{
			if(els[i]==text)
			{
				return true;
			}
		}
	}
	return false;
}

function ClearAll()
{
	if(GetLock())
		return;
	if (confirm("確定要清除暱稱與所有選取的項目？\r\n\r\n這個操作無法復原。")) 
	{
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		if(urlParams.has('list'))
		{
			urlParams.delete('list');
		}
		document.getElementById("SelectionCount").innerText = "０００";
		const url = new URL(window.location.href);
		url.search  = urlParams.toString();
		window.history.replaceState( null , null, url);
		SetAllPos();
	}
}
function GetScrollPos()
{
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if(urlParams.has('scroll'))
	{
		return Number(urlParams.get('scroll'));
	}
	return 0;
}

function SetAllPos()
{
	//----------------------------------------
	/*
	var gridcontainer = document.getElementById("gridcontainer");
	for(var y=1; y<=68; y++)
	{
		for(var x=1; x<=29; x++)
		{		
			gridcontainer.innerHTML += "\r\n<div class=\"grid\" data-col=\""+ x +"\" data-row=\""+ y +"\">"+ x +","+ y +"</div>";
		}
	}
	*/
	//----------------------------------------
	
	Array.from(document.getElementsByTagName("div")).forEach(
		function(element, index, array) {
			if("row" in element.dataset)
				element.style.top = ((element.dataset.row-1) * 40) + "px";
		
			if("col" in element.dataset)
				element.style.left = ((element.dataset.col-1) * 40) + "px";			
			
			if("x" in element.dataset)
				element.style.marginLeft = (element.dataset.x * 40) + "px";
			
			if("y" in element.dataset)
				element.style.marginTop = (element.dataset.y * 40) + "px";
			
			element.style.visibility="visible";
		}
	);	
	
	var isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	var bgImage = "url('metro_select.png')";
	
	
	Array.from(document.getElementsByClassName("box")).forEach(
		function(element, index, array) {
			var order = element.innerText.length>=3 ? element.innerText.substr(0,3) : "000";
			
			var classSplits = element.className.split(' ');
			if(classSplits.length<2)
				retrun;
			
			var selected = HasQueryString(toBase62(order));
			var selectValue = 0.95;
			
			var style = window.getComputedStyle(element);
			var boxcolor = style.getPropertyValue('border-color');

			element.style.opacity = selected ? selectValue : 1;
			element.style.backgroundImage = selected ? bgImage : "";
			element.style.fontWeight = selected? 400 : 700;
			element.style.boxShadow =	selected ? 
										"0px 0px 8px 8px rgba(255, 255, 192, 0.5)"+
										", 2px 0px "+ boxcolor +
										", -2px 0px "+ boxcolor+
										", 0px 2px "+ boxcolor+
										", 0px -2px "+ boxcolor
										: null;
			element.style.borderColor = selected? "#ffa" : null;
			element.onclick = function(){
				if(GetLock())
					return;
				if(element.style.opacity==1)
				{
					AddQueryString(toBase62(order));					
					element.style.opacity = selectValue;
					element.style.backgroundImage = bgImage;
					element.style.fontWeight = 400;
					element.style.boxShadow =
										"0px 0px 8px 8px rgba(255, 255, 192, 0.5)"+
										", 2px 0px "+ boxcolor +
										", -2px 0px "+ boxcolor+
										", 0px 2px "+ boxcolor+
										", 0px -2px "+ boxcolor;
					element.style.borderColor = "#ffa";
				}
				else
				{
					RemoveQueryString(toBase62(order));		
					element.style.opacity = 1;
					element.style.backgroundImage = "";
					element.style.fontWeight = 700;
					element.style.boxShadow = null;
					element.style.borderColor = null;
				}
			}
		}
	);	
	
	var showLv = GetShowLevel();
	Array.from(document.getElementsByClassName("tip")).forEach(
		function(element, index, array) {
			element.style.visibility = showLv ? "visible" : "hidden";
			var c0 = element.innerText[0];
			var c1 = element.innerText[1];
			
			var risk = 0;
			if(c0=='A')risk = 1;
			if(c0=='B')risk = 2;
			if(c0=='C')risk = 3;
			if(c0=='D')risk = 4;
			if(c0=='E')risk = 5;
			risk+=0.25;
			
			var strength = Number(c1);
			var score = Math.round(Math.sqrt(risk*strength));
			
			if(score==1) { element.style.backgroundColor = "#9CE"; }
			if(score==2) { element.style.backgroundColor = "#9F9"; }
			if(score==3) { element.style.backgroundColor = "#EE8"; }
			if(score==4) { element.style.backgroundColor = "#EA8"; }
			if(score==5) { element.style.backgroundColor = "#F33"; }
			
			element.title = "英文字母表示風險等級，數字表示體能等級，顏色為綜合評分。等級參考自HikingBook，難度僅供參考。建議入手順序：藍綠黃橘紅。";
		}
	);	
	
	document.documentElement.scrollTop = GetScrollPos();	
	
	
	document.getElementById("info").style.display = GetHideControl() ? "none" : "block";
	
	document.getElementById("input_name").value = GetName();
	document.getElementById("RouteMapTitle").innerHTML = GetName();
	document.getElementById("input_name_placeholder").value = GetName();
	
	document.getElementById("input_name").style.display = GetLock() ? "none" : "inline";
	document.getElementById("input_name_placeholder").style.display = GetLock() ? "inline" : "none";
	
	document.getElementById("input_lock").checked = GetLock();
	document.getElementById("input_showlevel").checked = GetShowLevel();
	
	const urlParams = new URLSearchParams(window.location.search);
	if(urlParams.has('list'))
	{
		const list = urlParams.get('list');
		var selection_count = list.length==0 ? 0 : list.split('_').length-1;
		document.getElementById("SelectionCount").innerText = Half2Full(pad(selection_count.toString(), 3));
	}
	else
	{
		document.getElementById("SelectionCount").innerText = "０００";
	}
	document.getElementById("nodecontainer").style.visibility = "visible";
}