import { useState, useEffect } from 'react';

function useFreeSlots(moduleID) {
    const [freeSlots, setFreeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
        if (!moduleID) return;
        const fetchFreeSlots = async (moduleID) => {
            return await (await fetch(`https://pro-age.ru:3000/officehours/slots/${moduleID}`)).json();
        }

        fetchFreeSlots(moduleID).then((res) => {
            setFreeSlots(res);
        }
        ).catch((err) => {
            setError(err);
        }
        ).finally(() => {
            setLoading(false);
        }
        )
    }, [moduleID]);

    return [freeSlots, loading, error];
}

export default useFreeSlots;
