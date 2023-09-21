const divTablero = document.querySelector("#tablero");
const btnIniciar = document.querySelector("#iniciar");
const btnParar = document.querySelector("#parar");
const btnLimpiar = document.querySelector("#limpiar");

const MAX_FILA = 10;
const MAX_COL = 10;

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

function botonIniciar() {
    btnIniciar.addEventListener("click", function() {
        setInterval(function() {
            proximaGeneracion();
            actualizarTablero();
        }, 1000);
    });
}

function botonParar() {
    btnParar.addEventListener("click", function() {
        clearInterval();
    });
}

function botonLimpiar() {
    btnLimpiar.addEventListener("click", function() {
        initMatrizTablero();
        actualizarTablero();
    });
}

// Inicializa la matriz del tablero
const matrizTablero = [];
function initMatrizTablero() {
    for (let fila = 0; fila < MAX_FILA; fila++) {
        matrizTablero[fila] = [];
        for (let columna = 0; columna < MAX_COL; columna++) {
            matrizTablero[fila][columna] = MUERTA;
        }
    }
}

// Genera la matriz de la siguiente generacion
function proximaGeneracion() {
    for (let fila = 0; fila < MAX_FILA; fila++) {
        for (let columna = 0; columna < MAX_COL; columna++) {
            let vecinasVivas = contarVecinasVivas(fila, columna);
            if (matrizTablero[fila][columna] == VIVA) {
                if (vecinasVivas < 2 || vecinasVivas > 3) {
                    matrizTablero[fila][columna] = MUERTA;
                }
            } else {
                if (vecinasVivas == 3) {
                    matrizTablero[fila][columna] = VIVA;
                }
            }
        }
    }
}

// Actualiza el tablero con la matriz de la siguiente generacion
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

// Genera las casillas correspondientes a la fila actual
function agregarColumnas(fila) {
    let columnasGeneradasHtml = "";
    for (let columna = 0; columna < MAX_COL; columna++) {
        columnasGeneradasHtml += `
            <div id="casilla-${fila+"-"+columna}" class="col casilla"></div>`;
        }
    return columnasGeneradasHtml;
}

// Actualiza el tablero con la matriz de la siguiente generacion
function actualizarTablero() {
    for (let fila = 0; fila < MAX_FILA; fila++) {
        for (let columna = 0; columna < MAX_COL; columna++) {
            let casilla = document.querySelector("#casilla-" + fila + "-" + columna);
            if (matrizTablero[fila][columna] == VIVA) {
                casilla.classList.add("viva");
            } else {
                casilla.classList.remove("viva");
            }
        }
    }
}

main();