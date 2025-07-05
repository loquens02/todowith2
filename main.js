// 사용자 정보 및 색상 정의
const users = [
  { name: 'User1', color: '#4F8EF7' },
  { name: 'User2', color: '#F78E4F' }
];

// 데이터베이스 파일 경로
const DB_FILE = 'todos.json';

// 상태 표시 업데이트
function updateStatus(message) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
}

// 할 일 목록 불러오기 (JSON 파일)
async function loadTodos() {
  try {
    const response = await fetch(DB_FILE);
    if (response.ok) {
      const data = await response.json();
      return data.todos || [];
    }
  } catch (error) {
    console.log('데이터베이스 파일이 없습니다. 새로 생성합니다.');
  }
  return [];
}

// 할 일 목록 저장 (JSON 파일)
async function saveTodos(todos) {
  const data = {
    lastUpdated: new Date().toISOString(),
    todos: todos
  };
  
  // 브라우저에서는 파일을 직접 저장할 수 없으므로
  // localStorage에 임시 저장하고 다운로드 링크 제공
  localStorage.setItem('todos2users_backup', JSON.stringify(data));
  
  // JSON 파일 다운로드 링크 생성
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = DB_FILE;
  a.textContent = '데이터베이스 파일 다운로드';
  a.style.display = 'block';
  a.style.marginTop = '10px';
  a.style.padding = '8px';
  a.style.backgroundColor = '#4F8EF7';
  a.style.color = 'white';
  a.style.textDecoration = 'none';
  a.style.borderRadius = '4px';
  a.style.textAlign = 'center';
  
  const downloadSection = document.getElementById('download-section');
  downloadSection.innerHTML = '';
  downloadSection.appendChild(a);
  
  updateStatus(`저장됨 (${todos.length}개 항목) - 파일을 다운로드하고 GitHub에 업로드하세요`);
}

// 할 일 렌더링
function renderTodos(todos) {
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
      checkbox.addEventListener('change', async () => {
        todo.checked[uidx] = checkbox.checked;
        await saveTodos(todos);
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
    delBtn.onclick = async () => {
      todos.splice(idx, 1);
      await saveTodos(todos);
    };
    li.appendChild(delBtn);

    list.appendChild(li);
  });
}

// 할 일 추가
async function addTodo(text) {
  const todos = await loadTodos();
  todos.push({ 
    text, 
    checked: [false, false],
    createdAt: new Date().toISOString()
  });
  await saveTodos(todos);
  renderTodos(todos);
}

// 폼 이벤트 연결
function setupForm() {
  const form = document.getElementById('todo-form');
  form.onsubmit = async (e) => {
    e.preventDefault();
    const input = document.getElementById('todo-input');
    const value = input.value.trim();
    if (value) {
      await addTodo(value);
      input.value = '';
    }
  };
}

// 새로고침 버튼 설정
function setupRefreshButton() {
  const refreshBtn = document.getElementById('refresh-btn');
  refreshBtn.onclick = async () => {
    updateStatus('데이터 새로고침 중...');
    const todos = await loadTodos();
    renderTodos(todos);
    updateStatus(`로드됨 (${todos.length}개 항목)`);
  };
}

// 초기화
window.onload = async function() {
  updateStatus('데이터 로드 중...');
  setupForm();
  setupRefreshButton();
  
  const todos = await loadTodos();
  renderTodos(todos);
  updateStatus(`로드됨 (${todos.length}개 항목)`);
};
