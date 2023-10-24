import React, { useEffect, useState, useRef } from 'react'
import { pb } from '../pocketbase'



function Scoring() {
    const [data, setData] = useState()
    const [candidatePick, setCandidatePick] = useState()
    const ref = useRef(null)
    const [talent, setTalent] = useState(0)
    const [presentation, setPresentation] = useState(0)
    const [toggle, setToggle] = useState(false)
    const [poise, setPoise] = useState(10)
    const [score, setScore] = useState(0)

    useEffect(() => {
        setScore(parseInt(talent) + parseInt(presentation) + parseInt(poise))
    }, [talent, presentation, poise])

    useEffect(() => {
        if (poise > 50) {
            alert('Poise score cannot be more than 50')
            setPoise(0)
        }
    }, [poise])

    useEffect(() => {
        async function fetchData() {
            const record = await pb.collection('Contestants').getFullList();
            setData(record)
            setCandidatePick(record[0].id)
            console.log(record)
        }
        fetchData()
        if (localStorage.getItem('judge') === null) {
            window.location.href = '/'
        }
    }, [])

    const confirmScore = async () => {
        if (talent === 0 || presentation === 0) {
            alert('Please select score')
            return
        } else {
            setToggle(!toggle)
        }
    }

    const sendScores = async () => {
        const candidateData = await pb.collection('Contestants').getOne(candidatePick)
        const datastalent = {
            judge_name: localStorage.getItem('judge'),
            Candidate: candidateData.id,
            Score: talent,
            Category: 'Talent'
        }
        const recordtalent = await pb.collection('Scores').create(datastalent)
        const dataspresent = {
            judge_name: localStorage.getItem('judge'),
            Candidate: candidateData.id,
            Score: presentation,
            Category: 'Presentation'
        }
        const recordpoise = await pb.collection('Scores').create(dataspresent)
        const dataspoise = {
            judge_name: localStorage.getItem('judge'),
            Candidate: candidateData.id,
            Score: presentation,
            Category: 'Poise'
        }
        const recordpresent = await pb.collection('Scores').create(dataspoise)
        setToggle(!toggle)
    }

    const candidateName = data ? data.filter((item) => item.id === candidatePick)[0].Name : null

    useEffect(() => {
        console.log(talent)
        console.log(presentation)
        console.log(candidatePick)
    }, [talent, presentation])


    return (
        <>
            <div className='w-screen h-screen flex justify-center items-center'>
                <div className='w-[80vw] h-[90vh] bg-blue-300 rounded-3xl p-10'>
                    <h1 className='text-4xl font-bold uppercase'>Select contestant</h1>
                    <select ref={ref} onChange={() => setCandidatePick(ref.current.value)} name="contestant" id="contestant" className='p-5 rounded-xl text-2xl border-2'>
                        {data ? data.map((item, i) => (
                            <option key={i} value={item.id}>{item.Name}</option>
                        )) : (<option>Loading...</option>)}
                    </select>

                    <div className='flex justify-center items-center flex-col gap-10'>
                        <div className='w-[50%] h-auto'>
                            <h3 className='text-3xl p-5'>Talent</h3>
                            <form onChange={(e) => setTalent(e.target.value)} className='text-xl font-bold flex gap-4'>
                                <input style={{ height: "35px", width: "35px" }} value="50" type="radio" name="talent" id="talent" required />
                                <label for="talent">50</label>
                                <input style={{ height: "35px", width: "35px" }} value="40" type="radio" name="talent" id="talent" required />
                                <label for="talent">40</label>
                                <input style={{ height: "35px", width: "35px" }} value="30" type="radio" name="talent" id="talent" required />
                                <label for="talent">30</label>
                                <input style={{ height: "35px", width: "35px" }} value="20" type="radio" name="talent" id="talent" required />
                                <label for="talent">20</label>
                                <input style={{ height: "35px", width: "35px" }} value="10" type="radio" name="talent" id="talent" required />
                                <label for="talent">10</label>
                            </form>
                        </div>
                        <div className='w-[50%] h-auto'>
                            <h3 className='text-3xl p-5'>Presentation</h3>
                            <form onChange={(e) => setPresentation(e.target.value)} className='text-xl font-bold flex gap-4' >
                                <input style={{ height: "35px", width: "35px" }} value="50" type="radio" name="presentation" id="presentation" required />
                                <label for="presentation">50</label>
                                <input style={{ height: "35px", width: "35px" }} value="40" type="radio" name="presentation" id="presentation" required />
                                <label for="presentation">40</label>
                                <input style={{ height: "35px", width: "35px" }} value="30" type="radio" name="presentation" id="presentation" required />
                                <label for="presentation">30</label>
                                <input style={{ height: "35px", width: "35px" }} value="20" type="radio" name="presentation" id="presentation" required />
                                <label for="presentation">20</label>
                                <input style={{ height: "35px", width: "35px" }} value="10" type="radio" name="presentation" id="presentation" required />
                                <label for="presentation">10</label>
                            </form>
                        </div>
                        <div className='w-[50%] h-auto'>
                            <h3 className='text-3xl p-5'>Poise</h3>
                            <form onChange={(e) => setPresentation(e.target.value)} className='text-xl font-bold flex gap-4' >
                                <label for="poise">Poise</label>
                                <input type="number" onChange={(e) => setPoise(e.target.value)} />
                                <input className='w-[10rem]' value={poise} type="range" min="0" max="50" onChange={(e) => setPoise(e.target.value)} />
                            </form>
                        </div>
                        {toggle && (
                            <>
                                <div className='absolute w-[50vw] h-[40vh] top-10 bg-white z-10'>
                                    <h1>Is this your final scores?</h1>
                                    <p>Talent: {talent}</p>
                                    <p>Presentation: {presentation}</p>
                                    <p>Candidate: {candidateName}</p>
                                    <div className='flex gap-5'>
                                        <button onClick={() => setToggle(!toggle)} className='bg-red-500 p-5 rounded-xl text-white'>No</button>
                                        <button onClick={() => sendScores()} className='bg-blue-500 p-5 rounded-xl text-white'>Yes</button>
                                    </div>
                                </div>
                                <div className='w-screen h-screen absolute bg-black opacity-30'>
                                </div>
                            </>
                        )}
                        <h1 className='text-3xl'>Final Score: {score}</h1>
                        <button onClick={() => confirmScore()} className='w-[30%] h-20 rounded-2xl font-bold text-xl bg-white text-black'>Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Scoring;