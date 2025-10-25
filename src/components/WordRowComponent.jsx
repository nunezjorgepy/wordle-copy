

function WordRowComponent(props) {
    const { row, addToReds } = props;
    const cells = [
        row+'0',
        row+'1',
        row+'2',
        row+'3',
        row+'4',
    ]


    const HTMLLetters = cells.map((item) => {
        if (item === '00') {
            return (
                <div ref={el => addToReds(el, item)} key={item} className="letter current_cell"></div>
            )
        }
        return (
            <div ref={el => addToReds(el, item)} key={item} className="letter"></div>
        )
    })

    return (
        <div className={`row${row} word`}>
            {HTMLLetters}
        </div>
    )
}

export default WordRowComponent