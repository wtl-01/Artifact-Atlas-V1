import chinese_vase from '../assets/Chinese_vase.jpg'
import styles from './Gamescreen.module.css'
import HistorySlider from '../../HistorySlider/HistorySlider.jsx'

function Gamescreen() {

 return (
    <div className={styles.game_ui}>
        <img src={chinese_vase} className={styles.image}>
        </img>
        <div className={styles.selectors}>
            <HistorySlider></HistorySlider>
            <div className={styles.buttons}>
                <button className={styles.game_button}>
                    Submit
                </button>
                <button className={styles.game_button}>
                    Forfeit
                </button>
                <button className={styles.game_button}>
                    Home
                </button>
            </div>
        </div>
        <div className={styles.guesses}>
            <ul className={styles.guess_list}>
                <li><div className={styles.guess}>Guess 1</div></li>
                <li><div className={styles.guess}>Guess 2</div></li>
                <li><div className={styles.guess}>Guess 3</div></li>
                <li><div className={styles.guess}>Guess 4</div></li>
                <li><div className={styles.guess}>Guess 5</div></li>
            </ul>
        </div>
    </div>
 )
}

export default Gamescreen