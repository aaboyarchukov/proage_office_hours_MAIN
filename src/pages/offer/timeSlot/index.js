import styles from "@/styles/TimeSlot.module.css"
import { useState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/router"
import useFreeSlots from "@/hooks/useFreeSlots"
import useModuleID from "@/hooks/useModuleID"
import getOfficeHours from "@/libs/getOfficeHours"
import useSlotID from "@/hooks/useSlotID"
import Header from "@/components/header"

import Loader from '@/components/loader'

function OfferTimeSlot() {
    const router = useRouter();
    const [moduleID, setModuleID] = useModuleID();
    const [slotID, setSlotID] = useSlotID();
    const [freeSlots, loading, error] = useFreeSlots(moduleID);
    const [calendar, setCalendar] = useState();

    const [selectedDay, setSelectedDay] = useState();
    const [selectedTime, setSelectedTime] = useState();
    const [selectedMonth, setSelectedMonth] = useState();

    useEffect(() => {
        if (loading) return;
        if (error) return;
        console.log(freeSlots, "слоты");
        const info = getOfficeHours(freeSlots.slots, "");
        setCalendar(info);
        console.log(info, "информация");

        // find closest day with classes
        for (const key in info) {
            if (info[key].date.haveClass) {
                setSelectedDay(key);
                setSelectedTime(info[key]);
                break;
            }
        }
    }, [freeSlots, loading, error])

    useEffect(() => {
        if (selectedTime) {
            console.log(selectedTime, "время");
        }

        if (selectedDay) {
            console.log(selectedDay, "день");
        }

    }, [selectedDay, selectedTime])

    useEffect(() => {
        if (calendar && selectedMonth === undefined) {
            const month = calendar[Object.keys(calendar)[0]].date.month;
            setSelectedMonth(month);
        }
    }, [calendar])

    useEffect(() => {
        if (selectedTime) {
            const month = selectedTime.date.month;
            setSelectedMonth(month);
        }
    }, [selectedTime])

    function handleClickDay(iden) {
        setSelectedDay(iden);
        setSelectedTime(calendar[iden]);
    }

    function handleClickTime(iden) {
        console.log(iden);
        setSlotID(iden);
        router.push(`/offer/submit`);
    }


    if (loading) return <Loader />
    return (
        <>
            <Header text="Дата и время" />
            <main className={styles.main}>
                <div>
                    <div className={styles.month}>{selectedMonth}</div>
                    <div className={styles.calendar}>
                        {calendar && Object.keys(calendar).map((key, index) => {
                            const day = calendar[key];
                            return <CalendarDay key={key} keyIden={key} day={day.date.day} dayOfWeek={day.date.dayOfWeek} handleClickDay={handleClickDay} selectedDay={selectedDay} isHoliday={day.date.isHoliday} haveClass={day.date.haveClass} />
                        })}
                    </div>
                    <div className={styles.timepicker}>
                        {selectedTime && selectedTime.timeSlots["Утро"].length != 0 && <div className={styles.timepicker__phase}>
                            <div className={styles.timepicker__phase__name}>Утро</div>
                            <div className={styles.timepicker__phase__timeSlot}>
                                {selectedTime.timeSlots["Утро"].map((time, index) => {
                                    return <button onClick={() => handleClickTime(time.id)} key={index} className={styles.timepicker__phase__timeSlot__time}>{time.time}</button>
                                })}

                            </div>
                        </div>}

                        {selectedTime && selectedTime.timeSlots["День"].length != 0 && <div className={styles.timepicker__phase}>
                            <div className={styles.timepicker__phase__name}>День</div>
                            <div className={styles.timepicker__phase__timeSlot}>
                                {selectedTime.timeSlots["День"].map((time, index) => {
                                    return <button onClick={() => handleClickTime(time.id)} key={index} className={styles.timepicker__phase__timeSlot__time}>{time.time}</button>
                                })}
                            </div>
                        </div>}

                        {selectedTime && selectedTime.timeSlots["Вечер"].length != 0 && <div className={styles.timepicker__phase}>
                            <div className={styles.timepicker__phase__name}>Вечер</div>
                            <div className={styles.timepicker__phase__timeSlot}>
                                {selectedTime.timeSlots["Вечер"].map((time, index) => {
                                    return <button onClick={() => handleClickTime(time.id)} key={index} className={styles.timepicker__phase__timeSlot__time}>{time.time}</button>
                                })}
                            </div>
                        </div>}

                        {selectedTime && selectedTime.timeSlots["Ночь"].length != 0 && <div className={styles.timepicker__phase}>
                            <div className={styles.timepicker__phase__name}>Ночь</div>
                            <div className={styles.timepicker__phase__timeSlot}>
                                {selectedTime.timeSlots["Ночь"].map((time, index) => {
                                    return <button onClick={() => handleClickTime(time.id)} key={index} className={styles.timepicker__phase__timeSlot__time}>{time.time}</button>
                                })}
                            </div>
                        </div>}
                    </div>
                </div>
            </main>
        </>
    );
}

function CalendarDay(props) {
    const { day, dayOfWeek, handleClickDay, selectedDay, keyIden, isHoliday, haveClass } = props;
    const [isPressed, setIsPressed] = useState(selectedDay == keyIden);
    useEffect(() => {
        setIsPressed(selectedDay == keyIden);
    }, [selectedDay])
    return (
        <button onClick={() => handleClickDay(keyIden)} disabled={!haveClass} className={`${styles.calendar__day} ${isPressed ? styles.calendar__day__active : ""} ${isHoliday ? styles.colendar__day__holiday : ""}`}>
            <div>{dayOfWeek}</div>
            <div>{day}</div>
        </button>
    )
}

export default OfferTimeSlot;
