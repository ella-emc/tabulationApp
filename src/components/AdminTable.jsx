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
            {/* {judgeId + " " + topic} */}
            <div onClick={() => getAdmin()} className='[&::-webkit-scrollbar]:hidden absolute w-40 h-16 border-t-0 top-0 left-5 text-2xl cursor-pointer border-2 border-purple-600 rounded-b-3xl bg-blue-100 text-center font-bold text-purple-900 flex place-content-evenly items-center ps-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span>Refetch</span>
            </div>
            <table className="table-fixed w-full overflow-scroll [&::-webkit-scrollbar]:w-0">
                <thead>
                    <tr className='bg-[#881497] text-white'>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Subcriterion</th>
                        <th className="ps-4 py-2 pe-30">Total</th>
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
                        .map((candidateName, index) => {
                            const candidateData = filteredData[candidateName];
                            const overallScore = candidateData.reduce((acc, item) => acc + item.score, 0);
                            const subcriterias = candidateData[0].subcriterias;
                            return (
                                <tr className="bg-white border-b-2 border-blue-400" key={candidateName}>
                                    <td className='text-center'>{candidateName}</td>
                                    <td className='py-3'>
                                        {candidateData.map((item, index) => {
                                            return (
                                                <tr className=" " key={`${candidateName}-${index}`}>
                                                    <td className='ps-28 pe-40 py-2 capitalize'>{item.subtopic}</td>
                                                    <td className='px-9 text-center'>{item.score}</td>
                                                </tr>
                                            );
                                        })}
                                    </td>
                                    <td className='text-center pe-30'>{overallScore}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    )
}

export default AdminTable