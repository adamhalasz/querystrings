require('sugar')

/**
* @class QueryString
*/
var QueryString = new Object()

/**
* @memberof QueryString
* @method stringifyTraverse
* @description The opposite of QueryString.traverse(). Create a string from a Query Object by Recursively Traversing through it
* @param {object} subject - The object to be stringified
* @param {intenger} 
* @param {string} key
* @returns {string} result  
*/
QueryString.stringifyTraverse = function(subject, level, key){
	var result = '';
	for (var prop in subject) {
		var parent_appendix = key ? key : '' ;
		var parent_appendix = level > 1 && level < 2 ? '['+key+']' : parent_appendix ;
		var child_appendix = level > 0 ? '['+prop+']' : prop ;
		var appendix = parent_appendix + child_appendix;
		var value = subject[prop];
	    if (Object.isObject(value)) {
	        //output(appendix.red, value, level);
	        result += QueryString.stringifyTraverse(value, level + 1, appendix);
	    } else if (Array.isArray(value)) {
	    	for(var i = 0; i < value.length; i++){
	    		result += appendix+'='+QueryString.stringifyValue(value[i])+'&';
	    		//console.log((appendix+'='+QueryString.stringifyValue(value[i])+'&').toString().white);
	    	}
	    	
	    } else {
	        //output(appendix.yellow, value, level);
	        //console.log((appendix +'='+ value).toString().white);
	        result += appendix +'='+ QueryString.stringifyValue(value) + '&';
	    }
	}
	return result;
}


/**
* @memberof QueryString
* @method stringify
* @description Create a string from a Query Object
* @param {object} query - The object to be stringified
* @returns {string} result  
*/
QueryString.stringify = function(query){
	//console.log('\n\n============================', query);
	var result = QueryString.stringifyTraverse(query, 0);
	result = result.substr(0, result.length-1);
	//console.log('RESULT', result.replace(/\&/gi, '\n&'));
	return result;
}

/**
* @memberof QueryString
* @method value
* @description Get values in their accurate type. Converts Numbers and Booleans within Strings into actual Number and Boolean Objects.
* @param {variable} value - the value to be converted
* @returns {variable} value - the value in the right type
*/
QueryString.value = function(value){
	if(value == 'true'){ 
		value = true; 	// boolean true
	} else if (value == 'false') {
		value = false; 	// boolean false
	} else if (isset(value) && !isNaN(value)) {
		value = +value; // number
	}
	return value;
}

/**
* @memberof QueryString
* @method stringifyValue
* @description The opposite of QueryString.value(). Convert Booleans and Numbers into Strings.
* @param {variable} value - the value to be converted
* @returns {variable} value - the value as a string
*/
QueryString.stringifyValue = function(value){
	if(value === true){ 
		value = 'true'; 	// boolean true
	} else if (value === false) {
		value = 'false'; 	// boolean false
	} else if (isset(value) && !isNaN(value)) {
		value = +value; // number
	}
	return value;
}

/**
* @memberof traverse
* @method value
* @description The opposite of QueryString.stringifyTraverse(). Create a Query Object from a Query String (single key-value like ?topic=nature). It will recursively traversing through nested deep objects/arrays as well.
* @param {object} subject - The string to be converted into an object
* @param {intenger} key - the key part of the key-value pair ([key]=value)
* @param {string} value - the value part of the key-value pair (key=[value])
* @returns {object} value
*/
QueryString.traverse = function(subject, key, value){
	
	if(key.indexOf('[') != -1){	
		var split = key.split('[');
		//console.log('\n' + key.yellow)
		//console.log('SPLIT'.red,  split.length, split[1].split(']')[0], (split.length > 2),  isNaN(split[1].split(']')[0]));
		var INT_SUBJECT = subject;
		if(isNaN(split[1].split(']')[0])){
		    var lastSection = split[split.length-1].split(']')[0]
		    //console.log('lastSection', '=', lastSection);
			for(var i = 0; i < split.length; i++){
				var section = split[i].indexOf(']') ? split[i].split(']')[0] : split[i] ;
				//console.log('  ->'.grey, '['+i+'/'+(split.length-1)+'] '+ section);
				
				if(i < split.length-1){
				    if(!isNaN(lastSection) && !INT_SUBJECT[section] && i == split.length-2 || split.length < 2) {
				        //console.log('The one before the last section');
				        INT_SUBJECT[section] = [];
				    } else if(!INT_SUBJECT[section]) {
				        INT_SUBJECT[section] = {};
				    }
				} else {
					if(INT_SUBJECT[section]) {
						INT_SUBJECT[section] = [INT_SUBJECT[section]];
						INT_SUBJECT[section].push(QueryString.value(value))
					} else {
						INT_SUBJECT[section] = QueryString.value(value);
					}
				}
				INT_SUBJECT = INT_SUBJECT[section];
				
				//console.log(' -> INT_SUBJECT: ', INT_SUBJECT);
			}
			subject = INT_SUBJECT;
		} else {
			var parent = split[0];
			var section = split[1].indexOf(']') ? split[1].split(']')[0] : split[1] ;
			if(typeof INT_SUBJECT[parent] != 'object') INT_SUBJECT[parent] = [];
			INT_SUBJECT[parent].push(QueryString.value(value));
			subject = INT_SUBJECT;
		}
	} else if (subject[key]) {
		if(typeof subject[key] != 'object') subject[key] = [subject[key]];
		subject[key].push(QueryString.value(value));
	} else {
		subject[key] = QueryString.value(value);
	}
	return subject;
}

/**
* @memberof QueryString
* @method parse
* @description parse an entire Query String into a Query Object
* @param {string} body 
* @returns {object} QueryObject
*/
QueryString.parse = function(body){
	var result = {};
	body = body.toString().replace(/\+/gi,' ')
	//console.log('###ORIGINAL', body);
	var split = body.split(/\&/gi);
	split.forEach(function(string){
		var split = string.split('=');
		if(split){
    		var key = decodeURIComponent(escape(split[0]));
    		var value = decodeURIComponent(escape(split[1]));
    		
    		//console.log(key,'=',value);
    		QueryString.traverse(result, key, value, split.length)
		}
			//result[key] = QueryString.value(value);
	});
	//console.log('PARSE RESULT', result);
	return result;
}

function output(appendix, value, level) {
    console.log('     ' + space(level*4) + '--> ' +level+':'+ appendix +'='+ value.toString().cyan );
}

function space(ed){
	var s = ''; for(var i = 1; i < ed; i++){ s += ' '.grey; } return s;
}

function isset(object){
	return (object != "undefined" && object != undefined && object != null && object != "" && typeof(object) != 'undefined') ? true : false ;
}

module.exports = QueryString;