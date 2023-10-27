import React, { useEffect } from 'react'
import { pb } from '../pocketbase.js'
import { useTable } from 'react-table'


function AdminTable() {
    const [data, setData] = React.useState([])

    useEffect(() => {
        async function getAdmin() {
            try {
                const res = await pb.collection('Scores').getFullList()
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
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Score</th>
                        <th className="px-4 py-2">Topic</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{item.name}</td>
                            <td className="border px-4 py-2">{item.score}</td>
                            <td className="border px-4 py-2">{item.topic}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminTable