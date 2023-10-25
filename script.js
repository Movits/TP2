const divTablero = document.querySelector("#tablero");
const btnIniciar = document.querySelector("#iniciar");
const btnParar = document.querySelector("#parar");
const btnLimpiar = document.querySelector("#limpiar");

let MAX_FILA = 10;
let MAX_COL = 10;

const VIVA = true;
const MUERTA = false;

function main() {
    initMatrizTablero();
    generarMatriz();
    agregarEventosClick();
    proximaGeneracion();
    actualizarTablero();
}

// Agrega el evento click a cada casilla
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

// Agrega los eventos a los botones
let intervalo;
function botonIniciar() {
    intervalo = setInterval(function() {
        proximaGeneracion();
        actualizarTablero();
    }, 1000);
    btnIniciar.disabled = true;
}

function botonParar() {
    clearInterval(intervalo);
    btnIniciar.disabled = false;
}

function botonLimpiar() {
    initMatrizTablero();
    actualizarTablero();
    botonParar();
    btnIniciar.disabled = false;
}

// Inicializa una matriz 2D para el tablero
const matrizTablero = [];
function initMatrizTablero() {
    for (let fila = 0; fila < MAX_FILA; fila++) {
        matrizTablero[fila] = [];
        for (let columna = 0; columna < MAX_COL; columna++) {
            matrizTablero[fila][columna] = MUERTA;
        }
    }
}

// Matriz temporaria para guardar la siguiente generacion
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

// Verifica el estado de las celulas
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

// Genera el Tablero de la pagina
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

function agregarColumnas(fila) {
    let columnasGeneradasHtml = "";
    for (let columna = 0; columna < MAX_COL; columna++) {
        columnasGeneradasHtml += `
            <div id="casilla-${fila+"-"+columna}" class="col casilla"></div>`;
        }
    return columnasGeneradasHtml;
}

// Actualiza las celulas del tablero en css
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

// Configura la matriz del tablero con los valores ingresados por el usuario
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

//Botones para localStorage
function guardarTablero() {
    let tablerosGuardados = JSON.parse(localStorage.getItem("tablerosGuardados")) || [];
    tablerosGuardados.push({
        tablero: matrizTablero,
        imagen: generarImagen()
    });
    localStorage.setItem("tablerosGuardados", JSON.stringify(tablerosGuardados));
}

function generarImgTablero() {
    const canvas = document.createElement("canvas");
    canvas.width = MAX_COL * 10;
    canvas.height = MAX_FILA * 10;
    const ctx = canvas.getContext("2d");

    for (let fila = 0; fila < MAX_FILA; fila++) {
        for (let columna = 0; columna < MAX_COL; columna++) {
            if (matrizTablero[fila][columna] == VIVA) {
                ctx.fillStyle = "black";
            } else {
                ctx.fillStyle = "white";
            }
            ctx.fillRect(columna * 10, fila * 10, 10, 10);
        }
    }
}

function cargarTablero(i) {
    let tablerosGuardados = JSON.parse(localStorage.getItem("tablerosGuardados")) || [];
    if (tablerosGuardados[i]) {
        matrizTablero = tablerosGuardados[i].board;
        actualizarTablero();
    }
}

function mostrarTablerosGuardados() {
    let tablerosGuardados = JSON.parse(localStorage.getItem("tablerosGuardados")) || [];
    let contenedorTableros = document.querySelector(".offcanvas-body > div");
    contenedorTableros.innerHTML = '';
    
    tablerosGuardados.forEach((tableroGuardado, index) => {
        let elemTablero = document.createElement('div');
        elemTablero.classList.add("saved-board");
        
        let imagenElem = document.createElement('img');
        imagenElem.src = tableroGuardado.imagen;
        imagenElem.alt = "Tablero " + (i + 1);
        imagenElem.addEventListener("click", function() {
            cargarTablero(i);
        });

        let btnEliminar = document.createElement('button');
        btnEliminar.innerHTML = "X";
        btnEliminar.classList.add("delete-board-btn");
        btnEliminar.addEventListener("click", function(event) {
            event.stopPropagation();
            eliminarTablero(i);
            mostrarTablerosGuardados();
        });

        elemTablero.appendChild(imagenElem);
        elemTablero.appendChild(btnEliminar);
        contenedorTableros.appendChild(elemTablero);
    });
}

function eliminarTablero(i) {
    let tablerosGuardados = JSON.parse(localStorage.getItem("tablerosGuardados")) || [];
    if (tablerosGuardados[i]) {
        tablerosGuardados.splice(i, 1);
        localStorage.setItem("tablerosGuardados", JSON.stringify(tablerosGuardados));
    }
}




function limpiarTablerosGuardados() {
    localStorage.clear();
}

main();