import { useEffect, useState } from "react";

function useBookingSlot() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [data, setData] = useState();

    const bookingSlot = async (slotId, userID, question) => {
        setLoading(true);
        console.log(slotId, userID, question);
        const response = await fetch(`/api/book/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": slotId,
                "userID": userID,
                "question": question
            })
        })
        return await response.json();
    }

    const book = async (slotId, userID, question) => {
        await bookingSlot(slotId, userID, question).then((res) => {
            setData(res);
        }).catch((err) => {
            setError(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    const cancelSlot = async (slotId, userID) => {
        setLoading(true);
        console.log(slotId, userID);
        const response = await fetch(`/api/cancel/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": slotId,
                "userID": userID
            })
        })
        return await response.json();
    }

    const cancel = (slotId, userID) => {
        cancelSlot(slotId, userID).then((res) => {
            setData(res);
        }).catch((err) => {
            setError(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    return [data, loading, error, book, cancel];
}

export default useBookingSlot;