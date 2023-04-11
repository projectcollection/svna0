
// STATIC DOM REFERENCES
const submitButton = document.getElementById("submit");
const form = document.getElementById("main-form");
const inputs = form.getElementsByTagName("input");
const savedDataContainer = document.getElementById("saved");

// GLOBALS
let dataIdCounter = 0;
let editingId = undefined;
let savedData = {};

function onSubmit() {
    let data = {};
    for(let i = 0; i < inputs.length - 1; i++) {
        let label = inputs[i].name;
        let value = inputs[i].value;

        data[label] = value;
    }
    savedData[dataIdCounter] = data;
    dataIdCounter++;

    renderSavedData(savedData);
}

function renderSavedData(savedData) {
    clearChildNodes(savedDataContainer);

    let dataContainer = document.createElement("div");
    let ids = Object.keys(savedData);

    ids.forEach((id) => {
        const data = savedData[id];
        const keys = Object.keys(data);
        const isEditing = String(editingId) === id;

        const dataId = document.createElement("p");

        dataId.innerText = id;
        dataId.className = "id";
        dataContainer.appendChild(dataId);

        keys.forEach((key) => {
            const label = document.createElement("p");

            let value;

            if (isEditing) {
                value = document.createElement("input");
                value.name = key;

                if (key === "first" || key === "last"){
                    value.type = "text";
                } else {
                    value.type = "date";
                }

                value.value = data[key];
            } else {
                value = document.createElement("p");
            }

            label.innerText = key;
            label.className = "label";
            dataContainer.appendChild(label);

            value.innerText = data[key];
            label.className = "value";
            dataContainer.appendChild(value);
        });

        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        if (isEditing) {
            const updateInputs = dataContainer.getElementsByTagName("input");

            editButton.innerText = "save";
            editButton.onclick = () => updateData(id, updateInputs);
            dataContainer.appendChild(editButton);
        } else {
            editButton.innerText = "edit";
            editButton.onclick = () => editData(id);
            dataContainer.appendChild(editButton);
        }

        deleteButton.innerText = "delete";
        deleteButton.onclick = () => deleteData(id);
        dataContainer.appendChild(deleteButton);
    });

    savedDataContainer.appendChild(dataContainer);
}

function editData(id) {
    editingId = id;
    renderSavedData(savedData);
}

function updateData(id, inputs) {
    editingId = undefined;

    let updatedData = {};
    for(let i = 0; i < inputs.length; i++) {
        let label = inputs[i].name;
        let value = inputs[i].value;

        updatedData[label] = value;
    }

    savedData[id] = updatedData;
    renderSavedData(savedData);
}

function deleteData(id) {
    delete savedData[id];
    renderSavedData(savedData);
}

function clearChildNodes(parent) {
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}

submitButton.onclick = onSubmit;
