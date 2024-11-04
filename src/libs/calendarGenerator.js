function generateCalendar() {
    const date = new Date();
    // create object with current date and 90 days ahead of it (3 months), key is date in format MM-DD and value is a object with date and array of time slots
    const calendar = {};
    for (let i = 0; i < 90; i++) {
        const day = new Date(date);
        day.setDate(day.getDate() + i);
        const dayString = `${day.getMonth() + 1}-${day.getDate()}`;
        calendar[dayString] = {
            date: day,
            timeSlots: []
        };
    }
    return calendar;
}

export default generateCalendar;