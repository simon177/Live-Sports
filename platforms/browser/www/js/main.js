
function findMatch()
{
$("#inter").on('click', function () {
  var urlAPI = 'http://wizard.uek.krakow.pl/~s179683/Web/order2/www/data.php';
  var date = $('#fdate').val();
  var league = $('#fto').val();
  var link = 'https://apifootball.com/api/?action=get_events&from=' + date + '&to=' + date + '&league_id=' + league + '&match_live=1';
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
});
}

function matchDetail()
{
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

        html += '<button data-home=' + formatedData[0].match_hometeam_name.replace(/ /g, "_") + ' data-away=' + formatedData[0].match_awayteam_name.replace(/ /g, "_") + ' data-date=' + formatedData[0].match_date + ' data-time=' + formatedData[0].match_time + ' id="reminder">Remind Me!</button>';
      }
      else if (formatedData[0].match_status == 'FT') {
        html += '<label>' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + ' ' + formatedData[0].match_hometeam_score + ':' + formatedData[0].match_awayteam_score + '</label>';
      }
      else {
        html += '<label>' + formatedData[0].match_status + ' ' + formatedData[0].match_hometeam_name + ' - ' + formatedData[0].match_awayteam_name + ' ' + formatedData[0].match_hometeam_score + ':' + formatedData[0].match_awayteam_score + ' LIVE!</label>';
      }
      html += '</div>';
      html += '<div class="result__item__heds">';
      html += '<a href="#standingsPage" class="standings" data-home=' + formatedData[0].match_hometeam_name.replace(/ /g, "_") + ' data-away=' + formatedData[0].match_awayteam_name.replace(/ /g, "_") + ' id=' + elemLeague + '>Standings</a>';
      html += '</div>';
      html += '<div class="result__item__heds">';
      html += '<a href="#oddsPage" class="bets" data-date=' + elemDate + ' id=' + elemID + '>Odds</a>';
      html += '</div>';
      $.each(formatedData[0].goalscorer, function (key, value) {
        html += '<div class="goalscorers">';
        html += '<label>' + value.time + ' ' + value.score + ' ' + value.home_scorer + '' + value.away_scorer + '</label>';
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
}

function standings()
{
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
          html += '<tr style="color:blue;">';
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
      $('#standings').html(html);
    }
  });
});
}

function bets()
{
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
        html += '<tr>';
        html += '<th>' + value.odd_bookmakers + '</th>';
        html += '<th>' + value.odd_1 + '</th>';
        html += '<th>' + value.odd_x + '</th>';
        html += '<th>' + value.odd_2 + '</th>';
        html += '</tr>';
        html += '<p>' + value.odd_bookmakers + '  ' + value.odd_1 + '  ' + value.odd_x + '  ' + value.odd_2 + '</p>';
        html += '</div>';
      });
      $('#oddsResult').html(html);
    }
  });
});
}

function reminder()
{
$('body').on('click', '#reminder', function () {
  //var home = $(this).attr('data-home').replace(/_/g," ");
  //var away= $(this).attr('data-away').replace(/_/g," ");
  //var dateD = $(this).attr('data-date');
  //var timeD = $(this).attr('data-time');
  //var year = dateD.substring(0,4);
  //var month = dateD.substring(5,7);
  //var day = dateD.substring(8,10);
  //var hour = timeD.substring(0,2);
  //var minutes = timeD.substring(3,5);
  var startDate = new Date(2017, 05, 22, 18, 00); // beware: month 0 = january, 11 = december
  var endDate = new Date(2017, 05, 22, 19, 00);
  var title = "My nice event";
  var eventLocation = "Home";
  var notes = "Some notes about this event.";
  var success = function (message) {
    alert("Success: " + JSON.stringify(message));
  };
  var error = function (message) {
    alert("Error: " + message);
  };
  var calOptions = window.plugins.calendar.getCalendarOptions();
  window.plugins.calendar.createEvent(title, eventLocation, notes, startDate, endDate, success, error);
});
}


function move1js()
{
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
}
