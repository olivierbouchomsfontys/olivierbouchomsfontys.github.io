class GraphRenderer {
    colorPrimary = getComputedStyle(document.documentElement).getPropertyValue('--graph-primary');
    colorSecondary = getComputedStyle(document.documentElement).getPropertyValue('--graph-secondary');
    colorTertiary = getComputedStyle(document.documentElement).getPropertyValue('--graph-tertiary');
    colorQuaternary = getComputedStyle(document.documentElement).getPropertyValue('--graph-quaternary');
    chart;

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
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(element, {
            type: graphType,
            data: {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        borderColor: this.getBorderColor(graphType),
                        backgroundColor: this.getBackgroundColor(data, graphType),
                        fillColor: this.colorPrimary,
                        highlightFill: this.colorSecondary,
                        highlightStroke: this.colorSecondary
                    }
                ]
            },
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
            title: '3d point clustering',
            width: element.offsetWidth
        };

        Plotly.newPlot(element, plotData, layout);

    }

    getBackgroundColor(data, graphType) {
        switch (graphType) {
            case 'line':
                return this.getBackgroundColorLine();
            default:
                return this.getBackgroundColorOther(data);
        }
    }

    getBackgroundColorLine() {
        return 'transparent';
    }

    getBackgroundColorOther(data) {
        if (data.length > 4) {
            return Please.make_color({ hue: 50, saturation: 0.55, colors_returned: data.length + 1 });
        }

        return data.map((row, index) => {
            if (index % 4 === 0) {
                return this.colorQuaternary;
            }

            if (index % 3 === 0) {
                return this.colorTertiary;
            }

            if (index % 2 === 0) {
                return this.colorSecondary;
            }

            return this.colorPrimary;
        });
    }

    getBorderColor(graphType) {
        switch (graphType) {
            case 'line':
                return this.colorPrimary;
            default:
                return 'transparent';
        }
    }
}
