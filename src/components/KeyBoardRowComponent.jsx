
function KeyBoardRowComponent(props) {
    const { letters, addToKeyRefs, onLetterPress, onEnterPress, onBackspacePress, enterRef, backspaceRef, row } = props;

    const HTMLLetters = letters.map((letter) => {
        /* Agrega todas las letras al useRef */
        return (
            <button 
            ref={el => addToKeyRefs(el, letter)} 
            className="keyboard_letter keyboar_hover"
            key={`letter_${letter}`}
            onClick={() => onLetterPress(letter)}>
                {letter}
            </button>
        )
    })

    return (
        <div className="keyboard_row letters_first_row">
            {/* Este botón se muestra sólo en la fila 3 */}
            {row === 3 && <button ref={enterRef} className="keyboard_letter keyboar_hover" onClick={() => onEnterPress()}>
                                <i className="bi bi-check2"></i>
                            </button>}

            {HTMLLetters}
            
            {/* Este botón se muestra sólo en la fila 3 */}
            {row === 3 && <button ref={backspaceRef} className="keyboard_letter keyboar_hover" onClick={() => onBackspacePress()}>
                                <i className="bi bi-backspace"></i>
                            </button>}
        </div>
    )
}

export default KeyBoardRowComponent