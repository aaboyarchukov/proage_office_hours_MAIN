import Header from "@/components/header";
import ModuleCard from "@/components/moduleCard";
import styles from "@/styles/Modules.module.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Loader from '@/components/loader'
import useLocalStorageState from 'use-local-storage-state'
const ModuleChoose = () => {
    const fetcher = url => fetch(url).then(r => r.json());
    const { data, error } = useSWR("https://pro-age.ru:3000/modules", fetcher);
    const router = useRouter();
    const [selectedModule, setSelectedModule] = useLocalStorageState('module');
    const [withoutTeacher, setWithoutTeacher] = useLocalStorageState('withoutTeacher', { defaultValue: false });
    useEffect(
        () => {
            console.log(data);
        }
    )

    const clickHandler = (id, name) => {
        console.log(id);
        setSelectedModule({ id: id, name: name });
        if (withoutTeacher) {
            router.push("/timeSlot");
            return;
        }
        router.push("/teachers")
    }

    if (!data) return <Loader />

    return (
        <>
            <Header text="Модули" />
            <main className={styles.main}>
                <div className={styles.grid}>
                    {data && data.modules.map((module) => {
                        if (module.image === null) return;
                        return (
                            <ModuleCard onClick={clickHandler} name={module.name} img={module.image} id={module.id} key={module.id} />
                        )
                    })}
                </div>
            </main>
        </>
    );
}
export default ModuleChoose;
