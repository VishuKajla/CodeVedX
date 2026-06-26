// State Management
let state = {
    tasks: [],
    filter: 'all',
    sortBy: 'dateCreated-desc',
    searchQuery: '',
    theme: 'dark'
};

// Sample Seed Tasks for a Beautiful Initial Experience
const SEED_TASKS = [
    {
        id: 'seed-1',
        title: 'Welcome to TaskFlow! 🚀',
        description: 'This is a premium task manager. You can add new tasks, edit details, set priorities, and keep track of your performance.',
        category: 'Work',
        priority: 'high',
        dueDate: new Date().toISOString().split('T')[0], // Today
        completed: false,
        dateCreated: Date.now() - 1000 * 60 * 60 * 2 // 2 hours ago
    },
    {
        id: 'seed-2',
        title: 'Explore Dark & Light Modes 🌙',
        description: 'Click the sun/moon icon in the top right to switch between light and dark glassmorphism themes.',
        category: 'Personal',
        priority: 'medium',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0], // Tomorrow
        completed: false,
        dateCreated: Date.now() - 1000 * 60 * 5 // 5 mins ago
    },
    {
        id: 'seed-3',
        title: 'Complete a task by clicking the circle',
        description: 'Once completed, the statistics card and progress bar will update automatically to reflect your progress.',
        category: 'Health',
        priority: 'low',
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0], // Yesterday (Overdue/Completed)
        completed: true,
        dateCreated: Date.now() - 1000 * 60 * 60 * 24 * 2 // 2 days ago
    }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTasks();
    registerEventListeners();
    render();
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('taskflow-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        state.theme = savedTheme;
    } else {
        state.theme = systemPrefersDark ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', state.theme);
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('taskflow-theme', state.theme);
    showToast(`Switched to ${state.theme} theme`, 'info');
}

// Data Management
function initTasks() {
    const savedTasks = localStorage.getItem('taskflow-tasks');
    if (savedTasks) {
        try {
            state.tasks = JSON.parse(savedTasks);
        } catch (e) {
            console.error('Error parsing tasks, falling back to seed data', e);
            state.tasks = [...SEED_TASKS];
            saveTasks();
        }
    } else {
        // First run: seed with beautiful initial data
        state.tasks = [...SEED_TASKS];
        saveTasks();
    }
}

function saveTasks() {
    localStorage.setItem('taskflow-tasks', JSON.stringify(state.tasks));
}

// Event Listeners Registration
function registerEventListeners() {
    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Search Input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        render();
    });

    // Add Task Form Submit
    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const titleInput = document.getElementById('task-title');
        const descInput = document.getElementById('task-desc');
        const priorityInput = document.getElementById('task-priority');
        const categoryInput = document.getElementById('task-category');
        const dueDateInput = document.getElementById('task-due-date');
        
        const newTask = {
            id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            title: titleInput.value.trim(),
            description: descInput.value.trim(),
            priority: priorityInput.value,
            category: categoryInput.value,
            dueDate: dueDateInput.value || '',
            completed: false,
            dateCreated: Date.now()
        };
        
        state.tasks.unshift(newTask); // Add to the top
        saveTasks();
        
        // Reset Form
        taskForm.reset();
        
        // Set default date empty again
        dueDateInput.value = '';
        
        showToast('Task added successfully', 'success');
        render();
    });

    // Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.filter = e.target.dataset.filter;
            render();
        });
    });

    // Sort Selector
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        render();
    });

    // Modal Control: Close
    document.getElementById('close-modal').addEventListener('click', closeEditModal);
    document.getElementById('cancel-edit').addEventListener('click', closeEditModal);
    
    // Modal Edit Form Submit
    const editForm = document.getElementById('edit-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('edit-task-id').value;
        const title = document.getElementById('edit-task-title').value.trim();
        const desc = document.getElementById('edit-task-desc').value.trim();
        const priority = document.getElementById('edit-task-priority').value;
        const category = document.getElementById('edit-task-category').value;
        const dueDate = document.getElementById('edit-task-due-date').value;
        
        const taskIndex = state.tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            state.tasks[taskIndex] = {
                ...state.tasks[taskIndex],
                title,
                description: desc,
                priority,
                category,
                dueDate
            };
            
            saveTasks();
            closeEditModal();
            showToast('Task updated', 'success');
            render();
        }
    });

    // Close Modal on clicking outside card
    const modalOverlay = document.getElementById('edit-modal');
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeEditModal();
        }
    });
}

