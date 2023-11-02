
import React, { useEffect, useRef, useState } from 'react'
import { pb } from '../pocketbase'
import toast, { Toaster } from 'react-hot-toast';
import eventsource from 'eventsource'
import { motion, AnimatePresence } from 'framer-motion';




function Judge() {
    const [key, setKey] = useState('')
    const [lock, setLock] = useState(true)
    const [data, setData] = useState([])
    const [timer, setTimer] = useState(new Date().toLocaleTimeString())
    const [load, setLoad] = useState(false)
    const ref = useRef(null)
    const [status, setStatus] = useState('Checking passkey...')
    const [loading, setLoading] = useState(false)


    global.EventSource = eventsource;

    useEffect(() => {
        pb.collection('ControlUnlock').subscribe('*', function (e) {
            setLock(e.record.viewunlock)
            console.log(e.record.viewunlock);
        });
    }, [])

    useEffect(() => {
        async function LoginFetch() {
            const res = await pb.collection('Judges').getFullList()
            console.log(res);
            setData(res)
        }
        LoginFetch()
        setInterval(() => {
            setTimer(new Date().toLocaleTimeString())
        }, 1000);
    }, [])

    function clearInput() {
        setKey('')
        setLoad(false)
        ref.current.value = '';
        ref.current.focus()
    }

    function disableButton() {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }


    // useEffect(() => {
    //     pb.collection('Judges').subscribe('*', function (e) {

    //         console.log(e.record);
    //         toast(`${e.record.Name} has been logged in`)
    //     });

    // }, [])

    async function Login() {

        setLoad(true)
        disableButton()
        try {
            const main = data ? data.filter((item) => item.secretkey === key)[0].id : false;
            const loggedin = await pb.collection('Judges').getOne(main)
            console.log(main)
            if (loggedin.loggedin === true) {
                toast.dismiss()
                toast.error('Already logged in')
            } else if (main) {
                localStorage.setItem('judge', main)
                toast.dismiss()
                setLoad(false)
                toast.success('Logged in')
                await pb.collection('Judges').update(data.filter((item) => item.secretkey === key)[0].id, { loggedin: true })
                window.location.href = '/scoring'
            }
        } catch (error) {
            setTimeout(() => {
                setStatus('Wrong Passkey')
            }, 2000);

        }
    }

    return (
        <>
            {!lock && (
                <>
                    <div className="fixed z-20 left-5 top-[40vh] flex gap-5 items-center text-3xl"><span className='leading-relaxed'>M<br />M<br />B<br />U<br /></span> <span>2<br />0<br />2<br />3</span></div>
                    <div className="fixed z-20 right-5 top-[40vh] flex gap-5 items-center text-3xl"> <span>2<br />0<br />2<br />3</span><span className='leading-relaxed'>M<br />M<br />B<br />U<br /></span></div>
                </>
            )}
            <div className={`w-full h-screen z-10 absolute flex justify-center items-center ${lock && "pointer-events-none"}`}>
                <motion.div animate={{ scale: lock ? 1.5 : 1 }} transition={{ duration: 1.5, type: "spring" }} className="w-full h-screen  fixed border-[8rem] overflow-hidden border-[#FEBDF6]">
                    <motion.div animate={{ y: lock ? 1000 : 0 }} transition={{ duration: 1, type: "tween" }} className="absolute w-full h-full bg-black opacity-60"></motion.div>

                </motion.div>
                <AnimatePresence>

                    {!lock && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed flex justify-center gap-32 translate-y-[-3rem] flex-col items-center'>
                        <div className="fixed z-20 bottom-[-34vh] text-3xl">{timer}</div>
                        <div className="fixed z-20 top-[-18vh] text-3xl">{timer}</div>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className='text-white  z-10 w-20'>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        <h1 className="text-4xl text-white font-bold z-20">Please wait for the admin to unlock</h1>
                        <div className='flex group z-30 pointer-events-auto cursor-pointer gap-5 translate-y-[-5rem] items-center justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-[#FEBDF6] z-10 w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                            <p className="z-10 text-white group-hover:text-pink-500">hover here for more info</p>
                            <div className='bg-transparent w-[20rem] h-[10rem] absolute bottom-[-12rem] rounded-2xl group-hover:bg-white transition-all ease-in-out duration-300'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-white hidden group-hover:block w-10 h-10 absolute top-[-2rem] ml-[9rem] animate-bounce">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                </svg>
                                <p className='text-black p-5 text-justify hidden group-hover:block'>The fun is yet to begin...<br /> please reach to the staffs  behind you for assistance and troubleshooting or other concerns.</p>
                            </div>
                        </div>

                    </motion.div>)}
                </AnimatePresence>

            </div>
            <Toaster />
            <div className='flex w-full h-screen justify-center items-center perspective-[2000px] transform-style-3d overflow-hidden'>
                <motion.div animate={{ scale: key ? 1.05 : 1 }} transition={{ duration: 2, type: 'spring' }} className=' w-[80vw] h-[80vh] shadow-2xl flex justify-center items-center translate-z-40 rounded-3xl overflow-hidden'>

                    <motion.div layout animate={{ scale: key ? 0.85 : 1 }} transition={{ duration: 2, type: 'spring' }} className='flex flex-col items-center justify-center p-10 gap-10 w-full h-full z-10 bg-pink-100 rounded-2xl overflow-hidden'>

                        {lock && (<motion.img initial={{ y: -500, rotateX: 360 }} animate={{ y: 0, rotateX: 360 }} exit={{ y: 1000 }} transition={{ duration: 2, type: "spring" }} className='object-contain w-[8rem] z-0 translate-z-12' src="/img/mmbu23_logo.png" alt="mmbu-logo" />)}


                        <motion.div layout className='flex flex-col gap-3 justify-center items-center' transition={{ duration: 1, type: 'spring' }}>
                            <motion.h1 className='text-2xl uppercase'>Enter the key</motion.h1>
                            <div className='flex relative overflow-hidden rounded-2xl justify-center items-center w-[30vw] h-[8vh]'>
                                <motion.div animate={{ y: load ? 0 : 200 }} transition={{ duration: 1, type: "tween" }} className='bg-gradient-to-r from-purple-500 to-pink-500 w-[30vw] h-[8vh] absolute flex justify-center items-center text-white text-2xl'><p>{status}</p></motion.div>
                                <motion.input ref={ref} onChange={(e) => setKey(e.target.value)} className='w-[30vw] h-[7vh] border-2 border-pink-300 rounded-2xl text-5xl' type="password" required={true} />
                            </div>
                            <motion.p className='opacity-20'>{key}</motion.p>
                            {load ? (<motion.button onClick={() => clearInput()} className={`w-[10vw] h-[5vh] bg-white shadow-2xl text-black text-xl font-bold rounded-2xl disabled:bg-gray-300 hover:opacity-80 ${lock ? "opacity-1" : "opacity-0"} transition-all duration-300 ease-in-out`} disabled={loading}>{loading ? "Loading" : "Try Again?"}</motion.button>) : (<motion.button onClick={() => Login()} className={`w-[10vw] h-[5vh] bg-white shadow-2xl text-black text-xl font-bold rounded-2xl hover:opacity-80 ${lock ? "opacity-1" : "opacity-0"} transition-all duration-300 ease-in-out`}>Submit</motion.button>)}
                        </motion.div>
                    </motion.div>

                    <div className='absolute scale-150 w-full h-[80vw] bg-gradient-to-r from-purple-500 to-pink-500'></div>

                </motion.div>
            </div >
        </>
    )
}

export default Judge