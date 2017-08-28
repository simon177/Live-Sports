<!-- *** Connection with API and parser, find matches ***-->
<script>
    $("#inter").on('click', function () {

        var urlAPI = 'http://wizard.uek.krakow.pl/~s179683/Web/order2/www/data.php';
        var date = $('#date').val();
        var league = $('#fto').val();
        var link = 'https://apifootball.com/api/?action=get_events&from=' + date + '&to=' + date + '&league_id=' + league + '&match_live=1';
        if (date == null || date == "") {
            alert("Date field is required")
        }
        else {
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
                    if (formatedData.error == 404) {
                        html = 'This league is not playing on that day';
                        $('#result').html(html);
                    }
                    else {
                        $.each(formatedData, function (key, value) {
                            if (value.match_status == '') {
                                html += '<a href="#matchpage">';
                                html += '<div data-date=' + date + ' data-league=' + value.league_id + ' class="result__item"' + 'match_id=' + value.match_id + '>';
                                html += '<label>' + value.match_time + ' ' + value.match_hometeam_name + ' - ' + value.match_awayteam_name + '</label>';
                                html += '</div>';
                                html += '</a>';
                            }
                            if (value.match_status == 'FT') {
                                html += '<a href="#matchpage">';
                                html += '<div data-date=' + date + ' data-league=' + value.league_id + ' class="result__item"' + 'match_id=' + value.match_id + '>';
                                html += '<label>Full Time ' + value.match_hometeam_name + ' ' + value.match_hometeam_score + ':' + value.match_awayteam_score + ' ' + value.match_awayteam_name + '</label>';
                                html += '</div>';
                                html += '</a>';
                            }
                            if (value.match_status != 'FT' && value.match_status != 'Canc.' && value.match_status != '' && value.match_status != 'Postp.') {
                                html += '<a href="#matchpage">';
                                html += '<div data-date=' + date + ' data-league=' + value.league_id + ' class="result__item"' + 'match_id=' + value.match_id + '>';
                                html += '<label>' + value.match_status + ' ' + value.match_hometeam_name + ' ' + value.match_hometeam_score + ':' + value.match_awayteam_score + ' ' + value.match_awayteam_name + ' LIVE!</label>';
                                html += '</div>';
                                html += '</a>';
                            }
                        });
                    }
                    $('#result').html(html);
                }
            });
        }
    });
</script>

<!--*** Result items *** -->
<script>
    $('body').on('click', '.result__item', function () {
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
    });
</script>

<!-- *** Stanings *** -->
<script>
    $('body').on('click', '.standings', function () {
        var urlAPI = 'http://wizard.uek.krakow.pl/~s179683/Web/order2/www/data.php';
        var elemLeague = $(this).attr('id');
        var home = $(this).attr('data-home');
        var away = $(this).attr('data-away');
        var link = 'https://apifootball.com/api/?action=get_standings&league_id=' + elemLeague;
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
                formatedData.sort(function (a, b) {
                    return parseFloat(a.overall_league_position) - parseFloat(b.overall_league_position);
                });
                var html = '';
                $.each(formatedData, function (key, value) {
                    if (value.team_name.replace(/ /g, "_") == home || value.team_name.replace(/ /g, "_") == away) {
                        html += '<tr>';
                        html += '<th style="color:blue;">' + value.overall_league_position + '</th>';
                        html += '<th style="color:blue;">' + value.team_name + '</th>';
                        html += '<th style="color:blue;">' + value.overall_league_payed + '</th>';
                        html += '<th style="color:blue;">' + value.overall_league_W + '</th>';
                        html += '<th style="color:blue;">' + value.overall_league_D + '</th>';
                        html += '<th style="color:blue;">' + value.overall_league_L + '</th>';
                        html += '<th style="color:blue;">' + value.overall_league_GF + '</th>';
                        html += '<th style="color:blue;">' + value.overall_league_GA + '</th>';
                        html += '<th style="color:blue;">' + value.overall_league_PTS + '</th>';
                        html += '</tr>';
                    }
                    else {
                        html += '<tr>';
                        html += '<th>' + value.overall_league_position + '</th>';
                        html += '<th>' + value.team_name + '</th>';
                        html += '<th>' + value.overall_league_payed + '</th>';
                        html += '<th>' + value.overall_league_W + '</th>';
                        html += '<th>' + value.overall_league_D + '</th>';
                        html += '<th>' + value.overall_league_L + '</th>';
                        html += '<th>' + value.overall_league_GF + '</th>';
                        html += '<th>' + value.overall_league_GA + '</th>';
                        html += '<th>' + value.overall_league_PTS + '</th>';
                        html += '</tr>';
                    }
                });
                console.log(html);
                $('#standingsResult').html(html);
            }
        });
    });
