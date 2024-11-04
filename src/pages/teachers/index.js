import Header from "@/components/header";
import TeacherCard from "@/components/teacherCard";
import useSWR from 'swr'
import styles from "@/styles/Teachers.module.css"
import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {useState} from "react";
import useLocalStorageState from 'use-local-storage-state'
import Loader from '@/components/loader'

const Teachers = () => {
    const fetcher = (url) => fetch(url).then((res) => res.json())
    const [selectedModule, setSelectedModule] = useLocalStorageState('module', {
        defaultValue: {
            id: 1,
            name: "Модуль 1"
        }
    });
    const {data, error} = useSWR(`https://pro-age.ru:3000/officehours/slots/${selectedModule.id}`, fetcher);
    const {data: teachersData, error: teachersError} = useSWR("https://pro-age.ru:3000/teachers", fetcher);
    const router = useRouter();
    const [selectedTeacher, setSelectedTeacher] = useLocalStorageState('teacher');
    const [selectedId, setSelectedId] = useLocalStorageState('timeID');
    const [teachers, setTeachers] = useState();

    function handleClick(username, id) {
        setSelectedTeacher({username: username, id : id});
        const {slots} = router.query;
        const {type} = router.query;
        if (slots && data) {
            const parsedSlotIds = JSON.parse(slots);
            const filteredSlots = data.slots.filter(slot => parsedSlotIds.includes(slot.id));
            const selectedSlot = filteredSlots.find(slot => slot.teacher.username === username);

            if (selectedSlot) {
                setSelectedId(selectedSlot.id);
            }

            router.push(`/submit`);
        } else {
            router.push({pathname:`/timeSlot`, query : {type : type}});
        }
    }

    useEffect(() => {
        const {slots} = router.query;
        const {type} = router.query;
        if (slots && data) {
            const parsedSlotIds = JSON.parse(slots);
            const filteredSlots = data.slots.filter(slot => parsedSlotIds.includes(slot.id));

            const uniqueTeachers = filteredSlots.reduce((acc, curr) => {
                const found = acc.find(el => el.teacher.username === curr.teacher.username);
                if (!found) {
                    acc.push(curr);
                }
                return acc;
            }, []);

            setTeachers({slots: uniqueTeachers});
        } else if (type==="suggestions" && teachersData) {
            const filteredTeachers = teachersData.teachers
                .filter(teacher => teacher.zoom_url !== null && teacher.icon !== null)
                .map(teacher => ({
                    id: teacher.id,
                    teacher: {...teacher}
                }));

            console.log(filteredTeachers);
            setTeachers({slots: filteredTeachers});

        } else if (data) {
            const teachers = data.slots.reduce((acc, curr) => {
                const found = acc.find(el => el.teacher.username === curr.teacher.username);
                if (!found) {
                    acc.push(curr);
                }
                return acc;
            }, []);
            setTeachers({slots: teachers});
        }
    }, [data, teachersData, router.query])

    useEffect(() => {
    }, [teachers])

    if (!teachers) return <Loader/>
    if (teachers.slots.length === 0) return (
        <>
            <Header text="Преподаватели"/>
            <main className={styles.main}>
                <h1 className={styles.title}>К сожалению, на данный момент свободных преподавателей нет</h1>
            </main>
        </>
    )
    return (
        <>
            <Header text="Преподаватели"/>
            <main className={styles.main}>
                {teachers && teachers.slots.map((teacherData) => {
                    return (
                        <TeacherCard onClick={handleClick} key={teacherData.id} teacher={teacherData.teacher}/>
                    )
                })}
            </main>
        </>
    );
};
export default Teachers;
