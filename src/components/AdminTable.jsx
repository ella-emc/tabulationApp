import React, { useEffect } from 'react'
import { pb } from '../pocketbase.js'
import toast, { Toaster } from 'react-hot-toast'


function AdminTable({ judgeId, topic }) {
    const [data, setData] = React.useState([])

    useEffect(() => {

        getAdmin()
    }, [])

    async function getAdmin() {
        try {
            toast.loading('Fetching data')
            const res = await pb.collection('Scores').getFullList({
                sort: '-score',
                filter: `judge = "${judgeId}" && topic = "${topic}"`
            })
            console.log(res)
            if (res.length > 0) {
                setData(res)
                toast.dismiss()
                toast.success('Data fetched')
            } else {
                toast.dismiss()
                toast.error('No data found')
                setData([])
            }
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <div>
            <Toaster />
            {judgeId + " " + topic}
            <div onClick={() => getAdmin()} className='absolute w-40 h-16 border-t-0 top-0 left-5 p-0 text-2xl cursor-pointer border-2 border-black rounded-b-3xl bg-blue-100 text-center font-bold'>Refetch</div>
            <table className="table-auto w-full overflow-scroll">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Score</th>
                        <th className="px-4 py-2">Criterion</th>
                        <th className="px-4 py-2">Subcriterion</th>
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