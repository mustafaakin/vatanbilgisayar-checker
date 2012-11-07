var async = require("async");
var request = require("request");
var jsdom = require('jsdom');

function getItems(page,cb){
	var url = 'http://www.vatanbilgisayar.com/Notebook-Netbook-Tablet/products.aspx?L2=PC_POR';
	if ( page > 0) {
		url = url + "&rcd=" + (16 * page + 1);
	}
	console.log(url);
	jsdom.env(url, function(err, window){
		var links = [];
    	for ( var i = 0; i < 16; i++){
    		var index = i < 10 ? ('0' + i) : i;
    		var id = "ctl00_ContentPlaceHolder1_dlProduct_ctl" + index + "_lbtnTitle";
	    	var link = window.document.getElementById(id);	    
	    	if ( link && link.href){
	    		links.push(link.href);
	    	}
    	}
    	cb(links);
	});
}

function getPrice(link,cb){
	jsdom.env(link, function(err,window){
		var marka = window.document.getElementById("ctl00_ContentPlaceHolder1_lblMarka").innerHTML;
		var model = window.document.getElementById("ctl00_ContentPlaceHolder1_lblTitle").innerHTML;
		var inputs, index;
		inputs = window.document.getElementsByTagName('input');
		var prices = [];
		for (index = 0; index < inputs.length; ++index) {
			var k = inputs[index];
			if ( k.name && k.name.match("hfFiyat")){
				prices.push(Math.ceil(k.value.replace(",",".")));
			};
		}
		prices = prices.sort();
		console.log(prices[0] + "\t" + marka + "\t\t" + model);
		// var k = a.match(/\b\d+.*\d+ TL/g);
		// console.log(k);
	});				
}

for ( var i = 0; i < 1; i++){
	getItems(i, function(links){
		for ( var j in links){
			var link = links[j];
			getPrice(link,null);
		}
	});
}

