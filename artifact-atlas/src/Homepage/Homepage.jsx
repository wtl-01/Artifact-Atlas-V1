import styles from './Homepage.module.css';
import loading from '../assets/loading.gif';

function Homepage({ onStart, isLoading }) {
    return (
        <div className={styles.home}>
            <p className={styles.tagline}>Identify ancient artefacts from around the world</p>
            <button className={styles.start_button} onClick={onStart} disabled={isLoading}>
                {isLoading ? <img src={loading} alt="Loading..." className={styles.loadingIcon} /> : 'Play'}
            </button>
        </div>
    );
}

export default Homepage;
