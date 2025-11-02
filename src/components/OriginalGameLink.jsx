

function OriginalGameLink() {
    return (
        <div className="original_game_container">
            <div className="original_text">
                Este juego es una copia de
            </div>
            <div className="original_wordle_letters">
                <div className="original_wordle_letter right_place">W</div>
                <div className="original_wordle_letter right_letter">o</div>
                <div className="original_wordle_letter wrong_letter">r</div>
                <div className="original_wordle_letter right_place">d</div>
                <div className="original_wordle_letter right_letter">l</div>
                <div className="original_wordle_letter wrong_letter">E</div>
            </div>
            <div className="original_text">
                Para jugar al original entra <a href="https://lapalabradeldia.com/">acá</a>
            </div>
        </div>
    )
}

export default OriginalGameLink