const clickbtn = document.querySelectorAll('button');
const tabla = document.querySelector('.tbody');

var modalWrap = null;

const showModal = () => {
    let total = 0;
    let cantidad = 0;

    carrito.forEach(lugar => {
        const lugarPrecio = Number(lugar.precio.replace("L.",''));
        total = total + lugarPrecio * lugar.cantidad;
    })

    carrito.forEach(lugar => {
        const cantlugar = Number(lugar.cantidad);
        cantidad = cantidad + cantlugar;
    })

    if(modalWrap !== null){
        modalWrap.remove();
    }

    modalWrap = document.createElement('div');

    if (total == 0) {
        modalWrap.innerHTML = `
            <div class="modal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" id="exampleModalLabel">Error</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Debe añadir un lugares para realizar su compra.
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        modalWrap.innerHTML = `
            <div class="modal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" id="exampleModalToggleLabel">Confirmación de compra</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            La cantidad de platilos es: <strong>${cantidad}</strong>
                            <br>
                            El total de su compra es de: <strong>L.${total}</strong>
                            <br>
                            <center>
                            <br>
                            <strong>¿Desea confirmar la compra?</strong>
                            </center>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button class="btn btn-success" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal" onclick="limpiaTabla()">Confirmar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    document.body.append(modalWrap);

    var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();
}

function limpiaTabla(){
    const tr = document.querySelector('.tbody');
    for (let i = 0; i <= carrito.length; i++) {
        carrito.splice(i);
    }
    tr.remove();
    totalCarrito();
}

let carrito = [];

clickbtn.forEach(btn => {
    btn.addEventListener('click', agregaCarrito);
})

function agregaCarrito (e) {
    const button = e.target;
    const comida = button.closest('.columnaProducto');
    const ctitulo = comida.querySelector('.titulo').textContent;
    const cprecio = comida.querySelector('.precio').textContent;
    const cimagen = comida.querySelector('img').src;

    const combo = {
        titulo : ctitulo,
        precio : cprecio,
        imagen : cimagen,
        cantidad : 1
    };
    agregaComboCar(combo);
}

function agregaComboCar(combo){

    for (let i = 0; i < carrito.length; i++) {
        if(carrito[i].titulo.trim() === combo.titulo.trim()){
            carrito[i].cantidad ++;
            addLocalStorage();
            return null;
        }
    }
    carrito.push(combo);
    addLocalStorage();
}

function cargarCarrito(){
    tabla.innerHTML = '';
    carrito.map(lugar => {
        const tr = document.createElement('tr');
        tr.classList.add('itemCarrito');
        const cont = `
        <tr>
            <th scope="row">1</th>
            <td class="table_productos">
                <img src=${lugar.imagen} alt="">
                <h6 class="title">${lugar.titulo}</h6>
            </td>
            <td class="table_precio">${lugar.precio}</td>
            <td class="table_cantidad">
                <input class="add" type="number" min="1" value=${lugar.cantidad}>
                <button class="delete btn btn-danger">X</button>
            </td>
        </tr>
        `
        tr.innerHTML = cont;
        tabla.append(tr);
        tr.querySelector('.delete').addEventListener('click', eliminarlugar);
        tr.querySelector('.add').addEventListener('change', añadirlugar);
        tr.querySelector('.add').addEventListener('change', totalCantidad);

    })
    totalCarrito();
}

function totalCarrito() {
    let total = 0;
    const carTotal = document.querySelector('.itemCartTotal');
    carrito.forEach(lugar => {
        const lugarPrecio = Number(lugar.precio.replace("L.",''));
        total = total + lugarPrecio * lugar.cantidad;
    })
    carTotal.innerHTML =`Total: L. ${total}`;

    totalCantidad();
    addLocalStorage();
}

function totalCantidad() {
    let cantidad = 0;
    const carCantidad = document.querySelector('.itemCantlugars');
    carrito.forEach(lugar => {
        const cantlugar = Number(lugar.cantidad);
        cantidad = cantidad + cantlugar;
    })
    carCantidad.innerHTML =`Cantidad: ${cantidad}`;
}

function añadirlugar(e){
    const addlugar = e.target;
    const tr = addlugar.closest('.itemCarrito');
    const titulo = tr.querySelector('.title').textContent;

    carrito.forEach(lugar => {
        if(lugar.titulo.trim() === titulo.trim()){
            addlugar.value < 1 ? (addlugar.value = 1) : addlugar.value;
            lugar.cantidad = addlugar.value;
            totalCantidad();
            totalCarrito();
            console.log(carrito);
        }
    })
}

function eliminarlugar(e){
    const dellugar = e.target;
    const tr = dellugar.closest('.itemCarrito');
    const titulo = tr.querySelector('.title').textContent;

    for (let i = 0; i < carrito.length; i++) {
        if(carrito[i].titulo.trim() === titulo.trim()){
            carrito.splice(i,1);
        }    
    }

    tr.remove();
    totalCarrito();
    totalCantidad();
}

function addLocalStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

window.onload = function () {
    const storage = JSON.parse(localStorage.getItem('carrito'));

    if(storage){
        carrito = storage;
        cargarCarrito();
    }
}