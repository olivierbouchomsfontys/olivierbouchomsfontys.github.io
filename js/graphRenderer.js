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

    renderMixedGraphByCsv(datasets, element, graphTypes){
        const graphRenderer = this;
        let labels;
        const data = [];

        for (let dataset of datasets){
            d3.csv(dataset.url)
                .then((csvData) => {
                    if (labels === undefined){
                        labels = csvData.map(d => d[dataset.labelKey]);
                    }

                    data.push({
                        label: dataset.name,
                        data: csvData.map(d => d[dataset.dataKey]),
                        type: graphTypes[data.length]
                    });

                    // If all data objects have been pushed
                    if (data.length === datasets.length){
                        graphRenderer.renderMixedGraph(element, graphTypes[0], data, labels)
                    }
                });
        }
    }

    renderGraph(data, element, graphType, labels = null) {
        new Chart(element, {
            type: graphType,
            data: {
                labels: labels,
                datasets: [
                    {
                        data: data
                    }
                ]
            }
        });
    }

    renderMixedGraph(element, graphType, datasets, labels) {
        new Chart(element, {
            type: graphType,
            data: {
                datasets: datasets,
                labels: labels
            }
        }).update();
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
