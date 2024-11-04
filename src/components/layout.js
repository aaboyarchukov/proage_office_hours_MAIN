import { Montserrat } from 'next/font/google'
const montserrat = Montserrat({ subsets: ['latin-ext', "cyrillic-ext"], weights: [400, 500, 600, 700, 800, 900] })

import styles from '@/styles/Layout.module.css'


const Layout = ({ children }) => {
    return (
        <div className={`${montserrat.className} ${styles.wrapper}`}>
            {children}
        </div>
    )
}
export default Layout