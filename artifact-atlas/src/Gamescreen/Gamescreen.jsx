import chinese_vase from '../assets/Chinese_vase.jpg'

function Gamescreen() {
 return (
    <div className='game_ui'>
        <img src={chinese_vase}>
        </img>
        <div>
            <button>
                Submit
            </button>
            <button>
                Forfeit
            </button>
            <button>
                Home
            </button>
        </div>
        <div>
            <ul>
                <li>Guess 1</li>
                <li>Guess 2</li>
                <li>Guess 3</li>
                <li>Guess 4</li>
                <li>Guess 5</li>
            </ul>
        </div>
    </div>
 )
}

export default Gamescreen