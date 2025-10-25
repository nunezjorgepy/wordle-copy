import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './HomePage.css';

import WordRowComponent from "../components/WordRowComponent";

function HomePage() {
    const [row, setRow] = useState(0);
    const [searchedWord, setSearchedWord] = useState('');
    const cellsRef = useRef({})

    const getRAEword = async () => {
        /* 
        Busca en la API de la RAE una palabra de 5 caracteres. 
        */
        let fecthedWord = await axios.get('https://rae-api.com/api/random');
        while (fecthedWord.data.data.word.length !== 5) {
            fecthedWord = await axios.get('https://rae-api.com/api/random');
        }
        setSearchedWord(fecthedWord.data.data.word)
    }

    /* 
    Añade la referencia a la celda correspondiente 
    */
    const addToReds = (element, key) => {
        if (element) {
            cellsRef.current[key] = element
        }
    }

    const newGame = () => {
        /* 
        Esta función reinciará el juego cuando sepa bien cómo ahcerlo 
        */
        console.log('El botón debería reiniciar el juego')
        getRAEword()
    }

    useEffect(() => {
        // Busca una palabra SOLAMENTE en el primer renderizado
        getRAEword()
    }, [])

    console.log('searchedWord is now: ' + searchedWord);
    console.log(cellsRef)

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
            </main>
        </>
    )
}

export default HomePage