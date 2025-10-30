import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import './HomePage.css';

import WordRowComponent from "../components/WordRowComponent";
import KeyBoardRowComponent from "../components/KeyBoardRowComponent";

function HomePage() {
    /* useStates */
    const [row, setRow] = useState(0);
    const [cell, setCell] = useState(0);
    const [chosenWord, setChosenWord] = useState('');
    const [searchedWord, setSearchedWord] = useState('');
    const [playing, setPlaying] = useState(true);
    /* useRefs */
    const cellsRef = useRef({});
    const keyBoardRef = useRef({});
    const incomplete_word = useRef(null);
    const not_on_list = useRef(null);
    const newGemaBtn = useRef(null)


    /* 
    ==========================================================================
    ==========================================================================
    ==========================================================================
    General Functions
    ==========================================================================
    ==========================================================================
    ==========================================================================
    */
    const getRAEword = async () => {
        /* Busca en la API de la RAE una palabra de 5 caracteres. */
        /* TODO: para evitar perder tiempo mientras la API busca una palabra, que para colmo puede contener tildes, momentaneamente hago que la palabra sea siempre SECAR. Es importante modificar esto luego. */
        /* let fecthedWord = await axios.get('https://rae-api.com/api/random');
        while (fecthedWord.data.data.word.length !== 5) {
            fecthedWord = await axios.get('https://rae-api.com/api/random');
        }
        setSearchedWord(fecthedWord.data.data.word.toUpperCase()); */
        setSearchedWord('SECAR');
    }

    /* Añade la referencia a la celda correspondiente */
    const addToReds = (element, key) => {
        if (element) {
            cellsRef.current[key] = element
        }
    }

    const addToKeyRefs = (element, letter) => {
        if (element){
            keyBoardRef.current[letter] = element;
        }
    }

    /* Error message function */
    const showErrorMsg = (ref) => {
        ref.current.classList.add('error_animation');
        setTimeout(() => {
            ref.current.classList.remove('error_animation');
        }, 3000)
    }

    /* New Game Funciton */
    const newGame = () => {
        newGemaBtn.current.blur()
        getRAEword();
    }

    /* Counting Letters */
    const countingLEtters = () => {
        /* 
        Cuenta la cantidad de veces que cada letra aparece en la palabra 
        Devuelve un objeto con dicha cantidad.
        */
        const LETTEROBJECT = {}
        const LETTERCOUNT = [...searchedWord].forEach(letter => {
            if (LETTEROBJECT[letter]){
                LETTEROBJECT[letter]++
            } else{
                LETTEROBJECT[letter] = 1
            }
        })

        return LETTEROBJECT
    }

    const checkRightPlace = (LETTERCOUNT) => {
        /*
        Verifica, por cada letra, si está en el lugar correcto
        */
        for (let i = 0; i < searchedWord.length; i++){
            if (searchedWord[i] === chosenWord[i]){
                let currentCell = cellsRef.current[`${row}${i}`];
                currentCell.classList.add('right_place');
                LETTERCOUNT[chosenWord[i]]--;
                addClassToKeyBoard('right_place', chosenWord[i])
            }
        }
    }

    const checkRightetter = (LETTERCOUNT) => {
        /* 
        Verifies if the letter are in the word and available to use
        */
        for (let i = 0; i < 5; i++){
            // Create the variables that are either true or false
            const rightPlace = cellsRef.current[`${row}${i}`].classList.contains('right_place');
            const isInWord = searchedWord.includes(chosenWord[i]);
            const available = LETTERCOUNT[chosenWord[i]];

            // Verifies if conditions are met
            if (rightPlace){
                continue;
            } else if (isInWord && available) {
                cellsRef.current[`${row}${i}`].classList.add('right_letter');
                LETTERCOUNT[chosenWord[i]]--;
                addClassToKeyBoard('right_letter', chosenWord[i]);
            } else {
                cellsRef.current[`${row}${i}`].classList.add('wrong_letter');
                addClassToKeyBoard('wrong_letter', chosenWord[i]);
            }
        }
    }

    const setCellAndRow = () => {
        // Setea la fila y celda después de verificar la palabra.
        setCell(0);
        setRow(prevRow => {
            if (prevRow !== 5){
                return prevRow + 1;
            } else {
                console.log(`Perdiste. La palabra es: ${searchedWord}`);
                setPlaying(false);
                return 0
            }
        })
        cellsRef.current[`${row}${cell}`].classList.add('current_letter');
    }

    const addClassToKeyBoard = (colorClass, letter) => {
        /* Agrega la clase correspondiente a la letras del teclado. */
        const uncoloredLetter = keyBoardRef.current[letter];
        const hasRightPlace = uncoloredLetter.classList.contains('right_place');
        const hasRightLetter = uncoloredLetter.classList.contains('right_letter');

        if (colorClass === 'right_place'){
            uncoloredLetter.classList.add(colorClass);
            uncoloredLetter.classList.remove('right_letter');
        } else if (colorClass === 'right_letter' && !hasRightPlace){
            uncoloredLetter.classList.add(colorClass);
            uncoloredLetter.classList.remove('wrong_letter');
        } else if (colorClass === 'wrong_letter' && !hasRightPlace && !hasRightLetter){
            uncoloredLetter.classList.add(colorClass);
        }

        /* Saca la clase que el da el hover a las letras. */
        uncoloredLetter.classList.remove('keyboar_hover');
    }

    const onLetterPress = (letra) => {
        /* Se jecuta al presionar una letra. Ingresa la letra en la casilla actual, además de quitar la clase current_cell. Setea chosenWord y la nueva celda. */

        /* Si chosenWord ya tiene 5 letras, la función se termina y no hace nada. */
        if (chosenWord.length === 5 || !playing) return

        /* Setting chosenWord */
        setChosenWord((prevWord) => prevWord + letra);

        /* Writing the letter and removing current_cell class from current Cell */
        const currentCell = cellsRef.current[`${row}${cell}`];
        currentCell.innerHTML = letra;
        currentCell.classList.remove('current_cell');
        currentCell.blur();

        /* Add current_cell to the next cell */
        if (cell !== 4){
            const nextCell = cellsRef.current[`${row}${cell + 1}`];
            nextCell.classList.add('current_cell');
        }

        /* Moving to next cell */
        setCell((prevCell) => (prevCell !== 4 ? prevCell + 1 : prevCell));
    }

    const onBackspacePress = () => {
        /* Al presionar Backspace, borra la última letra de chosenWord, cambia la celda actual y borra la letra de la celda correspondiente. */
        if (!playing || chosenWord.length === 0) return;     // Si no estoy jugando o estoy en la primera celda, termina la función

        setChosenWord(prevWord => prevWord.slice(0, -1));    // Elimina la última letra de chosenWord

        let currentCell = cellsRef.current[`${row}${cell}`];
        
        if (chosenWord.length === 5) {
            /* Si ya hay 5 letras en chosen Word */
            currentCell.innerHTML = '';
            currentCell.classList.add('current_cell');
        }
        else{
            let newCell = cellsRef.current[`${row}${cell - 1}`];
            currentCell.classList.remove('current_cell');
            newCell.classList.add('current_cell');
            newCell.innerHTML = '';
        }

        setCell((prevCell) => {
            /* Ok, so this one was a perra.
                - If I wrote 5 characters, it deletes the last one, the letter from the cell, but it remains in the last cell;
                - If it's on the first cell (index = 0), it remains there and nothing else
                - Else, sets the cell index to the previous one.
            */
            if (prevCell === 4 && chosenWord.length === 5){
                return 4
            } else if (prevCell === 0) {
                return 0
            } else{
                return prevCell - 1
            }
        })
    }


    /* 
    ==========================================================================
    ==========================================================================
    ==========================================================================
    Key press handlers
    ==========================================================================
    ==========================================================================
    ==========================================================================
    */
    /* 
    Event Listener for key down
    */
    const handleKeyDown = async (e) => {
        if (!playing) return; // Si no estoy jugando, no hace nada.

        
        if ('ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.includes(e.key.toUpperCase())) {
            const letra = e.key.toUpperCase();
            onLetterPress(letra);
        }

        if (e.key === 'Backspace') {
            onBackspacePress();
        }

        if (e.key === 'Enter') {
            // TODO: when I press Enter, it should check if chosenWord has 5 characters, if it exists and all the winning or not winning functions.

            /* If the word doesn't have enough letters */
            console.log(chosenWord);
            if (chosenWord.length < 5){
                // If chosen word doesn't have enough letter, show error
                showErrorMsg(incomplete_word)
                return false
            }

            /* Check if word is in dictionary */
            /* try {
                const foundWord = await axios.get(`https://rae-api.com/api/words/${chosenWord}`);
            } catch (error) {
                showErrorMsg(not_on_list)
                return false
            } */

            /* Check if the user won */
            if (searchedWord === chosenWord) {
                for (let i = 0; i < 5; i++){
                    cellsRef.current[`${row}${i}`].classList.add('right_place');
                    addClassToKeyBoard('right_place', chosenWord[i]);
                    setPlaying(false);
                    setChosenWord('');
                }
                return false
            }

            const LETTERCOUNT = countingLEtters();
            
            setChosenWord('');              // If not reset, the game doesn't continue.
            checkRightPlace(LETTERCOUNT);   // Check if it is in the right place
            checkRightetter(LETTERCOUNT);   // Check if it is in the word. If not, pain it gray
            setCellAndRow();                // Set new Row and Cell

        }
    }

    useEffect(() => {
        // Busca una palabra SOLAMENTE en el primer renderizado
        getRAEword()
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])
    
    return (
        <>
            <main>
                <section className="section_game">
                    <div className="game_flex">
                        {/* Título */}
                        <h1 className="game_title">LA PALABRA DEL DÍA</h1>

                        {/* Botón de Nueva Palabra */}
                        <button className="new_game_btn" ref={newGemaBtn} onClick={() => newGame()}>Nueva Palabra</button>

                        {/* Palabras */}
                        <div className="words_container">
                            <WordRowComponent row='0' addToReds={addToReds} />
                            <WordRowComponent row='1' addToReds={addToReds} />
                            <WordRowComponent row='2' addToReds={addToReds} />
                            <WordRowComponent row='3' addToReds={addToReds} />
                            <WordRowComponent row='4' addToReds={addToReds} />
                            <WordRowComponent row='5' addToReds={addToReds} />
                        </div>

                        {/* Teclado */}
                        <div className="letters_container">

                            {/* Teclado First Row */}
                            <KeyBoardRowComponent 
                            letters={['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']} 
                            addToKeyRefs={addToKeyRefs} 
                            onLetterPress={onLetterPress}
                            />

                            {/* Teclado Second Row */}
                            <KeyBoardRowComponent 
                            letters={['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ']} 
                            addToKeyRefs={addToKeyRefs} 
                            onLetterPress={onLetterPress}
                            />

                            {/* Teclado Third Row */}
                            <KeyBoardRowComponent 
                            letters={['Z', 'X', 'C', 'V', 'B', 'N', 'M']} 
                            addToKeyRefs={addToKeyRefs} 
                            row={3} 
                            onLetterPress={onLetterPress}
                            />
                        </div>
                    </div>
                </section>

                {/* Mensaje de faltan letras */}
                <div ref={incomplete_word} className="error_msg incomplete_word">No hay suficientes letras</div>
                {/* Palabra no encontrada */}
                <div ref={not_on_list} className="error_msg not_on_list">La palabra no está en la lista</div>
            </main>
        </>
    )
}

export default HomePage