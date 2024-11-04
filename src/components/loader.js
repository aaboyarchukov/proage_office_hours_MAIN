import styles from "@/styles/Loader.module.css"
function Loader() {
    return (
        <div className={styles.loader}>
            <img src="/Gear.gif" alt="loader" />
        </div>
    )
}

export default Loader