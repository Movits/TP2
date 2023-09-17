const divTablero = document.querySelector("#tablero");

const MAX_FILA = 10;
const MAX_COL = 10;

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




/* // Verifica si la posicion esta dentro del tablero
function limiteTablero(fila, col) {
    return fila >= 0 && fila < MAX_FILA && col >= 0 && col < MAX_COL;
} */