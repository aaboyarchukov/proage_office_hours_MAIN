import Image from "next/image";
import styles from "@/styles/ModuleCard.module.css";
const ModuleCard = (props) => {
    return (
        <div onClick={() => props.onClick(props.id, props.name)} className={styles.ModuleCard}>
            <div className={styles.ModuleCard__img}>
                <Image width={200} height={200} src={props.img || 'https://via.placeholder.com/200x200.jpeg?text=+'} alt={props.name} />
            </div>
        </div>
    );
}
export default ModuleCard;