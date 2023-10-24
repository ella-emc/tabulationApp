
import React, { useEffect, useRef, useState } from 'react'
import { pb } from '../pocketbase'



function Judge() {
    const ref = useRef(null)
    const [value, setValue] = useState('Ella')
    const [toggle, setToggle] = useState(false)
    const [data, setData] = useState()
    const [disable, setDisable] = useState(false)


    useEffect(() => {
        async function fetchData() {
            const record = await pb.collection('Judges').getFullList();
            console.log(record)
            setData(record)
            setValue(record[0].id)
        }
        fetchData()
    }, [])



    const handleSubmit = async () => {
        setDisable(true)
        const data = await pb.collection('Judges').getOne(value)
        if (data.LoggedIn === true) {
            alert('Judge already logged in')
            setToggle(!toggle)
            setDisable(false)
            return
        } else {
            await pb.collection('Judges').update(value, { LoggedIn: true })
            localStorage.setItem('judge', value)
            console.log(value)
            setToggle(!toggle)
            window.location.href = '/scoring'
        }
    }

    return (
        <div className="w-screen h-screen bg-blue-200 flex justify-center items-center">
            <div
                className="w-[70vw] h-[80vh] bg-white rounded-2xl flex flex-col justify-center items-center list-none font-bold gap-10"
            >
                <p className="text-4xl">Select Judge</p>
                <form className="p-5">
                    <select
                        ref={ref}
                        name="judge"
                        id="judge"
                        className="rounded-xl p-6 text-2xl border-2"
                        onChange={() => setValue(ref.current.value)}
                    >
                        {data ? data.map((item, i) => (
                            <option key={i} value={item.id}>{item.Name}</option>
                        )) : (
                            <option> Loading...</option>
                        )}
                    </select>

                </form>
                <button
                    onClick={() => setToggle(!toggle)}
                    disabled={!data}
                    className="bg-blue-500 rounded-xl p-6 text-2xl text-white disabled:opacity-10">Submit</button
                >
            </div>
            {
                toggle && (
                    <>
                        <div className='absolute w-screen h-screen bg-black opacity-25'>
                        </div>
                        <div className='w-[50vw] h-[30vh] flex flex-col gap-5 justify-center items-center absolute top-10 bg-gray-200 rounded-2xl opacity-100'>
                            <h2 className='text-4xl'>Are you sure with this information?</h2>
                            <p className='text-3xl'>Judge: {value}</p>
                            <div className='flex gap-5'>
                                <button
                                    onClick={() => handleSubmit()}
                                    disabled={disable}
                                    className='bg-blue-500 rounded-xl p-6 text-2xl text-white disabled:opacity-50'>{disable ? "Loading" : "Yes"}</button>
                                <button
                                    onClick={() => setToggle(!toggle)}
                                    className='bg-red-500 rounded-xl p-6 text-2xl text-white'>No</button>
                            </div>
                        </div>
                    </>
                )
            }
        </div >
    )
}

export default Judge