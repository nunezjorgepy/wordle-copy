import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import './HomePage.css';

import WordRowComponent from "../components/WordRowComponent";

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

        
        if ('ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.includes(e.key.toUpperCase()) && chosenWord.length !== 5) {
            const letra = e.key.toUpperCase();
            /* Setting chosenWord */
            setChosenWord((prevWord) => prevWord + letra);

            /* Writing the lleter and removing current_cell class from current Cell */
            const currentCell = cellsRef.current[`${row}${cell}`];
            currentCell.innerHTML = letra;
            currentCell.classList.remove('current_cell');

            /* Moving to next cell */
            setCell((prevCell) => (prevCell !== 4 ? prevCell + 1 : prevCell));
        }

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

        if (e.key === 'Enter') {
            // TODO: when I press Enter, it should check if chosenWord has 5 characters, if it exists and all the winning or not winning functions.

            /* If the word doesn't have enough letters */
            if (chosenWord.length < 5){
                // If chosen word doesn't have enough letter, show error
                showErrorMsg(incomplete_word)
                return false
            }

            /* Check if word is in dictionary */
            try {
                const foundWord = await axios.get(`https://rae-api.com/api/words/${chosenWord}`);
            } catch (error) {
                showErrorMsg(not_on_list)
                return false
            }

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

        /* DEBUG function: this function only lets me log searchedWord to know which one it is. It MUST be deleted after the app is completed. */
        if (e.key === ' ') {
            console.log('searchedWord is: ', searchedWord);
        }
    }

    const handleKeyUp = (e) => {
        if (!playing) return false  // If I'm not playing, nothing happens
        
        /* Updates the useStates, deletes the letters on the cell and... */
        let currentCell = cellsRef.current[`${row}${cell}`];

        /* Add the class to the next cell */
        if (chosenWord.length !== 5) {
            currentCell.classList.add('current_cell');
        }

        /* Delete the letter from the cell */
        if (e.key === 'Backspace'){
            currentCell.innerHTML = '';
        } 

    }

    useEffect(() => {
        // Busca una palabra SOLAMENTE en el primer renderizado
        getRAEword()
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyUp, handleKeyDown])
    
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
                            <div className="keyboard_row letters_first_row">
                                <button 
                                ref={el => addToKeyRefs(el, 'Q')} 
                                className="keyboard_letter keyboar_hover">
                                    Q
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'W')} 
                                className="keyboard_letter keyboar_hover">
                                    W
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'E')} 
                                className="keyboard_letter keyboar_hover">
                                    E
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'R')} 
                                className="keyboard_letter keyboar_hover">
                                    R
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'T')} 
                                className="keyboard_letter keyboar_hover">
                                    T
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'Y')} 
                                className="keyboard_letter keyboar_hover">
                                    Y
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'U')} 
                                className="keyboard_letter keyboar_hover">
                                    U
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'I')} 
                                className="keyboard_letter keyboar_hover">
                                    I
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'O')} 
                                className="keyboard_letter keyboar_hover">
                                    O
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'P')} 
                                className="keyboard_letter keyboar_hover">
                                    P
                                </button>
                            </div>

                            {/* Teclado Second Row */}
                            <div className="keyboard_row letters_second_row">
                                <button
                                ref={el => addToKeyRefs(el, 'A')}
                                className="keyboard_letter keyboar_hover">
                                    A
                                </button>
                                <button
                                ref={el => addToKeyRefs(el, 'S')}
                                className="keyboard_letter keyboar_hover">
                                    S
                                </button>
                                <button
                                ref={el => addToKeyRefs(el, 'D')}
                                className="keyboard_letter keyboar_hover">
                                    D
                                </button>
                                <button
                                ref={el => addToKeyRefs(el, 'F')}
                                className="keyboard_letter keyboar_hover">
                                    F
                                </button>
                                <button
                                ref={el => addToKeyRefs(el, 'G')}
                                className="keyboard_letter keyboar_hover">
                                    G
                                </button>
                                <button
                                ref={el => addToKeyRefs(el, 'H')}
                                className="keyboard_letter keyboar_hover">
                                    H
                                </button>
                                <button
                                ref={el => addToKeyRefs(el, 'J')}
                                className="keyboard_letter keyboar_hover">
                                    J
                                </button>
                                <button
                                ref={el => addToKeyRefs(el, 'K')}
                                className="keyboard_letter keyboar_hover">
                                    K
                                </button>
                                <button
                                ref={el => addToKeyRefs(el, 'L')}
                                className="keyboard_letter keyboar_hover">
                                    L
                                </button>
                                <button
                                ref={el => addToKeyRefs(el, 'Ñ')}
                                className="keyboard_letter keyboar_hover">
                                    Ñ
                                </button>
                            </div>

                            {/* Teclado Third Row */}
                            <div className="keyboard_row letters_third_row">
                                <button className="keyboard_letter">
                                    <i className="bi bi-check2"></i>
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'Z')}
                                className="keyboard_letter keyboar_hover">
                                    Z
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'X')}
                                className="keyboard_letter keyboar_hover">
                                    X
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'C')}
                                className="keyboard_letter keyboar_hover">
                                    C
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'V')}
                                className="keyboard_letter keyboar_hover">
                                    V
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'B')}
                                className="keyboard_letter keyboar_hover">
                                    B
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'N')}
                                className="keyboard_letter keyboar_hover">
                                    N
                                </button>
                                <button 
                                ref={el => addToKeyRefs(el, 'M')}
                                className="keyboard_letter keyboar_hover">
                                    M
                                </button>
                                <button className="keyboard_letter">
                                    <i className="bi bi-backspace"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <div ref={incomplete_word} className="error_msg incomplete_word">No hay suficientes letras</div>
                <div ref={not_on_list} className="error_msg not_on_list">La palabra no está en la lista</div>
            </main>
        </>
    )
}

export default HomePage