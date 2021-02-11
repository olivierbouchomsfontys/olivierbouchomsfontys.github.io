class GraphRenderer {
    colorPrimary = getComputedStyle(document.documentElement).getPropertyValue('--graph-primary');
    colorSecondary = getComputedStyle(document.documentElement).getPropertyValue('--graph-secondary');
    colorTertiary = getComputedStyle(document.documentElement).getPropertyValue('--graph-tertiary');
    colorQuaternary = getComputedStyle(document.documentElement).getPropertyValue('--graph-quaternary');
    chart;
    plotElement;

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

    renderMixedGraphByCsv(selectDatasets, element, graphTypes){
        const graphRenderer = this;
        let labels;
        const data = [];

        for (let selectDataset of selectDatasets){
            d3.csv(selectDataset.dataset.url)
                .then((csvData) => {
                    if (labels === undefined){
                        labels = csvData.map(d => d[selectDataset.xAs]);
                    }

                    data.push({
                        label: selectDataset.dataset.name,
                        data: csvData.map(d => d[selectDataset.yAs]),
                        type: graphTypes[data.length]
                    });

                    // If all data objects have been pushed
                    if (data.length === selectDatasets.length){
                        graphRenderer.renderMixedGraph(element, graphTypes[0], data, labels)
                    }
                });
        }
    }

    renderGraph(data, element, graphType, labels = null) {
        this.destroyAll();

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

    renderMixedGraph(element, graphTypes, datasets, labels) {
        this.destroyAll();

        let backgroundColor = null;

        let isAllBar = true;

        graphTypes.forEach(t => {
            if (isAllBar) {
                isAllBar = t === 'bar';
            }
        })

        if (isAllBar) {
            backgroundColor = this.getBackgroundColor(datasets[0].data, 'bar');
        }

        datasets.forEach(ds => {
            ds.borderColor = this.getBorderColor(ds.type);
            ds.backgroundColor = backgroundColor || this.getBackgroundColor(ds.data, ds.type);
            ds.fillColor = this.colorPrimary;
            ds.highlightFill = this.colorSecondary;
            ds.highlightStroke = this.colorSecondary;
        })

        this.chart = new Chart(element, {
            type: 'bar',
            data: {
                datasets: datasets,
                labels: labels
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
        this.destroyAll();
        this.plotElement = element;

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

        this.plot = Plotly.newPlot(element, plotData, layout);

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

    destroyAll () {
        if (this.chart) {
            this.chart.destroy();
        }

        if (this.plotElement) {
            Plotly.purge(this.plotElement);
        }
    }
}
