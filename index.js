
// STATIC DOM REFERENCES
const submitButton = document.getElementById("submit");
const form = document.getElementById("main-form");
const formInputElements = form.getElementsByTagName("input");
const savedDataContainer = document.getElementsByTagName("tbody")[0];

// GLOBALS
const localStorageData = localStorage.getItem("svna0");
const localIdCounter = localStorage.getItem("svna0IdCounter");

let dataIdCounter = localIdCounter ? parseInt(localIdCounter) : 0;
let editingId = undefined;
let savedData = localStorageData ? JSON.parse(localStorageData) : {};

if (localStorageData) {
    renderSavedData(savedData);
}

function renderSavedData(savedData) {
    clearChildNodes(savedDataContainer);
    let ids = Object.keys(savedData);

    ids.forEach((id) => {
        const dataRow = document.createElement("tr");
        const data = savedData[id];
        const keys = Object.keys(data);
        const isEditing = String(editingId) === id;

        let dataElements = [];

        const dataId = document.createElement("p");
        dataId.innerText = id;
        dataId.className = "id";
        dataElements.push(dataId);

        keys.forEach((key) => {
            let value;

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
            dataElements.push(value);
        });

        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        if (isEditing) {
            const updateInputs = dataRow.getElementsByTagName("input");

            editButton.innerText = "save";
            editButton.onclick = () => updateData(id, updateInputs);
        } else {
            editButton.innerText = "edit";
            editButton.onclick = () => editData(id);
        }
        dataElements.push(editButton);

        deleteButton.innerText = "delete";
        deleteButton.onclick = () => deleteData(id);
        dataElements.push(deleteButton);

        addTd(dataElements, dataRow);

        savedDataContainer.appendChild(dataRow);
    });

}

function update(data) {
    localStorage.setItem("svna0", JSON.stringify(data));
    localStorage.setItem("svna0IdCounter", JSON.stringify(dataIdCounter));
    renderSavedData(data);
}

function onSubmit() {
    let data = getData(formInputElements, formInputElements.length - 1);

    if (isDataValid(data)) {
        savedData[dataIdCounter] = data;
        dataIdCounter++;

        update(savedData);
    } else {
        alert("invalid data");
    }
}

function editData(id) {
    editingId = id;
    update(savedData);
}

function updateData(id, inputElements) {
    editingId = undefined;

    let updatedData = getData(inputElements, inputElements.length);

    if (isDataValid(updatedData)) {
        savedData[id] = updatedData;
        update(savedData);
    } else {
        alert("invalid data");
    }
}

function deleteData(id) {
    delete savedData[id];
    update(savedData);
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

function addTd(dataElements, row) {
    dataElements.forEach((dataElement) => {
        const td = document.createElement("td");
        td.appendChild(dataElement);
        row.appendChild(td);
    })
}

submitButton.onclick = onSubmit;
