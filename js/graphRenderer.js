class GraphRenderer {
    renderGraphByCsv(url, dataKey, labelKey, element, graphType) {
        const graphRenderer = this;
        d3.csv(url)
            .then(function (csvData) {
                const labels = csvData.map(function (d) {
                    return d[labelKey]
                });

                const data = csvData.map(function (d) {
                    return d[dataKey]
                });
                graphRenderer.renderGraph(data, element, graphType, labels);
            });

    }

    renderGraph(data, element, graphType, labels = null) {

        let colorPallete = ["#EAC435", "#345995", "#F37021", "#E40066", "#03CEA4"];
        new Chart(element, {
            type: graphType,
            data: {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: colorPallete
                    }
                ]
            },
        });
    }

    render3dPlotByCsv(url, element, xKey, yKey, zKey, graphType) {
        const graphRenderer = this;

        Plotly.d3.csv(url, function (err, rows) {
            graphRenderer.render3dPlot(rows, element, xKey, yKey, zKey, graphType)

        });
    }

    render3dPlot(data, element, xKey, yKey, zKey, graphType) {
        function unpack(rows, key) {
            return rows.map(function (row) {
                return row[key];
            });
        }

        const xData = unpack(data, xKey);
        const yData = unpack(data, yKey);
        const zData = unpack(data, zKey);

        const plotData = [{
            x: xData,
            y: yData,
            z: zData,
            mode: 'markers',
            type: graphType,
            marker: {
                color: 'rgb(23, 190, 207)',
                size: 2
            }
        }, {
            alphahull: 7,
            opacity: 0.1,
            type: 'mesh3d',
            x: xData,
            y: yData,
            z: zData
        }];

        const layout = {
            autosize: true,
            height: element.offsetHeight,
            scene: {
                aspectratio: {
                    x: 1,
                    y: 1,
                    z: 1
                },
                camera: {
                    center: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    eye: {
                        x: 1.25,
                        y: 1.25,
                        z: 1.25
                    },
                    up: {
                        x: 0,
                        y: 0,
                        z: 1
                    }
                },
                xaxis: {
                    type: 'linear',
                    zeroline: false
                },
                yaxis: {
                    type: 'linear',
                    zeroline: false
                },
                zaxis: {
                    type: 'linear',
                    zeroline: false
                }
            },
            title: '3d point clustering',
            width: element.offsetWidth
        };

        Plotly.newPlot(element, plotData, layout);

    }
}