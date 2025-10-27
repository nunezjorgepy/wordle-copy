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