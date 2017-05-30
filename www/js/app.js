//document.addEventListener("deviceready", init, false);
//function init() {
//
//	document.querySelector("#sendMessage").addEventListener("touchend", function() {
//		var number = document.querySelector("#number").value;
//		var message = document.querySelector("#message").value;
//		console.log("going to send "+message+" to "+number);
//
//		//simple validation for now
//		if(number === '' || message === '') return;
//
//		sms.send(number,message,{}, function(message) {
//			console.log("success: " + message);
//			navigator.notification.alert(
//			    'Message to ' + number + ' has been sent.',
//			    null,
//			    'Message Sent',
//			    'Done'
//			);
//
//		}, function(error) {
//			console.log("error: " + error.code + " " + error.message);
//			navigator.notification.alert(
//				'Sorry, message not sent: ' + error.message,
//				null,
//				'Error',
//				'Done'
//			);
//		});
//
//	}, false);
//
//}
var exec = require('cordova/exec');

var app = {
    sendSms: function() {
        var number = document.getElementById('numberTxt').value;
        var message = document.getElementById('messageTxt').value;
        console.log("number=" + number + ", message= " + message);

        //CONFIGURATION
        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: 'INTENT'  // send SMS with the native android SMS messaging
                //intent: '' // send SMS without open any other app
            }
        };

        var success = function () { alert('Message sent successfully'); };
        var error = function (e) { alert('Message Failed:' + e); };
        sms.send(number, message, options, success, error);
    }
};

var sms = {};

function convertPhoneToArray(phone) {
    if (typeof phone === 'string' && phone.indexOf(',') !== -1) {
        phone = phone.split(',');
    }
    if (Object.prototype.toString.call(phone) !== '[object Array]') {
        phone = [phone];
    }
    return phone;
}


sms.send = function(phone, message, options, success, failure) {
    // parsing phone numbers
    phone = convertPhoneToArray(phone);

    // parsing options
    var replaceLineBreaks = false;
    var androidIntent = '';
    if (typeof options === 'string') { // ensuring backward compatibility
        window.console.warn('[DEPRECATED] Passing a string as a third argument is deprecated. Please refer to the documentation to pass the right parameter: https://github.com/cordova-sms/cordova-sms-plugin.');
        androidIntent = options;
    }
    else if (typeof options === 'object') {
        replaceLineBreaks = options.replaceLineBreaks || false;
        if (options.android && typeof options.android === 'object') {
            androidIntent = options.android.intent;
        }
    }

    // fire
    exec(
        success,
        failure,
        'Sms',
        'send', [phone, message, androidIntent, replaceLineBreaks]
    );
};

sms.hasPermission = function(success, failure) {
    // fire
    exec(
        success,
        failure,
        'Sms',
        'has_permission', []
    );
};

module.exports = sms;