import chinese_vase from '../assets/Chinese_vase.jpg'
import styles from './Gameselectors.module.css'
import HistorySlider from '../HistorySlider/HistorySlider.jsx'
import React, { useState, useMemo } from 'react';
import ReactFlagsSelect from "react-flags-select";


function Gameselectors({status, setGameStatus}) {
    
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

    //This is the hook to set the country the user selects
    const [selectedCountry, setSelectedCountry] = useState("");

    //This is the state (year) value we pass to the child HistorySlider component as props
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    console.log(selectedCountry)
    console.log(selectedYear)


    //API call to submit a guess for evaluation (right/wrong)
    const handleSubmit = async () => {
        // 1. First lets handle the API call
        try {
            const response = await fetch('http://localhost:3001/api/game/gameid/guess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    country: selectedCountry,
                    year: selectedYear
                })
            })
        }
        catch (error) {
            console.log(error)
        }

        // 2. Second lets handle the frontend UI portion, this will update the guess list

    }

    //API call to give up, this will display the answer and render the page to have a next button
    const handleForfeit = async () => {
        //1. First lets handle the API call
        try {
            const response = await fetch('https://localhost:8888/gameid/forfeit', {
                method: 'POST'
            })
        }
        catch (error) {
            console.log(error)
        }

        //2. Then lets handle the frontend UI portion
    }

    return (
            <div className={styles.selectors}>
                <div className={styles.countryselector}>
                    <ReactFlagsSelect
                    selected={selectedCountry}
                    onSelect={(code) => setSelectedCountry(code)}
                    selectButtonClassName={styles.flagSelectButton}
                    customLabels={{
                        BN: "Brunei",
                        TL: "East Timor",
                        SZ: "Eswatini",
                        GY: "Guyana",
                        MK: "North Macedonia",
                        VC: "Saint Vincent and the Grenadines",
                        VA: "Vatican City",
                        BO: "Bolivia",
                        VN: "Vietnam",
                        IR: "Iran",
                        CZ: "Czech Republic",
                        CD: "Congo (Democratic Republic)",
                        CG: "Congo (Republic)",
                        CV: "Cabo Verde",
                        LA: "Laos",
                        FM: "Micronesia",
                        MD: "Moldova",
                        PS: "Palestine",
                        ST: "São Tomé and Príncipe",
                        VE: "Venezuela"
                    }}
                    placeholder="Select Country"
                    searchable />
                </div>
                <HistorySlider
                    value={selectedYear}
                    onYearChange={setSelectedYear}
                    className={styles.historySlider}>
                </HistorySlider>
                <div className={styles.buttons}>
                    <button className={styles.game_button}>
                        Submit
                    </button>
                    <button className={styles.game_button} onClick={() => setGameStatus("lost")}>
                        Forfeit
                    </button>
                </div>
            </div>
    )
}

export default Gameselectors