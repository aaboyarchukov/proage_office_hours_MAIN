import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Header from '@/components/header'
import ClassCard from '@/components/classCard'
import {useEffect, useState} from 'react'
import useLocalStorageState from 'use-local-storage-state'
import {useRouter} from 'next/router'
import Loader from '@/components/loader'


import useSWR from 'swr'


export default function Home() {
    const fetcher = (url) => fetch(url).then(r => r.json());
    const router = useRouter();
    const {id} = router.query;
    const [userID, setUserID] = useLocalStorageState('userID', {defaultValue: 0});
    const [encodedUserID, setEncodedUserID] = useLocalStorageState('encodedUserID', {defaultValue: null});
    const [webApp, setWebApp] = useState();

    const [withoutTeacher, setWithoutTeacher] = useLocalStorageState('withoutTeacher', {defaultValue: false});
    const {data, error} = useSWR(`https://pro-age.ru:3000/officehours/history/${userID}`, fetcher);
    const [selectedTeacher, setSelectedTeacher] = useLocalStorageState('teacher');
    const [isLoading, setIsLoading] = useState(false);
    const [allLoaded, setAllLoaded] = useState(false);


    useEffect(() => {
        setSelectedTeacher({"username": "", "id" : 1});
        const WebApp = window.Telegram.WebApp;
        WebApp.expand();
        try {
            if (id) {
                setEncodedUserID(id);
                setUserID(Number(atob(id)));
            }
        } catch (error) {
            console.error('Error decoding base64 string:', error);
        }
        setWebApp(WebApp);
    });

    useEffect(() => {
        if (!userID) return;
        setAllLoaded(true);
    }, [userID])

    async function fetchCancel(id) {
        return await fetch(`/api/cancel/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": id,
                "userID": userID
            })
        })
    }

    async function cancelClickHandler(id) {
        setIsLoading(true);
        console.log("cancel");
        const response = await fetchCancel(id);
        console.log(response);
        router.reload();
    }

    if (!data || !allLoaded || isLoading) return <Loader/>

    function handleTeacherButtonClick() {
        setWithoutTeacher(false);
        router.push("/modules");
    }

    function handleTimeButtonClick() {
        setWithoutTeacher(true);
        router.push("/modules");

    }

    return (
        <>
            <Head>
                <title>Innoprog</title>
                <meta name="description" content="Online IT School Innoprog"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Header text="Индивидуальные занятия"/>
            <main className={styles.main}>
                <div className={styles.pickerContainer}>
                    <div onClick={() => handleTeacherButtonClick()} className={styles.pickerBox}>
                        <div>
                            <div className={styles.pickerBox__title}>Выбрать <br/> преподавателя</div>
                            <div className={styles.pickerBox__image}>
                                <Image src="/chooseTeacher.webp" alt='Выбор преподавателя' width={150} height={98}/>
                            </div>
                        </div>
                    </div>
                    <div onClick={() => handleTimeButtonClick()} className={styles.pickerBox}>
                        <div>
                            <div className={styles.pickerBox__title}>Выбрать <br/> свободное время</div>
                            <div className={styles.pickerBox__image}>
                                <Image src="/chooseTime.webp" alt='Выбор свободного времени' width={150} height={98}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {data && data.planned.length > 0 &&
                        <h2 className={styles.picker__title}>Запланированные занятия</h2>}
                    <div className={styles.class__container}>
                        {data && data.planned.map((classCard) => {
                            return (
                                <ClassCard key={classCard.id} onClick={cancelClickHandler} id={classCard.id}
                                           dateTime={classCard.datetime} module={classCard.module} type={1}
                                           teacher={classCard.teacher}/>
                            )
                        })}
                    </div>
                </div>


                <div>
                    {data && data.past.length > 0 && <h2 className={styles.picker__title}>Прошедшие занятия</h2>}
                    <div className={styles.class__container}>
                        {data && data.past.map((classCard) => {
                            return (
                                <ClassCard webApp={webApp} key={classCard.id} id={classCard.id}
                                           dateTime={classCard.datetime} module={classCard.module} type={2}
                                           recordingData={classCard.recording} teacher={classCard.teacher}/>
                            )
                        })}
                    </div>
                </div>

                {/*<Popup isOpen={openPopup} setIsOpen={setOpenPopup} />*/}
            </main>
        </>
    )
}
