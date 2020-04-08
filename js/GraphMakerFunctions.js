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
    var country_data = getCountryRow(country_name, content);

    country_data_keys = Object.keys(country_data);
    data_by_date_keys = country_data_keys.slice(4, );
    is_relevant = false;

    var ret_values = [];
    var init_day = 0;

    var three_days_moving_average = 0;
    var seven_days_moving_average = 0;
    var beta3 = 0;
    var beta7 = 0
    for (let i=0; i<data_by_date_keys.length; i++) {
        if (is_relevant == true && i > init_day + max_day) {
            break;
        }
        if (is_relevant == false && country_data[data_by_date_keys[i]] >= min_case_count && i>=init_day) {
            is_relevant = true;
            init_day = i;
        }
        if (is_relevant == false) {
            continue;
        }
        value = 0
        if (aggregation == 'cumulative') {
            value = parseInt(country_data[data_by_date_keys[i]]);
        }
        if (aggregation == 'new_cases') {
            if (i!=0){
                value = parseInt(country_data[data_by_date_keys[i]]) - parseInt(country_data[data_by_date_keys[i-1]]);
            }
        }
        ret_values.push(value);
    }
    ret_values = [country_name].concat(ret_values);
    return ret_values;
  }

  function showGraph(countries, min_case_count = 10, init_day = 0, max_day = 20, content='cases', aggregation='cumulative', normalization='none', scale='linear') {
    bd_data = getCountryData('Bangladesh', min_case_count, init_day, max_day, content, aggregation);
    console.log(bd_data);
    data_columns = [bd_data];
    for (let i=0; i<countries.length; i++)  {
        data_columns.push(getCountryData(countries[i], min_case_count, init_day, max_day, content, aggregation))
    }

    for (let i=0; i<data_columns.length; i++) {
        for (let j=1; j<data_columns[i].length; j++) {
            //data_columns[i][j] = Math.log10(data_columns[i][j]);
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
        axis : {
            y : {
                show:true,
                tick: {
                   format: function (d) {
                    return d;
                    //   return Math.pow(10,d).toFixed(0);
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
