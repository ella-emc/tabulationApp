
import React, { useEffect, useState } from 'react'
import { pb } from '../pocketbase'
import { set, useForm } from 'react-hook-form';

/**
 * ScoreLine component that displays the score form for a candidate in a specific topic
 * @param {Object} props - Component props
 * @param {string} props.topic - The topic of the score form
 * @param {string} props.judge - The name of the judge submitting the score
 * @param {string} props.candidate - The name of the candidate being scored
 * @param {string} props.candidateId - The ID of the candidate being scored
 * @param {string} props.candidateNum - The number of the candidate being scored
 * @param {string} props.prevScore - The previous scores for the candidate
 * @param {string} props.candidateGender - The gender of the candidate being scored
 * @returns {JSX.Element} - The ScoreLine component
 */
function ScoreLine({ topic, judge, candidate, candidateId, candidateNum, prevScore, candidateGender }) {
    const [talent, setTalent] = useState({ performance: '', material: '', impact: '' })
    const [swimwear, setSwimwear] = useState({ beauty: '', presence: '', poise: '' })
    const [press, setPress] = useState({ intelligence: '', beauty: '', appeal: '' })
    const [formal, setFormal] = useState({ attire: '', presence: '', poise: '' })
    const [question, setQuestion] = useState({ intelligence: '', poise: '' })
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [submit, setSubmit] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [datarender, setDatarender] = useState(null)

    /**
     * Redirects the user to the login page if the judge is not logged in
     */
    useEffect(() => {
        if (localStorage.getItem('judge') === null) {
            window.location.href = '/'
        }
    }, [])

    /**
     * Handles form submission for the talent topic
     * @param {Object} data - The form data submitted by the user
     */
    const onSubmit = data => {
        setTalent({ performance: data.talentperformance, material: data.talentmaterial, impact: data.talentimpact })
        console.log(data)

    };

    /**
     * Filters the previous scores to get the data for the current candidate
     */
    const filterData = () => {
        const data = prevScore.filter(item => item.candidate === candidateId)
        console.log(data)
    }

    /**
     * Sets the confirm state to true before submitting the form
     */
    const beforeSubmit = () => {
        setConfirm(true)
    }

    /**
     * Sets the submit state to true and saves the score to local storage
     * @param {Object} data - The form data submitted by the user
     */
    const submitState = (data) => {
        setSubmit(true)
        localStorage.setItem(topic + candidateNum + candidateGender, candidateId)
        localStorage.setItem(topic + candidateNum + candidateGender + 'score', data.talentperformance + " " + data.talentmaterial + " " + data.talentimpact)

    }

    /**
     * Submits the score to the database based on the topic
     * @param {Object} data - The form data submitted by the user
     */
    async function submitScore(data) {
        try {
            if (topic === 'talent') {
                try {
                    setLoading(true)
                    onSubmit(data)
                    await pb.collection('Scores').create({
                        topic: topic,
                        subtopic: "performance",
                        score: data.talentperformance,
                        judge: judge,
                        candidate: candidateId
                    })
                    await pb.collection('Scores').create({
                        topic: topic,
                        subtopic: "material",
                        score: data.talentmaterial,
                        judge: judge,
                        candidate: candidateId
                    })
                    await pb.collection('Scores').create({
                        topic: topic,
                        subtopic: "impact",
                        score: data.talentimpact,
                        judge: judge,
                        candidate: candidateId
                    })
                    setLoading(false)
                    submitState(data)
                } catch (error) {
                    console.log(error);
                    setLoading(false)
                }
            } else if (topic === 'swimwear') {
                await pb.collection('Scores').create({
                    topic: topic,
                    beauty: swimwear.beauty,
                    presence: swimwear.presence,
                    poise: swimwear.poise,
                    judge: judge,
                    candidate: candidateId
                })
            } else if (topic === 'press') {
                await pb.collection('Scores').create({
                    topic: topic,
                    intelligence: press.intelligence,
                    beauty: press.beauty,
                    appeal: press.appeal,
                    judge: judge,
                    candidate: candidateId
                })
            } else if (topic === 'formal') {
                await pb.collection('Scores').create({
                    topic: topic,
                    attire: formal.attire,
                    presence: formal.presence,
                    poise: formal.poise,
                    judge: judge,
                    candidate: candidateId
                })
            } else if (topic === 'question') {
                await pb.collection('Scores').create({
                    topic: topic,
                    intelligence: question.intelligence,
                    poise: question.poise,
                    judge: judge,
                    candidate: candidateId
                })
            }

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='flex gap-10 justify-center items-center px-2 py-3'>
            {/* <button onClick={() => console.log(prevScore.filter(item => item.judge === localStorage.getItem('judge') && item.id === candidateId))}>dump json</button> */}
            <div>
                {/* <h1 className='font-bold text-2xl'>{candidateId}</h1> */}
                {/* <h1>{topic}</h1> */}
                {/* <h2>{judge}</h2> */}
                {/* <h3 className='font-semibold text-xl'>{candidateNum}</h3> */}
                {/* <h3>{candidateId}</h3> */}
            </div>
            {localStorage.getItem('judge') === judge && localStorage.getItem(topic + candidateNum + candidateGender) === candidateId ? (<div className='flex gap-32' >Submitted! {localStorage.getItem(`${topic + candidateNum + candidateGender}score`).split(" ").map((num, i) => (
                <span key={i}>{num}% </span>
            ))}</div>) : (<div className='flex gap-4'>
                {topic === 'talent' ? (
                    <form onSubmit={handleSubmit(submitScore)} className='flex w-fit h-14 gap-5'>
                        <input className={`border-2 relative w-52 p-3 text-md font-bold rounded-3xl ${errors.talentperformance && "border-l-[2rem] border-red-400"} transition-all`} type="number" placeholder='Performance 0 - 60%' {...register("talentperformance", { required: true, max: 60, min: 0, maxLength: 2 })} />

                        <input className={`border-2 w-52 relative p-3 text-md font-bold rounded-3xl ${errors.talentmaterial && "border-l-[2rem] border-red-400"} transition-all`} type="number" placeholder='Material 0 - 30%' {...register("talentmaterial", { required: true, max: 30, min: 0, maxLength: 2 })} />

                        <input className={`border-2 w-52 relative p-3 text-md font-bold rounded-3xl ${errors.talentimpact && "border-l-[2rem] border-red-400"} transition-all`} type="number" placeholder='Impact 0-10%' {...register("talentimpact", { required: true, max: 10, min: 0, maxLength: 2 })} />

                        {submit === false && confirm === false ? (<button onClick={beforeSubmit} className='px-5 rounded-full bg-blue-400 text-xl text-center font-bold text-white cursor-pointer hover:bg-blue-300'>Submit</button>) : (<input className={`px-5 rounded-full bg-red-400 text-xl font-bold text-white cursor-pointer disabled:opacity-70 hover:bg-red-300 ${loading && "animate-spin"}`} disabled={loading} type="submit" value={loading ? "C" : `Confirm? ${parseInt(watch("talentperformance") || 0) + parseInt(watch("talentmaterial") || 0) + parseInt(watch("talentimpact") || 0)}%`} />)}
                    </form>
                ) : topic === 'swimwear' ? (
                    <div className='flex gap-5'>
                        <input className='border-2 p-3 text-md font-bold rounded-3xl' type="number" placeholder='Beauty of Figure' />
                        <input className='border-2 p-3 text-md font-bold rounded-3xl' type="number" placeholder='Stage Presence' />
                        <input className='border-2 p-3 text-md font-bold rounded-3xl' type="number" placeholder='Poise and Bearing' />
                    </div>
                ) : topic === 'press' ? (
                    <>
                        <input className='border-2 p-3 text-md font-bold rounded-3xl' type="number" placeholder='Intelligence, wit, and style of delivery ' />
                        <input className='border-2 p-3 text-md font-bold rounded-3xl' type="number" placeholder='Beauty, poise, and appearance' />
                        <input className='border-2 p-3 text-md font-bold rounded-3xl' type="number" placeholder='Audience Appeal' />
                    </>
                ) : topic === 'formal' ? (
                    <>
                        <input className='border-2 p-3 text-md font-bold rounded-3xl' type="number" placeholder='Attire and Carriage, Personality ' />
                        <input className='border-2 p-3 text-md font-bold rounded-3xl' type="number" placeholder='Stage Presence' />
                        <input className='border-2 p-3 text-md font-bold rounded-3xl' type="number" placeholder='Poise and Bearing ' />
                    </>
                ) : topic === 'question' ? (
                    <div className='flex gap-4'>
                        <input className='border-2 p-3 text-md font-bold rounded-3xl' type="number" placeholder='Intelligence' />
                        <input className='border-2 p-3 text-md font-bold rounded-3xl' type="number" placeholder='Poise and Personality' />
                    </div>
                ) : 'no topic'}
            </div>)}
        </div>
    )
}

export default ScoreLine