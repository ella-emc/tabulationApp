import React, { useEffect, useState, useRef } from 'react'
import { pb } from '../pocketbase'
import eventsource from 'eventsource'
import ScoreLine from './ScoreLine'



function Scoring() {
    const [topics, setTopics] = useState()
    const [data, setData] = useState([])

    global.EventSource = eventsource;

    useEffect(() => {
        async function scoreFetch() {
            const res = await pb.collection('Topic').getFullList()
            const dat = await pb.collection('Candidates').getFullList()
            console.log(res);
            console.log(dat);
            setTopics(res[0].topic)
            setData(dat)
        }
        scoreFetch()
    }, [])

    useEffect(() => {
        pb.collection('Topic').subscribe('*', function (e) {
            setTopics(e.record.topic)
        });
    }, [])

    return (
        <div className='flex w-[90vw] h-[90vh] bg-white rounded-3xl p-10 flex-col gap-5'>
            <h1 className='font-bold text-2xl'>Scoring</h1>
            <h2 className='text-2xl'>Topic: {topics}</h2>
            <ol className='flex flex-col gap-5'>
                {data.map((dat) => (
                    <li key={dat.id} className='font-italic uppercase'>{dat.nameId}
                        <ScoreLine topic={topics} candidate={dat.Name} candidateNum={dat.nameId} candidateId={dat.id} judge={localStorage.getItem('judge')} />
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default Scoring;