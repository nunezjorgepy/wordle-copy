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

# Función para las teclas del tecaldo en pantalla
Intento N°1:
Para las letras, llevar Todo el código desde 'const letra = e.key.toUpperCase();' (actualmente, línea 176) hasta el fin de esa funcionalidad (línea 186) a otra función que acepte como parámetro:
	- La variable letra si es en el eventListener
	- La letra del teclado en pantalla si es por pantalla

Puedo hacer lo mismo con las otras funciones.

Al parecer, en el caso de key-up, nada de la función necesita el valor de la letra, por lo que puedo encerrar todo en otra función y llamarla al terminar el código de la función key-down.


A como quedó el código ahora, es posible que me convenga agregar el componente para los botones del teclado. Pero eso es otra historia.


# Botón juego nuevo
¿Qué cosas debe resetear?
    - Buscar una nueva palabra para adivinar
    - chosenWord a '' (OJO: la función enter no resetea la palabra si el jugador ganó)

    - Eliminar la clase right_place de cada letra en la grilla  --
    - Eliminar la clase right_letter de cada letra en la grilla   | -- Hacer juntas
    - Eliminar la clase wrong_letter de cada letra en la grilla --

    - Eliminar la clase right_place de cada letra en el teclado de pantalla
    - Eliminar la clase right_letter de cada letra en el teclado de pantalla
    - Eliminar la clase wrong_letter de cada letra en el teclado de pantalla

    - Dar foco a la primera celda de la primera fila
    - Dar clase current_cell a la primera celda de la primer fila

Pseudocódigo:
    <!-- Momentaneamente, la nueva palabra será 'LUGAR'. Más adelante, será elegida aleatoriamente. -->
    - Elegir nueva palabra

    - setChosenWord('')

    - Para cada elemnto de cellsRef:
        - Eliminar la calse right_place
        - Eliminar la calse right_letter
        - Eliminar la calse wrong_letter
    
    - Para cada elemnto de keyBoarRef:
        - Eliminar la calse right_place
        - Eliminar la calse right_letter
        - Eliminar la calse wrong_letter

    - Selecciono la primera celda de la primera fila
    - Agrego la clase current_cell

    - Seteo la cell a 0
    - Seteo la row a 0


# Problema con 'Nueva Palabra' (SOLUCIONADO)
Si hago click en el botón Nueva Palabra antes de completar las 5 letras, se reinicia, pero:
    - La casilla actual (antes del click) queda con la clase 'current_class'
    - Al llegar a esa última casilla, no permite seguir ingresando letras.

# Mesaje de error, versión 2.0
Quiero intentar que los mensjaes de error no sean parte del HTML, si no que se muestren según el estado actual (si hay que mostrarlos). Creo que una buena es:
    - Crear una useSeate que constenga el error a mostrar actual (en principio, 'letras');
    - Si chosenWord no tiene 5 caracteres, mantiene 'letras;
    - Si tiene 5 letras y la palabra no esta dentro de las posibles, cambia a 'lista';
    - Si tiene 5 letras y estoy en la última fila (perdí) cambia a 'haveLost';
    - Si presiono Enter y era una palabra válida, seteo a 'lista';
    - Si presiono Backspace, cambia a 'letras';

    - Al clickear en Nueva Palabra, lo setea a letras

Creo que aún así hay un pequeño problema con el de Nueva Palabra. Si esta seteado en 'haveLost' o 'lista' y doy click en Nueva Palabra, antes de apretar cualquier tecla queda seteado en esos y no en 'letras' como debería. Por lo que si la primera tecla que presiono es Enter, mostraá el error equivocado. El problema es cuando:
    - chosenWord tiene 5 letras y no esta en la lista de válidas, pero no presiono Enter; o chosenWord tiene 5 letras, estoy en la última fila y la palabra no es la palabra a adivinar, pero no presiono Enter.
    - Si en ese momento clickeo en Nueva Palabra, creo que quedará el useState incorrecto.