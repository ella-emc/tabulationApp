
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
            <div className='flex w-[95vw] h-[95vh] bg-white rounded-3xl p-10 flex-col'>
                <div className="flex gap-10 mb-10">
                    <h1 className='font-bold text-4xl'>Scoring</h1>
                    <h2 className='text-2xl font-semibold'>Topic: {topics}</h2>
                </div>
                <div className="flex gap-5">
                    <div onClick={() => changeTab("male")} className={`px-10 text-xl cursor-pointer py-5 rounded-t-xl border-2 border-b-0 hover:bg-slate-200 ${gender === 'male' && "bg-blue-200"} `}>{loading ? <p className='animate-spin'>C</p> : "Male"}</div>
                    <div onClick={() => changeTab("female")} className={`px-10 text-xl cursor-pointer py-5 rounded-t-xl border-2 border-b-0 hover:bg-slate-200 ${gender === 'female' && "bg-blue-200"} `}>{loading ? <p className='animate-spin'>C</p> : "Female"}</div>
                </div>
                <table className='flex flex-col gap-10  h-full overflow-scroll border-2 p-5'>
                    <thead>

                        {topics === 'swimwear' ? (
                            <tr className='flex gap-20'>
                                <th className='mr-8'>Candidates</th>
                                {/* <th>Scores</th> */}
                                <th>Beauty of Figure 0 - 15%</th>
                                <th>Stage Presence 0 - 5%</th>
                                <th>Poise and Bearing 0 - 5%</th>
                            </tr>

                        ) : topics === 'formal' ? (
                            <tr className='flex gap-20'>
                                <th className='mr-8'>Candidates</th>
                                {/* <th>Scores</th> */}
                                <th>Attire and Carriage 0 - 15%</th>
                                <th>Stage Presence 0 - 5%</th>
                                <th>Poise and Bearing 0 - 5%</th>
                            </tr>
                        ) : topics === 'question' ? (
                            <tr className='flex gap-20'>
                                <th className='mr-8'>Candidates</th>
                                {/* <th>Scores</th> */}
                                <th>Intelligence 0 - 25%</th>
                                <th>Poise and Personality 0 - 25%</th>
                            </tr>
                        ) : (<tr><th>not found</th></tr>)}

                    </thead>

                    <tbody>
                        {data.map((dat) => (
                            <tr key={dat.id} className='font-italic items-center uppercase flex gap-5'>
                                <td className='font-semibold mr-5'>{dat.nameId}</td>
                                {/* <td onClick={() => setSubmitScore(true)} className='text-center font bold bg-blue-400 rounded-2xl px-4 py-2 font-bold text-white'>Submit Scores</td> */}
                                <td>
                                    <ScoreLine candidateGender={dat.gender} prevScore={prevScore} topic={topics} candidate={dat.Name} candidateNum={dat.nameId} candidateId={dat.id} judge={localStorage.getItem('judge')} />
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div >
        </>
    )
}

export default Scoring;