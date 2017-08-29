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

function findMatches(){
        var urlAPI = 'http://wizard.uek.krakow.pl/~s179683/Web/order2/www/data.php';
        var elemID = $(this).attr('match_id');
        var elemDate = $(this).attr('data-date');
        var elemLeague = $(this).attr('data-league');
        var link = 'https://apifootball.com/api/?action=get_events&from=' + elemDate + '&to=' + elemDate + '&match_id=' + elemID;
        $.ajax({
            url: urlAPI,
            type: 'POST',
            data: {
                'link': link,
            },
            //zamiana odpowiedzi json na string
            success: function (result) {
                var returnedData = JSON.parse(result);
                var formatedData = JSON.parse(returnedData);
                var html = '';
                html += '<div class="new_result">';
                html += '<label>' + formatedData[0].league_name + ' - ' + formatedData[0].country_name + '</label>';
                html += '<label>' + formatedData[0].match_date + ' ' + formatedData[0].match_time + '</label>';
                if (formatedData[0].match_status == "") {
                    html += '<label>' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + '</label>';
                    html += '<button data-home=' + formatedData[0].match_hometeam_name.replace(/ /g, "_") + ' data-away=' + formatedData[0].match_awayteam_name.replace(/ /g, "_") + ' data-date=' + formatedData[0].match_date + ' data-time=' + formatedData[0].match_time + ' id="reminder">Remind me before match!</button>';
                    html += '<button data-home=' + formatedData[0].match_hometeam_name.replace(/ /g, "_") + ' data-away=' + formatedData[0].match_awayteam_name.replace(/ /g, "_") + ' data-date=' + formatedData[0].match_date + ' data-time=' + formatedData[0].match_time + ' id="reminder2">Remind me after match!</button>';
                    html += '<button data-matchdate=' + formatedData[0].match_date + ' data-matchId=' + formatedData[0].match_id + ' id="followMatch" class="matchFollow">Follow Match</button>';
                    html += '<button data-matchdate=' + formatedData[0].match_date + ' data-matchId=' + formatedData[0].match_id + ' id="sendSMSreminder" class="sendSMSreminder"><a href="sms.html" data-rel="contact" data-icon="comment">SMS</a></button>';
                }
                else if (formatedData[0].match_status == 'FT') {
                    html += '<label>' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + ' ' + formatedData[0].match_hometeam_score + ':' + formatedData[0].match_awayteam_score + '</label>';
                }
                else {
                    html += '<label>' + formatedData[0].match_status + ' ' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + ' ' + formatedData[0].match_hometeam_score + ':' + formatedData[0].match_awayteam_score + ' LIVE!</label>';
                    html += '<button data-matchdate=' + formatedData[0].match_date + ' data-matchId=' + formatedData[0].match_id + ' id="followMatch" class="matchFollow">Follow Match</button>';

                }
                html += '</div>';
                html += '<a href="#standingsPage" class="standings" data-home=' + formatedData[0].match_hometeam_name.replace(/ /g, "_") + ' data-away=' + formatedData[0].match_awayteam_name.replace(/ /g, "_") + ' id=' + elemLeague + '>Standings</a>';
                html += '<a href="#oddsPage" class="bets" data-date=' + elemDate + ' id=' + elemID + '>Odds</a>';
                if (formatedData[0].match_status != "" && formatedData[0].cards != null) {
                    html += '<label>Goals</label>';
                }
                var scoreCheck = 00;
                $.each(formatedData[0].goalscorer, function (key, value) {
                    html += '<div class="goalscorers">';
                    var score = value.score;
                    var scoreFormated = score.replace(/\s/g, '');
                    var home = scoreFormated.substring(0, 1);
                    var away = scoreFormated.substring(2, 3);
                    var scorer = value.home_scorer;
                    var scorer2 = value.away_scorer;
                    var formatedScorer = scorer.substring(4);
                    var formatedScorer2 = scorer2.substring(4);
                    console.log(home + away);
                    //if(home == 0 && away ==0){
                    //scoreCheck = home+away
                    //html += '<label>' + value.time + ' ' + value.score + ' ' + formatedScorer + '' + formatedScorer2 + ' Missed Penalty!</label>';
                    //}
                    //else {
                    if (home + away != scoreCheck) {
                        html += '<label>' + value.time + ' ' + value.score + ' ' + formatedScorer + '' + formatedScorer2 + '</label>';
                        scoreCheck = home + away;
                    }
                    else {
                        html += '<label>' + value.time + ' ' + value.score + ' ' + formatedScorer + '' + formatedScorer2 + ' Missed Penalty!</label>';
                        scoreCheck = home + away;
                    }
                    //}
                    html += '</div>';
                });
                console.log(formatedData[0].cards);
                if (formatedData[0].match_status != "" && formatedData[0].cards != null) {
                    html += '<label>Cards</label>';
                }
                $.each(formatedData[0].cards, function (key, value) {
                    html += '<div class="cards">';
                    if (value.time != "") {
                        var faul = value.home_fault;
                        var faul2 = value.away_fault;
                        var formatedFaul = faul.substring(4);
                        var formatedFaul2 = faul2.substring(4);
                        html += '<label>' + value.time + ' ' + value.card + ' ' + formatedFaul + '' + formatedFaul2 + '</label>';
                    }
                    html += '</div>';
                });
                //}
                //if(formatedData[0].match_status=="FT" ){
                //$.each(formatedData[0].goalscorer, function(key, value){
                //html += '<div class="goalscorers">';
                //html += '<label>'+value.time+' '+value.score+' '+value.home_scorer+''+value.away_scorer+'</label>';
                //html += '</div>';
                //});
                //}
                $('#matchDetails').html(html);
            }
        });
    }

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