</script>

<!-- *** Bets & Odds *** -->
<script>
    $('body').on('click', '.bets', function () {
        var urlAPI = 'http://wizard.uek.krakow.pl/~s179683/Web/order2/www/data2.php';
        var elemID = $(this).attr('id');
        var elemDate = $(this).attr('data-date');
        var link = 'https://apifootball.com/api/?action=get_odds&from=' + elemDate + '&to=' + elemDate + '&match_id=' + elemID;
        $.ajax({
            url: urlAPI,
            type: 'POST',
            data: {
                'link': link,
            },
            //zamiana odpowiedzi json na string
            success: function (result) {
                var returnedData = JSON.parse(result);
                var html = '';
                $.each(returnedData, function (key, value) {
                    html += '<div>';
                    //html += '<tr>';
                    //html += '<th>' + value.odd_bookmakers + '</th>';
                    //html += '<th>' + value.odd_1 + '</th>';
                    //html += '<th>' + value.odd_x + '</th>';
                    //html += '<th>' + value.odd_2 + '</th>';
                    //html += '</tr>';
                    html += '<p>' + value.odd_bookmakers + '  ' + value.odd_1 + '  ' + value.odd_x + '  ' + value.odd_2 + '</p>';
                    html += '</div>';
                });
                $('#oddsResult').html(html);
            }
        });
    });
</script>

<!-- *** Live Results Content *** -->
<script>
    $("#liveButton").on('click', function () {
        var urlAPI = 'http://wizard.uek.krakow.pl/~s179683/Web/order2/www/data.php';
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        date = yyyy + '-' + mm + '-' + dd;
        console.log(date);
        var link = 'https://apifootball.com/api/?action=get_events&from=' + date + '&to=' + date + '&match_live=1';
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
                if (formatedData.error == 404) {
                    html = 'No live matches';
                    $('#LiveResult').html(html);
                }
                else {
                    $.each(formatedData, function (key, value) {
                        if (value.match_status != 'FT' && value.match_status != 'Canc.' && value.match_status != '' && value.match_status != 'Postp.') {
                            html += '<a href="#matchpage">';
                            html += '<div data-date=' + date + ' data-league=' + value.league_id + ' class="result__item"' + 'match_id=' + value.match_id + '>';
                            html += '<label>' + value.match_status + ' ' + value.match_hometeam_name + ' ' + value.match_hometeam_score + ':' + value.match_awayteam_score + ' ' + value.match_awayteam_name + ' LIVE!</label>';
                            html += '</div>';
                            html += '</a>';
                        }
                    });
                }
                $('#LiveResult').html(html);
            }
        });
    });
</script>

<!-- *** Follow match button action *** -->
<script>
    $('body').on('click', '.matchFollow', function () {
        var elemDate = $(this).attr('data-matchdate');
        var elemID = $(this).attr('data-matchId');
        var len = localStorage.length;
        var identifier = 0;
        console.log(identifier);
        for (var i = 0; i < len; i++) {
            var key = localStorage.key(i);
            console.log(key + ' ' + elemID)
            if (elemID == key) {
                identifier = 1;
                console.log(identifier);
            }
        }
        if (identifier == 1) {
            alert("You are already following this match");
        }
        else {
            localStorage.setItem(elemID, elemDate);
            alert("You are now following this match, to easy check the score, click button following in main menu");
        }
    });
