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

    const handlePurchase = () => {
        const webApp = window.Telegram.WebApp;
        webApp.sendData("tariffs");
    };

    return (
        <Dialog open={props.isOpen} onClose={handleClose}>
            <div className={styles.popup__backdrop} aria-hidden="true"></div>
            <div className={styles.popup__container}>
                <Dialog.Panel className={styles.popup__panel}>
                    <Dialog.Title className={styles.popup__title}>Невозможно забронировать</Dialog.Title>
                    <Dialog.Description className={styles.popup__text}>
                        Недостаточно оплаченных индивидуальных занятий
                    </Dialog.Description>
                    <button className={styles.popup__purchaseButton} onClick={handlePurchase}>
                        Приобрести индивидуальные занятия
                    </button>

                    <button className={styles.popup__button} onClick={handleClose}>
                        Закрыть
                    </button>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

export default WarningPopUp;
