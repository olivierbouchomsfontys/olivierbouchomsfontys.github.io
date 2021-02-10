datasets = [
    new Dataset("Conform Exercise Norm", "csv/ConformExerciseNorm.csv", 'Conform exercise norm', 'Age'),
    new Dataset("Life Expectation", "csv/LifeExpectation.csv", 'Life expectation', 'Age'),
    new Dataset("Participates In Sports Association", "csv/ParticipatesInSportsAssociation.csv", 'Participates in sports association', 'Age'),
    new Dataset("Sports Weekly", "csv/SportsWeekly.csv", 'Sports weekly', 'Age'),
    new Dataset("Subscription To Sports", "csv/SubscriptionToSports.csv", 'Subscription to sports', 'Age'),
]

const selectElement = document.querySelector("#select-dataset select");
selectElement.addEventListener('change', onDatasetChange);

window.onload = function () {
    selectElement.innerHTML = buildDatasetDropdownOptions();
}

function onDatasetChange(event){
    event.preventDefault();

    const selectedValue = selectElement.value;
    const dataset = datasets.find(data => data.url === selectedValue);
    console.log(selectedValue);

    const graphRenderer = new GraphRenderer();
    graphRenderer.renderGraphByCsv(dataset.url, dataset.dataKey, dataset.labelKey, document.getElementById("chart1"), "line");
}

function buildDatasetDropdownOptions(){
    let html = ""
    for (let dataset of datasets){
        html += "<option value='" + dataset.url + "'>" + dataset.name + "</option>"
    }

    return html;
}
