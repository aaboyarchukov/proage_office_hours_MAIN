export function dateformat(date) {
    const monthList = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"]
    const dateObject = new Date(date);
    // starts with lowercase
    const month = monthList[dateObject.getMonth()].toLowerCase();

    const day = dateObject.getDate();
    const hours = (dateObject.getHours() < 10 ? '0' : '') + dateObject.getHours()
    const minutes = (dateObject.getMinutes() < 10 ? '0' : '') + dateObject.getMinutes()
    console.log(minutes);
    const result = {
        "day": `${day} ${month}`,
        "time": `${hours}:${minutes}`
    }
    return result;
}