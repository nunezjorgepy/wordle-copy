

function KeyBoardRowComponent(props) {
    const { letters, addToKeyRefs, row } = props;

    const HTMLLetters = letters.map((letter) => {
        return (
            <button 
            ref={el => addToKeyRefs(el, letter)} 
            className="keyboard_letter keyboar_hover"
            key={`letter_${letter}`}>
                {letter}
            </button>
        )
    })

    return (
        <div className="keyboard_row letters_first_row">
            {row === 3 && <button className="keyboard_letter keyboar_hover">
                                <i className="bi bi-check2"></i>
                            </button>}

            {HTMLLetters}
            
            {row === 3 && <button className="keyboard_letter keyboar_hover">
                                <i className="bi bi-backspace"></i>
                            </button>}
        </div>
    )
}

export default KeyBoardRowComponent