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
    const incomplete_word = useRef(null);
    const not_on_list = useRef(null);

    const getRAEword = async () => {
        /* 
        Busca en la API de la RAE una palabra de 5 caracteres. 
        */
        let fecthedWord = await axios.get('https://rae-api.com/api/random');
        while (fecthedWord.data.data.word.length !== 5) {
            fecthedWord = await axios.get('https://rae-api.com/api/random');
        }
        setSearchedWord(fecthedWord.data.data.word.toUpperCase());
    }

    /* 
    Añade la referencia a la celda correspondiente 
    */
    const addToReds = (element, key) => {
        if (element) {
            cellsRef.current[key] = element
        }
    }

    /* 
    Error message function
    */
    const showErrorMsg = (ref) => {
        ref.current.classList.add('error_animation');
        setTimeout(() => {
            ref.current.classList.remove('error_animation');
        }, 3000)
    }

    /*
    New Game Funciton
    */
    const newGame = () => {
        getRAEword();
    }


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
                showErrorMsg(incomplete_word)
                return
            }

            /* If the word doesn't exist */
            try {
                const foundWord = await axios.get(`https://rae-api.com/api/words/${chosenWord}`);
            } catch (error) {
                showErrorMsg(not_on_list)
                return
            }
            
            if (searchedWord === chosenWord) {
                for (let i = 0; i < 5; i++){
                    cellsRef.current[`${row}${i}`].classList.add('right_place');
                    setPlaying(false);
                    setChosenWord('');
                }
            }
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

        /* console.log('chosenWord is now: ' , chosenWord);
        console.log('row: ' , row, 'cell: ', cell); */
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
                        <button className="new_game_btn" onClick={() => newGame()}>Nueva Palabra</button>

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
                                <button className="keyboard_letter">Q</button>
                                <button className="keyboard_letter">W</button>
                                <button className="keyboard_letter">E</button>
                                <button className="keyboard_letter">R</button>
                                <button className="keyboard_letter">T</button>
                                <button className="keyboard_letter">Y</button>
                                <button className="keyboard_letter">U</button>
                                <button className="keyboard_letter">I</button>
                                <button className="keyboard_letter">O</button>
                                <button className="keyboard_letter">P</button>
                            </div>

                            {/* Teclado Second Row */}
                            <div className="keyboard_row letters_second_row">
                                <button className="keyboard_letter">A</button>
                                <button className="keyboard_letter">S</button>
                                <button className="keyboard_letter">D</button>
                                <button className="keyboard_letter">F</button>
                                <button className="keyboard_letter">G</button>
                                <button className="keyboard_letter">H</button>
                                <button className="keyboard_letter">J</button>
                                <button className="keyboard_letter">K</button>
                                <button className="keyboard_letter">L</button>
                                <button className="keyboard_letter">Ñ</button>
                            </div>

                            {/* Teclado Third Row */}
                            <div className="keyboard_row letters_third_row">
                                <button className="keyboard_letter">
                                    <i className="bi bi-check2"></i>
                                </button>
                                <button className="keyboard_letter">Z</button>
                                <button className="keyboard_letter">X</button>
                                <button className="keyboard_letter">C</button>
                                <button className="keyboard_letter">V</button>
                                <button className="keyboard_letter">B</button>
                                <button className="keyboard_letter">N</button>
                                <button className="keyboard_letter">M</button>
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