// Desc: Hook to get and save the module ID from or to the local storage
import useLocalStorageState from 'use-local-storage-state'
function useModuleID() {
    const [moduleID, setModuleID] = useLocalStorageState('moduleID', { defaultValue: 0 });

    return [moduleID, setModuleID];

}

export default useModuleID;