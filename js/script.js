// FUNCTIONS
const sanitizeItem = string => DOMPurify.sanitize(string);

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
        error.classList.add('active')
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

const closeError = () => document.querySelector('.error').classList.remove('active');

const createUser = () => {
    if(validateInputs()){
        const inputNome = document.getElementById('nome');
        const user = {
            nome: sanitizeItem(document.getElementById('nome').value),
            sobrenome: sanitizeItem(document.getElementById('sobrenome').value),
            idade: sanitizeItem(document.getElementById('idade').value),
            email: sanitizeItem(document.getElementById('email').value)
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

    const fragment = document.createDocumentFragment(); //Performance Frag

    if(getUsers.length > 0){
        getUsers.forEach((user, index) => {
            const newTr = document.createElement('tr');

            const newTdName = document.createElement('td');
            newTdName.textContent = sanitizeItem(user.nome);
            
            const newTdSobrenome = document.createElement('td');
            newTdSobrenome.textContent = sanitizeItem(user.sobrenome);
            
            const newTdIdade = document.createElement('td');
            newTdIdade.textContent = sanitizeItem(user.idade);
            
            const newTdEmail = document.createElement('td');
            newTdEmail.textContent = sanitizeItem(user.email);
            
            const newTdActions = document.createElement('td');
            newTdActions.setAttribute('class', 'Actions');

            const newBtnEdit = document.createElement('button');
            newBtnEdit.setAttribute('class', 'btn warning');
            newBtnEdit.setAttribute('id', sanitizeItem(`editBtn-${index}`));

            const newIconEdit = document.createElement('i');
            newIconEdit.setAttribute('class', 'fa-regular fa-pen-to-square')
            
            const newBtnDelete = document.createElement('button');
            newBtnDelete.setAttribute('class', 'btn danger');
            newBtnDelete.setAttribute('id', sanitizeItem(`deleteBtn-${index}`));

            const newIconDelete = document.createElement('i');
            newIconDelete.setAttribute('class', 'fa-solid fa-trash')

            newBtnEdit.append(newIconEdit);
            newBtnDelete.append(newIconDelete);
            newTdActions.append(newBtnEdit, newBtnDelete);
            newTr.append(newTdName, newTdSobrenome, newTdIdade, newTdEmail, newTdActions);
            
            fragment.append(newTr);
            
        })
        document.querySelector('.table tbody').appendChild(fragment);
    }else{
        const newTr = document.createElement('tr');

        const newTd = document.createElement('td');
        newTd.setAttribute('colspan', '5');
        newTd.setAttribute('id', 'noUsers');
        newTd.textContent = 'Sem usuários cadastrados';

        newTr.appendChild(newTd)
        document.querySelector('.table tbody').appendChild(newTr);
    }
}
const searchUser = () => {
    const searchInput = sanitizeItem(document.getElementById('searchInput').value.toLowerCase());

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
    document.getElementById('nome').value = sanitizeItem(getUsers.nome);
    document.getElementById('sobrenome').value = sanitizeItem(getUsers.sobrenome);
    document.getElementById('idade').value = sanitizeItem(getUsers.idade);
    document.getElementById('email').value = sanitizeItem(getUsers.email);
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