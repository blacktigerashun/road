//
$(function () {
    echart_1();
    echart_2();
    echart_3();
    echart_4();

    // 饼图：遗址保护状态
    function echart_1() {
        var myChart = echarts.init(document.getElementById('chart_1'));
        option = {
            backgroundColor: 'transparent',
            title: {
                text: '遗址保护状态统计',
                top: 35,
                left: 20,
                textStyle: {
                    fontSize: 18,
                    color: '#FFD700',
                    fontFamily: '"STKaiti", "KaiTi", serif'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",
                textStyle: {
                    fontFamily: '"STKaiti", "KaiTi", serif'
                }
            },
            legend: {
                right: 20,
                top: 35,
                data: ['需维护', '完好'],
                textStyle: {
                    color: '#FFE4B5',
                    fontFamily: '"STKaiti", "KaiTi", serif'
                }
            },
            series: [{
                name: '遗址状态',
                type: 'pie',
                radius: ['0', '60%'],
                center: ['50%', '60%'],
                color: ['#4ECDC4', '#45B7D1'],
                label: {
                    normal: {
                        formatter: '{b}\n{d}%',
                        color: '#FFE4B5',
                        fontFamily: '"STKaiti", "KaiTi", serif'
                    },

                },
                data: [{
                    value: 12,
                    name: '需维护'
                },
                {
                    value: 314,
                    name: '完好',
                    selected: true
                }
                ]
            }]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    // 柱状折线图：年度游客流量
    function echart_2() {
        var myChart = echarts.init(document.getElementById('chart_2'));
        var data = {
            id: 'multipleBarsLines',
            title: '近半年游客流量统计',
            legendBar: ['接待游客', '团队游客', '散客'],
            symbol: '',
            legendLine: ['历史同期'],
            xAxis: ['7月', '8月', '9月', '10月', '11月', '12月'],
            yAxis: [
                [12, 18, 15, 22, 14, 16]
            ],
            lines: [
                [10, 15, 13, 18, 12, 14]
            ],
            barColor: ['#4ECDC4', '#45B7D1', '#96CEB4'],
            lineColor: ['#FF6B6B'],

        };

        var myData = (function test() {
            var yAxis = data.yAxis || [];
            var lines = data.lines || [];
            var legendBar = data.legendBar || [];
            var legendLine = data.legendLine || [];
            var symbol = data.symbol || ' ';
            var seriesArr = [];
            var legendArr = [];
            yAxis && yAxis.forEach((item, index) => {
                legendArr.push({
                    name: legendBar && legendBar.length > 0 && legendBar[index]
                });
                seriesArr.push({
                    name: legendBar && legendBar.length > 0 && legendBar[index],
                    type: 'bar',
                    barGap: '0.5px',
                    data: item,
                    barWidth: data.barWidth || 12,
                    label: {
                        normal: {
                            show: true,
                            formatter: '{c}' + symbol,
                            position: 'top',
                            textStyle: {
                                color: '#FFD700',
                                fontStyle: 'normal',
                                fontFamily: '"STKaiti", "KaiTi", serif',
                                textAlign: 'left',
                                fontSize: 11,
                            },
                        },
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 4,
                            color: data.barColor[index]
                        },
                    }
                });
            });

            lines && lines.forEach((item, index) => {
                legendArr.push({
                    name: legendLine && legendLine.length > 0 && legendLine[index]
                })
                seriesArr.push({
                    name: legendLine && legendLine.length > 0 && legendLine[index],
                    type: 'line',
                    data: item,
                    itemStyle: {
                        normal: {
                            color: data.lineColor[index],
                            lineStyle: {
                                width: 3,
                                type: 'solid',
                            }
                        }
                    },
                    label: {
                        normal: {
                            show: false,
                            position: 'top',
                        }
                    },
                    symbol: 'circle',
                    symbolSize: 10
                });
            });

            return {
                seriesArr,
                legendArr
            };
        })();


        option = {
            backgroundColor: 'transparent',
            title: {
                show: true,
                top: '10%',
                left: '3%',
                text: data.title,
                textStyle: {
                    fontSize: 18,
                    color: '#FFD700',
                    fontFamily: '"STKaiti", "KaiTi", serif'
                },
                subtext: data.subTitle,
                link: ''
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var time = '';
                    var str = '';
                    for (var i of params) {
                        time = i.name.replace(/\n/g, '') + '<br/>';
                        if (i.data == 'null' || i.data == null) {
                            str += i.seriesName + '：无数据' + '<br/>'
                        } else {
                            str += i.seriesName + '：' + i.data + '万人<br/>'
                        }

                    }
                    return time + str;
                },
                axisPointer: {
                    type: 'none'
                },
            },
            legend: {
                right: data.legendRight || '30%',
                top: '12%',
                right: '5%',
                itemGap: 16,
                itemWidth: 10,
                itemHeight: 10,
                data: myData.legendArr,
                textStyle: {
                    color: '#FFE4B5',
                    fontStyle: 'normal',
                    fontFamily: '"STKaiti", "KaiTi", serif',
                    fontSize: 12,
                }
            },
            grid: {
                x: 30,
                y: 80,
                x2: 30,
                y2: 60,
            },
            xAxis: {
                type: 'category',
                data: data.xAxis,
                axisTick: {
                    show: false,
                },

                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#FFD700',
                    },
                    symbol: ['none', 'arrow']
                },
                axisLabel: {
                    show: true,
                    interval: '0',
                    textStyle: {
                        lineHeight: 16,
                        padding: [2, 2, 0, 2],
                        height: 50,
                        fontSize: 12,
                        fontFamily: '"STKaiti", "KaiTi", serif'
                    },
                    rich: {
                        Sunny: {
                            height: 50,
                            padding: [0, 5, 0, 5],
                            align: 'center',
                        },
                    },
                    formatter: function (params, index) {
                        var newParamsName = "";
                        var splitNumber = 5;
                        var paramsNameNumber = params && params.length;
                        if (paramsNameNumber && paramsNameNumber <= 4) {
                            splitNumber = 4;
                        } else if (paramsNameNumber >= 5 && paramsNameNumber <= 7) {
                            splitNumber = 4;
                        } else if (paramsNameNumber >= 8 && paramsNameNumber <= 9) {
                            splitNumber = 5;
                        } else if (paramsNameNumber >= 10 && paramsNameNumber <= 14) {
                            splitNumber = 5;
                        } else {
                            params = params && params.slice(0, 15);
                        }

                        var provideNumber = splitNumber;
                        var rowNumber = Math.ceil(paramsNameNumber / provideNumber) || 0;
                        if (paramsNameNumber > provideNumber) {
                            for (var p = 0; p < rowNumber; p++) {
                                var tempStr = "";
                                var start = p * provideNumber;
                                var end = start + provideNumber;
                                if (p == rowNumber - 1) {
                                    tempStr = params.substring(start, paramsNameNumber);
                                } else {
                                    tempStr = params.substring(start, end) + "\n";
                                }
                                newParamsName += tempStr;
                            }

                        } else {
                            newParamsName = params;
                        }
                        params = newParamsName;
                        return '{Sunny|' + params + '}';
                    },
                    color: '#FFD700',
                },

            },
            yAxis: {
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#FFD700',
                    },
                    symbol: ['none', 'arrow']
                },
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 215, 0, 0.2)',
                        type: 'solid'
                    },
                }
            },
            series: myData.seriesArr
        }
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    // 地图：未央宫遗址点位分布
    // 未央宫 专属点位分布图（无广西、无城市地图、永不崩溃）
    // 遗址分布图（仅用 ECharts 内置图形模拟，美观、稳定）
    function echart_3() {
        var myChart = echarts.init(document.getElementById('chart_3'));

        // 模拟坐标范围 0~100，建筑中心点（散点位置）
        var locations = {
            qianDian: [52, 42],    // 前殿
            jiaoFang: [30, 58],    // 椒房殿
            tianLu: [26, 72],    // 天禄阁
            shiQu: [45, 35],    // 石渠阁
            chengQiang: [63, 74]   // 汉城墙(模拟)
        };

        // 散点数据（含保护指数）
        var scatterData = [
            { name: '未央宫前殿', value: [locations.qianDian[0], locations.qianDian[1], 96] },
            { name: '椒房殿', value: [locations.jiaoFang[0], locations.jiaoFang[1], 88] },
            { name: '天禄阁', value: [locations.tianLu[0], locations.tianLu[1], 75] },
            { name: '石渠阁', value: [locations.shiQu[0], locations.shiQu[1], 72] },
            { name: '汉城墙', value: [locations.chengQiang[0], locations.chengQiang[1], 81] }
        ];

        var option = {
            backgroundColor: 'transparent',
            title: {
                text: '西安未央区 · 汉长安城未央宫遗址',
                left: 'center',
                top: 10,
                textStyle: { color: '#FFD700', fontSize: 16, fontWeight: 'normal', fontFamily: '"STKaiti", "KaiTi", serif' }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}<br/>保护指数：{c[2]}分',
                textStyle: {
                    fontFamily: '"STKaiti", "KaiTi", serif'
                }
            },
            // ———————— 手绘建筑轮廓 ————————
            graphic: [
                // 1. 遗址外轮廓（略带凹凸的梯形/多边形）
                {
                    type: 'polygon',
                    shape: {
                        points: [
                            [10, 10], [90, 10], [92, 92], [65, 95], [40, 95], [8, 92], [10, 10]
                        ]
                    },
                    style: {
                        fill: 'rgba(78, 205, 196, 0.12)',
                        stroke: '#4ECDC4',
                        lineWidth: 2.5,
                        shadowBlur: 15,
                        shadowColor: '#4ECDC4',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0
                    },
                    left: 'center',
                    top: 'middle',
                    bounding: 'raw'
                },
                // 2. 前殿区域（矩形，略偏东）
                {
                    type: 'rect',
                    shape: { x: 42, y: 30, width: 20, height: 14 },
                    style: {
                        fill: 'rgba(78, 205, 196, 0.2)',
                        stroke: '#4ECDC4',
                        lineWidth: 1.5,
                        shadowBlur: 8,
                        shadowColor: '#4ECDC4'
                    },
                    left: 'center',
                    top: 'middle',
                    bounding: 'raw'
                },
                // 3. 椒房殿区域
                {
                    type: 'rect',
                    shape: { x: 22, y: 48, width: 16, height: 11 },
                    style: {
                        fill: 'rgba(69, 183, 209, 0.2)',
                        stroke: '#45B7D1',
                        lineWidth: 1.5,
                        shadowBlur: 8,
                        shadowColor: '#45B7D1'
                    },
                    left: 'center',
                    top: 'middle',
                    bounding: 'raw'
                },
                // 4. 石渠阁区域
                {
                    type: 'rect',
                    shape: { x: 37, y: 26, width: 14, height: 10 },
                    style: {
                        fill: 'rgba(150, 206, 180, 0.2)',
                        stroke: '#96CEB4',
                        lineWidth: 1.5,
                        shadowBlur: 8,
                        shadowColor: '#96CEB4'
                    },
                    left: 'center',
                    top: 'middle',
                    bounding: 'raw'
                },
                // 5. 天禄阁区域
                {
                    type: 'rect',
                    shape: { x: 19, y: 64, width: 13, height: 9 },
                    style: {
                        fill: 'rgba(255, 107, 107, 0.2)',
                        stroke: '#FF6B6B',
                        lineWidth: 1.5,
                        shadowBlur: 8,
                        shadowColor: '#FF6B6B'
                    },
                    left: 'center',
                    top: 'middle',
                    bounding: 'raw'
                },
                // 6. 城墙示意（一段）
                {
                    type: 'rect',
                    shape: { x: 55, y: 65, width: 22, height: 10 },
                    style: {
                        fill: 'rgba(147, 112, 219, 0.15)',
                        stroke: '#9370DB',
                        lineWidth: 1.5,
                        shadowBlur: 8,
                        shadowColor: '#9370DB'
                    },
                    left: 'center',
                    top: 'middle',
                    bounding: 'raw'
                },
                // 7. 建筑名称标签
                { type: 'text', left: '53%', top: '52%', style: { text: '前殿', fill: '#FFE4B5', fontSize: 10, fontFamily: '"STKaiti", "KaiTi", serif' }, bounding: 'raw' },
                { type: 'text', left: '33%', top: '62%', style: { text: '椒房殿', fill: '#FFE4B5', fontSize: 10, fontFamily: '"STKaiti", "KaiTi", serif' }, bounding: 'raw' },
                { type: 'text', left: '45%', top: '42%', style: { text: '石渠阁', fill: '#FFE4B5', fontSize: 10, fontFamily: '"STKaiti", "KaiTi", serif' }, bounding: 'raw' },
                { type: 'text', left: '26%', top: '72%', style: { text: '天禄阁', fill: '#FFE4B5', fontSize: 10, fontFamily: '"STKaiti", "KaiTi", serif' }, bounding: 'raw' },
                { type: 'text', left: '60%', top: '74%', style: { text: '城墙段', fill: '#FFE4B5', fontSize: 10, fontFamily: '"STKaiti", "KaiTi", serif' }, bounding: 'raw' }
            ],
            xAxis: { show: false, min: 0, max: 100 },
            yAxis: { show: false, min: 0, max: 100 },
            grid: { left: 0, right: 0, top: '18%', bottom: 0 },
            series: [
                {
                    name: '遗址点位',
                    type: 'scatter',
                    symbol: 'circle',
                    symbolSize: 12,
                    data: scatterData,
                    label: { show: false },
                    itemStyle: { color: '#4ECDC4', borderColor: '#fff', borderWidth: 1.5 }
                },
                {
                    name: '光晕',
                    type: 'effectScatter',
                    symbolSize: 18,
                    data: scatterData,
                    rippleEffect: { brushType: 'stroke', scale: 2.5 },
                    itemStyle: { color: '#4ECDC4' },
                    zlevel: 1
                }
            ]
        };

        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    // 横向柱状图：遗址区域监测
    function echart_4() {
        var myChart = echarts.init(document.getElementById('chart_4'));
        var data = [85, 92, 78, 96, 88];
        var titlename = ['前殿', '椒房殿', '石渠阁', '天禄阁', '城墙'];
        var valdata = [100, 100, 100, 100, 100];
        var myColor = ['#4ECDC4', '#45B7D1', '#96CEB4', '#FF6B6B', '#9370DB'];
        option = {
            backgroundColor: 'transparent',
            title: {
                text: '区域保护指数',
                x: 'center',
                textStyle: {
                    color: '#FFD700',
                    fontFamily: '"STKaiti", "KaiTi", serif'
                },
                left: '6%',
                top: '10%'
            },
            grid: {
                top: '20%',
                left: '32%'
            },
            xAxis: {
                show: false
            },
            yAxis: [{
                show: true,
                data: titlename,
                inverse: true,
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#FFE4B5',
                    fontFamily: '"STKaiti", "KaiTi", serif',
                    formatter: (value, index) => {
                        return `{lg|${index + 1}}  ` + '{title|' + value + '} '
                    },
                    rich: {
                        lg: {
                            backgroundColor: '#FFD700',
                            color: '#8B4513',
                            borderRadius: 15,
                            align: 'center',
                            width: 15,
                            height: 15
                        },
                    }
                },


            }, {
                show: true,
                inverse: true,
                data: valdata,
                axisLabel: {
                    textStyle: {
                        fontSize: 12,
                        color: '#FFE4B5',
                        fontFamily: '"STKaiti", "KaiTi", serif'
                    },
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },

            }],
            series: [{
                name: '指数',
                type: 'bar',
                yAxisIndex: 0,
                data: data,
                barWidth: 10,
                itemStyle: {
                    normal: {
                        barBorderRadius: 20,
                        color: function (params) {
                            var num = myColor.length;
                            return myColor[params.dataIndex % num]
                        },
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        formatter: '{c}分',
                        color: '#8B4513',
                        fontFamily: '"STKaiti", "KaiTi", serif'
                    }
                },
            }, {
                name: '框',
                type: 'bar',
                yAxisIndex: 1,
                barGap: '-100%',
                data: [100, 100, 100, 100, 100],
                barWidth: 15,
                itemStyle: {
                    normal: {
                        color: 'none',
                        borderColor: '#FFD700',
                        borderWidth: 3,
                        barBorderRadius: 15,
                    }
                }
            },]
        };
        myChart.setOption(option);
    }
});
