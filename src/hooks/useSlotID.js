// Desc: Hook to get and save the slot ID from or to the local storage
import useLocalStorageState from 'use-local-storage-state'
function useSlotID() {
    const [slotID, setSlotID] = useLocalStorageState('slotID', { defaultValue: -1 });

    return [slotID, setSlotID];

}

export default useSlotID;
