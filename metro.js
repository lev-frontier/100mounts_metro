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
	return document.getElementById('input_showlevel').checked;
}

function SetShowLevel()
{
	var isShowLevel = document.getElementById('input_showlevel').checked;

	Array.from(document.getElementsByClassName("tip")).forEach(
		function(element, index, array) {
			element.style.visibility = isShowLevel ? "visible" : "hidden";
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
	return document.getElementById('isLockedAndHideControl').checked;
}

function SetName()
{	
	if(GetLock())
		return;
	document.getElementById("RouteMapTitle").innerHTML = document.getElementById('input_name').name;
}
function GetName()
{
	return document.getElementById('input_name').value;
}

function GetSummitList()
{
	return document.getElementById('fieldSummits').value;
}

function SetSummitList(val)
{
	document.getElementById('fieldSummits').value = val;
}

function AddQueryString(text)
{
	var list = GetSummitList();
	if(list && list.length!==0 )
	{
		var els = list.split('_');
		var alreadyHas = false;
		for(var i=0; i< els.length; i++)
		{
			if(els[i]==text)
				return;
		}
		list+="_"+text;
	}
	else
	{
		list = "_"+text;
	}	
	SetSummitList(list);
	var selection_count = list.length==0 ? 0 : list.split('_').length-1;
	document.getElementById("SelectionCount").innerText = Half2Full(pad(selection_count.toString(), 3));

}
function RemoveQueryString(text)
{
	var list = GetSummitList();
	if(list && list.length!==0)
	{
		var els = list.split('_');
		var newList = "";
		for(var i=0; i< els.length; i++)
		{
			if(els[i]!=text && els[i]!="")
			{
				newList+= "_"+els[i];
			}
		}
		SetSummitList(newList);
		var selection_count = list.length==0 ? 0 : list.split('_').length-1;
		document.getElementById("SelectionCount").innerText = Half2Full(pad(selection_count.toString(), 3));
	}
	else
	{
		document.getElementById("SelectionCount").innerText = "０００";
	}
}
function HasQueryString(text)
{
	var list = GetSummitList();
	if(list && list.length!==0)
	{
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
	if (confirm("確定要清除暱稱與所有選取的項目？清除後請自行點選[儲存資料]寫入變更。\r\n\r\n若想後悔，請直接重新整理頁面。")) 
	{
		document.getElementById('input_name').value = "";
		document.getElementById('input_showlevel').checked = false;
		document.getElementById('fieldSummits').value = "";
		document.getElementById("SelectionCount").innerText = "０００";
		SetAllPos();
	}
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
	
	
	document.getElementById("info").style.display = GetLock() ? "none" : "block";	
	document.getElementById("RouteMapTitle").innerHTML = document.getElementById("input_name").value;	
	document.getElementById("input_name").style.display = GetLock() ? "none" : "inline";
	
	const list = GetSummitList();
	var listHasContent = list && list.length!==0;
	if(listHasContent)
	{
		var selection_count = list.length==0 ? 0 : list.split('_').length-1;
		document.getElementById("SelectionCount").innerText = Half2Full(pad(selection_count.toString(), 3));
	}
	else
	{
		document.getElementById("SelectionCount").innerText = "０００";
	}
	document.getElementById("nodecontainer").style.visibility = "visible";
	document.getElementById("mainclipper").style.bottom = GetLock() ? 0 : 44;
	document.getElementById("summitCountLabel").style.visibility = listHasContent ? "visible" : "hidden";
}