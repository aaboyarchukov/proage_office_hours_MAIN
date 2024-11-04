import useUserID from "@/hooks/useUserID";
import useUserHistory from "@/hooks/useUserHistory";
import useSlotID from "@/hooks/useSlotID";
import useSlotInfo from "@/hooks/useSlotInfo";
import useBookingSlot from "@/hooks/useBookingSlot";

import Loader from '@/components/loader'

import Header from "@/components/header";
import styles from "@/styles/Submit.module.css"

import {useState, useEffect} from "react";


import Image from "next/image";
import Link from "next/link";
import Router from "next/router";

function OfferSubmit() {
    const userID = useUserID();
    const [history, loadingHistory, error] = useUserHistory(userID);
    const [submitState, setSubmitState] = useState("new");
    const [question, setQuestion] = useState("");

    const [data, loadingOrder, errorOrder, book, cancel] = useBookingSlot();


    const [slotID, setSlotID] = useSlotID();
    const [slotInfo, setData, loadingInfo, findSlot] = useSlotInfo(1);

    useEffect(() => {
        if (!userID) return;
        if (!loadingHistory && !error) {
            // find module id 1 in history
            const modu = history.planned.filter((item) => {
                return item.module == "Ознакомительный";
            });
            console.log("modu check", modu)
            // if found, redirect to submit
            if (modu.length > 0) {
                setSubmitState("cancel");
                setData(modu[0]);
            }
        }
    }, [userID, history, loadingHistory, error, slotInfo])

    useEffect(() => {
        if (!slotID) return;
        console.log("init done");
        console.log(slotID);
        if (!loadingInfo && !error) {
            console.log("find slot");
            findSlot(slotID);
        }

    }, [slotID, loadingInfo, error])


    function handleSubmit() {
        if (submitState == "new") {
            console.log("new");
            console.log(slotID, userID, question);
            const response = book(slotID, userID, question);
            console.log(response);
            setSubmitState("cancel");
        }
        if (submitState == "cancel") {
            const response = cancel(slotID, userID);
            console.log(response);
            Router.push("/offer/timeSlot");

        }
    }

    if (loadingHistory || loadingOrder || loadingInfo) {
        return <Loader/>
    }

    if (submitState == "new") {
        return (
            <>
                <Header text="Проверка записи"/>
                <main>
                    <div className={styles.teacherSubmit__container}>
                        <h2 className={styles.submit__title}>Преподаватель</h2>
                        {slotInfo && <TeacherSubmitCard teacher={slotInfo.teacher}/>}
                    </div>
                    <div className={styles.timeSubmit__container}>
                        <h2 className={styles.submit__title}>Дата и время</h2>
                        {slotInfo && <TimeSubmitCard submitState={submitState} date={slotInfo.datetime}/>}
                    </div>
                    <div className={styles.question__container}>
                        <h2 className={styles.submit__title}>Какие вопросы наставнику?</h2>
                        <input type="text" onChange={(e) => setQuestion(e.target.value)}
                               className={styles.question__textarea} placeholder="Напишите здесь свой вопрос"/>
                    </div>

                    <p style={{marginBottom: '10px', marginTop: '30px'}}>
                        Занятие можно отменить за <span style={{fontWeight: 'bold'}}>3 часа</span> до его начала, нажав на
                        кнопку <span style={{fontWeight: 'bold'}}>Отменить</span> в главном меню. Если ученик не присутствует на занятии, и оно не было отменено, то занятие считается проведенным.
                    </p>

                    <div className={styles.submit__end}>
                        <button onClick={async () => handleSubmit()} className={styles.submit__button}>Подтвердить
                        </button>
                    </div>


                </main>
            </>
        )
    }

    if (submitState == "cancel") {
        return (
            <>
                <Header text="Проверка записи"/>
                <main>
                    <div className={styles.teacherSubmit__container}>
                        <h2 className={styles.submit__title}>Преподаватель</h2>
                        {slotInfo && <TeacherSubmitCard teacher={slotInfo.teacher}/>}
                    </div>
                    <div className={styles.timeSubmit__container}>
                        <h2 className={styles.submit__title}>Дата и время</h2>
                        {slotInfo && <TimeSubmitCard date={slotInfo.datetime}/>}
                    </div>
                    <div className={styles.submit__end}>
                        <button onClick={async () => handleSubmit()} className={styles.submit__button}>Отменить</button>
                    </div>

                </main>
            </>
        )
    }


    return (
        <>
            <div>
                <Loader/>
            </div>
        </>
    )
}

