function getAreaChartDateKeys(pr_country_name) {
    let date_keys = Object.keys(country_objects['Bangladesh']['num_tests']).slice(1, );
    return date_keys;
}

function getAreaChartData (pr_country_name, type='test_statistics') {
    let data_labels;
    let data_keys;
    let ret_columns = [];
    date_keys = Object.keys(country_objects['Bangladesh']['num_tests']).slice(1, );
    if (type == 'test_statistics')  {
        ret_columns = [['Negative'], ['Positive']];    
        for (let j=1; j<date_keys.length; j++) {
            let new_tests = country_objects[pr_country_name]['num_tests'][date_keys[j]] - country_objects[pr_country_name]['num_tests'][date_keys[j-1]];
            let new_cases = country_objects[pr_country_name]['num_cases'][date_keys[j]] - country_objects[pr_country_name]['num_cases'][date_keys[j-1]];
            ret_columns[0].push(new_tests);
            ret_columns[1].push(new_cases);
        }
    }
    else if (type == 'case_statistics') {
        ret_columns = [['Recovered'], ['Death']];
        for (let j=0; j<date_keys.length; j++) {
            let num_recovered = country_objects[pr_country_name]['num_recovered'][date_keys[j]];
            let num_death = country_objects[pr_country_name]['num_death'][date_keys[j]];
            ret_columns[0].push(num_recovered);
            ret_columns[1].push(num_death);

        }
    }
    return ret_columns;
}

function generateC3Chart(chart_div_id, data_columns, date_keys, color_list, data_groups, original_values) {
    return c3.generate({
        bindto: chart_div_id,
        data: {
            columns: data_columns,
            colors: color_list,
            type: 'area',
            groups: [data_groups]
        },
        size: {
            height: 500,
        },
        tooltip: {
            format: {
                title: function (name) {
                    return dateConverter(date_keys[name]);
                },
                name: function (name, ratio, id, index) {
                    return name + ' (' + original_values[index+1][name] +')';
                }
            }
        },
        axis : {
            y : {
                show:true,
                tick: {
                    values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    format: function (d, index) {
                        return d + '%';
                    }
                }
            },
            x : {
                show:true,
                tick: {
                   format: function (d) { return date_keys[d]; }
                }
            }
        }
    });
}


function showAreaChart (pr_country_name = 'Bangladesh', type='test_statistics') {
    let data_columns = getAreaChartData(pr_country_name, type);
    let date_keys = getAreaChartDateKeys(pr_country_name);
    let colors, chart_title, chart_div_id;
    if (type == 'test_statistics') {
        colors = ['blue', 'orange'];
        chart_title = 'Test Statistics';
        chart_div_id = '#total_test_stat';
        date_keys = date_keys.slice(1, );
    }
    else if (type == 'case_statistics') {
        colors = ['green', 'red'];
        chart_title = 'Case Statistics';
        chart_div_id = '#total_case_stat';
    }
    let data_groups = []
    let color_list = Object();
    for (let i=0; i<data_columns.length; i++) {
        color_list[data_columns[i][0]] = colors[i];
        data_groups.push(data_columns[i][0]);
    }
    
    let y_tick_values;
    let y_axis_min_value;

    let max_y_val = 0;
    let min_y_val=2;
    divisor = []
    let original_values = Object();
    for (let i=0; i<data_columns[0].length; i++) {
        divisor.push(0);
    }
    for (let j=1; j<data_columns[0].length; j++) {
        original_values[j] = Object();
        for (let i=0; i<data_columns.length; i++) {
            divisor[j] += parseInt(data_columns[i][j]);
        }
    }

    for (let i=0; i<data_columns.length; i++) {
        let tot = 0;
        for (let j=1; j<data_columns[i].length; j++) {
            original_values[j][data_columns[i][0]] = data_columns[i][j];
            data_columns[i][j] /= divisor[j];
            data_columns[i][j] = (data_columns[i][j] * 100).toFixed(2);
        }
    }
    if (type == 'test_statistics') {
        if (test_stat_chart != undefined) {
            test_stat_chart = test_stat_chart.destroy();
        }
        test_stat_chart = generateC3Chart(chart_div_id, data_columns, date_keys, color_list, data_groups, original_values);    
    }
    else if (type == 'case_statistics') {
        if (case_stat_chart != undefined) {
            case_stat_chart = case_stat_chart.destroy();
        }
        case_stat_chart = generateC3Chart(chart_div_id, data_columns, date_keys, color_list, data_groups, original_values);
    }
    
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