$(document).ready(function() {
  // Set global variables
    var zip = "";
    var deg = "";
    var units = "imperial";
    var degs = 'F';
    var weatherStat;
    var cityName="";
    var timeDay, sunrise, sunset;
// Get visitor's zip code based on IP, and set it to the var zip
  function getIp()  {$.ajax({
        type: 'GET',
        url: 'http://ip-api.com/json',
        success: function(data) {
            zip = data.zip;
            $('#address').attr('value',zip);
        },
        complete: getTemp
    });}
    //Check for current units, and return appropriate abbreviation
    function degGet() {
      var checkUnits = units;
        if (checkUnits == 'imperial') {
            degs = 'F';
        } else if(checkUnits == 'metric'){
            degs = 'C';
        }
    }
    //Use Zip code to GET openweathermap JSON
    function getTemp() {
        $.ajax({
            type: 'GET',
            url: ('http://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',us' + '&appid=2310fb952e694107d99d1667a348d72d&units=' + units),
            success: function(e) {
                weatherStat = e.weather[0].id;
                deg = Math.round(e.main.temp);
                cityName = e.name;
                sunrise = e.sys.sunrise;
                sunset = e.sys.sunset;
                timeDay = e.dt;
              fillTemp();
            },
            complete: function(){changeIcon();}
        });
    }
//Detect current units and convert temperature, rounded to 0 decimal places
function convert() {
  if (units == 'imperial'){
    deg = Math.round((deg * (9 / 5)) + 32,0);
    degGet();
    fillTemp();
  }
  else if (units == 'metric'){
    deg = Math.round(((deg - 32) * (5/9)),0);
    degGet();
    fillTemp();
  }
}
//Change units and run the convert function
    function changeU() {
      var unitCheck = units;
        if (unitCheck == 'imperial') {
            units = 'metric';
            convert();
        } else if (unitCheck == 'metric') {
            units = 'imperial';
            convert() ;
        }
    }
    //Function to call after the #units object has been created by fillTemp()
function setClick(){
  $('#units').click(changeU);
  $('#whyHere').click(function()
  {
    $('#modal').modal();
  });
                      }
//Insert html <a id="units"> into <p id="temp">
function fillTemp(){
  $('#temp').html(deg + "&#176;" + '<a id="units" >' + degs + '</a>');
  $('#city').html(cityName + '<a><i class="fa fa-question"id="whyHere"></i></a>');
  setClick();
}
//Change icon displayed based on value of weatherStat
function changeIcon(){
  var $weatherIcon = $('#weatherIcon');
  // if (timeDay >= sunrise && timeDay <= sunset){
  //   $weatherIcon.attr('class',"wi wi-owm-day-" + weatherStat);
  // }
  // else if (timeDay <= sunrise || timeDay >= sunset){
  //   $weatherIcon.attr('class',"wi wi-owm-night-" + weatherStat);}
  //   else
    {$weatherIcon.attr('class',"wi wi-owm-" + weatherStat);}
  // if (weatherStat == 'Thunderstorm'){
  //   $weatherIcon.attr('class',"wi wi-thunderstorm");
  // }
  // if (weatherStat == 'Drizzle' || 'Rain'){
  //   $weatherIcon.attr('class',"wi wi-showers");
  // }
  // if (weatherStat == 'Snow'){
  //   $weatherIcon.attr('class',"wi wi-snow");
  // }
  // if (weatherStat == 'Atmosphere'){
  //   $weatherIcon.attr('class',"wi wi-smoke");
  // }
  // if (weatherStat == 'Clear'){
  //   $weatherIcon.attr('class',"wi wi-wu-clear");
  // }
  // if (weatherStat == 'Extreme'){
  //   $weatherIcon.attr('class',"wi wi-windy");
  // }
}
//New Zip script
function updateWeather(){
 var  $address = $('#address');
  if ($address.val() !== '' || null){
    zip = $address.val();
  }
  zip=$('#address').val();
  getTemp();
  $('#zipUpdate').css('display','none');
  $('#changeLoc').css('display','');
}
//hide things
function peekaBoo(){
  $('#changeLoc').css('display','none');
  $('#zipUpdate').css('display','flex');
}
  $('#update').click(updateWeather);
  $('#changeLoc').click(peekaBoo);
  $('#address').keypress(function(e){
      if(e.keyCode==13 && $('#address').val() !==""){
        updateWeather();
      }});

  //prevent text highlighting on certain elements
    $('p, h1,#temp,#city').mousedown(function(event) {
        event.preventDefault();
   //Clear text input on click
      $("#address").click(function() {
    if (this.value !== "") {
        this.value = '';
    }
});
      //reinput
      $("#address").blur(function() {
    if (this.value === "") {
        this.value = zip;
    }
});
    });
  // initialize page
     getIp();
    getTemp();
});
