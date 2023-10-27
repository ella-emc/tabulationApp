import React, { useEffect } from 'react'
import { pb } from '../pocketbase.js'


function AdminTable({ judgeId, topic }) {
    const [data, setData] = React.useState([])

    useEffect(() => {
        async function getAdmin() {
            try {
                const res = await pb.collection('Scores').getFullList({
                    sort: '-score',
                    filter: ''
                })
                console.log(res)
                if (res.length > 0) {
                    setData(res)
                }
            } catch (e) {
                console.log(e)
            }
        }
        getAdmin()
    }, [])


    return (
        <div>
            {judgeId + " " + topic}
            <div className='absolute p-5 cursor-pointer border-2 border-black rounded-full bg-blue-100 text-center font-bold'>Refetch</div>
            <table className="table-auto w-full overflow-scroll">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Score</th>
                        <th className="px-4 py-2">Topic</th>
                        <th className="px-4 py-2">Subtopic</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{item.name}</td>
                            <td className="border px-4 py-2">{item.score}</td>
                            <td className="border px-4 py-2">{item.topic}</td>
                            <td className="border px-4 py-2">{item.subtopic}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminTable