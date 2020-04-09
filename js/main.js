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
                    showGraph(pr_country_name=chart_primary_country, countries=[], min_case_count = 10, init_day = 0, max_day = 30, content='cases', aggregation='cumulative', normalization='none', scale='linear');
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
              bd_press_briefing_data['Date'] = data[0][0]
              bd_press_briefing_data['Total'] = parseInt(data[0][1]);
              bd_press_briefing_data['Death'] =  parseInt(data[0][2]);
              bd_press_briefing_data['Recovered'] =  parseInt(data[0][3]);
              
          }
      });
}

function initialize(){
  console.log("data fetched");
  showInitialGraph();
  bringBangladeshLatestData();
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