</script>

<!-- *** Follows Main Page ***-->
<script>
    $("#goToFollow").on('click', function () {
        var len = localStorage.length;
        for (var i = len - 1; i >= 0; i--) {
            var key = localStorage.key(i);
            var value = localStorage[key];
            var urlAPI = 'http://wizard.uek.krakow.pl/~s179683/Web/order2/www/data.php';
            var link = 'https://apifootball.com/api/?action=get_events&from=' + value + '&to=' + value + '&match_id=' + key;
            var html = '';
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
                    html += '<div class="' + formatedData[0].match_id + '_resultsfromFollow">';
                    if (formatedData[0].match_status == "") {
                        html += '<label>' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + '</label>';
                    }
                    else if (formatedData[0].match_status == 'FT') {
                        html += '<label>' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + ' ' + formatedData[0].match_hometeam_score + ':' + formatedData[0].match_awayteam_score + '</label>';
                    }
                    else {
                        html += '<label>' + formatedData[0].match_status + ' ' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + ' ' + formatedData[0].match_hometeam_score + ':' + formatedData[0].match_awayteam_score + ' LIVE!</label>';
                    }
                    html += '<div class="' + formatedData[0].match_id + '_goalscorers_follow">';
                    $.each(formatedData[0].goalscorer, function (key, value) {
                        html += '<label>&nbsp' + value.time + ' ' + value.score + ' ' + value.home_scorer + '' + value.away_scorer + '</label>';
                    });
                    html += '</div>';
                    html += '<label>-----------</label>';
                    html += '</div>';
                    $('#followResult').html(html);
                }
            });
        }
    });
</script>

<!-- *** Remind1 *** -->
<script>
    $('body').on('click', '#reminder', function () {
        var home = $(this).attr('data-home').replace(/_/g, " ");
        var away = $(this).attr('data-away').replace(/_/g, " ");
        var dateD = $(this).attr('data-date');
        var timeD = $(this).attr('data-time');
        var year = dateD.substring(0, 4);
        var month = dateD.substring(5, 7);
        var day = dateD.substring(8, 10);
        var hour = timeD.substring(0, 2);
        var minutes = timeD.substring(3, 5);
        var calOptions = window.plugins.calendar.getCalendarOptions(); // grab the defaults
        calOptions.firstReminderMinutes = 30;
        calOptions.secondReminderMinutes = 5;
        var startDate = new Date(year, month - 1, day, hour, minutes); // beware: month 0 = january, 11 = december
        var endDate = new Date(year, month - 1, day, hour, minutes);
        var title = home + ' - ' + away;
        var eventLocation = home + " Stadium";
        var notes = "Don't forget";
        var success = function (message) {
            alert("Success: Reminder set correctly");
        };
        var error = function (message) {
            alert("Error: something went wrong");
        };
        window.plugins.calendar.createEventWithOptions(title, eventLocation, notes, startDate, endDate, calOptions, success, error);
    });
</script>

<!-- *** Remind2 *** -->
<script>
    $('body').on('click', '#reminder2', function () {
        var home = $(this).attr('data-home').replace(/_/g, " ");
        var away = $(this).attr('data-away').replace(/_/g, " ");
        var dateD = $(this).attr('data-date');
        var timeD = $(this).attr('data-time');
        var year = dateD.substring(0, 4);
        var month = dateD.substring(5, 7);
        var day = dateD.substring(8, 10);
        var hour = timeD.substring(0, 2);
        var finalHour = +hour + 2;
        console.log(finalHour);
        var minutes = timeD.substring(3, 5);
        var calOptions = window.plugins.calendar.getCalendarOptions(); // grab the defaults
        calOptions.firstReminderMinutes = 5;
        calOptions.secondReminderMinutes = 1;

        var startDate = new Date(year, month - 1, day, finalHour, minutes); // beware: month 0 = january, 11 = december
        var endDate = new Date(year, month - 1, day, finalHour, minutes);
        var title = home + ' - ' + away;
        var eventLocation = home + " Stadium";
        var notes = "Match ended, you can now check the final score in app";
        var success = function (message) {
            alert("Success: Reminder set correctly");
        };
        var error = function (message) {
            alert("Error: something went wrong");
        };
        window.plugins.calendar.createEventWithOptions(title, eventLocation, notes, startDate, endDate, calOptions, success, error);
    });
