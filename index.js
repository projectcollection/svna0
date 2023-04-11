
// STATIC DOM REFERENCES
const submitButton = document.getElementById("submit");
const form = document.getElementById("main-form");
const formInputElements = form.getElementsByTagName("input");
const savedDataContainer = document.getElementsByTagName("tbody")[0];

// GLOBALS
let dataIdCounter = 0;
let editingId = undefined;
let savedData = {};

function renderSavedData(savedData) {
    clearChildNodes(savedDataContainer);
    let ids = Object.keys(savedData);

    ids.forEach((id) => {
        const dataRow = document.createElement("tr");
        const data = savedData[id];
        const keys = Object.keys(data);
        const isEditing = String(editingId) === id;

        const dataId = document.createElement("p");
        const dataTd = document.createElement("td");

        dataId.innerText = id;
        dataId.className = "id";

        dataTd.appendChild(dataId);
        dataRow.appendChild(dataTd);

        keys.forEach((key) => {
            let value;

            const td = document.createElement("td");

            if (isEditing) {
                value = document.createElement("input");
                value.name = key;

                if (key === "first" || key === "last") {
                    value.type = "text";
                } else {
                    value.type = "date";
                }

                value.value = data[key];
            } else {
                value = document.createElement("p");
            }


            value.innerText = data[key];

            td.appendChild(value);
            dataRow.appendChild(td);
        });

        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");


        const editTd = document.createElement("td");
        const deleteTd = document.createElement("td");

        if (isEditing) {
            const updateInputs = dataRow.getElementsByTagName("input");

            editButton.innerText = "save";
            editButton.onclick = () => updateData(id, updateInputs);
        } else {
            editButton.innerText = "edit";
            editButton.onclick = () => editData(id);
        }

        editTd.appendChild(editButton);
        dataRow.appendChild(editTd);

        deleteButton.innerText = "delete";
        deleteButton.onclick = () => deleteData(id);
        deleteTd.appendChild(deleteButton)
        dataRow.appendChild(deleteTd);

        savedDataContainer.appendChild(dataRow);
    });

}

function onSubmit() {
    let data = getData(formInputElements, formInputElements.length - 1);

    if (isDataValid(data)) {
        savedData[dataIdCounter] = data;
        dataIdCounter++;

        renderSavedData(savedData);
    } else {
        alert("invalid data");
    }
}

function editData(id) {
    editingId = id;
    renderSavedData(savedData);
}

function updateData(id, inputElements) {
    editingId = undefined;

    let updatedData = getData(inputElements, inputElements.length);

    if (isDataValid(updatedData)) {
        savedData[id] = updatedData;
        renderSavedData(savedData);
    } else {
        alert("invalid data");
    }

}

function deleteData(id) {
    delete savedData[id];
    renderSavedData(savedData);
}

// helpers
function clearChildNodes(parent) {
    while (parent.children.length > 1) {
        parent.removeChild(parent.lastChild);
    }
}

function getData(inputElements, len) {
    let data = {};
    for (let i = 0; i < len; i++) {
        let label = inputElements[i].name;
        let value = inputElements[i].value;

        data[label] = value;
    }

    return data;
}

function isDataValid(data) {
    const keys = Object.keys(data);

    return !keys.some((key) => {
        if (data[key].length === 0 || data.dob >= data.doj) {
            return true;
        }
    })
}

submitButton.onclick = onSubmit;
