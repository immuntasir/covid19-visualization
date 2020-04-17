var latest_data;
function fetchDataAndLoadChart(){
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
                if (i==2) {
                    fetchBangladeshLatestData();
                }
                }
            });
    }
}

function loadChart() {
    showGraph(pr_country_name=chart_primary_country, countries=[], min_case_count = 10, init_day = 0, max_day = 90, content='cases',
                    aggregation_over = chart_aggregation_over, aggregation_type=chart_aggregation_type, normalization='none', scale='linear');
    MakeDescription();
}

function initializeVariables() {
    countries_to_compare.sort();
    for (let i=0; i<countries_to_compare.length; i++) {
        country_objects[countries_to_compare[i]] = Object();
        country_objects[countries_to_compare[i]]['start_date'] = getStartDate(countries_to_compare[i], 1, 0, 30);
        if (countries_to_compare[i] == 'Bangladesh') {
            country_objects[countries_to_compare[i]]['color'] = "#006a4e";
            country_objects[countries_to_compare[i]]['num_tests'] = Object();
            country_objects[countries_to_compare[i]]['num_cases'] = Object();
            country_objects[countries_to_compare[i]]['num_death'] = Object();
            country_objects[countries_to_compare[i]]['num_recovered'] = Object();
        }
        else {
            country_objects[countries_to_compare[i]]['color'] = country_colors[i];
        }
    }
    genericSlider('valueSpan2','slider12');
    initMinimumCaseSlider('valueSpan2');
    genericSlider('valueSpan3','slider13');
    showCountryOptions();
    countrySelector();
    addOnClickFunctions();
    enablingToolip();

    
    // Javascript to enable link to tab
    var url = document.location.toString();
    if (url.match('#')) {
        let tab_name = url.split('#')[1];
        if (tab_name != 'nav-list') {
            $('.nav-tabs a[href="#' + tab_name + '"]').tab('show');
        }
    }

    // Change hash for page-reload
    $('.nav-tabs a').on('shown.bs.tab', function (e) {
        window.location.hash = e.target.hash;
        window.scrollTo(0, 0);
    })


    /***************Preset graph options *****************/
    showCountryChartPreset();
}

function initializeCountryData (country_name='Bangladesh') {
    for (let i=0; i<content_actual_name.length; i++) {
        cur_country_data = getCountryRow(country_name, content_actual_name[i]);
        let keys = Object.keys(cur_country_data).slice(4);
        for (let j=0; j<keys.length; j++) {
            country_objects[country_name]['num_' + content_actual_name[i]][keys[j]] = parseInt(cur_country_data[keys[j]]);
        }
    }
    if (country_name == 'Bangladesh') {
        for (let i=0; i<latest_data.length; i++) {
            country_objects[country_name]['num_tests'][latest_data[i][0]] = parseInt(latest_data[i][4])
        }
    }
}

function fetchBangladeshLatestData(){
  var data;
  data_url ='https://raw.githubusercontent.com/rizveeerprojects/Corona-History/master/bangladesh-data/time_series.csv';
  $.ajax({
          type: "GET",
          url: data_url,
          dataType: "text",
          success: function(response)
          {

              data = $.csv.toArrays(response);
              latest_data = data;
              let length = data.length;
              bd_press_briefing_data['Date'] = data[length-1][0];
              bd_press_briefing_data['num_cases'] = parseInt(data[length-1][1]);
              bd_press_briefing_data['num_death'] =  parseInt(data[length-1][2]);
              bd_press_briefing_data['num_recovered'] = parseInt(data[length-1][3]);
              bd_press_briefing_data['num_test'] = parseInt(data[length-1][4]);

              initializeVariables();
              initializeCountryData('Bangladesh');
              loadChart();
          }
      });
}

function hideButtons(){
  if(chart_aggregation_over=='cumulative'){
    document.getElementById('dropdownMenuButton').style.display='none';
  }
}

function initialize(){
    fetchDataAndLoadChart();
    hideButtons();
}
