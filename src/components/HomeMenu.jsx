import React, { useEffect } from 'react'
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import Marquee from 'react-fast-marquee'


function HomeMenu() {
    const [picked, setPicked] = React.useState("")
    const [time, setTime] = React.useState(new Date().toLocaleTimeString())
    const [toggle, setToggle] = React.useState(false)
    const title = ["THE SEARCH FOR", "MR. AND MS. BICOL UNIVERSITY 2023"]

    useEffect(() => {
        setInterval(() => {
            setTime(new Date().toLocaleTimeString())
        }, 1000)
    }, [])


    const animate = {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0
        },
    }

    return (
        <div className="overflow-x-hidden">
            <div className="w-screen h-[95vh] flex justify-center items-center">
                <motion.div

                    className="flex flex-col gap-16 justify-center items-center rounded-3xl"
                >
                    <motion.div layout className=' aspect-auto w-1/2 flex flex-col items-center'>
                        <motion.img
                            className='object-fit w-1/4 mb-4' src="/img/mmbu23_logo.png" alt="mmbu-logo"
                            initial={{ opacity: 0, y: -500, rotateY: 360 }}
                            animate={{ opacity: 1, y: 0, rotateY: 0 }} transition={{ duration: 3.5, type: "spring" }}
                        />
                        <motion.h1
                            className='uppercase text-fuchsia-600 text-4xl text-center font-medium'
                            variants={animate} initial="hidden" animate="visible" transition={{ staggerChildren: 0.05 }}
                        >
                            {title.map((text, index) => (
                                <span className="block" key={index}>
                                    {text.split(" ").map((word, index) => (
                                        <span className="inline-block" key={index}>
                                            {word.split("").map((char, index) => (
                                                <motion.span
                                                    className="inline-block"
                                                    variants={animate}
                                                    key={index}
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                            <span className="inline-block">&nbsp;</span>
                                        </span>
                                    ))}
                                </span>
                            ))}
                        </motion.h1>
                    </motion.div>

                    {!picked && (
                        <motion.h1 layoutId="selector" className="text-3xl font-bold" initial={{ opacity: 0, y: 500, rotateX: 360 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 2.5, type: "spring", bounce: 0.2 }}
                        >Select Event</motion.h1>
                    )}

                    <motion.div layout className="flex gap-10">
                        <motion.h2 initial={{ y: 500 }} animate={{ y: 0 }} transition={{ duration: 1.5, type: "spring" }} onClick={() => setPicked("closed")} className={`text-xl bg-white text-center font-normal shadow-2xl px-6 py-2 w-72 rounded-xl ${picked === "closed" && "bg-yellow-500 text-white"} cursor-pointer hover:outline-[#FBB040] hover:outline`}>
                            Closed-Door Interview
                        </motion.h2>
                        <motion.h2 initial={{ y: 500 }} animate={{ y: 0 }} transition={{ duration: 1.5, type: "spring" }} onClick={() => setPicked("coronation")} className={`text-xl bg-white  text-center font-normal shadow-xl px-6 py-2 w-72 rounded-xl ${picked === "coronation" && " bg-yellow-500 text-white"} cursor-pointer hover:outline-[#FBB040] hover:outline`}>
                            Coronation Night
                        </motion.h2>
                    </motion.div>
                    {picked && (
                        <>
                            <motion.h1 layoutId="selector" className="text-3xl font-bold">Select Interface</motion.h1>
                            <div className='flex gap-10'>
                                <a href="/judges">
                                    <motion.div initial={{ x: -500 }} animate={{ x: 0 }} transition={{ duration: 1.5, type: "spring" }} className='shadow-2xl px-6 py-2 w-60 text-center text-xl rounded-2xl cursor-pointer bg-white hover:outline-fuchsia-400 hover:outline'>
                                        Judges
                                    </motion.div>
                                </a>
                                <a href="/adminview">
                                    <motion.div initial={{ x: 500 }} animate={{ x: 0 }}
                                        transition={{ duration: 1.5, type: "spring" }} className=' shadow-2xl px-6 py-2 w-60 text-center text-xl rounded-2xl bg-white cursor-pointer hover:outline-fuchsia-400 hover:outline'>
                                        Admin
                                    </motion.div>
                                </a>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
            <Marquee
                className='fixed text-2xl flex font-bold text-white bg-fuchsia-600 p-2'
            >
                {time}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;



                <div className='flex items-center overflow-hidden'>
                    <h1
                        className='absolute text-center animate-pulse'
                    >
                        The Search for Mr. and Ms. Bicol University 2023
                    </h1>
                </div>


            </Marquee>
        </div >
    )
}

export default HomeMenu