$(function () {
    map();
    function map() {
        var myChart = echarts.init(document.getElementById('map_1'));

        var data = [
            { name: '西安', value: 320 },
            { name: '洛阳', value: 280 },
            { name: '兰州', value: 240 },
            { name: '武威', value: 200 },
            { name: '张掖', value: 190 },
            { name: '酒泉', value: 180 },
            { name: '敦煌', value: 260 },
            { name: '乌鲁木齐', value: 230 },
            { name: '喀什', value: 210 },
            { name: '西宁', value: 170 }
        ];

        var toolTipData = [
            { name: "西安", value: [{ name: "遗址总数", value: 528 }, { name: "关隘", value: 92 }, { name: "城池", value: 134 }] },
            { name: "洛阳", value: [{ name: "遗址总数", value: 416 }, { name: "关隘", value: 56 }, { name: "城池", value: 102 }] },
            { name: "兰州", value: [{ name: "遗址总数", value: 287 }, { name: "关隘", value: 78 }, { name: "烽燧", value: 64 }] },
            { name: "武威", value: [{ name: "遗址总数", value: 231 }, { name: "关隘", value: 62 }, { name: "城池", value: 45 }] },
            { name: "张掖", value: [{ name: "遗址总数", value: 204 }, { name: "关隘", value: 58 }, { name: "烽燧", value: 49 }] },
            { name: "酒泉", value: [{ name: "遗址总数", value: 196 }, { name: "关隘", value: 71 }, { name: "烽燧", value: 53 }] },
            { name: "敦煌", value: [{ name: "遗址总数", value: 342 }, { name: "建筑群", value: 126 }, { name: "城池", value: 58 }] },
            { name: "乌鲁木齐", value: [{ name: "遗址总数", value: 275 }, { name: "城池", value: 69 }, { name: "驿站", value: 42 }] },
            { name: "喀什", value: [{ name: "遗址总数", value: 238 }, { name: "关隘", value: 76 }, { name: "城池", value: 51 }] },
            { name: "西宁", value: [{ name: "遗址总数", value: 174 }, { name: "驿站", value: 38 }, { name: "烽燧", value: 46 }] }
        ];

        var geoCoordMap = {
            '西安': [108.954065, 34.3457],
            '洛阳': [112.454069, 34.623460],
            '兰州': [103.823557, 36.058038],
            '武威': [102.644852, 37.928896],
            '张掖': [100.451802, 38.933378],
            '酒泉': [98.499850, 39.720972],
            '敦煌': [94.681825, 40.138827],
            '乌鲁木齐': [87.617793, 43.825591],
            '喀什': [75.941180, 39.469253],
            '西宁': [101.777818, 36.616260]
        };

        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value)
                });
            }
            return res;
        };

        var lines = [
            { coords: [geoCoordMap['洛阳'], geoCoordMap['西安']] },
            { coords: [geoCoordMap['西安'], geoCoordMap['兰州']] },
            { coords: [geoCoordMap['兰州'], geoCoordMap['西宁']] },
            { coords: [geoCoordMap['兰州'], geoCoordMap['武威']] },
            { coords: [geoCoordMap['武威'], geoCoordMap['张掖']] },
            { coords: [geoCoordMap['张掖'], geoCoordMap['酒泉']] },
            { coords: [geoCoordMap['酒泉'], geoCoordMap['敦煌']] },
            { coords: [geoCoordMap['敦煌'], geoCoordMap['乌鲁木齐']] },
            { coords: [geoCoordMap['乌鲁木齐'], geoCoordMap['喀什']] }
        ];

        option = {
            title: {
                left: "center",
                top: 100,
                textStyle: { color: "#fff" }
            },
            tooltip: {
                trigger: "item",
                formatter: function (p) {
                    var html = "";
                    toolTipData.forEach(i => {
                        if (p.name == i.name) {
                            html = i.name + "<br/>";
                            i.value.forEach(j => {
                                html += j.name + "：" + j.value + "<br/>";
                            });
                        }
                    });
                    return html;
                }
            },
            geo: {
                map: "china",
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: "#ffb347",
                        borderColor: "#ff8c00"
                    }
                }
            },
            series: [
                {
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    data: convertData(data),
                    symbolSize: v => v[2] / 28,
                    label: {
                        normal: {
                            show: true,
                            formatter: "{b}",
                            color: "#000000",
                            fontSize: 12,
                            position: "right"
                        }
                    },
                    itemStyle: { color: "#4682b4" },
                    rippleEffect: { scale: 2 }
                },
                {
                    type: "lines",
                    coordinateSystem: "geo",
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 4,
                        symbolSize: 3,
                        color: "#00ffff"
                    },
                    lineStyle: {
                        color: "#0099ff",
                        width: 1.4,
                        opacity: 0.7
                    },
                    data: lines
                }
            ]
        };

        myChart.setOption(option);
        window.addEventListener("resize", () => myChart.resize());
    }
})