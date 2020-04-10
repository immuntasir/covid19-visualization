function csvJSON(csv){

    var lines=csv;

    var result = [];

    var headers=lines[0]

    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i];

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    return result; //JavaScript object
    //return JSON.stringify(result); //JSON
  }

  function returnDateObject(string){
    string = string.toString();
    let str = string.split('/');
    return new Date(parseInt(str[2]),parseInt(str[0])-1,parseInt(str[1]));
  }

  function isPressBriefingDataUpdated(country_data) {
    let last_date = Object.keys(country_data).slice(-1,);
    last_date = returnDateObject(last_date);
    let current_date = returnDateObject(bd_press_briefing_data['Date']);
    try{
      let d1 = current_date-last_date;
      if(d1 == 86400000) {
        return true;
      }
      return false;
    }
    catch(error){
      return false;
    }
    return false;
  }

  function getCountryRow(country_name, content='cases') {
      var country_rows;
      country_rows = allCountriesData[content];

      var country_data;
      if (country_name == 'France' || country_name == "United Kingdom" || country_name == "Denmark") {
        country_data = country_rows.filter(function(x) {
            return x['Country/Region'] == 'France' && x['Province/State'] == '';
        })[0];
      }
      else {
        country_data = country_rows.filter(function(x){
            return x['Country/Region'] == country_name;
        })[0];
      }

      if (country_name == 'Bangladesh') {
          if (isPressBriefingDataUpdated(country_data)) {
              country_data[bd_press_briefing_data['Date']] = bd_press_briefing_data[content];
          }
      }
      return country_data;
  }

  function getStartDate(country_name, min_case_count = 10, init_day = 0, max_day = 20, content='cases') {
    let country_data = getCountryRow(country_name, 'cases');
    let country_data_keys = Object.keys(country_data);
    let data_by_date_keys = country_data_keys.slice(4, );
    init_day = -1;
    for (let i=Math.max(init_day, 0); i<data_by_date_keys.length; i++) {
        if (country_data[data_by_date_keys[i]] >= min_case_count && i>=init_day) {
            init_day = i;
            break;
        }
    }
    return init_day;
  }

  function dateConverter(date_string) {
      date_object = date_string.split('/');
      return date_object[1].toString() + ' ' + months[date_object[0] - 1] + ', 20' + date_object[2];
  }

  function getCountryData (country_name, min_case_count = 10, init_day = 0, max_day = 20, content='cases', aggregation_over='cumulative', aggregation_type='none') {

    init_day = getStartDate(country_name, min_case_count, init_day, max_day, content='cases');
    if (init_day == -1) {
        return [];
    }

    let country_data = getCountryRow(country_name, content);
    let country_data_keys = Object.keys(country_data);
    let data_by_date_keys = country_data_keys.slice(4, );
    is_relevant = false;

    var ret_values = [];


    country_current_init_dates[country_name] = [];

    for (let i=init_day; i<data_by_date_keys.length; i++) {
        if (i > init_day + max_day) {
            break;
        }
        value = 0
        country_current_init_dates[country_name].push(dateConverter(data_by_date_keys[i]));

        if (aggregation_over == 'cumulative') {
            value = parseInt(country_data[data_by_date_keys[i]]);
        }
        else if (aggregation_over == 'new_cases') {
            if (i != 0){
                value = parseInt(country_data[data_by_date_keys[i]]) - parseInt(country_data[data_by_date_keys[i-1]]);
            }
            else {
                value = parseInt(country_data[data_by_date_keys[i]]);
            }
        }
        ret_values.push(value);
    }

    if (aggregation_type != 'none') {
        let three_days_moving_sum = 0;
        let seven_days_moving_sum = 0;
        let three_days_moving_n = 0;
        let seven_days_moving_n = 0;

        ret_values_new = []
        for (let i=0; i<ret_values.length; i++) {
            value = 0;
            if (aggregation_type == '3_day_moving_average') {
                three_days_moving_n += 1;
                three_days_moving_sum += ret_values[i];
                if (three_days_moving_n > 3) {
                    three_days_moving_n = 3;
                    three_days_moving_sum -= ret_values[i-3];
                }
                value = Math.round(three_days_moving_sum / three_days_moving_n);
            }
            else if (aggregation_type == '7_day_moving_average') {
                seven_days_moving_n += 1;
                seven_days_moving_sum += ret_values[i];
                if (seven_days_moving_n > 7) {
                    seven_days_moving_n = 7;
                    seven_days_moving_sum -= ret_values[i-7];
                }
                value = Math.round(seven_days_moving_sum / seven_days_moving_n);
            }
            ret_values_new.push(value);
        }
        ret_values = ret_values_new;
    }

    ret_values = [country_name].concat(ret_values);
    return ret_values;
  }

  function showGraph(pr_country_name='Bangladesh', countries=[], min_case_count = 10, init_day = 0, max_day = 30, content='cases', aggregation_over='cumulative', aggregation_type='none', normalization='none', scale='linear') {
    pr_data = getCountryData(pr_country_name, min_case_count, init_day, max_day, content, aggregation_over, aggregation_type);
    data_columns = [pr_data];
    for (let i=0; i<countries.length; i++)  {
        cur_data = getCountryData(countries[i], min_case_count, init_day, max_day, content, aggregation_over, aggregation_type);
        if (cur_data.length > 1) {
            data_columns.push(cur_data);
        }
    }

    if (scale == 'logarithmic') {
        for (let i=0; i<data_columns.length; i++) {
            for (let j=1; j<data_columns[i].length; j++) {
                if (data_columns[i][j] != 0) {
                    data_columns[i][j] = Math.log10(data_columns[i][j]) / Math.LN10;;
                }
            }
        }
    }

    var chart = c3.generate({
        data: {
            columns: data_columns,
            type: chart_type_comparing_countries,
            types: {
                [pr_country_name]: chart_type_primary_country,
            }
        },
        size: {
            height: 500,
        },
        tooltip: {
            format: {
                name: function (name, ratio, id, index) {
                    return name + ' (' + country_current_init_dates[name][index] + ')';
                }
            }
        },
        axis : {
            y : {
                show:true,
                tick: {
                   format: function (d) {
                        if (scale == 'logarithmic') {
                            if (d!=0) {
                                return Math.pow(10,d * Math.LN10).toFixed(0)
                            }
                            else {
                                return d
                            }
                        }
                        else {
                            return d;
                        }
                    }
                }
            },
            x : {
                show:true,
                tick: {
                   format: function (d) { return 'Day ' + d; }
                }
            }
        },
    });
  }
