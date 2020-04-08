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

  function getCountryRow(country_name, content='cases') {
      var country_rows;
      country_rows = allCountriesData[content];

      var country_data
      if (country_name == 'France') {
        country_data = country_rows.filter(function(x) {
            return x['Country/Region'] == 'France' && x['Province/State'] == '';
        })[0];
      }
      else {
        country_data = country_rows.filter(function(x){
            return x['Country/Region'] == country_name;
        })[0];
      }
      return country_data;
  }

  function getCountryData (country_name, min_case_count = 10, init_day = 0, max_day = 20, content='cases', aggregation='cumulative') {
    
    var country_data = getCountryRow(country_name, 'cases');
    var country_data_keys = Object.keys(country_data);
    var data_by_date_keys = country_data_keys.slice(4, );
    
    for (let i=init_day; i<data_by_date_keys.length; i++) {
        if (country_data[data_by_date_keys[i]] >= min_case_count && i>=init_day) {
            init_day = i;
            break;
        }
    }

    country_data = getCountryRow(country_name, content);
    country_data_keys = Object.keys(country_data);
    data_by_date_keys = country_data_keys.slice(4, );
    is_relevant = false;

    var ret_values = [];
    
    var three_days_moving_sum = 0;
    var seven_days_moving_sum = 0;
    var three_days_moving_n = 0;
    var seven_days_moving_n = 0;
    
    
    for (let i=init_day; i<data_by_date_keys.length; i++) {
        if (i > init_day + max_day) {
            break;
        }
        value = 0
        if (aggregation == 'cumulative') {
            value = parseInt(country_data[data_by_date_keys[i]]);
        }
        else if (aggregation == 'new_cases') {
            if (i != init_day){
                value = parseInt(country_data[data_by_date_keys[i]]) - parseInt(country_data[data_by_date_keys[i-1]]);
            }
            else {
                value = parseInt(country_data[data_by_date_keys[i]]);
            }
        }
        else if (aggregation == '3_day_moving_average') {
            three_days_moving_n += 1;
            three_days_moving_sum += parseInt(country_data[data_by_date_keys[i]]);
            if (three_days_moving_n > 3) {
                three_days_moving_n = 3; 
                three_days_moving_sum -= parseInt(country_data[data_by_date_keys[i-3]])
            }
        
            value = Math.round(three_days_moving_sum / three_days_moving_n);
        }
        else if (aggregation == '7_day_moving_average') {
            seven_days_moving_n += 1;
            seven_days_moving_sum += parseInt(country_data[data_by_date_keys[i]]);
            if (seven_days_moving_n > 7) {
                seven_days_moving_n = 7; 
                seven_days_moving_sum -= parseInt(country_data[data_by_date_keys[i-7]])
            }

            value = Math.round(seven_days_moving_sum / seven_days_moving_n);
        }
        //console.log(country_name, i, parseInt(country_data[data_by_date_keys[i]]), value);
        ret_values.push(value);
    }
    ret_values = [country_name].concat(ret_values);
    return ret_values;
  }

  function showGraph(countries, min_case_count = 10, init_day = 0, max_day = 20, content='cases', aggregation='cumulative', normalization='none', scale='linear') {
    bd_data = getCountryData('Bangladesh', min_case_count, init_day, max_day, content, aggregation);
    //console.log(bd_data);
    data_columns = [bd_data];
    for (let i=0; i<countries.length; i++)  {
        data_columns.push(getCountryData(countries[i], min_case_count, init_day, max_day, content, aggregation))
    }

    if (scale == 'logarithmic') {
        for (let i=0; i<data_columns.length; i++) {
            for (let j=1; j<data_columns[i].length; j++) {
                if (data_columns[i][j] != 0) {
                    data_columns[i][j] = Math.log10(data_columns[i][j]);
                }
            }
        }
    }

    var chart = c3.generate({
        data: {
            columns: data_columns,
            type: 'line',
            types: {
                Bangladesh: 'bar',
            }
        },
        size: {
            height: 500,
        },
        axis : {
            y : {
                show:true,
                tick: {
                   format: function (d) {
                        if (scale == 'logarithmic') {
                            if (d!=0) {
                                return Math.pow(10,d).toFixed(0)
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
