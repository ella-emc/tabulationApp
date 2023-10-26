import React from 'react'
import { pb } from '../pocketbase.js'

function Dashboard() {
    const [toggle, setToggle] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    async function getToggle() {
        try {
            setLoading(true)
            const res = await pb.collection('ControlUnlock').update('w3kuc2a0rtq7x5e', { viewunlock: toggle })
            setToggle(!toggle)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-10 w-[80vw] h-[80vh] justify-center items-center bg-white rounded-3xl">
            <h1 className="text-4xl font-bold uppercase">Dashboard</h1>
            <div onClick={getToggle} className={`w-40 h-20 cursor-pointer rounded-full border-2 border-black flex items-center transition-all`}>
                <div className={`w-16 h-16 mx-1 flex justify-center items-center bg-blue-300 rounded-full ${toggle && "translate-x-20 bg-red-300"} transition-all`}>
                    {loading ? (<h1 className='font-bold text-3xl animate-spin'>C</h1>) : toggle ? (<h1 className='font-bold text-3xl'>X</h1>) : (<h1 className='font-bold text-3xl'>O</h1>)}
                </div>
            </div>

        </div>
    )
}

export default Dashboard