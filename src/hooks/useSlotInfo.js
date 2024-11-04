import { useEffect, useState } from "react";

function useSlotInfo(moduleID) {

    const [dataInfo, setDataInfo] = useState();
    const [loadingInfo, setLoadingInfo] = useState(true);
    const [error, setError] = useState();
    const [data, setData] = useState();

    useEffect(() => {
        if (!moduleID) return;
        const infoData = async (moduleID) => {
            return await (await fetch(`https://pro-age.ru:3000/officehours/slots/${moduleID}`)).json();
        }

        infoData(moduleID).then((res) => {
            setDataInfo(res);
        }
        ).catch((err) => {
            setError(err);
        }
        )
    }, [moduleID])

    useEffect(() => {
        if (!dataInfo) return;
        setLoadingInfo(false);
    }, [dataInfo])

    const findBySlotID = (id) => {
        const selectedData = dataInfo.slots.filter((item) => {
            return item.id == id;
        });
        return selectedData[0];
    }

    const findSlot = (id) => {
        const selectedData = findBySlotID(id);
        setData(selectedData);
    }



    return [data, setData, loadingInfo, findSlot]
}

export default useSlotInfo;
