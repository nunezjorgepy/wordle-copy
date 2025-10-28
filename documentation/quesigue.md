# Idea del archivo
Mostrar qué es lo que tengo que hacer en la rama actual

# Función checkRightPlace

## Variables a usar
Supongamos que la palabra de la RAE es ALIAS
howManyLetters = {
    A: [2, 0],
    L: [1, 0],
    I: [1, 0],
    S: [1, 0],
}
El primer número muestra la cantidad de veces que figura en la palabra de la RAE. El segundo la cantidad de veces que yo elegí la letra. 
Supongamos que la letra a revisar es S en la palabra escogida 'SOLOS'. Como la letra S esta bien colocada en la última posición, la función checkRightPlace la colorea de verde y suma 1 en el correspondiente lugar de la variable, dejandola así:
howManyLetters = {
    A: [2, 0],
    L: [1, 0],
    I: [1, 0],
    S: [1, 1],
}
Ahora, cuando verifique las S en la función checkRightLetter, no va a colorear ninguna a pesar que estén en la palabra, porque ya agoté la cantidad de Ss que puedo colorear.
Obviamente, para esto tengo que verificar antes de colorear si agoté la cantidad posible.

# Función checkRightLetter
Funcionalidad:
    - Verifica si las letras están en la palabra. Si están, y quedan letras disponibles, las pinta de amarillo. Si no están, las pinta de gris.
    - Si no estoy en la última fila, cambio de fila y la celda actual pasa a ser la 0.
    - Si estoy en la útlima fila, significa que no pude adivinar la palabra en todos los intentos disponibles.
        En ese caso, tengo que mostrar por pantalla el mensaje "Perdió"

Pseudocódigo:
    - Para cada letra de la palabra:
        - Si el div tiene la clase 'right_place', no hago nada
        - Si esta en la palabra y quedan letras disponibles (si LETTERCOUNT[LETRA] no es 0)
            - Agrega la clase right_letter
            - Resto 1 a las disponible de esa letra
        - Caso contrario, la pinto de gris.
        
Código:
    for (let i = 0; i < 5; i++){
        // Creo las variables qe deben ser true o false
        const rightPlace = cellsRef.current[`${row}${i}`].classList.contains('right_place');
        const isInWord = searchedWord.includes(chosenWord[i]);
        const available = LETTERCOUNT[chosenWord[i]];

        if (!rightPlace && isInWord && available){
            cellsRef.current[`${row}${i}`].classList.add('right_letter');
            available--
        } else{
            cellsRef.current[`${row}${i}`].classList.add('wrong_letter');
        }
    }