/*** Global object that contains the app ***/
var app = app || {};

app.control = (function() {

	// Declaring our app variables
	var nameOfTheClass,	// String
		RecordsClass,	// Parse Class Object
		records,		// Instance of RecordsClass
		recordsQuery;	// Parse Fetch Object

	var words = ['who+', 'what+', 'when+', 'where+', 'why+', 'how+'];
	// All results from this day
	var dailyResults = [];
	var wordIndex = 0;
	var isRunning = false;

	var initParse = function(callback){
		console.log('Called initParse.');

	    Parse.initialize("R0mfLbOFVBYkmG8Amg6xjAKhbJ3HT06MaaDsokQW",
	    				 "JTnq2Qe22Hl129G3o9Rkrt4FN6MO1OyfTsz8Vxfl");		
		
		nameOfTheClass = 'Records';
		RecordsClass = Parse.Object.extend(nameOfTheClass);
		records = new RecordsClass();
		recordsQuery = new Parse.Query(nameOfTheClass);

		callback();
	};

	var initVars = function(){
		words = ['who+', 'what+', 'when+', 'where+', 'why+', 'how+'];
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

    var fetchAll = function(fetch){
		fetch.find({
			success: function(obj) {
				console.log(obj);
				obj.forEach(function(item){
					console.log(item.get('word'));
				});
			},
			error: function(err) {
				console.log(err);
			}
		});
    };

	var saveRecord = function(instance, obj){
		console.log('Called saveRecord');
		instance.save(obj, {
			success: function(res){
				console.log('Saved object.');
				console.log(res);
			},
			error: function(res, err){
				console.log(err);
			}
		});
	};	

	/*-------------------- AUTOCOMPLETE --------------------*/	

	function callAutocomplete(query){
		console.log('Called callAutocomplete.')

		// var url = {
		// 	uri: concatenateUrl(query),
		// 	encoding: null
		// };
		
		var url = concatenateUrl(query);

		$.getJSON(url, function(data){
			console.log(data);
		});

		// .fail(function() {
		//     console.log( "error" );
  // 		});

		// request(url, function (error, response, body) {
		// // 	// console.log(error);
		// // 	// console.log(response);
		// 	// console.log(body);

		// 	if (!error && response.statusCode == 200) {

		// 		var data = JSON.parse(iconv.decode(body, 'ISO-8859-1'));
		// 		// console.log(data);
		// 		var suggestions = data[1];
		// 		// console.log(suggestions);
		// 		// console.log(suggestions.length);

		// 		// Create a new record and store
		// 		createRecord(query, suggestions, function(err, obj){
		// 			if(!err){
		// 				console.log(obj);	
		// 				dailyResults.push(obj);						
		// 			}
		// 			// Call next iteration even if err == true
		// 			// Might be the case that no suggestions were retrieved,
		// 			// so just jump to the next letter
		// 			// nextIteration();				
		// 		});
		// 	}else{
		// 		console.log(error);
		// 	}
		// });
	};

	// Creates url for reqquest, concatenating the parameters
	var concatenateUrl = function(query){
		console.log('Called concatenateUrl');
		// console.log(service.ds);	
		var requestUrl = 'http://cors.io/?u=' +
						 'https://www.google.com/complete/search?' +
						 '&client=firefox'+
						 '&q=' + query;

		// console.log(requestUrl);
		console.log('Returning ' + requestUrl);
		return requestUrl;
	};	

	var init = function() {
		console.log('Called init.');
		initParse(attachEvents);
	};

	return{
		init: init
	};
})(window, document, jQuery, _);

// call app.map.init() once the DOM is loaded
window.addEventListener('DOMContentLoaded', function(){
  app.control.init();  
});