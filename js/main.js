
function CheckCurrentTime(){

}

$(document).ready(function(){
    //genericSlider('valueSpan','slider11');
    countries_to_compare.sort();
    genericSlider('valueSpan2','slider12');
    genericSlider('valueSpan3','slider13');
    showCountryOptions();
    //showGraphOptions();
    countrySelector();
    //colorChanger("0");



    var data;
    urls = ["https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
            "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
            "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv"]

    for (let i=0; i<urls.length; i++) {
        data_url = urls[i];
        $.ajax({
            type: "GET",
            url: data_url,
            dataType: "text",
            success: function(response)
            {
                data = $.csv.toArrays(response);
                allCountriesData[content_actual_name[i]] = csvJSON(data);
                if (i==0) {
                    showGraph([], min_case_count = 10, init_day = 0, max_day = 20, content='cases', aggregation='cumulative', normalization='none', scale='linear');
                }
                }
            });
    }

    var now = new Date();
    var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0, 0, 0) - now;
    console.log(millisTill10);
    if (millisTill10 < 0) {
      millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
    }
    //setTimeout(function(){alert("It's 10am!")}, millisTill10);


    });
