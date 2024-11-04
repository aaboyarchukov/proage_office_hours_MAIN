import styles from '@/styles/Header.module.css'
import { useRouter } from 'next/router'
const Header = (props) => {
    const router = useRouter()
    return (
        <header className={styles.header}>
            {router.pathname !== '/' && <BackButton />}
            {/* <div className={styles.divide} /> */}
            <h1 className={styles.title}>{props.text}</h1>
            {/* <div className={styles.divide} /> */}
        </header>
    )
}
export default Header


function BackButton() {
    const router = useRouter()
    return (
        <div className={styles.backButton}>
            <button className={styles.button} onClick={() => router.back()}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_402_2)">
                        <path d="M28.0004 10.0001C28.4677 9.99921 28.9206 10.162 29.2804 10.4601C29.4829 10.628 29.6503 10.8342 29.773 11.0669C29.8957 11.2996 29.9713 11.5542 29.9955 11.8162C30.0196 12.0781 29.9918 12.3423 29.9138 12.5935C29.8357 12.8447 29.7088 13.078 29.5404 13.2801L20.5804 24.0001L29.2204 34.7401C29.3865 34.9447 29.5106 35.1801 29.5854 35.4328C29.6603 35.6854 29.6845 35.9504 29.6566 36.2125C29.6287 36.4745 29.5493 36.7285 29.423 36.9598C29.2966 37.1911 29.1258 37.3951 28.9204 37.5601C28.7135 37.7422 28.4711 37.8795 28.2086 37.9635C27.9461 38.0475 27.669 38.0763 27.3948 38.0481C27.1207 38.02 26.8552 37.9354 26.6153 37.7998C26.3753 37.6642 26.166 37.4805 26.0004 37.2601L16.3404 25.2601C16.0462 24.9023 15.8854 24.4534 15.8854 23.9901C15.8854 23.5269 16.0462 23.078 16.3404 22.7201L26.3404 10.7201C26.541 10.4781 26.7959 10.2868 27.0843 10.1617C27.3727 10.0366 27.6866 9.98122 28.0004 10.0001Z" fill="#231F20" />
                    </g>
                    <defs>
                        <clipPath id="clip0_402_2">
                            <rect width="48" height="48" fill="white" />
                        </clipPath>
                    </defs>
                </svg>

            </button>
        </div>
    )
}