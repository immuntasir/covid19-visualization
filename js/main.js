
$(document).ready(function(){
    //genericSlider('valueSpan','slider11');
    genericSlider('valueSpan2','slider12');
    genericSlider('valueSpan3','slider13');
    showCountryOptions();
    showGraphOptions();
    countrySelector();
    colorChanger("0");



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
                var bd_data = getCountryData('Bangladesh');
                if (i==0) {
                    showGraph([], min_case_count = 10, init_day = 0, max_day = 20, content='cases', aggregation='cumulative', normalization='none', scale='linear');
                }
                }
            });
    }
    });
