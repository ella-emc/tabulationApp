
import React, { useEffect, useRef, useState } from 'react'
import { pb } from '../pocketbase'
import toast, { Toaster } from 'react-hot-toast';
import eventsource from 'eventsource'




function Judge() {
    const [key, setKey] = useState('')
    const [lock, setLock] = useState(true)
    const [data, setData] = useState([])


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
    }, [])


    // useEffect(() => {
    //     pb.collection('Judges').subscribe('*', function (e) {

    //         console.log(e.record);
    //         toast(`${e.record.Name} has been logged in`)
    //     });

    // }, [])

    async function Login() {
        toast.loading('Logging in')
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
                toast.success('Logged in')
                await pb.collection('Judges').update(data.filter((item) => item.secretkey === key)[0].id, { loggedin: true })
                window.location.href = '/scoring'
            }
        } catch (error) {
            toast.dismiss()
            toast.error('Wrong key')
        }
    }

    return (
        <>
            {lock &&
                (<div className="w-full h-screen absolute flex justify-center items-center">
                    <div className="w-full h-screen absolute">
                        <div className="w-full h-full bg-white opacity-95"></div>
                    </div>
                    <h1 className="text-4xl text-black font-bold absolute z-10">Please wait for the admin to unlock</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className='absolute top-52 z-10 w-20'>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>

                </div>)} 
            <Toaster />
            <div className='flex w-full h-screen justify-center items-center bg-blue-400'>
                    <div className='flex flex-col items-center justify-center p-10 gap-10 w-[80vw] h-[70vh] bg-white rounded-2xl'>
                    <h1 className='text-3xl font-bold uppercase'>Enter the key</h1>
                    <input onChange={(e) => setKey(e.target.value)} className='w-[50vw] h-[10vh] border-4 border-black rounded-2xl text-5xl' type="password" required={true} />
                    <p className='opacity-20'>{key}</p>
                    <button onClick={() => Login()} className='w-[20vw] h-[10vh] bg-blue-400 text-white text-4xl font-bold rounded-2xl hover:opacity-80'>Submit</button>
                </div>
            </div>
        </>
    )
}

export default Judge