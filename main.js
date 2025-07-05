// 사용자 정보 및 색상 정의
const users = [
  { name: 'User1', color: '#4F8EF7' },
  { name: 'User2', color: '#F78E4F' }
];

// 할 일 목록 불러오기 (localStorage)
function loadTodos() {
  const todos = localStorage.getItem('todos2users');
  return todos ? JSON.parse(todos) : [];
}

// 할 일 목록 저장 (localStorage)
function saveTodos(todos) {
  localStorage.setItem('todos2users', JSON.stringify(todos));
}

// 할 일 렌더링
function renderTodos() {
  const todos = loadTodos();
  const list = document.getElementById('todo-list');
  list.innerHTML = '';
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.gap = '16px';

    // 체크박스 2개 (각 사용자별)
    users.forEach((user, uidx) => {
      const label = document.createElement('label');
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.gap = '4px';
      label.style.color = user.color;
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!todo.checked[uidx];
      checkbox.addEventListener('change', () => {
        todo.checked[uidx] = checkbox.checked;
        saveTodos(todos);
        renderTodos();
      });
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(user.name));
      li.appendChild(label);
    });

    // 할 일 텍스트
    const span = document.createElement('span');
    span.textContent = todo.text;
    li.appendChild(span);

    // 삭제 버튼
    const delBtn = document.createElement('button');
    delBtn.textContent = '삭제';
    delBtn.style.marginLeft = 'auto';
    delBtn.onclick = () => {
      todos.splice(idx, 1);
      saveTodos(todos);
      renderTodos();
    };
    li.appendChild(delBtn);

    list.appendChild(li);
  });
}

// 할 일 추가
function addTodo(text) {
  const todos = loadTodos();
  todos.push({ text, checked: [false, false] });
  saveTodos(todos);
  renderTodos();
}

// 폼 이벤트 연결
function setupForm() {
  const form = document.getElementById('todo-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('todo-input');
    const value = input.value.trim();
    if (value) {
      addTodo(value);
      input.value = '';
    }
  };
}

// 초기화
window.onload = function() {
  setupForm();
  renderTodos();
};