</script>

<!-- *** Standings Main Page *** -->
<script>
    $("#findStan").on('click', function () {
        var urlAPI = 'http://wizard.uek.krakow.pl/~s179683/Web/order2/www/data.php';
        var league = $('#fleague').val();
        var link = 'https://apifootball.com/api/?action=get_standings&league_id=' + league;
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
                formatedData.sort(function (a, b) {
                    return parseFloat(a.overall_league_position) - parseFloat(b.overall_league_position);
                });
                var html = '';
                $.each(formatedData, function (key, value) {
                    html += '<tr>';
                    html += '<th>' + value.overall_league_position + '</th>';
                    html += '<th>' + value.team_name + '</th>';
                    html += '<th>' + value.overall_league_payed + '</th>';
                    html += '<th>' + value.overall_league_W + '</th>';
                    html += '<th>' + value.overall_league_D + '</th>';
                    html += '<th>' + value.overall_league_L + '</th>';
                    html += '<th>' + value.overall_league_GF + '</th>';
                    html += '<th>' + value.overall_league_GA + '</th>';
                    html += '<th>' + value.overall_league_PTS + '</th>';
                    html += '</tr>'
                });
                $('#standingsMenuResult').html(html);
            }
        });
    });
</script>

<!-- *** Local Storage test *** -->
<script>
    $(document).on('pagebeforeshow', '#find_match', function () {
        $(document).on('click', '#inter', function () {
            // store some data
            if (typeof(Storage) !== "undefined") {
                firstname = "Lukasz";
                lastname = "Dolezalek";
                localStorage.setItem('firstname', firstname);
                localStorage.setItem('lastname', lastname);
            }
            // Change page
            $.mobile.changePage("#find_match_results");
        });
    });
    $(document).on('pagebeforeshow', '#find_match_results', function () {
        alert('My name is ' + localStorage.getItem('firstname') + ' ' + localStorage.getItem('lastname'));
    });
</script>

<!-- *** Local Storage test1 *** -->
<script>
    $(document).on('pagebeforeshow', '#find_match_results', function () {
        $(document).on('click', '#reminder', function () {
            // store some data
            if (typeof(Storage) !== "undefined") {
                mecz = "Legia-Wisla";
                data = "2017-08-11";
                godzina = "21:00";
                localStorage.setItem('firstname', firstname);
                localStorage.setItem('lastname', lastname);
                localStorage.setItem('mecz', mecz);
                localStorage.setItem('data', data);
                localStorage.setItem('godzina', godzina);
            }
            // Change page
            $.mobile.changePage("sms.html");
        });
    });
    $(document).on('pagebeforeshow', '#matchpage', function () {
        alert('My name is ' + localStorage.getItem('mecz') + ' ' + localStorage.getItem('data'));
    });
</script>

<!-- *** Check Network Connection *** -->
<script>

    // Wait for PhoneGap to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // PhoneGap is loaded and it is now safe to make calls PhoneGap methods
    //
    function onDeviceReady() {
        checkConnection();
    }

    function checkConnection() {
        var networkState = navigator.network.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.NONE] = 'No network connection';
        if ((states[networkState]) == states[Connection.NONE]) {
            alert("Please check your internet connectivity and try again for full app functionality");
        }
        else
            alert('Internet connectivity detected. Connection type: ' + states[networkState]);

    }
</script>

