import React, { useEffect } from 'react'
import { pb } from '../pocketbase'

function FullResult() {

    useEffect(() => {
        getFullResult()
    }, [])

    async function getFullResult() {
        try {

            const result = await pb.collection('Candidates').getFullList({
                expand: "Scores(candidate)"
            })
            console.log(result)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>Hello</div>
    )
}

export default FullResult