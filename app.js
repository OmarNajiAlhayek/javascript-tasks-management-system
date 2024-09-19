let tasks = JSON.parse(localStorage.getItem('tasks')) ?? [];

document.getElementById('search').addEventListener('keyup', function() {
  appBuild();
});



appBuild();

function addTask() {
  const taskTitle = prompt("أدخل عنوان المهمة:").trim();
  if (! validateTaskTitle(taskTitle)) {
    return;
  }



  tasks.push({
    id: tasks.length + 1,
    title: taskTitle,
    date: getCurrentDate(),
    isDone: false,
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));

  appBuild();
}

function validateTaskTitle(taskTitle) {

  
  if (!taskTitle) {
    alert('لا يمكنك إدخال مهمة فارغة');
    return false;
  }


  
  // tasks.forEach(task => {
  //   if (task.title === taskTitle) {
  //       alert('لديك هذه المهمة بالفعل');
  //       return false; // it returns from this small anonymous function, not from the outer function.
  //   }
  // })


  if (! uniqueTaskTitle(taskTitle)) {
    alert('لديك هذه المهمة بالفعل.');
    return false;
  }

  return true;
}

function uniqueTaskTitle(taskTitle) {
  for (let task of tasks)
    if (task.title === taskTitle)
      return false;
  return true;
}

function displayTasks(tasks) {
  document.getElementById("tasks").innerHTML = "";
  for (task of tasks) {
    const content = /*html*/`
            <!-- TASK -->
            <div class="task ${task.isDone ? 'task-done' : ''}" id="${task.id}">

            <!-- TASK INFO -->
            <div class="task-info">
                <h2>${task.title}</h2>

                <div>

                    <span>
                      ${task.date}
                    </span>
                    </div>
                </div>
                <!-- END TASK INFO -->

                <!-- TASK ACTION -->
                <div class="task-actions">
                    <button class="circular-btn delete-btn" onclick="deleteTask(${task.id})" title="delete the task">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                      </svg>
                    </button>
                    <button class="circular-btn ${task.isDone ?'toggle-completion-done-btn' : 'toggle-completion-not-done-btn'}" onclick="toggleTaskDone(${task.id})" title="done the task">

                        ${task.isDone ?
                           /*html*/
                           `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                            `
                             :
                           /*html*/
                           `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                            `
                          }
                        
                    </button>
                    <button class="circular-btn edit-btn" onclick="updateTask(${task.id})" title="edit the task">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                          <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                      </svg>
                    </button>
                </div>
                <!-- END TASK ACTION -->

            </div>
            <!-- END TASK -->
        `;

    document.getElementById("tasks").innerHTML += content;
  }
}

const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  return mm + "/" + dd + "/" + yyyy;
};


function deleteTask(id) {
    task = getTaskById(id).title
    if (! confirm(`هل أنت متأكد من أنك تريد حذف مهمة: ${task} `))
        return;
    
    tasks = tasks.filter(t => t.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    appBuild();
}

function updateTask(id) {
  const taskTitle = prompt("أدخل عنوان المهمة:", getTaskById(id).title);
  if (! validateTaskTitle(taskTitle))
      return;

  getTaskById(id).title = taskTitle;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  appBuild();
  
}

function toggleTaskDone(id) {
  let toggleTaskDone = getTaskById(id);
  toggleTaskDone.isDone = !toggleTaskDone.isDone;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  appBuild();
}

function getTaskById(id) {
  return tasks.filter(t => t.id == id)[0];
}

function appBuild() {
    const searchValue = document.getElementById('search').value;
    let filteredTasks;
    if (searchValue && tasks) {
      filteredTasks = tasks.filter(t => t.title === searchValue);
      document.getElementById('clear-icon').style.display = 'inline';
    } else {
      filteredTasks = JSON.parse(localStorage.getItem('tasks')) ?? [];
      document.getElementById('clear-icon').style.display = 'none';
    }
    displayTasks(filteredTasks);
}

function clearSearch() {
  document.getElementById('search').value = '';
  appBuild();
}

//https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
function clearAllTasks() {
  if (!confirm('هل أنت متأكد من أنك تريد حذف جميع المهام؟'))
    return;

  localStorage.removeItem('tasks');
  tasks.length = 0;
  appBuild();
}
