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

/* Backspcae. Esto va dentro del eventlisener, en el if del backspace. */
if (e.key === 'Backspace') {
    /* Eliminar la última letra de chosenWord */
    setChosenWord((prevWord) => {
        const newWord = prevWord.length !== 0 ? prevWord.slice(0, -1) : prevWord
        return newWord
    })

    /* Elige la celda actual y elimina la clase */
    const currentCell = cellsRef.current[`${row}${cell}`];
    currentCell.classList.remove('current_cell');

    /* Foco en la celda anterior */
    setCell((prevCell) => {
        /* Ok, so this one was a perra.
            - If I wrote 5 characters, it deletes the last one, the letter from the cell, but it remains in the last cell;
            - If it's on the first cell (index = 0), it remains there and nothing else
            - Else, sets the cell index to the previous one.
        */
        if (prevCell === 4 && chosenWord.length === 5){
            currentCell.innerHTML = '';
            return 4
        } else if (prevCell === 0) {
            return 0
        } else{
            return prevCell - 1
        }
    })
}