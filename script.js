const divTablero = document.querySelector("#tablero");

const MAX_FILA = 10;
const MAX_COL = 10;

const VIVA = true;
const MUERTA = false;

const matrizTablero = [];
function initMatrizTablero() {
    for (let fila = 0; fila < MAX_FILA; fila++) {
        matrizTablero[fila] = [];
        for (let columna = 0; columna < MAX_COL; columna++) {
            matrizTablero[fila][columna] = MUERTA;
        }
    }
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

generarMatriz();