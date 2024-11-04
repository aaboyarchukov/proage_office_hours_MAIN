import { useState, useEffect } from 'react';

function useUserHistory(userID) {
    const [history, setHistory] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
        if (!userID) return;
        const fetchHistory = async (userID) => {
            return await (await fetch(`https://pro-age.ru:3000/officehours/history/${userID}`)).json();
        }

        fetchHistory(userID).then((res) => {
            setHistory(res);
        }
        ).catch((err) => {
            setError(err);
        }
        ).finally(() => {
            setLoading(false);
        }
        )
    }, [userID]);

    return [history, loading, error];
}

export default useUserHistory;
