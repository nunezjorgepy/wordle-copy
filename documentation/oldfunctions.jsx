/* En este archivo guardo las funciones viejas en caso de que las nuevas no funcionen como deben. */

const onLetterPress = (letra) => {
    /* Se jecuta al presionar una letra. Ingresa la letra en la casilla actual, además de quitar la clase current_cell. Setea chosenWord y la nueva celda. */
    /* Setting chosenWord */
    if (chosenWord.length === 5) return
    setChosenWord((prevWord) => prevWord + letra);

    /* Writing the lleter and removing current_cell class from current Cell */
    const currentCell = cellsRef.current[`${row}${cell}`];
    currentCell.innerHTML = letra;
    currentCell.classList.remove('current_cell');
    currentCell.blur();

    /* Moving to next cell */
    setCell((prevCell) => (prevCell !== 4 ? prevCell + 1 : prevCell));
}

const onLetterRelease = (letra, platform) => {
    /* Updates the useStates, deletes the letters on the cell and... */
    let adding;     // No me acuerdo por qué es necesario. Estoy quemado. Pero sin esto funciona mal.
    platform === 'keyboard' || cell === 4 ? adding = 0 : adding = 1;

    let currentCell = cellsRef.current[`${row}${cell + adding}`];

    /* Add the class to the next cell */
    if (chosenWord.length !== 5) {
        currentCell.classList.add('current_cell');
    }

    /* Delete the letter from the cell */
    if (letra === 'Backspace'){
        currentCell.innerHTML = '';
    } 
}