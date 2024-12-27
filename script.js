document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const completedCount = document.getElementById('completed-count');
    const totalCount = document.getElementById('total-count');
    const progressPercent = document.getElementById('progress-percent');
    const calendar = document.getElementById('calendar');
  
    let tasks = [];
    const today = new Date().toISOString().slice(0, 10);
    const progressData = JSON.parse(localStorage.getItem('progressData')) || {};
  
    // Initialize Calendar
    function initCalendar() {
      const daysInMonth = new Date().getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        const date = new Date();
        date.setDate(i);
        const dayString = date.toISOString().slice(0, 10);
        day.dataset.date = dayString;
  
        if (dayString < today) {
          day.classList.add('past');
        }
  
        const progress = progressData[dayString] || 0;
        day.dataset.progress = progress;
        calendar.appendChild(day);
      }
    }
  
    // Update Progress
    function updateProgress() {
      const completed = tasks.filter(task => task.completed).length;
      const total = tasks.length;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  
      completedCount.textContent = completed;
      totalCount.textContent = total;
      progressPercent.textContent = percent;
  
      // Save progress for today
      progressData[today] = percent;
      localStorage.setItem('progressData', JSON.stringify(progressData));
  
      // Update calendar color
      const todayElement = document.querySelector(`.calendar-day[data-date="${today}"]`);
      if (todayElement) todayElement.dataset.progress = percent;
    }
  
    // Add Task
    function addTask(taskText) {
      const task = { text: taskText, completed: false };
      tasks.push(task);
      renderTasks();
      updateProgress();
    }
  
    // Render Tasks
    function renderTasks() {
      taskList.innerHTML = '';
      tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) li.classList.add('completed');
        li.addEventListener('click', () => {
          tasks[index].completed = !tasks[index].completed;
          renderTasks();
          updateProgress();
        });
        taskList.appendChild(li);
      });
    }
  
    // Event Listeners
    addTaskButton.addEventListener('click', () => {
      const taskText = taskInput.value.trim();
      if (taskText) {
        addTask(taskText);
        taskInput.value = '';
      }
    });
  
    // Initialize
    initCalendar();
    updateProgress();
  });
  