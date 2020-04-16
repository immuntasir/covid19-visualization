function getAreaChartDateKeys(pr_country_name) {
    let date_keys = Object.keys(country_objects['Bangladesh']['num_tests']).slice(1, );
    return date_keys;
}

function getAreaChartData (pr_country_name) {
    let data_labels = ['Total Tests', 'Total Case', 'Reported Deaths', 'Total Recovered'];
    let data_keys = ['num_tests', 'num_cases', 'num_death', 'num_recovered'];
    let ret_columns = [];

    date_keys = Object.keys(country_objects['Bangladesh']['num_tests']).slice(1, );

    for (let i=0; i<data_labels.length; i++) {
        let cur_col = [data_labels[i]];
        for (let j=0; j<date_keys.length; j++) {
            cur_col.push(country_objects[pr_country_name][data_keys[i]][date_keys[j]]);
        }
        ret_columns.push(cur_col);
    }
    return ret_columns;
}


function showAreaChart (pr_country_name = 'Bangladesh', scale='linear') {
    data_columns = getAreaChartData(pr_country_name);
    date_keys = getAreaChartDateKeys(pr_country_name);

    let color_list = ['blue', 'orange', 'red', 'green'];
    let y_tick_values;
    let y_axis_min_value;

    let max_y_val = 0;
    let min_y_val=min_case_count;
    
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
        y_tick_values = getYTickValues(min_y_val, max_y_val);
        y_axis_min_value = y_tick_values[0];
    }
    if (bd_stat_chart != undefined) {
        bd_stat_chart = bd_stat_chart.destroy();
    }
    
    bd_stat_chart = c3.generate({
        bindto: '#total_test_stat',
        data: {
            columns: data_columns,
            colors: color_list,
            type: 'area'
        },
        size: {
            height: 500,
        },
        tooltip: {
            format: {
                name: function (name, ratio, id, index) {
                    return name;
                }
            }
        },
        tooltip: {
            format: {
                title: function (name, index) {
                    return dateConverter(date_keys[name]);
                }
            }
        },
        axis : {
            y : {
                show:true,
                min: y_axis_min_value,
                tick: {
                    values: y_tick_values,
                    format: function (d) {
                        if (scale == 'logarithmic') {
                            return formatNumber(Math.pow(10,d * Math.LN10).toFixed(0));
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
                   format: function (d) { return date_keys[d]; }
                }
            }
        },
    });
}

function getNewVsTotalChartData (pr_country_name, num_days=1) {
    cur_country_data = getCountryData(pr_country_name, min_case_count = 1);
    ret_values = {
        x: [],
        y: [],
        type: 'scatter',
        name: pr_country_name,
        line: {
            color:  country_objects[pr_country_name]['color'],
          },hoverinfo: 'none',
        hovertemplate: '<br><b>Total Cases</b>: %{x}<br>' +
                        '<b>New Cases in the past week</b>: %{y}',
        showlegend: false
    }
    for (let i=num_days+1; i<cur_country_data.length; i++) {
        if (cur_country_data[i] < 50) {
            continue;
        }
        ret_values['x'].push(cur_country_data[i]);
        ret_values['y'].push(cur_country_data[i] - cur_country_data[i-num_days]);
    }

    return ret_values;
}

function showNewVsTotalChart (pr_country_name, countries) {
    var Bangladesh = getNewVsTotalChartData(pr_country_name, 7);
    var data = [Bangladesh];  
    for (let i=0; i<countries.length; i++) {
        data.push(getNewVsTotalChartData(countries[i], 7));
    }
    
    var layout = {
        height: 500,
        title: 'New Cases in the Past Week vs Total Number of Confirmed Cases',
        xaxis: {
            type: 'log',
            autorange: true,
            title:'Total Cases'
        },
        yaxis: {
            type: 'log',
            autorange: true,
            title: 'New Cases in the past Week'
        },
    };
    
    Plotly.newPlot('preset_chart_new_vs_total', data, layout);
}

function showPresetChart(pr_country_name='Bangladesh', chart_type = 'area_chart_all', scale='linear', countries=[]) {
    if (chart_type == 'area_chart_all') {
        showAreaChart(pr_country_name, 'linear');
    } 
    else if (chart_type == 'new_vs_total') {
        showNewVsTotalChart(pr_country_name, countries);
    }  
}