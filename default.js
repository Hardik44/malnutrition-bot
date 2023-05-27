function isNumeric(str) {
	if (typeof str != "string") return false;

	return !isNaN(str) && !isNaN(parseFloat(str));
}

function ageHandler (options, event, context, callback) {
	if (isNumeric(event.message)) {
		context.simpledb.roomleveldata["age"] = event.message;
	}

    callback(options, event, context);
}

function heightHandler (options, event, context, callback) {
	if (isNumeric(event.message)) {
		context.simpledb.roomleveldata["height"] = event.message;
	}

    callback(options, event, context);
}

function sexHandler (options, event, context, callback) {
	if (event.message.includes("महिला")){
		context.simpledb.roomleveldata["gender"] = "female";
	} else {
		context.simpledb.roomleveldata["gender"] = "male";
	}
    callback(options, event, context);
}

function weightHandler (options, event, context, callback) {
	context.simpledb.roomleveldata["weight"] = event.message;
    gender = context.simpledb.roomleveldata["gender"];
	age = context.simpledb.roomleveldata["age"];
	weight = context.simpledb.roomleveldata["weight"];
	height = context.simpledb.roomleveldata["height"];
	params = "gender=" + gender + "&age=" + age +"&weight=" + weight +"&height=" + height;

	var url = context.simpledb.botleveldata.config.URL;
	url = url + "/calculate_zscore?" + params;
	console.log(url);


    context.simplehttp.makeGet(url, {}, function (context, event) {
    	try {
    		var res = JSON.parse(event.getresp);
    	} catch (e) {
    		context.sendResponse('Error fetching data from server');
    		return;
    	}

        if (res.success === true) {
        	var wfh_score = res.weight_for_length_zscore;
        	var wfh = "Weight for Height zscore: " + res.weight_for_length_zscore;
        	var wfa = "Weight for Age zscore: " + res.weight_for_age_zscore;
        	var hfa = "Height for Age zscore: " + res.length_height_for_age_zscore;

        	var msg = wfh + "\n" + wfa + "\n" + hfa;

        	if (res.result) {
        		msg = JSON.stringify([msg, res.result]);
        	}
        } else {
        	var msg = res.message;
        }

        if (msg) {
        	context.sendResponse(msg);
        } else {
        	context.sendResponse(options.default_message);
        }

    });
}

module.exports.main = {
	label_ask_sex: sexHandler,
    label_age: ageHandler,
    label_height: heightHandler,
    label_weight: weightHandler
}
