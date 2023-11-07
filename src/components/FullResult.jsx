import React, { useEffect } from 'react'
import { pb } from '../pocketbase'

function FullResult() {
    const [data, setData] = React.useState([])

    useEffect(() => {
        getFullResult()
    }, [])

    async function getFullResult() {
        try {

            const result = await pb.collection('ScoreFinal').getFullList({
                expand: "candidate, judge",
                sort: '-score'
            })
            console.log(result)
            setData(result)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='flex justify-center items-center w-screen h-screen'>
            <h1>Full Result</h1>
            <div>
                {data.map((item, index) => (
                    <div key={index} className='flex justify-between items-center w-1/2'>
                        <p>{item.expand.candidate.Name}</p>
                        <p>{item.expand.judge.Name}</p>
                        <p>{item.score}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FullResult