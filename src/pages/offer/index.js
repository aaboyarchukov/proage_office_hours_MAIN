import React from 'react';
import {useEffect} from 'react';
import {useRouter} from 'next/router';
import useUserID from '@/hooks/useUserID';
import useModuleID from '@/hooks/useModuleID';
import useUserHistory from '@/hooks/useUserHistory';

import Loader from '@/components/loader'
import useSlotID from '@/hooks/useSlotID';

function Offer() {
    const Router = useRouter();
    const userID = useUserID();
    const [moduleID, setModuleID] = useModuleID();
    const [history, loading, error] = useUserHistory(userID);
    const [slotID, setSlotID] = useSlotID();

    useEffect(() => {
        if (!userID) return;
        setModuleID(1);
    }, [userID])

    useEffect(() => {
        if (!userID) return;
        if (!loading && !error) {
            // find module id 1 in history
            const modu = history.planned.filter((item) => {
                return item.module == "Ознакомительный";
            });

            // if not found, redirect to timeSlot
            if (modu.length == 0) {
                Router.push(`/offer/timeSlot`);
            }
            // if found, redirect to submit
            if (modu.length == 1) {
                setSlotID(modu[0].id);
                Router.push(`/offer/submit`);
            }
            // if found more than 1, redirect to timeSlot
            console.log(modu);
        }
    }, [loading, error])

    return (
        <>
            <div>
                {loading && <Loader/>}
            </div>
        </>
    )
}

export default Offer;