const divTablero = document.querySelector("#tablero");
const btnIniciar = document.querySelector("#iniciar");
const btnParar = document.querySelector("#parar");
const btnLimpiar = document.querySelector("#limpiar");

const VIVA = true;
const MUERTA = false;

let MAX_FILA = 10;
let MAX_COL = 10;

let intervalo;
let matrizTablero = [];

/**
 * Llama todo necessario para iniciar el juego
 */
function main() {
    initMatrizTablero();
    generarMatriz();
    agregarEventosClick();
    proximaGeneracion();
    actualizarTablero();
    mostrarTablerosGuardados();
}

/**
 * Boton que cuando hace click inicia el juego llamando 2 funciones todo segundo usando un interval
 */
function botonIniciar() {
    intervalo = setInterval(function() {
        proximaGeneracion();
        actualizarTablero();
    }, 1000);
    btnIniciar.disabled = true;
}

/**
 * Boton que paras el interval del botonIniciar
 */
function botonParar() {
    clearInterval(intervalo);
    btnIniciar.disabled = false;
}

/**
 * Boton que limpia lo tablero y para el juego
 */
function botonLimpiar() {
    initMatrizTablero();
    actualizarTablero();
    botonParar();
    btnIniciar.disabled = false;
}

/** 
 * Inicializa una matriz 2D para el tablero
 */
function initMatrizTablero() {
    for (let fila = 0; fila < MAX_FILA; fila++) {
        matrizTablero[fila] = [];
        for (let columna = 0; columna < MAX_COL; columna++) {
            matrizTablero[fila][columna] = MUERTA;
        }
    }
}

/**
 * Configura la matriz del tablero con los valores ingresados por el usuario
 */
function configurarMatriz() {
    const inputFilas = document.querySelector("#input-filas").value;
    const inputColumnas = document.querySelector("#input-columnas").value;

    if(inputFilas && inputColumnas) {
        MAX_FILA = parseInt(inputFilas);
        MAX_COL = parseInt(inputColumnas);
        main();
    } else {
        alert("Por favor, introduce valores válidos para las filas y las columnas.");
    }
}

/** 
 * Genera el Tablero de la pagina
 */
function generarMatriz() {
    divTablero.innerHTML = "";    
    for (let fila = 0; fila < MAX_FILA; fila++) {
        divTablero.innerHTML += `
            <div class="row">
                ${ agregarColumnas(fila) }
            </div>
        `;
    }
}

/**
 * return una casilla en el indice de la fila
 * @param {Number} fila de tablero indice
 * @returns html de casilla
 */
function agregarColumnas(fila) {
    let columnasGeneradasHtml = "";
    for (let columna = 0; columna < MAX_COL; columna++) {
        columnasGeneradasHtml += `
            <div id="casilla-${fila+"-"+columna}" class="col casilla"></div>`;
        }
    return columnasGeneradasHtml;
}

/**
 * Hace que cada casilla sea "clickable" con addEventListener y cambia el valor de la casilla clickada
 */
function agregarEventosClick() {
    for (let fila = 0; fila < MAX_FILA; fila++) {
        for (let columna = 0; columna < MAX_COL; columna++) {
            let casilla = document.querySelector("#casilla-" + fila + "-" + columna);
            casilla.addEventListener("click", function() {
                if (matrizTablero[fila][columna] == VIVA) {
                    matrizTablero[fila][columna] = MUERTA;
                } else {
                    matrizTablero[fila][columna] = VIVA;
                }
                actualizarTablero();
            });
        }
    }
}

/**
 * Verifica el tablero por el estado de las celulas
 * asi agregando o sacando de las casillas clases que estan def en css cambiando el color
 */
function actualizarTablero() {
    for (let fila = 0; fila < MAX_FILA; fila++) {
        for (let columna = 0; columna < MAX_COL; columna++) {
            let casilla = document.querySelector("#casilla-" + fila + "-" + columna);
            if (matrizTablero[fila][columna] == VIVA) {
                casilla.classList.add("viva");
                casilla.classList.remove("muerta");
            } else {
                casilla.classList.remove("viva");
                casilla.classList.add("muerta");
            }
        }
    }
}

/**
 * Verifica la cantidad de vecinas vivas de cada celula del tablero
 * @param {Number} fila de tablero indice
 * @param {Number} columna de tablero indice
 * @returns Cantidad de celulas vecinas vivas de una celula especifica
 */
function contarVecinasVivas(fila, columna) {
    let vecinasVivas = 0;
    for (let i = fila - 1; i <= fila + 1; i++) {
        for (let j = columna - 1; j <= columna + 1; j++) {
            if (i >= 0 && i < MAX_FILA && j >= 0 && j < MAX_COL) {
                if (matrizTablero[i][j] == VIVA) {
                    vecinasVivas++;
                }
            }
        }
    }
    if (matrizTablero[fila][columna] == VIVA) {
        vecinasVivas--;
    }
    return vecinasVivas;
}

