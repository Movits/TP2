const divTablero = document.querySelector("#tablero");

const MAX_FILA = 10;
const MAX_COL = 10;

const VIVA = true;
const MUERTA = false;

function main() {
    initMatrizTablero();
    generarMatriz();
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