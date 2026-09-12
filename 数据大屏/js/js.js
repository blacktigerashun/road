﻿﻿﻿$(window).load(function () {
    $(".loading").fadeOut()
})

/****/
$(document).ready(function () {
    var whei = $(window).width()
    $("html").css({ fontSize: whei / 20 })
    $(window).resize(function () {
        var whei = $(window).width()
        $("html").css({ fontSize: whei / 20 })
    });
});


$(window).load(function () {
    $(".loading").fadeOut()
})

$(function () {

    echarts_3()
    echarts_4()
    bt01()
    bt02()
    bt03()
    bt04()

    // ======================
    // 右下角：历年遗址发掘数量统计（三个按钮完整可用）
    // ======================
    function echarts_4() {
        var myChart = echarts.init(document.getElementById('echart4'));

        // ============== 1. 全部数据
        var optionAll = {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { data: ['发掘数量', '修复数量'], top: '5%', textStyle: { color: "#fff", fontSize: '12' } },
            grid: { left: '0%', top: '40px', right: '0%', bottom: '0', containLabel: true },
            xAxis: [{
                type: 'category', data: ['2000', '2005', '2010', '2015', '2020', '2024'],
                axisLine: { show: true, lineStyle: { color: "rgba(255,255,255,.1)", width: 1 } },
                axisTick: { show: false }, axisLabel: { interval: 0, show: true, textStyle: { color: "rgba(255,255,255,.6)", fontSize: '12' } }
            }],
            yAxis: [{
                type: 'value', axisLabel: { show: true, textStyle: { color: "rgba(255,255,255,.6)", fontSize: '12' } },
                axisTick: { show: false }, axisLine: { show: true, lineStyle: { color: "rgba(255,255,255,.1)", width: 1 } },
                splitLine: { lineStyle: { color: "rgba(255,255,255,.1)" } }
            }],
            series: [
                { name: '发掘数量', type: 'line', smooth: true, data: [45, 88, 132, 188, 244, 302], itemStyle: { normal: { color: '#3b82f6' } } },
                { name: '修复数量', type: 'line', smooth: true, data: [12, 34, 67, 95, 132, 167], itemStyle: { normal: { color: '#8b5cf6' } } }
            ]
        };

        // ============== 2. 近三十年数据
        var option30 = {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { data: ['发掘数量', '修复数量'], top: '5%', textStyle: { color: "#fff", fontSize: '12' } },
            grid: { left: '0%', top: '40px', right: '0%', bottom: '0', containLabel: true },
            xAxis: [{
                type: 'category', data: ['1995', '2000', '2005', '2010', '2015', '2020', '2024'],
                axisLine: { show: true, lineStyle: { color: "rgba(255,255,255,.1)", width: 1 } },
                axisTick: { show: false }, axisLabel: { interval: 0, show: true, textStyle: { color: "rgba(255,255,255,.6)", fontSize: '12' } }
            }],
            yAxis: [{
                type: 'value', axisLabel: { show: true, textStyle: { color: "rgba(255,255,255,.6)", fontSize: '12' } },
                axisTick: { show: false }, axisLine: { show: true, lineStyle: { color: "rgba(255,255,255,.1)", width: 1 } },
                splitLine: { lineStyle: { color: "rgba(255,255,255,.1)" } }
            }],
            series: [
                { name: '发掘数量', type: 'line', smooth: true, data: [25, 45, 88, 132, 188, 244, 302], itemStyle: { normal: { color: '#3b82f6' } } },
                { name: '修复数量', type: 'line', smooth: true, data: [5, 12, 34, 67, 95, 132, 167], itemStyle: { normal: { color: '#8b5cf6' } } }
            ]
        };

        // ============== 3. 近十年数据
        var option10 = {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { data: ['发掘数量', '修复数量'], top: '5%', textStyle: { color: "#fff", fontSize: '12' } },
            grid: { left: '0%', top: '40px', right: '0%', bottom: '0', containLabel: true },
            xAxis: [{
                type: 'category', data: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
                axisLine: { show: true, lineStyle: { color: "rgba(255,255,255,.1)", width: 1 } },
                axisTick: { show: false }, axisLabel: { interval: 0, show: true, textStyle: { color: "rgba(255,255,255,.6)", fontSize: '12' } }
            }],
            yAxis: [{
                type: 'value', axisLabel: { show: true, textStyle: { color: "rgba(255,255,255,.6)", fontSize: '12' } },
                axisTick: { show: false }, axisLine: { show: true, lineStyle: { color: "rgba(255,255,255,.1)", width: 1 } },
                splitLine: { lineStyle: { color: "rgba(255,255,255,.1)" } }
            }],
            series: [
                { name: '发掘数量', type: 'line', smooth: true, data: [188, 195, 208, 215, 222, 230, 244, 268, 285, 302], itemStyle: { normal: { color: '#3b82f6' } } },
                { name: '修复数量', type: 'line', smooth: true, data: [95, 102, 110, 118, 125, 132, 140, 148, 155, 167], itemStyle: { normal: { color: '#8b5cf6' } } }
            ]
        };

        // 默认显示全部
        myChart.setOption(optionAll);

        // 按钮切换
        $(".sebtn a").click(function () {
            $(this).addClass("active").siblings().removeClass("active");
            var idx = $(this).index();
            if (idx == 0) { myChart.setOption(optionAll); }      // 全部
            if (idx == 1) { myChart.setOption(option30); }       // 近三十年
            if (idx == 2) { myChart.setOption(option10); }       // 近十年
        })

        window.addEventListener("resize", function () { myChart.resize(); });
    }

    // 右侧省份建筑数量排行
    function echarts_3() {
        var myChart = echarts.init(document.getElementById('echart3'));
        var spNum = 5, _max = 100;
        var legendData = ['现存建筑', '损毁建筑'];
        var y_data = ['甘肃', '新疆', '陕西', '青海', '宁夏'];

        var data1 = [214, 187, 96, 53, 41];
        var data2 = [62, 58, 24, 16, 9];

        option = {
            grid: { containLabel: true, top: 10, left: 0, right: 15, bottom: -10 },
            tooltip: { show: true, formatter: '{b}<br/>{a}:{c}' },
            xAxis: { axisLabel: { show: false }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } },
            yAxis: [{
                data: y_data, axisLabel: { fontSize: 14, color: 'rgba(255,255,255,.6)' },
                axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false }
            }, { show: false, data: y_data }],
            series: [
                { type: 'bar', name: '现存建筑', stack: '2', barWidth: '50%', itemStyle: { normal: { color: '#06b6d4' } }, data: data1 },
                { type: 'bar', name: '损毁建筑', stack: '2', barWidth: '50%', itemStyle: { normal: { color: '#ec4899' } }, data: data2 }
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () { myChart.resize(); });
    }

    // bt01 = 完整完好
    function bt01() {
        var myChart = echarts.init(document.getElementById('bt01'));
        var data1 = 1760; var data2 = 2064; var data3 = data1 / (data1 + data2) * 100;
        option = {
            title: [
                { text: data3.toFixed(1) + '%', x: 'center', y: '54%', textStyle: { fontSize: 18, fontWeight: 'bold', color: '#fff' } },
                { text: '完整完好', x: 'center', y: '68%', textStyle: { fontSize: 10, color: 'rgba(255,255,255,.6)' } },
                { text: '完整完好', x: 'center', y: '20', textStyle: { fontSize: 14, fontWeight: 'bold', color: '#fff' } }
            ],
            tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
            color: ['#4ade80', '#1f2937'],
            series: [{
                name: '状态', type: 'pie', center: ['50%', '65%'], radius: ['45%', '60%'], startAngle: 360,
                label: { show: false }, labelLine: { show: false },
                data: [{ value: data1, name: '完整完好' }, { value: data2, name: '其他' }]
            }]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () { myChart.resize(); });
    }

    // bt02 = 轻微破损
    function bt02() {
        var myChart = echarts.init(document.getElementById('bt02'));
        var data1 = 980; var data2 = 2844; var data3 = data1 / (data1 + data2) * 100;
        option = {
            title: [
                { text: data3.toFixed(1) + '%', x: 'center', y: '54%', textStyle: { fontSize: 18, fontWeight: 'bold', color: '#fff' } },
                { text: '轻微破损', x: 'center', y: '68%', textStyle: { fontSize: 10, color: 'rgba(255,255,255,.6)' } },
                { text: '轻微破损', x: 'center', y: '20', textStyle: { fontSize: 14, fontWeight: 'bold', color: '#fff' } }
            ],
            tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
            color: ['#0ea5e9', '#1f2937'],
            series: [{
                name: '状态', type: 'pie', center: ['50%', '65%'], radius: ['45%', '60%'], startAngle: 360,
                label: { show: false }, labelLine: { show: false },
                data: [{ value: data1, name: '轻微破损' }, { value: data2, name: '其他' }]
            }]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () { myChart.resize(); });
    }

    // bt03 = 严重破损
    function bt03() {
        var myChart = echarts.init(document.getElementById('bt03'));
        var data1 = 642; var data2 = 3182; var data3 = data1 / (data1 + data2) * 100;
        option = {
            title: [
                { text: data3.toFixed(1) + '%', x: 'center', y: '54%', textStyle: { fontSize: 18, fontWeight: 'bold', color: '#fff' } },
                { text: '严重破损', x: 'center', y: '68%', textStyle: { fontSize: 10, color: 'rgba(255,255,255,.6)' } },
                { text: '严重破损', x: 'center', y: '20', textStyle: { fontSize: 14, fontWeight: 'bold', color: '#fff' } }
            ],
            tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
            color: ['#a855f7', '#1f2937'],
            series: [{
                name: '状态', type: 'pie', center: ['50%', '65%'], radius: ['45%', '60%'], startAngle: 360,
                label: { show: false }, labelLine: { show: false },
                data: [{ value: data1, name: '严重破损' }, { value: data2, name: '其他' }]
            }]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () { myChart.resize(); });
    }

    // bt04 = 濒危待修
    function bt04() {
        var myChart = echarts.init(document.getElementById('bt04'));
        var data1 = 442; var data2 = 3382; var data3 = data1 / (data1 + data2) * 100;
        option = {
            title: [
                { text: data3.toFixed(1) + '%', x: 'center', y: '54%', textStyle: { fontSize: 18, fontWeight: 'bold', color: '#fff' } },
                { text: '濒危待修', x: 'center', y: '68%', textStyle: { fontSize: 10, color: 'rgba(255,255,255,.6)' } },
                { text: '濒危待修', x: 'center', y: '20', textStyle: { fontSize: 14, fontWeight: 'bold', color: '#fff' } }
            ],
            tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
            color: ['#ef4444', '#1f2937'],
            series: [{
                name: '状态', type: 'pie', center: ['50%', '65%'], radius: ['45%', '60%'], startAngle: 360,
                label: { show: false }, labelLine: { show: false },
                data: [{ value: data1, name: '濒危待修' }, { value: data2, name: '其他' }]
            }]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () { myChart.resize(); });
    }
});