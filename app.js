
const URLBASE = 'http://localhost:3000/products'
let products = [];

window.addEventListener('DOMContentLoaded', () => {
  getProducts();
})

const getProducts = () => {
  fetch(URLBASE)
  .then(response => response.json())
  .catch(error => {
    alertManager('error', error)
  })
  .then(data => {
    products = data.data;
    renderResult(products);
  })
}

// DOM
const ViewProducts = document.querySelector('#productsList');

const renderResult = (products) => {
  let listHTML = '';
  products.forEach(product => {
    listHTML += `
      <div class="card">
        <div>Nombre: ${product.Nombre}</div>
        <div>Color: ${product.Color}</div>
        <div>Precio: ${product.Precio}</div>
        <div class="options">
          <button type="button" onclick="editProduct('${product.Id}')">Editar</button>
          <button type="button" onclick="deleteProduct('${product.Id}')">Eliminar</button>
        </div>
      </div>
    `
  });

  ViewProducts.innerHTML = listHTML;
}

const createProduct = () => {
  const formData = new FormData(document.querySelector('#formAdd'));

  if(!formData.get('nombre').length || !formData.get('color') || !formData.get('precio')) {
    document.querySelector('#msgFormAdd').innerHTML = 'Llena todos los campos';
    return;
  }
  document.querySelector('#msgFormAdd').innerHTML = '';
  
  const product = {
    Nombre: formData.get('nombre'),
    Color: formData.get('color'),
    Precio: formData.get('precio')
  }
  
  fetch(URLBASE, {
    method:'POST', 
    body:JSON.stringify(product),
    headers:{
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .catch(error => {
    alertManager('error', error);
    document.querySelector('#formAdd').reset();
  })
  .then(response => {
    alertManager('success', response.mensaje);
    document.querySelector('#formAdd').reset();
    getProducts();
  }); 
}

const editProduct = (id) => {
  let filteredProduct = null;
  products.filter(prod => {
    if( prod.Id == id ) { filteredProduct = prod }
  });
  document.querySelector('#formEdit #ID').value = filteredProduct.Id;
  document.querySelector('#formEdit #nombre').value = filteredProduct.Nombre;
  document.querySelector('#formEdit #color').value = filteredProduct.Color;
  document.querySelector('#formEdit #precio').value = filteredProduct.Precio;
  openModalEdit();
}

const updateProduct = () => {
  const productId = document.querySelector('#formEdit #ID').value;

  const product = {
    Nombre: document.querySelector('#formEdit #nombre').value,
    Color: document.querySelector('#formEdit #color').value,
    Precio: document.querySelector('#formEdit #precio').value
  }

  if(!product.Nombre || !product.Color || !product.Precio) {
    document.querySelector('#msgFormEdit').innerHTML = 'Los campos no deden estar vacios';
    return;
  }
  document.querySelector('#msgFormEdit').innerHTML = '';

  fetch(`${URLBASE}/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(product),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .catch(error => {
    alertManager('error', error);
  })
  .then(response => {
    alertManager('success', response.mensaje);
    getProducts();
  });
}

const deleteProduct = (id) => {
  fetch(`${URLBASE}/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .catch(error => {
    alertManager('error', error);
  })
  .then(response => {
    alertManager('success', response.mensaje);
    getProducts();
  });
}

// MODAL ADD MANAGER
/** --------------------------------------------------------------- */
const btnAdd = document.querySelector('#btnAdd');
const modalAdd = document.querySelector('#modalAdd');

btnAdd.onclick = () => openModalAdd();

window.onclick = function(event) {
  if (event.target == modalAdd) {
    modalAdd.style.display = "none";
  }
}

const closeModalAdd = () => {
  modalAdd.style.display = 'none';
}

const openModalAdd = () => {
  modalAdd.style.display = 'block';
}

// MODAL ADIT MANAGER
/** --------------------------------------------------------------- */
const modalEdit = document.querySelector('#modalEdit');

const openModalEdit = () => {
  modalEdit.style.display = 'block';
}

const closeModalEdit = () => {
  modalEdit.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == modalEdit) {
    modalEdit.style.display = "none";
  }
}


/** ALERT */
const alertManager = (typeMsg, message) => {
  const alert = document.querySelector('#alert');

  alert.innerHTML = message || 'Se produjo cambios';
  alert.classList.add(typeMsg);
  alert.style.display = 'block';

  setTimeout(() => {
    alert.style.display = 'none';
    alert.classList.remove(typeMsg);
  }, 3500);

}