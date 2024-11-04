import React, {useState} from 'react';
import {Dialog} from '@headlessui/react';
import styles from '@/styles/Popup.module.css';
import useLocalStorageState from "use-local-storage-state";

function WarningPopUp(props) {
    const [encodedUserID, setEncodedUserID] = useLocalStorageState('encodedUserID', {defaultValue: null});
    const [webApp, setWebApp] = useState();
    const handleClose = () => {
        props.setIsOpen(false);
    };

    return (
        <Dialog open={props.isOpen} onClose={handleClose}>
            <div className={styles.popup__backdrop} aria-hidden="true"></div>
            <div className={styles.popup__container}>
                <Dialog.Panel className={styles.popup__panel}>
                    <Dialog.Title className={styles.popup__title}>Уведомление</Dialog.Title>
                    <Dialog.Description className={styles.popup__text}>
                        Пожалуйста, предложите преподавателю <span className={styles.bold}>не менее 5 временных слотов</span>, чтобы он мог адаптироваться к вашему расписанию. Вы можете выбрать слоты на разные дни.
                    </Dialog.Description>
                    <button className={styles.popup__button} onClick={handleClose}>
                        Закрыть
                    </button>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

export default WarningPopUp;
