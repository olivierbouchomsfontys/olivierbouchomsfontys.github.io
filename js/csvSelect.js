datasets = [
    new Dataset("Conform Exercise Norm", "csv/ConformExerciseNorm.csv", 'Conform exercise norm', 'Age'),
    new Dataset("Life Expectation", "csv/LifeExpectation.csv", 'Life expectation', 'Age'),
    new Dataset("Participates In Sports Association", "csv/ParticipatesInSportsAssociation.csv", 'Participates in sports association', 'Age'),
    new Dataset("Sports Weekly", "csv/SportsWeekly.csv", 'Sports weekly', 'Age'),
    new Dataset("Subscription To Sports", "csv/SubscriptionToSports.csv", 'Subscription to sports', 'Age'),
]

const selectFirstElement = document.querySelector("select#dataset-one");
const selectSecondElement = document.querySelector("select#dataset-two");

window.onload = function () {
    selectFirstElement.innerHTML = buildDatasetDropdownOptions();
    selectSecondElement.innerHTML = buildDatasetDropdownOptions();
}

function buildDatasetDropdownOptions(){
    let html = ""
    for (let dataset of datasets){
        html += "<option value='" + dataset.url + "'>" + dataset.name + "</option>"
    }

    return html;
}
