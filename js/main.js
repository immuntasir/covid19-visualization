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
                    MakeDescription();
                }
                }
            });
    }
}

function bringBangladeshLatestData(){
  var data;
  data_url ='https://raw.githubusercontent.com/rizveeerprojects/Corona-History/master/bangladesh-data/time_series.csv';
  $.ajax({
          type: "GET",
          url: data_url,
          dataType: "text",
          success: function(response)
          {

              data = $.csv.toArrays(response);
              let length = data.length;
              bd_press_briefing_data['Date'] = data[length-1][0]
              bd_press_briefing_data['cases'] = parseInt(data[length-1][1]);
              bd_press_briefing_data['death'] =  parseInt(data[length-1][2]);
              bd_press_briefing_data['recovered'] =  parseInt(data[length-1][3]);
          }
      });
}

function initialize(){
  showInitialGraph();
  bringBangladeshLatestData();
}

$(document).ready(function(){
    countries_to_compare.sort();
    genericSlider('valueSpan2','slider12');
    initMinimumCaseSlider('valueSpan2');
    genericSlider('valueSpan3','slider13');
    showCountryOptions();
    countrySelector();
    addOnClickFunctions();
    enablingToolip();
    });
