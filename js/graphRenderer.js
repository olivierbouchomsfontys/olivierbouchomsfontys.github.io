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

    renderGraph(data, element, graphType, labels = null) {
        this.destroyAll();


        const mustBeConverted = isNaN(data[0]) || data[0] === "";
        let newData = [];
        let uniqueLabels = [];

        if (mustBeConverted){
            const count = (input, arr) => arr.filter(x => x === input).length;
            const onlyUnique = (value, index, self) =>{
                return self.indexOf(value) === index;
            }

            uniqueLabels = labels.filter(onlyUnique);

            for (let uniqueLabel of uniqueLabels){
                newData.push(count(uniqueLabel, labels))
            }
        }

        if (!mustBeConverted){
            newData = data;
            uniqueLabels = labels;
        }

        this.chart = new Chart(element, {
            type: graphType,
            data: {
                labels: uniqueLabels,
                datasets: [
                    {
                        data: newData,
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

    destroyAll(){
        if (this.chart) {
            this.chart.destroy();
        }

        if (this.plotElement) {
            Plotly.purge(this.plotElement);
        }
    }
}