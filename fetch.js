var request = require("request");
var jsdom = require("jsdom");
var fs = require("fs");
var path = require("path");
var colors = require("colors");
var jquery = fs.readFileSync("./jquery.js", "utf-8");

var prefix = "http://www.vatanbilgisayar.com";

var visitedCategories = {};

function parse(url, cb) {
	request({
		uri: prefix + url,
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.132 Safari/537.36'
		}
	}, function(error, response, body) {
		console.log("[INFO]".red, "Downloaded".cyan, url.blue);
		jsdom.env({
			html: body,
			src: [jquery],
			done: function(errors, window) {
				var $ = window.$;
				cb($);
			}
		});
	});
}


function getProducts($) {
	$(".product").each(function() {
		var a = $(this);
		var l = a.find(".prdName>a");
		var name = l.text().trim();
		var link = l.attr("href");
		var price = a.find(".urunListe_satisFiyat").text().trim();
		console.log( (new Date()).toISOString(), name, link, price.red);
	});
}

parse("/", function($) {
	console.log("[INFO]".red, "Reading main page".red);
	var cats = [];

	$(".catList>ul>li>a").each(function() {
		cats.push({
			title: $(this).text().trim(),
			url: $(this).attr("href"),
		});		
	});

	for(var i = 0; i < cats.length; i++){
		visitCategory(cats[i].url, 0);
	}

	getProducts($);
});


function visitCategory(category, page) {
	if ( visitedCategories[category] )
		return;

	console.log("[INFO]".red, "Visiting category".blue, category.blue);
	parse(category, function($) {
		if ( page == 0){
			// Find out the paging			
			$(".paging").each(function(){
				var href = $(this).attr("href");
				if ( href){
					visitCategory(href, 1);
				}
			});
		}
		getProducts($);
	});
}
