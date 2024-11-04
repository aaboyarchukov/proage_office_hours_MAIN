const Mouth = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

function getOfficeHours(slots, username) {
    if (username !== "") {
        slots = slots.filter(slot => slot.teacher.username === username);
    }

    const officeHours = {};
    const timeSlots = ["Утро", "День", "Вечер", "Ночь"];

    for (let i = 0; i < 90; i++) {
        const today = new Date();
        // const tomorrow = new Date(today);
        // tomorrow.setDate(tomorrow.getDate() + 1);
        // tomorrow.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        slots = slots.filter(slot => new Date(slot.datetime) >= today);
        const day = today;
        day.setDate(day.getDate() + i);
        const dayString = `${day.getMonth() + 1}-${day.getDate()}`;
        officeHours[dayString] = {
            date: {
                dayOfWeek: day.toLocaleString("ru", {weekday: "short"}),
                day: day.getDate(),
                month: Mouth[day.getMonth()],
                isHoliday: day.toLocaleString("ru", {weekday: "short"}) === "Сб" || day.toLocaleString("ru", {weekday: "short"}) === "Вс",
                haveClass: false
            },
            timeSlots: {}
        };

        timeSlots.forEach(timeSlot => {
            officeHours[dayString].timeSlots[timeSlot] = [];
        });
    }

    for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        const day = new Date(slot.datetime);
        if (day < new Date()) continue;
        const dayString = `${day.getMonth() + 1}-${day.getDate()}`;
        const time = day.getHours();
        const timeString = `${time < 10 ? "0" + time : time}:${day.getMinutes() < 10 ? "0" + day.getMinutes() : day.getMinutes()}`;
        slot.time = timeString;
        let isHaveClass = false;

        timeSlots.forEach(timeSlot => {
            if (time >= timeSlotStart[timeSlot] && time < timeSlotEnd[timeSlot]) {
                const existingSlot = officeHours[dayString].timeSlots[timeSlot].find(existingSlot => existingSlot.time === timeString);

                if (existingSlot) {
                    existingSlot.slots.push(slot);
                } else {
                    officeHours[dayString].timeSlots[timeSlot].push({
                        time: timeString,
                        slots: [slot]
                    });
                }


                isHaveClass = true;
            }
        });

        officeHours[dayString].date.haveClass = isHaveClass;
    }

    for (const key in officeHours) {
        const day = officeHours[key];
        for (const timeSlot in day.timeSlots) {
            day.timeSlots[timeSlot].sort((a, b) => {
                const aTime = a.time.split(":");
                const bTime = b.time.split(":");
                if (aTime[0] > bTime[0]) return 1;
                if (aTime[0] < bTime[0]) return -1;
                if (aTime[1] > bTime[1]) return 1;
                if (aTime[1] < bTime[1]) return -1;
                return 0;
            });
        }
    }

    return officeHours;
}

// Изменения в TimeSlot.js
// Добавьте следующие константы перед использованием в компоненте
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

export default getOfficeHours;