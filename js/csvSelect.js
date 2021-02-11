datasets = [
    // new Dataset("Conform Exercise Norm", "csv/ConformExerciseNorm.csv", 'Conform exercise norm', 'Age', ['Conform exercise norm', 'Age']),
    // new Dataset("Life Expectation", "csv/LifeExpectation.csv", 'Life expectation', 'Age', ['Life expectation', 'Age']),
    // new Dataset("Participates In Sports Association", "csv/ParticipatesInSportsAssociation.csv", 'Participates in sports association', 'Age', ['Participates in sports association', 'Age']),
    // new Dataset("Sports Weekly", "csv/SportsWeekly.csv", 'Sports weekly', 'Age',['Sports weekly', 'Age']),
    // new Dataset("Subscription To Sports", "csv/SubscriptionToSports.csv", 'Subscription to sports', 'Age', ['Subscription to sports', 'Age']),
    // new Dataset("Work", "csv/Work.csv", 'Age', 'Satisfied with work circumstances', [ 'Age', 'Satisfied with work circumstances', 'Satisfied with work']),
    // new ThreeDimensionalDataSet("Work 3D", "csv/Work.csv", 'Age', 'Satisfied with work circumstances', 'Satisfied with work'),
]

const selectFirstElement = document.querySelector("select#dataset-one");
const selectSecondElement = document.querySelector("select#dataset-two");

window.onload = async function () {
    await LoadDataSet();

    selectFirstElement.innerHTML += buildDatasetDropdownOptions();
    selectSecondElement.innerHTML += buildDatasetDropdownOptions(true);
    OnChangeDataSetOne();
}


async function LoadDataSet(){
    
   await AddDataSet("Conform Exercise Norm", "csv/ConformExerciseNorm.csv", false);
   await AddDataSet("Life Expectation", "csv/LifeExpectation.csv", false);
   await AddDataSet("Participates In Sports Association", "csv/ParticipatesInSportsAssociation.csv", false);
   await AddDataSet("Sports Weekly", "csv/SportsWeekly.csv",false);
   await AddDataSet("Subscription To Sports", "csv/SubscriptionToSports.csv",false);
   await AddDataSet("Work", "csv/Work.csv",false);
   await AddDataSet("Work 3D", "csv/Work.csv",true);
}


async function AddDataSet(name, url, supports3D){

    const response = await fetch(url);
    const text = await response.text();

    await processData(name, url, supports3D, text);
}


    
async function processData(name, url,supports3D, data) {
    var dataLines = data.split(/\r\n|\n/);
    var headers = dataLines[0].split(',');
    // var lines = [];

    // let head = [];

    // for (var i=1; i<dataLines.length; i++) {
    //     var data2 = dataLines[i].split(',');
    //     if (data2.length == headers.length) {

    //         var tarr = [];
    //         for (var j=0; j<headers.length; j++) {
    //             tarr.push(headers[j]+":"+data2[j]);
    //         }
    //         lines.push(tarr);
    //     }
    // }


    await datasets.push(new Dataset(name, url, 'a','b', headers))
    // alert(headers);



}





selectFirstElement.addEventListener('change', () => {
    selectSecondElement.innerHTML = buildDatasetDropdownOptions(true, selectFirstElement.value);
});

function buildDatasetDropdownOptions(addEmpty = false, excludeValue = null){
    let html = addEmpty ? "<option value=''>...</option>" : "";
    for (let dataset of datasets){
        if (excludeValue !== null && dataset.url === excludeValue){
            continue;
        }

        html += "<option data-set-type='"+dataset.constructor.name+"' value='" + dataset.url + "'>" + dataset.name + "</option>"
    }

    return html;
}
