import chinese_vase from '../assets/Chinese_vase.jpg'
import styles from './Gamescreen.module.css'
import HistorySlider from '../HistorySlider/HistorySlider.jsx'
import React, { useState, useMemo, useEffect } from 'react';
import ReactFlagsSelect from "react-flags-select";
import Gameselectors from '../Gameselectors/Gameselectors.jsx'
import Finishdisplay  from '../Finishdisplay/Finishdisplay.jsx';


function Gamescreen() {

    //we need to store 3 things in localstorage/custom hook, the image url, the game id, and the list of guesses, so when user refreshes the page they dont disappear

    //This is hook to set the current game status
    const [gameStatus, setGameStatus] = useState("active"); // possible values: "active", "won", "lost"

    //This is the list of guesses the user has made, we will use this to display the guess history on the right side of the screen, and we will also use this to determine whether the user has won or lost (after 5 guesses or correct guess)
    const [guesses, setGuesses] = useState([]); // each guess will be an object with country, year, and feedback (distance, direction, time)

    //for direction hints
    const directions = {
        N: '⬆️',
        S: '⬇️',
        E: '➡️',
        W: '⬅️',
        NW: '↖️',
        SW: '↙️ ',
        NE: '↗️',
        SE: '↘️'
    }

    //API call to start a new game session, this will get the picture etc when page loads or next game selected, and we will get the game id which we pass to gameselector
    const handleStartGame = async () => {
        // 1. First lets handle the API call
        try {
            const response = await fetch('http://localhost:3001/api/game/new', {
                method: 'POST'
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleStartGame();

        return () => {
            // Any necessary cleanup can be done here, should clear guess list so it empties when user starts a new game
        }
    }, [])


    return (
        <div className={styles.game_ui}>
            <img src={chinese_vase} className={styles.image}></img>
            {gameStatus === "active" && (<Gameselectors status={gameStatus} setGameStatus={setGameStatus}/>)}
            {(gameStatus === "won" || gameStatus === "lost") && (
                <Finishdisplay status={gameStatus} setGameStatus={setGameStatus}/>
            )}
            <div className={styles.guesses}>
                <ul className={styles.guess_list}>
                    <li><div className={styles.guess}>🇨🇦 1870 | ⬅️ 8000 km/4970.97 mi | ⏰ Ahead</div></li>
                    <li><div className={styles.guess}>🇨🇦 1870 | ⬆️ 8000 km/4970.97 mi | ⏰ Behind</div></li>
                    <li><div className={styles.guess}>🇨🇦 1870 | ⬇️ 8000 km/4970.97 mi | ⏰ Ahead</div></li>
                    <li><div className={styles.guess}>🇨🇦 1870 | ➡️ 8000 km/4970.97 mi | ⏰ Behind</div></li>
                    <li><div className={styles.guess}>🇨🇦 1870 | ⬅️ 8000 km/4970.97 mi | ⏰ Ahead</div></li>
                </ul>
            </div>
        </div>
    )
}

export default Gamescreen