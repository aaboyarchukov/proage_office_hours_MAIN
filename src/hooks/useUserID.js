// Desc: Hook to get the user ID from the URL
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useLocalStorageState from 'use-local-storage-state'
function useUserID() {
    const router = useRouter();
    const { id } = router.query;
    const [userID, setUserID] = useLocalStorageState('userID', { defaultValue: 0 });

    useEffect(() => {
        if (id) setUserID(Number(id));
    }, [id]);

    return userID;
}

export default useUserID;