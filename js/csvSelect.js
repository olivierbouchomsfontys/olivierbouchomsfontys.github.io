datasets = [];

const selectFirstElement = document.querySelector("select#dataset-one");
const selectSecondElement = document.querySelector("select#dataset-two");

window.onload = async function () {
    await LoadDataSet();

    selectFirstElement.innerHTML += buildDatasetDropdownOptions();
    selectSecondElement.innerHTML += buildDatasetDropdownOptions(true);
    OnChangeDataSetOne();
}


async function LoadDataSet() {

    await AddDataSet("Conform Exercise Norm", "csv/ConformExerciseNorm.csv", false);
    await AddDataSet("Life Expectation", "csv/LifeExpectation.csv", false);
    await AddDataSet("Participates In Sports Association", "csv/ParticipatesInSportsAssociation.csv", false);
    await AddDataSet("Sports Weekly", "csv/SportsWeekly.csv", false);
    await AddDataSet("Subscription To Sports", "csv/SubscriptionToSports.csv", false);
    await AddDataSet("Work", "csv/Work.csv", false);
    await AddDataSet("Work 3D", "csv/Work.csv", true);
}


async function AddDataSet(name, url, supports3D) {

    const response = await fetch(url);
    const text = await response.text();

    await processData(name, url, supports3D, text);
}



async function processData(name, url, supports3D, data) {
    var dataLines = data.split(/\r\n|\n/);
    const headers = dataLines[0].split(',');
    if (supports3D) {
        await datasets.push(new ThreeDimensionalDataSet(name, url, 'a', 'b', 'c', headers))
    }
    else {
        await datasets.push(new Dataset(name, url, 'a', 'b', headers))
    }
}


selectFirstElement.addEventListener('change', () => {
    selectSecondElement.innerHTML = buildDatasetDropdownOptions(true, selectFirstElement.value);
});

function buildDatasetDropdownOptions(addEmpty = false, excludeValue = null) {
    let html = addEmpty ? "<option value=''>...</option>" : "";
    for (let dataset of datasets) {
        if (excludeValue !== null && dataset.url === excludeValue) {
            continue;
        }

        html += "<option data-set-name='"+dataset.name+"' data-set-type='"+dataset.constructor.name+"' value='" + dataset.url + "'>" + dataset.name + "</option>"
    }

    return html;
}