// Rendering Logic
function render() {
    const tasksList = document.getElementById('tasks-list');
    const emptyState = document.getElementById('empty-state');
    
    // 1. Filter Tasks
    let filteredTasks = state.tasks.filter(task => {
        // Status Filter
        if (state.filter === 'pending' && task.completed) return false;
        if (state.filter === 'completed' && !task.completed) return false;
        
        // Search Query Filter
        if (state.searchQuery) {
            const inTitle = task.title.toLowerCase().includes(state.searchQuery);
            const inDesc = task.description.toLowerCase().includes(state.searchQuery);
            const inCat = task.category.toLowerCase().includes(state.searchQuery);
            return inTitle || inDesc || inCat;
        }
        
        return true;
    });

    // 2. Sort Tasks
    filteredTasks.sort((a, b) => {
        const [field, order] = state.sortBy.split('-');
        const direction = order === 'desc' ? -1 : 1;
        
        if (field === 'dateCreated') {
            return (a.dateCreated - b.dateCreated) * direction;
        }
        
        if (field === 'dueDate') {
            // Put items with no due date at the end
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            
            return a.dueDate.localeCompare(b.dueDate) * direction;
        }
        
        if (field === 'priority') {
            const priorityWeight = { low: 1, medium: 2, high: 3 };
            return (priorityWeight[a.priority] - priorityWeight[b.priority]) * direction;
        }
        
        return 0;
    });

    // 3. Update Statistics
    updateStats();

    // 4. Render DOM
    tasksList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        emptyState.style.display = 'flex';
    } else {
        emptyState.style.display = 'none';
        
        filteredTasks.forEach(task => {
            const taskCard = createTaskDOM(task);
            tasksList.appendChild(taskCard);
        });
    }
}

// Create individual DOM element for a task
function createTaskDOM(task) {
    const card = document.createElement('div');
    card.className = `task-item ${task.completed ? 'completed' : ''}`;
    card.dataset.id = task.id;

    // Relative Date & Priority formatting
    const dateInfo = getDueDateStatus(task.dueDate, task.completed);
    
    card.innerHTML = `
        <div class="checkbox-wrapper">
            <button class="checkbox-btn ${task.completed ? 'checked' : ''}" aria-label="Mark task as complete">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
        </div>
        
        <div class="task-info">
            <div class="task-header-row">
                <h3 class="task-title">${escapeHTML(task.title)}</h3>
                <div class="task-actions">
                    <button class="action-btn action-btn-edit" aria-label="Edit task">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    </button>
                    <button class="action-btn action-btn-delete" aria-label="Delete task">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
            
            ${task.description ? `<p class="task-desc">${escapeHTML(task.description)}</p>` : ''}
            
            <div class="task-meta">
                <span class="badge badge-${task.category.toLowerCase()}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                    ${task.category}
                </span>
                
                <span class="badge badge-priority-${task.priority}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    ${capitalize(task.priority)}
                </span>
                
                ${task.dueDate ? `
                    <span class="badge badge-date ${dateInfo.class}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ${dateInfo.text}
                    </span>
                ` : ''}
            </div>
        </div>
    `;

    // Hook up Event Listeners inside task item
    // Toggle Completion
    const checkBtn = card.querySelector('.checkbox-btn');
    checkBtn.addEventListener('click', () => {
        toggleTaskCompletion(task.id);
    });

    // Edit Button
    const editBtn = card.querySelector('.action-btn-edit');
    editBtn.addEventListener('click', () => {
        openEditModal(task.id);
    });

    // Delete Button
    const deleteBtn = card.querySelector('.action-btn-delete');
    deleteBtn.addEventListener('click', () => {
        // Trigger visual fade-out
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        card.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            deleteTask(task.id);
        }, 300);
    });

    return card;
}

// Action Handlers
function toggleTaskCompletion(id) {
    const taskIndex = state.tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
        const t = state.tasks[taskIndex];
        t.completed = !t.completed;
        saveTasks();
        
        if (t.completed) {
            showToast('Task completed! Good job 🎉', 'success');
        } else {
            showToast('Task marked as pending', 'info');
        }
        
        render();
    }
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    saveTasks();
    showToast('Task deleted successfully', 'danger');
    render();
}

function openEditModal(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    
    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-title').value = task.title;
    document.getElementById('edit-task-desc').value = task.description || '';
    document.getElementById('edit-task-priority').value = task.priority;
    document.getElementById('edit-task-category').value = task.category;
    document.getElementById('edit-task-due-date').value = task.dueDate || '';
    
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'flex';
}

function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'none';
}

// Helper Utilities
function updateStats() {
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('stats-total').textContent = total;
    document.getElementById('stats-pending').textContent = pending;
    document.getElementById('stats-completed').textContent = completed;
    document.getElementById('stats-percentage').textContent = `${rate}%`;
    document.getElementById('stats-progress').style.width = `${rate}%`;
}

function getDueDateStatus(dueDateStr, isCompleted) {
    if (!dueDateStr) return { text: '', class: '' };
    if (isCompleted) {
        return { text: `Completed (Due ${formatFriendlyDate(dueDateStr)})`, class: '' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        const absDays = Math.abs(diffDays);
        return {
            text: `Overdue by ${absDays} day${absDays > 1 ? 's' : ''}`,
            class: 'overdue'
        };
    } else if (diffDays === 0) {
        return { text: 'Due Today', class: 'due-today' };
    } else if (diffDays === 1) {
        return { text: 'Due Tomorrow', class: 'due-tomorrow' };
    } else {
        return { text: `Due ${formatFriendlyDate(dueDateStr)}`, class: '' };
    }
}

function formatFriendlyDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Toast Notifications System
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast`;
    
    let icon = '';
    if (type === 'success') {
        icon = `<svg class="toast-icon-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;
    } else if (type === 'info') {
        icon = `<svg class="toast-icon-info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
    } else if (type === 'danger') {
        icon = `<svg class="toast-icon-danger" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    }
    
    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}
