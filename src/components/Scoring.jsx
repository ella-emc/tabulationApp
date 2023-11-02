
import React, { useEffect, useState, useRef } from 'react'
import { pb } from '../pocketbase'
import eventsource from 'eventsource'
import ScoreLine from './ScoreLine'
import toast, { Toaster } from 'react-hot-toast';



function Scoring() {
    const [topics, setTopics] = useState()
    const [data, setData] = useState([])
    const [gender, setGender] = useState("male")
    const [loading, setLoading] = useState(false)
    const [submitScore, setSubmitScore] = useState(false)
    const [prevScore, setPrevScore] = useState([])

    global.EventSource = eventsource;

    useEffect(() => {
        async function scoreFetch() {
            try {
                const res = await pb.collection('Topic').getFullList()
                const dat = await pb.collection('Candidates').getFullList({
                    filter: `gender = "${gender}"`,
                    sort: '+nameId'
                })
                console.log(res);
                console.log(dat);
                setTopics(res[0].topic)
                const data = await pb.collection('Scores').getFullList({
                    filter: `judge = "${localStorage.getItem('judge')}" && topic = "${res[0].topic}"`,
                })
                setData(dat)
                setPrevScore(data)
                console.log(data)
            } catch (e) {

                console.log(e)
            }
        }
        scoreFetch()
    }, [])

    const changeTab = async (e) => {
        try {
            setLoading(true)
            toast.loading('Loading')
            const dat = await pb.collection('Candidates').getFullList({
                filter: `gender = "${e}"`,
                sort: '+nameId'
            })
            setData(dat)
            setLoading(false)
            setGender(e)
            toast.dismiss()
        } catch (err) {
            toast.error('Error')
            console.log(err)
        }
    }

    useEffect(() => {
        pb.collection('Topic').subscribe('*', function (e) {
            setTopics(e.record.topic)
        });

        return () => {
            pb.collection('Topic').unsubscribe()
        }
    }, [])

    return (
        <>
            <Toaster />

            <div className='flex flex-col h-screen'>
                <div className="flex content-center w-[75vw] my-12 bg-white rounded-3xl py-2 px-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <div className="flex gap-24 m-3">
                        <h1 className='text-base my-1 font-normal text-gray-600'>Segment</h1>
                        <h1 className='text-2xl font-bold'>{topics === 'swimwear' ? "Swimwear Competition" : topics === 'formal' ? "Formal Attire" : "Question and Answer"}</h1>
                    </div>
                </div>
                
                <div className='flex w-[75vw] bg-white rounded-3xl p-10 flex-col shadow-[0_8px_30px_rgb(0,0,0,0.12)]'>
                    <div className="flex gap-5">
                        <div onClick={() => changeTab("male")} className={`px-10 text-xl cursor-pointer py-5 rounded-t-xl border-2 border-b-0 hover:bg-slate-200 ${gender === 'male' && "bg-sky-400 text-white hover:bg-sky-600"} `}>{loading ? <p className='animate-spin'>O</p> : "Male"}</div>
                        <div onClick={() => changeTab("female")} className={`px-10 text-xl cursor-pointer py-5 rounded-t-xl border-2 border-b-0 hover:bg-slate-200 ${gender === 'female' && "bg-pink-400 text-white hover:bg-pink-600"} `}>{loading ? <p className='animate-spin'>O</p> : "Female"}</div>
                    </div>
                    <table className= {`flex flex-col border border-separate gap-6 h-full border-2 py-5 ${gender === 'male' ? 'shadow-2xl shadow-blue-500/20' : 'shadow-2xl shadow-pink-500/20'}`}> 
                        <thead>

                            {topics === 'swimwear' ? (
                                <tr className='flex gap-6 text-black text-base'>
                                    <th className='w-72 align-self-start'>Candidates</th>
                                    {/* <th>Scores</th> */}
                                    <th className='w-64'>Beauty of Figure (15%)</th>
                                    <th className='w-64'>Stage Presence (5%)</th>
                                    <th className='w-56'>Poise and Bearing (5%)</th>
                                    <th className='w-56'>Status</th>
                                </tr>

                            ) : topics === 'formal' ? (
                                <tr className='flex gap-6 text-black px-3 text-base'>
                                    <th className='w-80 justify-self-start'>Candidates</th>
                                    {/* <th>Scores</th> */}
                                    <th className='w-64'>Attire and Carriage (15%)</th>
                                    <th className='w-80'>Stage Presence (5%)</th>
                                    <th className='w-64'>Poise and Bearing (5%)</th>
                                    <th className='w-56'>Status</th>
                                </tr>
                            ) : topics === 'question' ? (
                                <tr className='flex gap-6 text-black text-lg'>
                                    <th className='w-56'>Candidates</th>
                                    {/* <th>Scores</th> */}
                                    <th className='w-64'>Intelligence (25%)</th>
                                    <th className='w-64'>Poise and Personality (25%)</th>
                                    <th className='w-48'>Status</th>
                                </tr>
                            ) : (<tr><th>not found</th></tr>)}

                        </thead>

                        <tbody>
                            {data.map((dat) => (
                                <tr key={dat.id} className='uppercase place-items-center flex gap-6 px-5 border border-separate divide-x-2'>
                                    <td className='font-semibold w-44'>{dat.nameId}</td>
                                    {/* <td onClick={() => setSubmitScore(true)} className='text-center font bold bg-blue-400 rounded-2xl px-4 py-2 font-bold text-white'>Submit Scores</td> */}
                                    <td className='ps-0'>
                                        <ScoreLine candidateGender={dat.gender} prevScore={prevScore} topic={topics} candidate={dat.Name} candidateNum={dat.nameId} candidateId={dat.id} judge={localStorage.getItem('judge')} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div >
            </div>
        </>
    )
}

export default Scoring;