/**
 * Hace una matriz nueva temporaria para guardar la siguiente generacion
 * siguinete generacion es def con la cant de vecinos vivos
 */
function proximaGeneracion() {
    let proxGen = [];
    for (let fila = 0; fila < MAX_FILA; fila++) {
        proxGen[fila] = [];
        for (let columna = 0; columna < MAX_COL; columna++) {
            let vecinasVivas = contarVecinasVivas(fila, columna);
            if (matrizTablero[fila][columna] == VIVA) {
                if (vecinasVivas < 2 || vecinasVivas > 3) {
                    proxGen[fila][columna] = MUERTA;
                } else {
                    proxGen[fila][columna] = VIVA;
                }
            } else {
                if (vecinasVivas == 3) {
                    proxGen[fila][columna] = VIVA;
                } else {
                    proxGen[fila][columna] = MUERTA;
                }
            }
        }
    }
    for (let fila = 0; fila < MAX_FILA; fila++) {
        for (let columna = 0; columna < MAX_COL; columna++) {
            matrizTablero[fila][columna] = proxGen[fila][columna];
        }
    }
}

/**
 * Guarda en localStorage el tablero y la imagen del tablero
 */
function guardarTablero() {
    let tablerosGuardados = JSON.parse(localStorage.getItem("tablerosGuardados")) || [];
    tablerosGuardados.push({
        tablero: matrizTablero,
        imagen: generarImgTablero()
    });
    localStorage.setItem("tablerosGuardados", JSON.stringify(tablerosGuardados));
}

/**
 * 
 * @returns una imagen del canvas del tablero
 */
function generarImgTablero() {
    const canvas = document.createElement("canvas");
    canvas.width = MAX_COL * 10;
    canvas.height = MAX_FILA * 10;
    const ctx = canvas.getContext("2d");

    for (let fila = 0; fila < MAX_FILA; fila++) {
        for (let columna = 0; columna < MAX_COL; columna++) {
            if (matrizTablero[fila][columna] == VIVA) {
                ctx.fillStyle = "orange";
            } else {
                ctx.fillStyle = "white";
            }
            ctx.fillRect(columna * 10, fila * 10, 10, 10);
        }
    }

    return canvas.toDataURL();
}

/**
 * Actualiza la matrizTablero con un tablero salvo y actualiza el visual del tablero   
 * @param {Number} index de tablero guardado en localStorage
 */
function cargarTablero(index) {
    let tablerosGuardados = JSON.parse(localStorage.getItem("tablerosGuardados")) || [];
    if (tablerosGuardados[index]) {
        matrizTablero = tablerosGuardados[index].tablero;
        actualizarTablero();
    }
}

/**
 * Mostra los tableros que estan guardados en el localStorage en el offcanvas
 */
function mostrarTablerosGuardados() {
    let tablerosGuardados = JSON.parse(localStorage.getItem("tablerosGuardados")) || [];
    let contenedorTableros = document.querySelector(".offcanvas-body > div");
    contenedorTableros.innerHTML = '';
    
    tablerosGuardados.forEach((tableroGuardado, index) => {
        let elemTablero = document.createElement('div');
        elemTablero.classList.add("saved-board");
        
        let imagenElemento = imgTableroGuardado(tableroGuardado, index);
        
        let btnEliminar = btnEliminarTablero(index);

        elemTablero.appendChild(imagenElemento);
        elemTablero.appendChild(btnEliminar);
        contenedorTableros.appendChild(elemTablero);
    });
}

/**
 * Devuelve el obj img configurado para la pagina
 * @param {Object} tableroGuardado actual a insertar
 * @param {Number} index del tablero
 * @returns la imagen del tablero
 */
function imgTableroGuardado(tableroGuardado, index) {
    let imagenElemento = document.createElement('img');
    imagenElemento.src = tableroGuardado.imagen;
    imagenElemento.alt = "Tablero " + (index + 1);
    imagenElemento.addEventListener("click", function () {
        cargarTablero(index);
    });
    return imagenElemento;
}

/**
 * Elimina un tablero indicado
 * @param {Number} index del tablero a eliminar
 */
function eliminarTablero(index) {
    let tablerosGuardados = JSON.parse(localStorage.getItem("tablerosGuardados")) || [];
    if (tablerosGuardados[index]) {
        tablerosGuardados.splice(index, 1);
        localStorage.setItem("tablerosGuardados", JSON.stringify(tablerosGuardados));
    }
}

/**
 * Crea un boton configurado
 * @param {Number} index del tablero a agregar un boton
 * @returns un boton
 */
function btnEliminarTablero(index) {
    let btnEliminar = document.createElement('button');
    btnEliminar.innerHTML = "X";
    btnEliminar.classList.add("delete-board-btn");
    btnEliminar.addEventListener("click", function (event) {
        event.stopPropagation();
        eliminarTablero(index);
        mostrarTablerosGuardados();
    });
    return btnEliminar;
}

/**
 * Limpia el localStorage
 */
function limpiarTablerosGuardados() {
    localStorage.clear();
}

main();