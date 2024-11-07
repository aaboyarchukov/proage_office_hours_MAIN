import Header from "@/components/header"
import styles from "@/styles/TimeSlot.module.css"
import {useEffect, useState} from "react";
import getOfficeHours from "@/libs/getOfficeHours";
import useSWR from "swr";
import {useRouter} from "next/router";
import useLocalStorageState from 'use-local-storage-state'
import Loader from '@/components/loader'
import allPossibleSlots from "@/libs/allPossibleSlots";
import Popup from "@/components/popup";
import PopupInfo from "@/components/popupInfo";

const TimeSlot = () => {
    const router = useRouter();
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const [selectedTeacher, setSelectedTeacher] = useLocalStorageState('teacher', {
        defaultValue: {username: "", id : 1}
    });
    const [selectedModule, setSelectedModule] = useLocalStorageState('module', {
        defaultValue: {id: 1, name: "Модуль 1"}
    });
    const [userID, setUserID] = useLocalStorageState('userID', {
        defaultValue: 99
    });
    const [isAvailable, setAvailable] = useState(false);
     const [openPopupInfo, setOpenPopupInfo] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const {data, error} = useSWR(`https://pro-age.ru:3000/officehours/slots/${selectedModule.id}`, fetcher);
    const [correctDay, setCorrectDay] = useState("");
    const [correctData, setCorrectData] = useState();
    const [calendar, setCalendar] = useState();
    const [correctMonth, setCorrectMonth] = useState();
    const [selectedId, setSelectedId] = useLocalStorageState('slotID');
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [webApp, setWebApp] = useState();

    useEffect(() => {
        const fetchData = async () => {
            if (data) {
                console.log(selectedTeacher.username, "selectedTeacher");
                let info;
                if (router.query.type === "suggestions") {
                    info = await allPossibleSlots(selectedTeacher,selectedModule);
                } else {
                    info = getOfficeHours(data.slots, selectedTeacher.username);
                }
                setCalendar(info);
                console.log(data);
                // find closest day with classes
                for (const key in info) {
                    if (info[key].date.haveClass) {
                        setCorrectDay(key);
                        setCorrectData(info[key]);
                        break;
                    }
                }
            }
        };

        fetchData();
    }, [data, selectedTeacher.username, selectedModule.name, router.query.type]);

    useEffect(() => {
        if (calendar && correctMonth === undefined) {
            const month = calendar[Object.keys(calendar)[0]].date.month;
            setCorrectMonth(month);
        }
    }, [calendar, correctMonth])

    useEffect(() => {
        if (correctData) {
            const month = correctData.date.month;
            setCorrectMonth(month);
        }
        console.log(correctData);
    }, [correctData])


    useEffect(() => {
        if (!userID) return;
        fetchAvailable().then((res) => {
            res.subscriptions.at(-1).remaining_office_hours > 0 ? setAvailable(true) : setAvailable(false);
        })
    }, [userID])

    async function fetchAvailable() {
        return await (await fetch(`https://pro-age.ru:3000/subscription/${userID}`)).json();
    }


    function handleClickDay(iden) {
        setCorrectDay(iden);
        setCorrectData(calendar[iden]);
        console.log("done");
    }

    function handleClickTime(slots) {
        if (router.query.type === 'suggestions') {
            const newSelectedTimes = [...selectedTimes];
            console.log(newSelectedTimes);
            console.log(slots);
            slots.forEach(slot => {
                const index = newSelectedTimes.indexOf(`${slot.day} ${slot.time}`);
                if (index !== -1) {
                    newSelectedTimes.splice(index, 1);
                } else if (newSelectedTimes.length < 10) {
                    newSelectedTimes.push(`${slot.day} ${slot.time}`);
                }
            });
            setSelectedTimes(newSelectedTimes);
        } else {
            if (slots.length === 1) {
                setSelectedId(slots[0].id.toString());
                router.push(`/submit`);
            } else {
                const slotIds = slots.map(slot => slot.id);
                router.push({
                    pathname: `/teachers`,
                    query: {slots: JSON.stringify(slotIds)},
                });
            }
        }
    }

    function handleSelectedTimeSlotSuggest() {
        if (isAvailable) {
            const newSelectedTimes = [...selectedTimes];

            try {
                const currentYear = new Date().getFullYear();
                if (newSelectedTimes.length < 5){
                    setOpenPopupInfo(true);
                } else {
                    const convertedTimeSlots = newSelectedTimes.map(slot => {
                        const [date, time] = slot.split(" ");
                        let [month, day] = date.split("-");
                        if (month.length === 1) {
                            month = "0" + month;
                        }
                        const [hour, minute] = time.split(":");

                        const timezoneOffsetInMinutes = new Date().getTimezoneOffset();

                        // Конвертируем локальное время в UTC
                        const utcDate = new Date(Date.UTC(currentYear, month, day, hour, minute) + timezoneOffsetInMinutes * 60000);
                        const utcTimeString = utcDate.toISOString().slice(0, 19).replace("T", " ");

                        return utcTimeString;
                    });

                    const timeSlots = convertedTimeSlots.join("/");
                    console.log(`suggest|${selectedTeacher.id}|${selectedModule.name}|${timeSlots}`);
                    console.log(new TextEncoder().encode(`suggest|${selectedTeacher.id}|${selectedModule.name}|${timeSlots}`).length )
                    const webApp = window.Telegram.WebApp;
                    webApp.sendData(`suggest|${selectedTeacher.id}|${selectedModule.name}|${timeSlots}`);
                }
            } catch (error) {
                console.error("Ошибка при обработке временных слотов:", error);
            }
        } else {
            setOpenPopup(true);
        }
    }


    function handleTimeSlotSuggest() {
        console.log('handleTimeSlotSuggest')
        router.push({
            pathname: '/teachers',
            query: {type: "suggestions"}
        })
    }

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcOffset = new Date().toLocaleTimeString('en', {
        timeZone: userTimeZone,
        timeZoneName: 'short'
    }).split(' ')[2];
    const localTimeInfo = `Время местное (${utcOffset})`;


    if (!calendar) return <Loader/>
    return (
        <>
            <Header text={`Дата и время`}/>
            <main className={styles.main}>
                <div className={styles.contentWrapper}>
                    <div>
                        <div className={styles.month}>{correctMonth}</div>
                        <div className={styles.calendar}>
                            {calendar && Object.keys(calendar).map((key, index) => {
                                const day = calendar[key];
                                return (
                                    <CalendarDay correctDay={correctDay} onClick={handleClickDay} key={key}
                                                 kIdentify={key}
                                                 dayOfWeek={day.date.dayOfWeek} day={day.date.day}
                                                 isHoliday={day.date.isHoliday} haveClass={day.date.haveClass}
                                                 fullInfo={day}/>
                                )
                            })}
                        </div>

                        <div className={styles.timezoneInfo}>
                            <p>{localTimeInfo}</p>
                        </div>
                        <div className={styles.timepicker}>
                            {correctData && Object.entries(correctData.timeSlots).map(([phase, slots]) => (
                                slots.length !== 0 &&
                                <div className={styles.timepicker__phase} key={phase}>
                                    <div className={styles.timepicker__phase__name}>{phase}</div>
                                    <div className={styles.timepicker__phase__timeSlot}>
                                        {slots.map((el, index) => {
                                            const isSelected = selectedTimes.includes(`${el.day} ${el.time}`);
                                            return (
                                                <button onClick={() => handleClickTime(el.slots)} key={index}
                                                        className={`${styles.timepicker__phase__timeSlot__time} ${isSelected && styles.selectedTime}`}>{el.time}</button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {router.query.type !== "suggestions" &&
                    <div className={styles.suggestButton}>
                        <button onClick={() => handleTimeSlotSuggest()} className={styles.suggestButton__button}>
                            Предложить слот
                        </button>
                    </div>
                }
                {router.query.type === "suggestions" &&
                    <div className={styles.suggestButton}>
                        <button onClick={() => handleSelectedTimeSlotSuggest()}
                                className={styles.suggestButton__button}>
                            Подтвердить
                        </button>
                    </div>
                }
                <Popup isOpen={openPopup} setIsOpen={setOpenPopup}/>
                <PopupInfo isOpen={openPopupInfo} setIsOpen={setOpenPopupInfo}/>
            </main>
        </>
    );
}

export default TimeSlot;


function CalendarDay(props) {
    const [isPressed, setIsPressed] = useState(props.correctDay == props.kIdentify ? true : false);
    useEffect(() => {
        setIsPressed(props.correctDay == props.kIdentify ? true : false);
    }, [props.correctDay])
    return (
        <button onClick={() => props.onClick(props.kIdentify)} disabled={!props.haveClass}
                className={`${styles.calendar__day} ${isPressed ? styles.calendar__day__active : ""} ${props.isHoliday == true ? styles.colendar__day__holiday : ""} `}>
            <div>{props.dayOfWeek}</div>
            <div>{props.day}</div>
        </button>
    )
}
