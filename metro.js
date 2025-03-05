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
	document.getElementById("input_name").style.display = GetLock() ? "none" : "inline";
	document.getElementById("input_name_placeholder").style.display = GetLock() ? "inline" : "none";
}

function SetName(text)
{
	if(GetLock())
		return;
	
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	urlParams.set('name', b64EncodeUnicode(text))
	const url = new URL(window.location.href);
	url.search  = urlParams.toString();
	window.history.replaceState( null , null, url);
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
		if(list.indexOf(","+text)==-1)
			list+=","+text;
		urlParams.set('list', list)
	}
	else
	{
		urlParams.set('list', ","+text);
	}
	var list = urlParams.get('list');
	document.getElementById("field_mounts").value = list.length==0 ? 0 : list.split(',').length-1;
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
		var index = list.indexOf(","+text);
		if(index!=-1)
			list = list.replace(","+text, "");
		urlParams.set('list', list)
		document.getElementById("field_mounts").value = list.length==0 ? 0 : list.split(',').length-1;
	}
	else
	{
		document.getElementById("field_mounts").value = 0;
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
		return list.indexOf(","+text)!=-1;
	}
	return false;
}
function ClearAll()
{
	if(GetLock())
		return;
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if(urlParams.has('list'))
	{
		urlParams.delete('list');
	}
	document.getElementById("field_mounts").value = 0;
	const url = new URL(window.location.href);
	url.search  = urlParams.toString();
	window.history.replaceState( null , null, url);
	SetAllPos();
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
	/*
	var gridcontainer = document.getElementById("gridcontainer");
	for(var y=1; y<=68; y++)
	{
		for(var x=1; x<=26; x++)
		{		
			gridcontainer.innerHTML += "\r\n<div class=\"grid\" data-col=\""+ x +"\" data-row=\""+ y +"\">"+ x +","+ y +"</div>";
		}
	}
	*/
	
	Array.from(document.getElementsByTagName("div")).forEach(
		function(element, index, array) {
			var row = element.dataset.row;
			var col = element.dataset.col;
			element.style.top = ((row-1) * 40) + "px";
			element.style.left = ((col-1) * 40) + "px";
			element.style.visibility="visible";
		}
	);	
	
	Array.from(document.getElementsByClassName("box")).forEach(
		function(element, index, array) {
			var order = element.innerText.length>=3 ? element.innerText.substr(0,3) : "000";
			element.style.backgroundColor = HasQueryString(order) ? "yellow" : "white";
			
			element.onclick = function(){
				if(GetLock())
					return;
				if(element.style.backgroundColor=="white")
				{
					AddQueryString(order);
					element.style.backgroundColor = "yellow";
				}
				else
				{
					RemoveQueryString(order);
					element.style.backgroundColor = "white";
				}
			}
		}
	);	
	
	document.documentElement.scrollTop = GetScrollPos();	
	document.getElementById("input_name").value = GetName();
	document.getElementById("input_name_placeholder").value = GetName();
	
	document.getElementById("input_name").style.display = GetLock() ? "none" : "inline";
	document.getElementById("input_name_placeholder").style.display = GetLock() ? "inline" : "none";
	
	document.getElementById("input_lock").checked = GetLock();
	
	const urlParams = new URLSearchParams(window.location.search);
	if(urlParams.has('list'))
	{
		const list = urlParams.get('list');
		document.getElementById("field_mounts").value = list.length==0 ? 0 : list.split(',').length-1;
	}
	else
	{
		document.getElementById("field_mounts").value = 0;
	}
}