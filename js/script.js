// FUNCTIONS
const clearInputs = () => {
    document.getElementById('nome').value = "";
    document.getElementById('sobrenome').value = "";
    document.getElementById('idade').value = "";
    document.getElementById('email').value = "";
}
const validateInputs = () => {
    const inputNome = document.getElementById('nome').value;
    const inputSobrenome = document.getElementById('sobrenome').value;
    const inputIdade = document.getElementById('idade').value;
    const inputEmail = document.getElementById('email').value;

    const error = document.querySelector('.error');

    if(!inputNome || !inputSobrenome || !inputIdade || !inputEmail){
        error.classList.add('active');
        document.getElementById('errorText').textContent = "Preencha os campos vazios!";
        return false;
    }

    if(inputIdade < 10){
        error.classList.add('active');
        document.getElementById('errorText').textContent = "Idade mínima - 10 anos!";
        return false;
    }

    if(!inputEmail.includes('@')){
        error.classList.add('active');
        document.getElementById('errorText').textContent = "E-mail inválido!";
        return false;
    }

    return true;
}

const openModal = () => document.querySelector('.modal').classList.add('active');
const closeModal = () => {
    const inputNome = document.getElementById('nome');
    inputNome.dataset.index = "new";
    document.querySelector('.modal-header h3').textContent = "Cadastrar";
    document.querySelector('.modal-footer button').textContent = "Cadastrar";
    document.querySelector('.modal-footer button').classList.remove('warning');
    clearInputs()
    document.querySelector('.modal').classList.remove('active');
}
const closeError = () => document.querySelector('.error').classList.remove('active')

const createUser = () => {
    if(validateInputs()){
        const inputNome = document.getElementById('nome');
        const user = {
            nome: document.getElementById('nome').value,
            sobrenome: document.getElementById('sobrenome').value,
            idade: document.getElementById('idade').value,
            email: document.getElementById('email').value
        }
        if(inputNome.dataset.index == "new"){
            createUserLS(user);
            closeModal();
            readTable();
        }else{
            updateUserLS(inputNome.dataset.index, user);
            closeModal();
            readTable();
        }
    }
}

const readTable = () => {
    document.querySelector('.table tbody').innerHTML = "";

    const getUsers = getLocalStorage();

    if(getUsers.length > 0){
        getUsers.forEach((user, index) => {
            const newTr = document.createElement('tr');
    
            newTr.innerHTML = `<td>${user.nome}</td>
                                <td>${user.sobrenome}</td>
                                <td>${user.idade}</td>
                                <td>${user.email}</td>
                                <td class="actions">
                                    <button class="btn warning" id="editBtn-${index}">
                                        <i class="fa-regular fa-pen-to-square"></i>
                                    </button>
                                    <button class="btn danger" id="deleteBtn-${index}">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>`
            
            document.querySelector('.table tbody').appendChild(newTr);
        })
    }else{
        const newTr = document.createElement('tr');
        newTr.innerHTML = `<td colspan="5" id="noUsers">Sem usuários cadastrados</td>`;
        document.querySelector('.table tbody').appendChild(newTr);
    }
}
const searchUser = () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    const getUsers = document.querySelectorAll('.table tbody tr')

    if(searchInput == ""){
        getUsers.forEach((user) => {
            user.style.display = "";
        })
    }else{
        getUsers.forEach((user) => {
            const textUsers = user.innerText.toLowerCase()
            
            if(textUsers.includes(searchInput)){
                user.style.display = ""
            }else{
                user.style.display = "none";
            }
        })
    }
}

const editUser = (index) => {
    const getUsers = getLocalStorage()[index];
    document.getElementById('nome').value = getUsers.nome;
    document.getElementById('sobrenome').value = getUsers.sobrenome;
    document.getElementById('idade').value = getUsers.idade;
    document.getElementById('email').value = getUsers.email;
    document.getElementById('nome').dataset.index = index;
    
    openModal();

    document.querySelector('.modal-header h3').textContent = "Editar";
    document.querySelector('.modal-footer button').textContent = "Editar";
    document.querySelector('.modal-footer button').classList.add('warning');
}

// LOCAL STORAGE
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_users')) || []; //READ
const setLocalStorage = (user) => localStorage.setItem('db_users', JSON.stringify(user));

// CRUD
const createUserLS = (client) => {
    const getUsers = getLocalStorage();
    getUsers.push(client)
    setLocalStorage(getUsers);
}
const updateUserLS = (index, client) => {
    const getUsers = getLocalStorage();
    getUsers[index] = client;
    setLocalStorage(getUsers);
}
const deleteUserLS = (index) => {
    const getUsers = getLocalStorage();
    getUsers.splice(index, 1);
    setLocalStorage(getUsers);
}

// EVENTS
document.getElementById('openModal')
    .addEventListener('click', () => openModal())

document.getElementById('closeModal')
    .addEventListener('click', () => closeModal())

document.getElementById('closeError')
    .addEventListener('click', () => closeError())

document.getElementById('btnRegister')
    .addEventListener('click', () => createUser())

document.getElementById('searchInput')
    .addEventListener('input', () => searchUser())

document.querySelector('.table tbody').addEventListener('click', (e) => {
    if(e.target.type == "submit"){
        const userId = e.target.id.split('-')
        const [action, index] = userId;

        if(action == "editBtn"){
            editUser(index);
        }else{
            const response = confirm('Tem certeza que deseja excluir esse usuário?');
            if(response){
                deleteUserLS(index);
                readTable();
            }
        }
    }
})

readTable()