function NewSubmit() {

}

function CancelSubmit() {

}

function TimeSubmitCard(props) {
    const [dateString, setDateString] = useState()
    const [timeString, setTimeString] = useState()
    useEffect(() => {
        if (props.date) {
            const date = new Date(props.date)
            // format: day month dayOfMonth
            const dateString = date.toLocaleDateString("ru-RU", {weekday: "long", month: "long", day: "numeric"})
            // format: hours:minutes
            const timeString = date.toLocaleTimeString("ru-RU", {hour: "numeric", minute: "numeric"})
            setDateString(dateString)
            setTimeString(timeString)
        }
    }, [props])
    return (
        <div className={styles.timeSubmitCard}>
            <div className={styles.timeSubmitCard__container}>
                <div className={styles.timeSubmitCard__date}>{dateString}</div>
                <div className={styles.timeSubmitCard__time}>{timeString}</div>
                <div className={styles.timeSubmitCard__duration}>длительность: 1 час</div>
                <div className={styles.timeSubmitCard__course}>{"Ознакомительный"}</div>
            </div>
            {props.submitState == "new" &&
                <Link className={styles.timeSubmitCard__icon} href={"/offer/timeSlot"}><EditIcon/></Link>}
        </div>
    )
}

function TeacherSubmitCard({teacher}) {
    return (
        <div className={styles.teacherSubmitCard}>
            <div className={styles.TeacherSubmitCard__image}>
                <Image width={65} height={65} src={teacher.icon} alt={teacher.name}/>
            </div>
            <div className={styles.TeacherSubmitCard__container}>
                <div className={styles}>
                    <h3 className={styles.TeacherSubmitCard__name}>{teacher.name.split(" ")[1]}</h3>
                    <p className={styles.TeacherSubmitCard__position}>{teacher.position}</p>
                </div>
                <div className={styles.TeacherSubmitCard__social}>
                    <div className={styles.TeacherSubmitCard__social__telegram}><TelegramIcon/>{teacher.username}</div>
                </div>
            </div>
        </div>
    )
}

function EditIcon(props) {
    return (
        <svg width="15" height="15" {...props} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12.1464 1.14645C12.3417 0.951184 12.6583 0.951184 12.8535 1.14645L14.8535 3.14645C15.0488 3.34171 15.0488 3.65829 14.8535 3.85355L10.9109 7.79618C10.8349 7.87218 10.7471 7.93543 10.651 7.9835L6.72359 9.94721C6.53109 10.0435 6.29861 10.0057 6.14643 9.85355C5.99425 9.70137 5.95652 9.46889 6.05277 9.27639L8.01648 5.34897C8.06455 5.25283 8.1278 5.16507 8.2038 5.08907L12.1464 1.14645ZM12.5 2.20711L8.91091 5.79618L7.87266 7.87267L8.12731 8.12732L10.2038 7.08907L13.7929 3.5L12.5 2.20711ZM9.99998 2L8.99998 3H4.9C4.47171 3 4.18056 3.00039 3.95552 3.01877C3.73631 3.03668 3.62421 3.06915 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3.06915 3.62421 3.03669 3.73631 3.01878 3.95552C3.00039 4.18056 3 4.47171 3 4.9V11.1C3 11.5283 3.00039 11.8194 3.01878 12.0445C3.03669 12.2637 3.06915 12.3758 3.10899 12.454C3.20487 12.6422 3.35785 12.7951 3.54601 12.891C3.62421 12.9309 3.73631 12.9633 3.95552 12.9812C4.18056 12.9996 4.47171 13 4.9 13H11.1C11.5283 13 11.8194 12.9996 12.0445 12.9812C12.2637 12.9633 12.3758 12.9309 12.454 12.891C12.6422 12.7951 12.7951 12.6422 12.891 12.454C12.9309 12.3758 12.9633 12.2637 12.9812 12.0445C12.9996 11.8194 13 11.5283 13 11.1V6.99998L14 5.99998V11.1V11.1207C14 11.5231 14 11.8553 13.9779 12.1259C13.9549 12.407 13.9057 12.6653 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.6653 13.9057 12.407 13.9549 12.1259 13.9779C11.8553 14 11.5231 14 11.1207 14H11.1H4.9H4.87934C4.47686 14 4.14468 14 3.87409 13.9779C3.59304 13.9549 3.33469 13.9057 3.09202 13.782C2.7157 13.5903 2.40973 13.2843 2.21799 12.908C2.09434 12.6653 2.04506 12.407 2.0221 12.1259C1.99999 11.8553 1.99999 11.5231 2 11.1207V11.1206V11.1V4.9V4.87935V4.87932V4.87931C1.99999 4.47685 1.99999 4.14468 2.0221 3.87409C2.04506 3.59304 2.09434 3.33469 2.21799 3.09202C2.40973 2.71569 2.7157 2.40973 3.09202 2.21799C3.33469 2.09434 3.59304 2.04506 3.87409 2.0221C4.14468 1.99999 4.47685 1.99999 4.87932 2H4.87935H4.9H9.99998Z"
                fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
        </svg>
    )
}

function TelegramIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="15px" height="15px">
            <path
                d="M 25.154297 3.984375 C 24.829241 3.998716 24.526384 4.0933979 24.259766 4.2011719 C 24.010014 4.3016357 23.055766 4.7109106 21.552734 5.3554688 C 20.048394 6.0005882 18.056479 6.855779 15.931641 7.7695312 C 11.681964 9.5970359 6.9042108 11.654169 4.4570312 12.707031 C 4.3650097 12.746607 4.0439208 12.849183 3.703125 13.115234 C 3.3623292 13.381286 3 13.932585 3 14.546875 C 3 15.042215 3.2360676 15.534319 3.5332031 15.828125 C 3.8303386 16.121931 4.144747 16.267067 4.4140625 16.376953 C 5.3912284 16.775666 8.4218473 18.015862 8.9941406 18.25 C 9.195546 18.866983 10.29249 22.222526 10.546875 23.044922 C 10.714568 23.587626 10.874198 23.927519 11.082031 24.197266 C 11.185948 24.332139 11.306743 24.45034 11.453125 24.542969 C 11.511635 24.579989 11.575789 24.608506 11.640625 24.634766 L 11.644531 24.636719 C 11.659471 24.642719 11.67235 24.652903 11.6875 24.658203 C 11.716082 24.668202 11.735202 24.669403 11.773438 24.677734 C 11.925762 24.726927 12.079549 24.757812 12.216797 24.757812 C 12.80196 24.757814 13.160156 24.435547 13.160156 24.435547 L 13.181641 24.419922 L 16.191406 21.816406 L 19.841797 25.269531 C 19.893193 25.342209 20.372542 26 21.429688 26 C 22.057386 26 22.555319 25.685026 22.875 25.349609 C 23.194681 25.014192 23.393848 24.661807 23.478516 24.21875 L 23.478516 24.216797 C 23.557706 23.798129 26.921875 6.5273437 26.921875 6.5273438 L 26.916016 6.5507812 C 27.014496 6.1012683 27.040303 5.6826405 26.931641 5.2695312 C 26.822973 4.8564222 26.536648 4.4608905 26.181641 4.2480469 C 25.826669 4.0352506 25.479353 3.9700339 25.154297 3.984375 z M 24.966797 6.0742188 C 24.961997 6.1034038 24.970391 6.0887279 24.962891 6.1230469 L 24.960938 6.1347656 L 24.958984 6.1464844 C 24.958984 6.1464844 21.636486 23.196371 21.513672 23.845703 C 21.522658 23.796665 21.481573 23.894167 21.439453 23.953125 C 21.379901 23.91208 21.257812 23.859375 21.257812 23.859375 L 21.238281 23.837891 L 16.251953 19.121094 L 12.726562 22.167969 L 13.775391 17.96875 C 13.775391 17.96875 20.331562 11.182109 20.726562 10.787109 C 21.044563 10.471109 21.111328 10.360953 21.111328 10.251953 C 21.111328 10.105953 21.035234 10 20.865234 10 C 20.712234 10 20.506484 10.14875 20.396484 10.21875 C 18.963383 11.132295 12.671823 14.799141 9.8515625 16.439453 C 9.4033769 16.256034 6.2896636 14.981472 5.234375 14.550781 C 5.242365 14.547281 5.2397349 14.548522 5.2480469 14.544922 C 7.6958673 13.491784 12.47163 11.434667 16.720703 9.6074219 C 18.84524 8.6937992 20.838669 7.8379587 22.341797 7.1933594 C 23.821781 6.5586849 24.850125 6.1218894 24.966797 6.0742188 z"/>
        </svg>
    )
}

export default OfferSubmit;