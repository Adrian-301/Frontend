const state = {
    isNameScreen: true,
    inputName: '',
    names: [],
    error: '',
    showError: false,
    result: ''
};

const namesScreen = document.getElementById('names');
const resultScreen = document.getElementById('result');
const inputEl = document.querySelector('input[type="text"]');
const addBtn = document.querySelector('button');
const listOfNames = document.querySelector('.list_of_names');
const errorLabel = document.querySelector('.error_label');
const checkWinnerBtn = document.querySelector('.action_button');
const resultValue = document.querySelector('.result_value');
const startOverBtn = document.querySelector('.action_button');
const changeWinnerBtn = document.querySelector('.btn2');

function render() {
    if (state.isNameScreen) {
        namesScreen.style.display = 'block';
        resultScreen.style.display = 'none';

        const errorEl = namesScreen.querySelector('.error_label');
        if (state.showError) {
            errorEl.textContent = state.error;
            errorEl.style.display = 'block';
        } else {
            errorEl.style.display = 'none';
        }

        const listEl = namesScreen.querySelector('.list_of_names');
        listEl.innerHTML = '';
        state.names.forEach((name, index) => {
            const div = document.createElement('div');
            div.textContent = name;
            div.classList.add('animate__animated', 'animate__fadeIn');
            div.addEventListener('click', () => removeName(index));
            listEl.appendChild(div);
        });

        const actionWrapper = namesScreen.querySelector('.action_button').parentElement;
        if (state.names.length > 1) {
            actionWrapper.style.display = 'block';
        } else {
            actionWrapper.style.display = 'none';
        }

    } else {
        namesScreen.style.display = 'none';
        resultScreen.style.display = 'block';
        resultScreen.querySelector('.result_value').textContent = state.result;
    }
}

function validate(value) {
    state.error = '';
    if (value === '') {
        state.error = 'Sorry, no empty name';
        return false;
    }
    if (state.names.includes(value)) {
        state.error = 'Sorry, names must be unique';
        return false;
    }
    return true;
}

function addNameToList() {
    const userName = inputEl.value.trim();
    if (validate(userName)) {
        state.names.push(userName);
        inputEl.value = '';
        state.showError = false;
    } else {
        state.showError = true;
    }
    render();
}

function removeName(index) {
    state.names.splice(index, 1);
    render();
}

function getRandomName() {
    return state.names[Math.floor(Math.random() * state.names.length)];
}

function generateResult() {
    let randName = getRandomName();
    if (state.result !== '') {
        let attempts = 0;
        while (randName === state.result && attempts < 100) {
            randName = getRandomName();
            attempts++;
        }
    }
    state.result = randName;
}

function showResult() {
    generateResult();
    state.isNameScreen = false;
    render();
}

function resetApp() {
    state.isNameScreen = true;
    state.names = [];
    state.error = '';
    state.showError = false;
    state.result = '';
    inputEl.value = '';
    render();
}

function getNewResult() {
    generateResult();
    render();
}

function init() {
    document.querySelector('button').addEventListener('click', addNameToList);

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addNameToList();
    });

    namesScreen.querySelector('.action_button').addEventListener('click', showResult);

    resultScreen.querySelector('.action_button:not(.btn2)').addEventListener('click', resetApp);

    resultScreen.querySelector('.btn2').addEventListener('click', getNewResult);

    render();
}

document.addEventListener('DOMContentLoaded', init);