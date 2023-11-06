const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// console.log(itemForm, itemInput, itemList)

function displayItems() {
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

//add item on submit
function OnAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;
    //validate input
    if (newItem === '') return alert("Please enter an item");

    //check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkDuplicateItem(newItem)) {
            alert('That item already exists');
            return;
        }
    }

    //add items to dom
    addItemToDOM(newItem)

    //add item to local storage
    addItemToStorage(newItem);
    checkUI()
    itemInput.value = '';

}

//additenm to dom
function addItemToDOM(item) {
    //create list item
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item))

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button)
    // console.log(li)
    itemList.appendChild(li)
}

//additem to storage
function addItemToStorage(item) {
    const itemsFromStorage = getItemFromStorage();

    //add new item to array
    itemsFromStorage.push(item);

    //convert to json string and set to lcoal storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}
//create button
function createButton(classes) {
    const button = document.createElement('button')
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

//create icon
function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

//get item from storage
function getItemFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage
}

//remove and edit item
function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
    } else {
        setItemToEdit(e.target);
    }
}

//check for dupplicate
function checkDuplicateItem(item) {
    const itemsFromStorage = getItemFromStorage();

    return itemsFromStorage.includes(item);
}

//edit the item
function setItemToEdit(item) {
    isEditMode = true;
    itemList.querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class="fa-solid fa-pen"><i/> Update Item';
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent
}

//remove paricular item
function removeItem(item) {
    if (confirm('Are you sure')) {
        //remove item from dom
        item.remove();

        //remove item from local storage
        removeItemFromStorage(item.textContent);
        checkUI();
    }
}

//remvoe items from storage
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage();

    //filter out the item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    //reset to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}
//clear all elemtns
function clearItems() {
    while (itemList.firstChild) {
        itemList.firstChild.remove();
    }

    //clear from local storage
    localStorage.removeItem('items');
    checkUI()
}




//filter the items
function filterItems(e) {
    const items = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase();
    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
        console.log(itemName)
    })
}


//clear ui
function checkUI() {
    itemInput.value = '';
    const items = itemList.querySelectorAll('li')
    // console.log(items)
    if (items.length === 0) {
        clearButton.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearButton.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}


//initialise app
function init() {

    //event listeners
    itemForm.addEventListener('submit', OnAddItemSubmit)
    itemList.addEventListener('click', onClickItem)
    clearButton.addEventListener('click', clearItems)
    itemFilter.addEventListener('input', filterItems)
    document.addEventListener('DOMContentLoaded', displayItems)
    checkUI()
}

init();



