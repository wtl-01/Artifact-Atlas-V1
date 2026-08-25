import styles from './Homepage.module.css';
import loading from '../assets/loading.gif';
import vase from '../assets/chinese_vase.png';
import ushebti from '../assets/egyptian.png';
import mayan from '../assets/mayan.png';

function Homepage({ onStart, isLoading }) {
    return (
        <div className={styles.home}>

            <p className={styles.tagline}>SINGLEPLAYER</p>

            <div className={styles.imageContainer}>
                <img src={ushebti.src} alt="Egyptian Artifact" className={styles.ushebtiImage} />
                <img src={vase.src} alt="Chinese Vase" className={styles.vaseImage} />
                <img src={mayan.src} alt="Mayan Artifact" className={styles.mayanImage} />
            </div>

            <p className={styles.tagline}>IDENTIFY ARTIFACTS FROM AROUND THE WORLD!</p>

            <button className={styles.start_button} onClick={onStart} disabled={isLoading}>
                {isLoading ? <img src={loading.src} alt="Loading..." className={styles.loadingIcon} /> : 'PLAY'}
            </button>
        </div>
    );
}

export default Homepage;
