const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');

let tasks = [];

function updateCounter() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    taskCounter.textContent = `${totalTasks} task (${completedTasks} selesai)`;
}

function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">Belum ada task. Silakan tambahkan task baru!</div>';
        updateCounter();
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
            <span class="task-text">${task.text}</span>
            <input type="text" class="edit-input" value="${task.text}">
            <div class="btn-group">
                <button class="edit-btn" onclick="editTask(${index})">Edit</button>
                <button class="save-btn" onclick="saveTask(${index})">Simpan</button>
                <button class="cancel-btn" onclick="cancelEdit(${index})">Batal</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Hapus</button>
            </div>
        `;
        taskList.appendChild(li);
    });

    updateCounter();
}

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Silakan masukkan task!');
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    taskInput.value = '';
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function editTask(index) {
    const taskItem = taskList.children[index];
    const taskText = taskItem.querySelector('.task-text');
    const editInput = taskItem.querySelector('.edit-input');
    const editBtn = taskItem.querySelector('.edit-btn');
    const deleteBtn = taskItem.querySelector('.delete-btn');
    const saveBtn = taskItem.querySelector('.save-btn');
    const cancelBtn = taskItem.querySelector('.cancel-btn');

    taskText.classList.add('editing');
    editInput.classList.add('active');
    editInput.focus();
    editBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
}

function saveTask(index) {
    const taskItem = taskList.children[index];
    const editInput = taskItem.querySelector('.edit-input');
    const newText = editInput.value.trim();

    if (newText === '') {
        alert('Task tidak boleh kosong!');
        return;
    }

    tasks[index].text = newText;
    renderTasks();
}

function cancelEdit(index) {
    renderTasks();
}

function deleteTask(index) {
    if (confirm('Apakah Anda yakin ingin menghapus task ini?')) {
        tasks.splice(index, 1);
        renderTasks();
    }
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

renderTasks();