function showInitialGraph(){
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
                    showGraph(pr_country_name=chart_primary_country, countries=[], min_case_count = 10, init_day = 0, max_day = 30, content='cases', 
                    aggregation_over = chart_aggregation_over, aggregation_type=chart_aggregation_type, normalization='none', scale='linear');
                }
                }
            });
    }
}

function initialize(){
  console.log("data fetched");
  showInitialGraph();
}

$(document).ready(function(){
    countries_to_compare.sort();
    genericSlider('valueSpan2','slider12');
    genericSlider('valueSpan3','slider13');
    showCountryOptions();
    countrySelector();
    addOnClickFunctions();
    enablingToolip();
    });
