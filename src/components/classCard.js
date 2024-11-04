import Image from "next/image";
import styles from "../styles/ClassCard.module.css";
import { dateformat } from "../libs/dateformat";

const ClassCard = (props) => {
    return (
        <div className={styles["class-card"]}>
            <div className={styles["class-card__info"]}>
                <div className={styles["class-card__info__container"]}>
                    <div>
                        <div className={styles["class-card__info__date"]}>{dateformat(props.dateTime).day}</div>
                        <div className={styles["class-card__info__time"]}>{dateformat(props.dateTime).time}</div>
                        <div className={styles["class-card__info__teacher"]}>{props.teacher.name.split(" ")[1]}</div>
                    </div>
                    <div className={styles["class-card__info__name"]}>{props.module}</div>
                </div>
                <div className={styles.classCard__container}>
                    {props.type === 1 ? <CancelButton id={props.id} dateTime={props.dateTime} onClick={props.onClick}/> :
                        <RecordButton webApp={props.webApp} recording={props.recordingData}/>}
                </div>
            </div>
            <div className={styles["class-card__info__image"]}>
                <Image src={props.teacher.icon} alt={props.teacher.name} width={100} height={100}/>
            </div>
        </div>
    );
};

export default ClassCard;

const CancelButton = (props) => {
    const currentTime = new Date();
    const oneHourInMilliseconds = 3 * 60 * 60 * 1000;
    console.log(props);

    const isWithinOneHour = () => {
        console.log("isWithinOneHour " + new Date(props.dateTime) + " "  + currentTime);
        return props.dateTime && ((new Date(props.dateTime) - currentTime) < oneHourInMilliseconds);
    };

    return (
        <button
            onClick={async () => {
                if (!isWithinOneHour()) {
                    await props.onClick(props.id);
                }
            }}
            className={styles["class-card__btn"]}
            disabled={isWithinOneHour()}
        >
            ОТМЕНИТЬ
        </button>
    );
};

const RecordButton = (props) => {
    console.log(props);
    return (
        <button disabled={props.recording == null} onClick={() => props.webApp.sendData(`video|${props.recording}`)}
                className={styles["class-card__btn"]}>ЗАПИСЬ</button>
    );
};
