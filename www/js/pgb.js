$("#inter").on('click', function() {

    var urlAPI = 'http://wizard.uek.krakow.pl/~s179683/Web/order2/www/data.php';
    var date = $('#date').val();
    var league = $('#fto').val();
    var link = 'https://apifootball.com/api/?action=get_events&from=' + date + '&to=' + date + '&league_id=' + league + '&match_live=1';
    if (date == null || date == "") {
        alert("Date field is required")
    } else {
        $.ajax({
            url: urlAPI,
            type: 'POST',
            data: {
                'link': link,
            },
            //zamiana odpowiedzi json na string
            success: function(result) {
                var returnedData = JSON.parse(result);
                var formatedData = JSON.parse(returnedData);
                var html = '';
                if (formatedData.error == 404) {
                    html = 'This league is not playing on that day';
                    $('#result').html(html);
                } else {
                    $.each(formatedData, function(key, value) {
                        if (value.match_status == '') {
                            html += '<a style="text-decoration: none;" href="#matchpage">';
                            html += '<div data-date=' + date + ' data-league=' + value.league_id + ' class="result__item"' + 'match_id=' + value.match_id + '>';
                            html += ' <fieldset class="ui-grid-solo">';
                            html += '<div class="ui-btn ui-corner-all ui-shadow ui-btn-b"><label style="white-space:normal;">' + value.match_time + ' ' + value.match_hometeam_name + ' - ' + value.match_awayteam_name + '</label></div>';
                            html += ' </fieldset>';

                            html += '</div>';
                            html += '</a>';
                        }
                        if (value.match_status == 'FT') {
                            html += '<a style="text-decoration: none;" href="#matchpage">';
                            html += '<div data-date=' + date + ' data-league=' + value.league_id + ' class="result__item"' + 'match_id=' + value.match_id + '>';
                            html += ' <fieldset class="ui-grid-solo">';
                            html += '<div class="ui-btn ui-corner-all ui-shadow ui-btn-b"><label style="white-space:normal;">Full Time ' + value.match_hometeam_name + ' ' + value.match_hometeam_score + ':' + value.match_awayteam_score + ' ' + value.match_awayteam_name + '</label></div>';
                            html += ' </fieldset>';
                            html += '</div>';
                            html += '</a>';
                        }
                        if (value.match_status != 'FT' && value.match_status != 'Canc.' && value.match_status != '' && value.match_status != 'Postp.') {
                            html += '<a style="text-decoration: none;" href="#matchpage">';
                            html += '<div data-date=' + date + ' data-league=' + value.league_id + ' class="result__item"' + 'match_id=' + value.match_id + '>';
                            html += ' <fieldset class="ui-grid-solo">';
                            html += '<div class="ui-btn ui-corner-all ui-shadow ui-btn-b"><label style="white-space:normal;">' + value.match_status + ' ' + value.match_hometeam_name + ' ' + value.match_hometeam_score + ':' + value.match_awayteam_score + ' ' + value.match_awayteam_name + ' LIVE!</label></div>';
                            html += ' </fieldset>';
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


$('body').on('click', '.result__item', function() {
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
        success: function(result) {
            var returnedData = JSON.parse(result);
            var formatedData = JSON.parse(returnedData);
            var html = '';
            html += '<div class="new_result">';
            html += '<label>' + formatedData[0].league_name + ' - ' + formatedData[0].country_name + '</label>';
            html += '<label>' + formatedData[0].match_date + ' ' + formatedData[0].match_time + '</label>';
            if (formatedData[0].match_status == "") {
                html += '<label>' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + '</label>';
                html += '<hr/>';
                html += ' <fieldset class="ui-grid-a">';
                html += '<div class=" ui-btn ui-corner-all ui-shadow ui-btn-b ui-block-a"><label style="white-space:normal;" data-home=' + formatedData[0].match_hometeam_name.replace(/ /g, "_") + ' data-away=' + formatedData[0].match_awayteam_name.replace(/ /g, "_") + ' data-date=' + formatedData[0].match_date + ' data-time=' + formatedData[0].match_time + ' id="reminder">Remind me before match!</label></div>';
                html += '<div class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-block-b"><label style="white-space:normal;" data-home=' + formatedData[0].match_hometeam_name.replace(/ /g, "_") + ' data-away=' + formatedData[0].match_awayteam_name.replace(/ /g, "_") + ' data-date=' + formatedData[0].match_date + ' data-time=' + formatedData[0].match_time + ' id="reminder2">Remind me after match!</label></div>';
                html += ' </fieldset>';
                html += '<hr/>';
                html += ' <fieldset class="ui-grid-a">';
                html += '<div class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-block-a"><label style="white-space:normal;" data-matchdate=' + formatedData[0].match_date + ' data-matchId=' + formatedData[0].match_id + ' id="followMatch" class="matchFollow">Follow Match</label></div>';
                html += '<div class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-block-b"><label style="white-space:normal;" data-matchdate=' + formatedData[0].match_date + ' data-matchTime=' + formatedData[0].match_time + ' data-matchHome=' + formatedData[0].match_hometeam_name.replace(/ /g, "_") + ' data-matchAway=' + formatedData[0].match_awayteam_name.replace(/ /g, "_") + ' id="shareButtonBefore" class="MshareBefore">Remind a friend!</label></div>';
                //html += '<div class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-block-b"><label data-matchdate=' + formatedData[0].match_date + ' data-matchId=' + formatedData[0].match_id + ' id="sendSMSreminder" class="sendSMSreminder"><a style="text-decoration: none;" href="sms.html" data-rel="contact" data-icon="comment">SMS</a></label></div>';
                html += ' </fieldset>';
                //html += ' <fieldset class="ui-grid-solo">';
                //html += ' </fieldset>';
            } else if (formatedData[0].match_status == 'FT') {
                html += '<hr/>';
                html += '<label>' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + ' ' + formatedData[0].match_hometeam_score + ':' + formatedData[0].match_awayteam_score + '</label>';
                html += ' <fieldset class="ui-grid-solo">'
                html += '<div class="ui-btn ui-corner-all ui-shadow ui-btn-b"><label style="white-space:normal;" data-matchdate=' + formatedData[0].match_date + ' data-matchTime=' + formatedData[0].match_time + ' data-matchHome=' + formatedData[0].match_hometeam_name.replace(/ /g, "_") + ' data-matchAway=' + formatedData[0].match_awayteam_name.replace(/ /g, "_") + ' data-awayScore=' + formatedData[0].match_awayteam_score + ' data-homeScore=' + formatedData[0].match_hometeam_score + ' id="shareButtonAfter" class="MshareAfter">Share a result!</label></div>';
                html += ' </fieldset>';
            } else {
                html += '<label>' + formatedData[0].match_status + ' ' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + ' ' + formatedData[0].match_hometeam_score + ':' + formatedData[0].match_awayteam_score + ' LIVE!</label>';
                html += '<hr/>';
                html += ' <fieldset class="ui-grid-solo">';
                html += '<div class="ui-btn ui-corner-all ui-shadow ui-btn-b"><label style="white-space:normal;" data-matchdate=' + formatedData[0].match_date + ' data-matchId=' + formatedData[0].match_id + ' id="followMatch" class="matchFollow">Follow Match</label></div>';
                html += '<div class="ui-btn ui-corner-all ui-shadow ui-btn-b"><label style="white-space:normal;" data-matchStatus=' + formatedData[0].match_status + ' data-matchHome=' + formatedData[0].match_hometeam_name.replace(/ /g, "_") + ' data-matchAway=' + formatedData[0].match_awayteam_name.replace(/ /g, "_") + ' data-awayScore=' + formatedData[0].match_awayteam_score + ' data-homeScore=' + formatedData[0].match_hometeam_score + ' id="shareButtonLive" class="MshareLive">Sharescore!</label></div>';
                html += ' </fieldset>';
            }
            html += '</div>';
            html += ' <fieldset class="ui-grid-a">';
            html += '<div class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-block-a"><label style="white-space:normal;" ><a style="text-decoration: none;" href="#standingsPage" class="standings" data-home=' + formatedData[0].match_hometeam_name.replace(/ /g, "_") + ' data-away=' + formatedData[0].match_awayteam_name.replace(/ /g, "_") + ' id=' + elemLeague + ' data-transition="flip">Standings</a></label></div>';
            html += '<div class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-block-b"><label style="white-space:normal;" ><a style="text-decoration: none;" href="#oddsPage" class="bets" data-date=' + elemDate + ' id=' + elemID + ' data-transition="flip">Odds</a></label></div>';
            html += ' </fieldset>';
            if (formatedData[0].match_status != "" && formatedData[0].cards != null) {
                html += '<label>Goals</label>';
                html += '<hr/>';
            }
            var scoreCheck = 00;
            $.each(formatedData[0].goalscorer, function(key, value) {
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
                    html += '<label>' + value.time + '   ' + value.score + ' ' + formatedScorer + '' + formatedScorer2 + '</label>';
                    scoreCheck = home + away;
                } else {
                    html += '<label>' + value.time + '   ' + value.score + ' ' + formatedScorer + '' + formatedScorer2 + ' Missed Penalty!</label>';
                    scoreCheck = home + away;
                }
                //}
                html += '</div>';
            });
            console.log(formatedData[0].cards);
            if (formatedData[0].match_status != "" && formatedData[0].cards != null) {
                html += '<label>Cards</label>';
                html += '<hr/>';
            }
            $.each(formatedData[0].cards, function(key, value) {
                html += '<div class="cards">';
                if (value.time != "") {
                    var faul = value.home_fault;
                    var faul2 = value.away_fault;
                    var formatedFaul = faul.substring(4);
                    var formatedFaul2 = faul2.substring(4);
                    html += '<label>' + value.time + '   ' + value.card + ' ' + formatedFaul + '' + formatedFaul2 + '</label>';
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

<!-- *** Stanings *** -->

$('body').on('click', '.standings', function() {
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
        success: function(result) {
            var returnedData = JSON.parse(result);
            var formatedData = JSON.parse(returnedData);
            formatedData.sort(function(a, b) {
                return parseFloat(a.overall_league_position) - parseFloat(b.overall_league_position);
            });
            var html = '';
            html += '<tr>';
            html += '<th >' + 'No.' + '</th>';
            html += '<th  >' + 'Name' + '</th>';
            html += '<th >' + 'PG' + '</th>';
            html += '<th >' + 'W' + '</th>';
            html += '<th  >' + 'D' + '</th>';
            html += '<th  >' + 'L' + '</th>';
            html += '<th >' + 'GF' + '</th>';
            html += '<th  >' + 'GA' + '</th>';
            html += '<th  >' + 'PT' + '</th>';
            html += '</tr>';
            $.each(formatedData, function(key, value) {
                if (value.team_name.replace(/ /g, "_") == home || value.team_name.replace(/ /g, "_") == away) {
                    html += '<tr>';
                    html += '<th style="color:blue; ">' + value.overall_league_position + '</th>';
                    html += '<th style="color:blue; ">' + value.team_name + '</th>';
                    html += '<th style="color:blue; ">' + value.overall_league_payed + '</th>';
                    html += '<th style="color:blue;">' + value.overall_league_W + '</th>';
                    html += '<th style="color:blue; ">' + value.overall_league_D + '</th>';
                    html += '<th style="color:blue; ">' + value.overall_league_L + '</th>';
                    html += '<th style="color:blue; ">' + value.overall_league_GF + '</th>';
                    html += '<th style="color:blue; ">' + value.overall_league_GA + '</th>';
                    html += '<th style="color:blue; ">' + value.overall_league_PTS + '</th>';
                    html += '</tr>';
                } else {
                    html += '<tr>';
                    html += '<th >' + value.overall_league_position + '</th>';
                    html += '<th >' + value.team_name + '</th>';
                    html += '<th >' + value.overall_league_payed + '</th>';
                    html += '<th >' + value.overall_league_W + '</th>';
                    html += '<th >' + value.overall_league_D + '</th>';
                    html += '<th >' + value.overall_league_L + '</th>';
                    html += '<th >' + value.overall_league_GF + '</th>';
                    html += '<th >' + value.overall_league_GA + '</th>';
                    html += '<th >' + value.overall_league_PTS + '</th>';
                    html += '</tr>';
                }
            });
            console.log(html);
            $('#standingsResult').html(html);
        }
    });
});

<!-- *** Bets & Odds *** -->

$('body').on('click', '.bets', function() {
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
        success: function(result) {
            var returnedData = JSON.parse(result);
            console.log(returnedData);
            var html = '';
            console.log(returnedData[0]);
            if (returnedData[0] == 404) {
				html += '<div>';
                html += '<p>There is no odds available for this match right now</p>';
                html += '</div>';
                console.log(html);
                $('#oddsResult').html(html);
            } else {
				html2=''
                html2+='<fieldset class="ui-grid-b">';
                html2+='<div class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-block-a"><label style="position: sticky; white-space:normal;" id="sortHome"  matchID='+elemID+' matchDate='+elemDate+'>Sort home team</label></div>';
				html2+='<div class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-block-b"><label style="position: sticky; white-space:normal;" id="sortX"  matchID='+elemID+' matchDate='+elemDate+'>Sort draw</label></div>';
				html2+='<div class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-block-c"><label style="position: sticky; white-space:normal;" id="sortAway" matchID='+elemID+' matchDate='+elemDate+'>Sort away team</label></div>';
				html2+='</fieldset>';
                $('#buttons').html(html2);
				returnedData.sort(function(a, b) {
                return parseFloat(b.odd_1) - parseFloat(a.odd_1);
            });
                html += '<p>' + 'Odds Legend' + '</p>';
                html += '<p>' + 'Bookmaker' + ' ' + 'Home Win' + ' ' + 'Draw' + ' ' + 'Away Win' + '</p>';
                $.each(returnedData, function(key, value) {
                    html += '<div>';
                    //html += '<tr>';
                    //html += '<th style="padding: 5px 5px 5px 5px;">' + value.odd_bookmakers + '</th>';
                    //html += '<th style="padding: 5px 5px 5px 5px;">' + value.odd_1 + '</th>';
                    //html += '<th style="padding: 5px 5px 5px 5px;">' + value.odd_x + '</th>';
                    //html += '<th style="padding: 5px 5px 5px 5px;">' + value.odd_2 + '</th>';
                    //html += '</tr>';
                    html += '<p>' + value.odd_bookmakers + '  ' + value.odd_1 + '  ' + value.odd_x + '  ' + value.odd_2 + '</p>';
                    html += '</div>';
                });
                $('#oddsResult').html(html);
            }
        }
    });
});
$('body').on('click', '#sortHome', function() {
    var urlAPI = 'http://wizard.uek.krakow.pl/~s179683/Web/order2/www/data2.php';
    var elemID = $(this).attr('matchID');
    var elemDate = $(this).attr('matchDate');
    var link = 'https://apifootball.com/api/?action=get_odds&from=' + elemDate + '&to=' + elemDate + '&match_id=' + elemID;
    $.ajax({
        url: urlAPI,
        type: 'POST',
        data: {
            'link': link,
        },
        //zamiana odpowiedzi json na string
        success: function(result) {
            var returnedData = JSON.parse(result);
            console.log(returnedData);
            var html = '';
            console.log(returnedData[0]);
            if (returnedData[0] == 404) {
                html += '<div>';
                html += '<p>There is no odds available for this match right now</p>';
                html += '</div>';
                console.log(html);
                $('#oddsResult').html(html);
            } else {
				returnedData.sort(function(a, b) {
                return parseFloat(b.odd_1) - parseFloat(a.odd_1);
            });
                html += '<p>' + 'Odds Legend' + '</p>';
                html += '<p>' + 'Bookmaker' + ' ' + 'Home Win' + ' ' + 'Draw' + ' ' + 'Away Win' + '</p>';
                $.each(returnedData, function(key, value) {
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
        }
    });
});

$('body').on('click', '#sortX', function() {
    var urlAPI = 'http://wizard.uek.krakow.pl/~s179683/Web/order2/www/data2.php';
    var elemID = $(this).attr('matchID');
    var elemDate = $(this).attr('matchDate');
    var link = 'https://apifootball.com/api/?action=get_odds&from=' + elemDate + '&to=' + elemDate + '&match_id=' + elemID;
    $.ajax({
        url: urlAPI,
        type: 'POST',
        data: {
            'link': link,
        },
        //zamiana odpowiedzi json na string
        success: function(result) {
            var returnedData = JSON.parse(result);
            console.log(returnedData);
            var html = '';
            console.log(returnedData[0]);
            if (returnedData[0] == 404) {
                html += '<div>';
                html += '<p>There is no odds available for this match right now</p>';
                html += '</div>';
                console.log(html);
                $('#oddsResult').html(html);
            } else {
				returnedData.sort(function(a, b) {
                return parseFloat(b.odd_x) - parseFloat(a.odd_x);
            });
                html += '<p>' + 'Odds Legend' + '</p>';
                html += '<p>' + 'Bookmaker' + ' ' + 'Home Win' + ' ' + 'Draw' + ' ' + 'Away Win' + '</p>';
                $.each(returnedData, function(key, value) {
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
        }
    });
});

$('body').on('click', '#sortAway', function() {
    var urlAPI = 'http://wizard.uek.krakow.pl/~s179683/Web/order2/www/data2.php';
    var elemID = $(this).attr('matchID');
    var elemDate = $(this).attr('matchDate');
    var link = 'https://apifootball.com/api/?action=get_odds&from=' + elemDate + '&to=' + elemDate + '&match_id=' + elemID;
    $.ajax({
        url: urlAPI,
        type: 'POST',
        data: {
            'link': link,
        },
        //zamiana odpowiedzi json na string
        success: function(result) {
            var returnedData = JSON.parse(result);
            console.log(returnedData);
            var html = '';
            console.log(returnedData[0]);
            if (returnedData[0] == 404) {
                html += '<div>';
                html += '<p>There is no odds available for this match right now</p>';
                html += '</div>';
                console.log(html);
                $('#oddsResult').html(html);
            } else {
				returnedData.sort(function(a, b) {
                return parseFloat(b.odd_2) - parseFloat(a.odd_2);
            });
                html += '<p>' + 'Odds Legend' + '</p>';
                html += '<p>' + 'Bookmaker' + ' ' + 'Home Win' + ' ' + 'Draw' + ' ' + 'Away Win' + '</p>';
                $.each(returnedData, function(key, value) {
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
        }
    });
});

<!-- *** Live Results Content *** -->

$("#liveButton").on('click', function() {
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
        success: function(result) {
            var returnedData = JSON.parse(result);
            var formatedData = JSON.parse(returnedData);
            var html = '';
			console.log(formatedData);
            if (formatedData.error == 404) {
                html = 'No live matches';
                $('#LiveResult').html(html);
            } else {
                $.each(formatedData, function(key, value) {
                    if (value.match_status != 'FT' && value.match_status != 'Canc.' && value.match_status != '' && value.match_status != 'Postp.') {
                            html += '<a style="text-decoration: none;" href="#matchpage">';
                            html += '<div data-date=' + date + ' data-league=' + value.league_id + ' class="result__item"' + 'match_id=' + value.match_id + '>';
                            html += ' <fieldset class="ui-grid-solo">';
                            html += '<div class="ui-btn ui-corner-all ui-shadow ui-btn-b"><label style="white-space:normal;">' + value.match_status + ' ' + value.match_hometeam_name + ' ' + value.match_hometeam_score + ':' + value.match_awayteam_score + ' ' + value.match_awayteam_name + ' LIVE!</label></div>';
                            html += ' </fieldset>';
                            html += '</div>';
                            html += '</a>';
                    }
                });
            }
            $('#LiveResult').html(html);
        }
    });
});

<!-- *** Follow match button action *** -->

$('body').on('click', '.matchFollow', function() {
    var elemDate = $(this).attr('data-matchdate');
    var elemID = $(this).attr('data-matchId');
    var len = localStorage.length;
    var identifier = 0;
    console.log(identifier);
    for (var i = 0; i < len; i++) {
        var key = localStorage.key(i);
        if (elemID == key) {
            identifier = 1;
            console.log(identifier);
        }
    }
    if (identifier == 1) {
        alert("You are already following this match");
    } else {
        localStorage.setItem(elemID, elemDate);
        alert("You are now following this match, to easy check the score, click button following in main menu");
    }
});

<!-- *** SMS button action on match details transfer data *** -->

$('body').on('click', '.sendSMSreminder', function() {
    var elemDate = $(this).attr('data-matchdate');
    var elemID = $(this).attr('data-matchId');
    var len = localStorage.length;
    var identifier = 0;
    console.log(identifier);
    for (var i = 0; i < len; i++) {
        var key = localStorage.key(i);
        if (elemID == key) {
            identifier = 1;
            console.log(identifier);
        }
    }
    localStorage.setItem('sms-matchId', elemID);
    localStorage.setItem('sms-matchdate', elemDate);

    //        if (identifier == 1) {
    //          alert("You are already following this match");
    //    }
    //  else {
    //    localStorage.setItem('matchId', elemID);
    //  localStorage.setItem('matchdate', elemDate);
    //localStorage.setItem(elemID, elemDate);
    //alert("You are now following this match, to easy check the score, click button following in main menu");
    //}
});

<!-- *** Unfollow match *** -->

$('body').on('click', '.matchUnfollow', function() {
    var elemID = $(this).attr('data-matchId');
    localStorage.removeItem(elemID);


    alert("Match is now unfollowed, refresh the page to see the result")
});

<!-- *** ReFollow match refresh *** -->

$('body').on('click', '.refFollow', function() {
    var len = localStorage.length;
    if (len > 0) {
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
                success: function(result) {
                    var returnedData = JSON.parse(result);
                    var formatedData = JSON.parse(returnedData);
                    html += '<div class="' + formatedData[0].match_id + '_resultsfromFollow">';
                    if (formatedData[0].match_status == "") {
                        html += '<label>' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + '</label>';
                    } else if (formatedData[0].match_status == 'FT') {
                        html += '<label>' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + ' ' + formatedData[0].match_hometeam_score + ':' + formatedData[0].match_awayteam_score + '</label>';
                    } else {
                        html += '<label>' + formatedData[0].match_status + ' ' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + ' ' + formatedData[0].match_hometeam_score + ':' + formatedData[0].match_awayteam_score + ' LIVE!</label>';
                    }
                    html += '<div class="' + formatedData[0].match_id + '_goalscorers_follow">';
                    $.each(formatedData[0].goalscorer, function(key, value) {
                        html += '<label>&nbsp' + value.time + ' ' + value.score + ' ' + value.home_scorer + '' + value.away_scorer + '</label>';
                    });
                    html += '</div>';
                    html += '<fieldset class="ui-grid-solo">';
                    html += '<div class=" ui-btn ui-corner-all ui-shadow ui-btn-b" style="background-color: coral; white-space:normal;"><label data-matchId=' + formatedData[0].match_id + ' id="UnfollowMatch" class="matchUnfollow">Unfollow</label></div>';
                    html += '<hr/>';
                    html += '</fieldset>';
                    html += '</div>';
                    $('#followResult').html(html);
                }
            });
        }
    } else {
        html = '';
        html += '<label>You are not following any match at the moment</label>';
        $('#followResult').html(html);
    }
});

<!-- *** Social Media Sharing Before *** -->

$('body').on('click', '.MshareBefore', function() {
    var elemDate = $(this).attr('data-matchDate');
    var elemTime = $(this).attr('data-matchTime');
    var elemHome = $(this).attr('data-matchHome');
    var homeTeam = elemHome.replace(/_/g, " ");
    var elemAway = $(this).attr('data-matchAway');
    var awayTeam = elemAway.replace(/_/g, " ");
    //console.log(elemDate+' '+elemTime+' '+homeTeam+'-'+awayTeam + ". Don't miss this match!");
    //$("#follows").load(location.href+" #follows>*","");
    window.plugins.socialsharing.share(elemDate + ' ' + elemTime + ' ' + homeTeam + ' - ' + awayTeam + ". Don't miss this match!");

});

<!-- *** Social Media Sharing After*** -->

$('body').on('click', '.MshareAfter', function() {
    var elemDate = $(this).attr('data-matchDate');
    var elemTime = $(this).attr('data-matchTime');
    var elemHome = $(this).attr('data-matchHome');
    var homeTeam = elemHome.replace(/_/g, " ");
    var elemAway = $(this).attr('data-matchAway');
    var awayTeam = elemAway.replace(/_/g, " ");
    var homeScore = $(this).attr('data-homeScore');
    var awayScore = $(this).attr('data-awayScore');
    //console.log(elemDate+' '+elemTime+' '+homeTeam+' - '+awayTeam + ' Final Score: '+homeScore+':'+awayScore);
    //$("#follows").load(location.href+" #follows>*","");
    window.plugins.socialsharing.share(elemDate + ' ' + elemTime + ' ' + homeTeam + ' - ' + awayTeam + ' Final Score: ' + homeScore + ':' + awayScore);
});

<!-- *** Social Media Sharing Live *** -->

$('body').on('click', '.MshareLive', function() {
    var elemStatus = $(this).attr('data-matchStatus');
    var elemHome = $(this).attr('data-matchHome');
    var homeTeam = elemHome.replace(/_/g, " ");
    var elemAway = $(this).attr('data-matchAway');
    var awayTeam = elemAway.replace(/_/g, " ");
	var homeScore = $(this).attr('data-homeScore');
    var awayScore = $(this).attr('data-awayScore');
    window.plugins.socialsharing.share(elemStatus + ' min ' + homeTeam + ' - ' + awayTeam + ' Score: ' + homeScore + ':' + awayScore);
});

<!-- *** Follows Main Page ***-->

$("#goToFollow").on('click', function() {
    var len = localStorage.length;
    if (len > 0) {
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
                success: function(result) {
                    var returnedData = JSON.parse(result);
                    var formatedData = JSON.parse(returnedData);
                    html += '<div class="' + formatedData[0].match_id + '_resultsfromFollow">';
                    if (formatedData[0].match_status == "") {
                        html += '<label>' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + '</label>';
                    } else if (formatedData[0].match_status == 'FT') {
                        html += '<label>' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + ' ' + formatedData[0].match_hometeam_score + ':' + formatedData[0].match_awayteam_score + '</label>';
                    } else {
                        html += '<label>' + formatedData[0].match_status + ' ' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + ' ' + formatedData[0].match_hometeam_score + ':' + formatedData[0].match_awayteam_score + ' LIVE!</label>';
                        html += '<hr/>';
                    }
                    html += '<div class="' + formatedData[0].match_id + '_goalscorers_follow">';
                    $.each(formatedData[0].goalscorer, function(key, value) {
                        html += '<label>&nbsp' + value.time + ' ' + value.score + ' ' + value.home_scorer + '' + value.away_scorer + '</label>';
                    });
                    html += '</div>';
                    html += ' <fieldset class="ui-grid-solo">';
                    html += '<div class=" ui-btn ui-corner-all ui-shadow ui-btn-b" style="background-color: coral; white-space:normal;"><label data-matchId=' + formatedData[0].match_id + ' id="UnfollowMatch" class="matchUnfollow">Unfollow</label></div>';
                    html += '<hr/>';
                    html += '</fieldset>';
                    html += '</div>';
                    $('#followResult').html(html);
                }
            });
        }
    } else {
        html = '';
        html += '<label>You are not following any match at the moment</label>';
        $('#followResult').html(html);
    }
});

<!-- *** Remind before match *** -->

$('body').on('click', '#reminder', function() {
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
    var success = function(message) {
        alert("Success: Reminder set correctly");
    };
    var error = function(message) {
        alert("Error: something went wrong");
    };
    window.plugins.calendar.createEventWithOptions(title, eventLocation, notes, startDate, endDate, calOptions, success, error);
});

<!-- *** Remind after match *** -->

$('body').on('click', '#reminder2', function() {
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
    var success = function(message) {
        alert("Success: Reminder set correctly");
    };
    var error = function(message) {
        alert("Error: something went wrong");
    };
    window.plugins.calendar.createEventWithOptions(title, eventLocation, notes, startDate, endDate, calOptions, success, error);
});

<!-- *** Standings Main Page *** -->

$("#findStan").on('click', function() {
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
        success: function(result) {
            var returnedData = JSON.parse(result);
            var formatedData = JSON.parse(returnedData);
            formatedData.sort(function(a, b) {
                return parseFloat(a.overall_league_position) - parseFloat(b.overall_league_position);
            });
            var html = '';
            html += '<tr>';
            html += '<th style="padding: 5px 5px 5px 5px;">' + 'No.' + '</th>';
            html += '<th  style="padding: 5px 5px 5px 5px;">' + 'Name' + '</th>';
            html += '<th  style="padding: 5px 5px 5px 5px;">' + 'PG' + '</th>';
            html += '<th  style="padding: 5px 5px 5px 5px;">' + 'W' + '</th>';
            html += '<th  style="padding: 5px 5px 5px 5px;">' + 'D' + '</th>';
            html += '<th  style="padding: 5px 5px 5px 5px;">' + 'L' + '</th>';
            html += '<th  style="padding: 5px 5px 5px 5px;">' + 'GF' + '</th>';
            html += '<th  style="padding: 5px 5px 5px 5px;">' + 'GA' + '</th>';
            html += '<th  style="padding: 5px 5px 5px 5px;">' + 'PT' + '</th>';
            html += '</tr>';
            $.each(formatedData, function(key, value) {
                html += '<tr>';
                html += '<th  padding: 5px 5px 5px 5px;">' + value.overall_league_position + '</th>';
                html += '<th  padding: 5px 5px 5px 5px;">' + value.team_name + '</th>';
                html += '<th  padding: 5px 5px 5px 5px;">' + value.overall_league_payed + '</th>';
                html += '<th  padding: 5px 5px 5px 5px;">' + value.overall_league_W + '</th>';
                html += '<th  padding: 5px 5px 5px 5px;">' + value.overall_league_D + '</th>';
                html += '<th  padding: 5px 5px 5px 5px;">' + value.overall_league_L + '</th>';
                html += '<th  padding: 5px 5px 5px 5px;">' + value.overall_league_GF + '</th>';
                html += '<th  padding: 5px 5px 5px 5px;">' + value.overall_league_GA + '</th>';
                html += '<th  padding: 5px 5px 5px 5px;">' + value.overall_league_PTS + '</th>';
                html += '</tr>';
            });
            $('#standingsMenuResult').html(html);
        }
    });
});
