import React, { useEffect } from 'react'
import { pb } from '../pocketbase.js'
import toast, { Toaster } from 'react-hot-toast'


function AdminTable({ judgeId, topic }) {
    const [data, setData] = React.useState([])
    const [filteredData, setFilteredData] = React.useState({})

    useEffect(() => {

        getAdmin()
    }, [])

    async function getAdmin() {
        try {
            toast.loading('Fetching data')
            const res = await pb.collection('Scores').getFullList({
                sort: '-score',
                filter: `judge = "${judgeId}" && topic = "${topic}"`,
                expand: "candidate"
            })
            console.log(res)
            console.log(res.length)
            if (res.length > 0) {
                setData(res)
                toast.dismiss()
                toast.success('Data fetched')
            } else {
                toast.dismiss()
                toast.error('No data found')
                setData([])
            }
            const groupedData = res.reduce((acc, item) => {
                const candidateName = item.expand.candidate.Name;
                if (!acc[candidateName]) {
                    acc[candidateName] = [item];
                } else {
                    acc[candidateName].push(item);
                }
                return acc;
            }, {});
            console.log(groupedData);
            setFilteredData(groupedData);
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <div>
            <Toaster />
            {judgeId + " " + topic}
            <div onClick={() => getAdmin()} className='[&::-webkit-scrollbar]:hidden absolute w-40 h-16 border-t-0 top-0 left-5 p-0 text-2xl cursor-pointer border-2 border-black rounded-b-3xl bg-blue-100 text-center font-bold'>Refetch</div>
            <table className="table-auto w-full overflow-scroll [&::-webkit-scrollbar]:w-0">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Score</th>
                        <th className="px-4 py-2">Criterion</th>
                        <th className="px-4 py-2">Subcriterion</th>
                    </tr>
                </thead>
                <tbody className='[&::-webkit-scrollbar]:hidden'>
                    {/* {data.map((item, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{item.expand.candidate.Name}</td>
                            <td className="border px-4 py-2">{item.score}</td>
                            <td className="border px-4 py-2">{item.topic}</td>
                            <td className="border px-4 py-2">{item.subtopic}</td>
                        </tr>
                    ))} */}
                    {Object.keys(filteredData)
                        .sort((a, b) => {
                            const aScore = filteredData[a].reduce((acc, item) => acc + item.score, 0);
                            const bScore = filteredData[b].reduce((acc, item) => acc + item.score, 0);
                            return bScore - aScore;
                        })
                        .map((candidateName) => {
                            const candidateData = filteredData[candidateName];
                            const overallScore = candidateData.reduce((acc, item) => acc + item.score, 0);
                            const subcriterias = candidateData[0].subcriterias;
                            return (
                                <tr className='border-b-2 border-blue-400' key={candidateName}>
                                    <td>{candidateName}</td>
                                    <td>{overallScore}</td>
                                    <td>
                                        <table className='table-fixed'>
                                            <thead>
                                                <tr>
                                                    <th>Subcriteria</th>
                                                    <th>Score</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {candidateData.map((item, index) => {
                                                    return (
                                                        <tr key={`${candidateName}-${index}`}>
                                                            <td>{item.subtopic}</td>
                                                            <td>{item.score}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    )
}

export default AdminTable