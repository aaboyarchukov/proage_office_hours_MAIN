const timeSlotStart = {
    "Утро": 5,
    "День": 13,
    "Вечер": 17,
    "Ночь": 0
};

const timeSlotEnd = {
    "Утро": 13,
    "День": 17,
    "Вечер": 24,
    "Ночь": 5
};

async function fetchData(teacher, module) {
    try {
        const fetcher = (url) => fetch(url).then((res) => res.json());

        const teacherResponse = await fetcher(`https://pro-age.ru:3000/officehours/teacher/history/${teacher.id}`);

        if (!teacherResponse || !teacherResponse.planned || !Array.isArray(teacherResponse.planned)) {
            console.error("Invalid response or missing planned slots.");
            return [];
        }

        let plannedSlots = teacherResponse.planned;
        plannedSlots = plannedSlots.map(slot => ({ ...slot, status: "booked" }));

        const moduleResponse = await fetcher(`https://pro-age.ru:3000/officehours/slots/${module.id}`);
        let moduleSlots = moduleResponse.slots.filter(slot => slot.teacher.username === teacher.username);
        moduleSlots = moduleSlots.map(slot => ({ ...slot, status: "planned" }));

        return [...plannedSlots, ...moduleSlots];
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}




function allPossibleSlots(teacher, module) {
    const slotsByDay = {};
    const currentTime = new Date(); // Get the current time

    return fetchData(teacher, module)
        .then(data => {
            console.log("office_hours", data);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let i = 0; i < 90; i++) {
                const day = new Date(today);
                day.setDate(day.getDate() + i);
                const month = day.getMonth();
                const dayNumber = day.getDate();
                const dayOfWeek = day.toLocaleString("ru", {weekday: "short"});
                const isWeekend = day.toLocaleString("ru", {weekday: "short"}) === "Сб" || day.toLocaleString("ru", {weekday: "short"}) === "Вс"

                const dayString = `${month}-${dayNumber}`;

                slotsByDay[dayString] = {
                    date: {
                        dayOfWeek: dayOfWeek,
                        day: dayNumber,
                        month: months[month],
                        isHoliday: isWeekend,
                        haveClass: true
                    },
                    timeSlots: {
                        Ночь: [],
                        Утро: [],
                        День: [],
                        Вечер: [],
                    }
                };

                for (const timeSlot in timeSlotStart) {
                    const startHour = timeSlotStart[timeSlot];
                    const endHour = timeSlotEnd[timeSlot];

                    for (let hour = startHour; hour < endHour; hour++) {
                        for (let minute = 0; minute < 60; minute += 15) {
                            let time = `${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}`;
                            const localDateTime = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute);

                            // Check if the generated time is after the current time
                            if (localDateTime > currentTime) {
                                const similarDateTimeExists = data.some(item => {
                                    const itemDateTime = new Date(item.datetime);
                                    return (itemDateTime.getTime() === localDateTime.getTime() ||
                                        (Math.abs(itemDateTime.getTime() - localDateTime.getTime()) <= 15 * 60 * 1000 && item.status === "booked") ||
                                        (Math.abs(itemDateTime.getTime() - localDateTime.getTime()) === 30 * 60 * 1000 && item.status === "booked")
                                    )
                                });

                                if (!similarDateTimeExists) {
                                    const slot = {
                                        time: time,
                                        day: dayString,
                                        slots: [{day: dayString, time: time}]
                                    };
                                    slotsByDay[dayString].timeSlots[timeSlot].push(slot);
                                }
                            }
                        }
                    }
                }
            }

            return slotsByDay;
        })
        .catch(error => {
            console.error("Error in allPossibleSlots:", error);
            return slotsByDay; // Return empty slots if there's an error
        });
}

const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];


function getDayOfWeek(dayIndex) {
    const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    return daysOfWeek[dayIndex];
}

export default allPossibleSlots;
