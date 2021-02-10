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
}