/*** Global object that contains the app ***/
var app = app || {};

app.control = (function() {

	// Declaring our app variables
	var nameOfTheClass,		// String
		RecordsClass;		// Parse Class Object

	var words;
	var wordIndex = 0;

	var initParse = function(){
		console.log('Called initParse.');

	    Parse.initialize("R0mfLbOFVBYkmG8Amg6xjAKhbJ3HT06MaaDsokQW",
	    				 "JTnq2Qe22Hl129G3o9Rkrt4FN6MO1OyfTsz8Vxfl");		
		
		nameOfTheClass = 'Records';
		RecordsClass = Parse.Object.extend(nameOfTheClass);
	};

	var initVars = function(){
		words = ['who ', 'what ', 'when ', 'where ', 'why ', 'how '];
		dailyResults = [];
		wordIndex = 0;
		isRunning = false;
	};

	var attachEvents = function(){
		console.log('Called attachEvents.');

		$('#record-bt').off('click').on('click', function(){
			callAutocomplete(words[0]);
		});
	};


	/*-------------------- PARSE --------------------*/

	var saveRecord = function(obj, callback){
		console.log('Called saveRecord');
		var recordsInstance = new RecordsClass();
		recordsInstance.save(obj, {
			success: function(res){
				console.log('Saved object.');
				console.log(res);
				callback();
			},
			error: function(res, err){
				console.log(err);
			}
		});
	};	


	/*-------------------- AUTOCOMPLETE --------------------*/	

	// Executes a call to autocomplete, one word at a time
	function callAutocomplete(query){
		
		console.log('Called callAutocomplete.')

		var title = $('<h3>Calling autocomplete for '+query+'<h3>').appendTo('#admin');

		$.ajax({
			url: 'https://www.google.com/complete/search?',
			dataType: 'jsonp',
			data: {
				q: query,
				nolabels: 't',
				client: 'firefox',
				hl: 'en'
			},
			success: function(data) {
				console.log(data);
				var results = data[1];
				// console.log(results);
				
				$('#loader-container').remove();
				var list = $('<ul></ul>').appendTo('#admin');

				for(var i = 0; i < results.length; i++){
					// console.log(results[i]);
					// console.log(replacePlusSign(results[i]));
					results[i] = replacePlusSign(results[i]);
					$(list).append('<li>'+results[i]+'</li>');
				}

				// NEXT
				createRecord(query, results, function(obj){
					saveRecord(obj, nextIteration);
				});
			},
			error: function(err){
				console.log(err)
			}
		});
	};

	var replacePlusSign = function(string){
		while(string.indexOf('+') > -1){
			string = string.replace('+', ' ');
		};
		return string;
	};

	// Parsing the results into a the database format 
	function createRecord(query, suggestions, callback){
		console.log('Called createRecord');
		// console.log('Received:');
		// console.log(query);
		// console.log(suggestions);
		var obj;
		if(suggestions.length > 0){	
			var now = new Date();
			now.setHours(0);
			now.setMinutes(0);
			now.setSeconds(0);
			now.setMilliseconds(0);

			obj = {
				date: now,
				word: query.substring(0, query.length - 1),
				results: suggestions
			};

			console.log(obj);
			
			callback(obj);
		}
	}

	var nextIteration = function(){

		// New word...
		wordIndex ++;
		if(wordIndex < words.length){
			// console.log(words[wordIndex]);
			callLoader();
			setTimeout(function(){	// Delay to prevent Google's shut down		
				callAutocomplete(words[wordIndex]);
			}, 2000);
		
		}else{
			$('#admin').append('<h2>Finished saving today\'s results</h2>');
		}	
	}	

	function callLoader(){
		$('#results-container').empty();
		var AdminLoaderContainer = $('<div id="loader-container"></div>')
		var loader = $('<span class="loader"></span>');
		$(AdminLoaderContainer).append(loader);
		$('#admin').append(AdminLoaderContainer)
	}

	var init = function() {
		console.log('Called init.');
		initParse();
		initVars();
		attachEvents();
	};

	return{
		init: init
	};
})(window, document, jQuery, _);

// call app.map.init() once the DOM is loaded
window.addEventListener('DOMContentLoaded', function(){
  app.control.init();  
});