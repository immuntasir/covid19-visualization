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
    if(str.length<2){
      str.length = "20"+str.length;
    }
    let year = parseInt(str[2]);
    if(year<2020){
      year = 2020;
    }
    return new Date(year,parseInt(str[0])-1,parseInt(str[1]));
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

  function getCountryRow(country_name_in, content='cases') {
    var country_rows;
    country_rows = allCountriesData[content];

    var country_data;
    let country_name = country_name_in;
    if (country_name in country_name_map) {
        country_name = country_name_map[country_name]
    }

    if (country_name == 'France' || country_name == "United Kingdom" || country_name == "Denmark") {
        country_data = country_rows.filter(function(x) {
            return x['Country/Region'] == country_name && x['Province/State'] == '';
        })[0];
    }
    else {
    country_data = country_rows.filter(function(x){
        return x['Country/Region'] == country_name;
    })[0];
    }

    if (country_name == 'Bangladesh') {
        if (isPressBriefingDataUpdated(country_data)) {
            country_data[bd_press_briefing_data['Date']] = bd_press_briefing_data['num_' + content];
        }
    }
    if (!country_data) {
        console.log(country_name);
    }
    return country_data;
  }

  function getCountryRowCombination (country_name_in, content='cfr') {
    let country_row = {}
    if (content == 'cfr') {
        let num_cases = getCountryRow(country_name_in, 'cases');
        let num_death = getCountryRow(country_name_in, 'death');
        let data_keys = Object.keys(num_cases)
        for (let i=0; i<data_keys.length; i++ ) {
            if (i<4) {
                country_row[data_keys[i]] = num_cases[data_keys[i]];
                continue;
            }
            if (num_cases[data_keys[i]] != 0) {
                country_row[data_keys[i]] = ((num_death[data_keys[i]] / num_cases[data_keys[i]]) * 100).toFixed(2);
            }
            else {
                country_row[data_keys[i]] = 0;
            }
        }
    }
    else if (content == 'death_by_closed_cases') {
        let num_recovered = getCountryRow(country_name_in, 'recovered');
        let num_death = getCountryRow(country_name_in, 'death');
        let data_keys = Object.keys(num_death)
        for (let i=0; i<data_keys.length; i++ ) {
            if (i<4) {
                country_row[data_keys[i]] = num_death[data_keys[i]];
                continue;
            }
            let tot = parseInt(num_death[data_keys[i]])  + parseInt(num_recovered[data_keys[i]]);
            if (tot != 0) {
                country_row[data_keys[i]] = ((parseInt(num_death[data_keys[i]]) / tot) * 100).toFixed(2);
            }
            else {
                country_row[data_keys[i]] = 0;
            }
        }
    }
    return country_row;
  }

  function getCountryDataCombination (country_name_in, content='cfr', min_case_count = 20, init_day = 0, max_day = 80) {
    
    init_day = getStartDate(country_name_in, min_case_count, init_day, max_day);
    if (init_day == -1) {
        return [];
    }

    let country_data = getCountryRowCombination(country_name_in, content);
    let country_data_keys = Object.keys(country_data);
    let data_by_date_keys = country_data_keys.slice(4, );
    is_relevant = false;

    let ret_values = [];


    country_current_init_dates[country_name_in] = [];

    for (let i=init_day; i<data_by_date_keys.length; i++) {
        if (i > init_day + max_day) {
            break;
        }
        country_current_init_dates[country_name_in].push(dateConverter(data_by_date_keys[i]));

        value = parseFloat(country_data[data_by_date_keys[i]]);
        
        ret_values.push(value);
    }

    data_label = country_name_in;
    ret_values = [data_label].concat(ret_values);
    return ret_values;
  }

  function getStartDate(country_name, min_case_count = 10, init_day = 0, max_day = 20) {
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
      return date_object[1].toString() + ' ' + months[date_object[0] - 1] + ', 2020';
  }

  function getCountryData (country_name, min_case_count = 20, init_day = 0, max_day = 80, content='cases', aggregation_over='cumulative', aggregation_type='none', data_label='none') {

    init_day = getStartDate(country_name, min_case_count, init_day, max_day);
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
    if (data_label == 'none') {
        data_label = country_name;
    }
    ret_values = [data_label].concat(ret_values);
    return ret_values;
  }

  function yAxisNumToLog (in_number) {
    if (in_number == 0) return -1;
    return Math.log10(in_number) / Math.LN10;
  }

  function yAxisLogToNum (in_number) {
    if (in_number == -1) return 0;
    return Math.pow(10, in_number * Math.LN10);
  }

  function getYTickValues (min_y_val, max_y_val) {
    let y_tick_values = [];
    loop_break = false;
    for (let i=0; ; i++) {
        if (loop_break){
            break;
        }
        for (let j=0; j<y_tick_scales.length; j++) {
            if (Math.pow(10, i)*y_tick_scales[j] < min_y_val && Math.pow(10, i)*y_tick_scales[j] < max_y_val) {
                continue;
            }
            y_tick_values.push(Math.log10(Math.pow(10, i)*y_tick_scales[j]) / Math.LN10);
            if (Math.pow(10, i)*y_tick_scales[j] > max_y_val) {
                loop_break = true;
                break;
            }
        }
    }
    return y_tick_values;
  }

  

  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  function getDoublesEveryNDays (n, num_points, min_value, max_value) {
    let cur_value = min_value;
    ret_values = ['Doubles every ' + n + ' days'];
    ret_values.push(yAxisNumToLog(cur_value));
    for (let i=n-1; i<num_points; i+=n) {
        cur_value *= 2;
        if (cur_value <= max_value) {
            for (let j=1; j<n; j++) {
                ret_values.push(null);
            }
            ret_values.push(yAxisNumToLog(cur_value));
        }
        else {
            break;
        }
    }
    return ret_values;
  }

  function showGraph(pr_country_name='Bangladesh', countries=[], min_case_count = 10, init_day = 0, max_day = 30, content='cases', aggregation_over='cumulative', aggregation_type='none', normalization='none', scale='linear') {
    let pr_data;
    if (content == 'cfr' || content == 'death_by_closed_cases') {
        pr_data = getCountryDataCombination(pr_country_name, content);
    }
    else {
        pr_data = getCountryData(pr_country_name, min_case_count, init_day, max_day, content, aggregation_over, aggregation_type);
    }
    data_columns = [pr_data];
    for (let i=0; i<countries.length; i++)  {
        if (content == 'cfr' || content == 'death_by_closed_cases') {
            cur_data = getCountryDataCombination(countries[i], content);
        }
        else {
            cur_data = getCountryData(countries[i], min_case_count, init_day, max_day, content, aggregation_over, aggregation_type);
        }
        if (cur_data.length > 1) {
            data_columns.push(cur_data);
        }
    }

    let color_list = Object();
    let y_tick_values;
    let y_axis_min_value;

    for (let i=0; i<data_columns.length; i++) {
        color_list[data_columns[i][0]] = country_objects[data_columns[i][0]]['color'];
    }

    let max_y_val = 0;
    let min_y_val=min_case_count;
    let hidden_list;

    if (scale == 'logarithmic') {
        y_axis_min_value = 0;
        for (let i=0; i<data_columns.length; i++) {
            for (let j=1; j<data_columns[i].length; j++) {
                if (data_columns[i][j] > max_y_val) {
                    max_y_val = data_columns[i][j];
                }
                if (data_columns[i][j] < min_y_val) {
                    min_y_val = data_columns[i][j];
                }
                if (data_columns[i][j] != 0) {
                    data_columns[i][j] = yAxisNumToLog (data_columns[i][j]);
                }
            }
        }
        hidden_list = []
        data_columns.push(getDoublesEveryNDays(2, max_day, min_y_val, max_y_val));
        color_list[data_columns.slice(-1)[0][0]] = '#000000';
        hidden_list.push(data_columns.slice(-1)[0][0])
        data_columns.push(getDoublesEveryNDays(3, max_day, min_y_val, max_y_val));
        color_list[data_columns.slice(-1)[0][0]] = '#000000';
        hidden_list.push(data_columns.slice(-1)[0][0])
        data_columns.push(getDoublesEveryNDays(7, max_day, min_y_val, max_y_val));
        color_list[data_columns.slice(-1)[0][0]] = '#000000';
        hidden_list.push(data_columns.slice(-1)[0][0])
        y_tick_values = getYTickValues(min_y_val, max_y_val);
        y_axis_min_value = Math.max(yAxisNumToLog(2), y_tick_values[0]);
    }
    if (chart != undefined) {
        chart = chart.destroy();
    }
    chart = c3.generate({
        data: {
            columns: data_columns,
            type: chart_type_comparing_countries,
            types: {
                [pr_country_name]: chart_type_primary_country,
            },
            colors: color_list,
            hide: hidden_list,
        },
        size: {
            height: 500,
        },
        tooltip: {
            format: {
                name: function (name, ratio, id, index) {
                    if (name.startsWith('Doubles')) {
                        return name;
                    }
                    return name + ' (' + country_current_init_dates[name][index] + ')';
                }
            }
        },
        line: {
            connectNull: true
        },
        axis : {
            y : {
                show:true,
                label: {
                    text: '# ' + content_name_map[content],
                    position: 'outer-middle',
                },
                min: y_axis_min_value,
                tick: {
                    values: y_tick_values,
                    format: function (d) {
                        if (scale == 'logarithmic') {
                            return formatNumber(yAxisLogToNum(d).toFixed(0));
                        }
                        else {
                            return formatNumber(d);
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
