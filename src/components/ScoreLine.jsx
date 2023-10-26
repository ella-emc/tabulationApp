import React, { useEffect, useState } from 'react'
import { pb } from '../pocketbase'
import { useForm } from 'react-hook-form';

function ScoreLine({ topic, judge, candidate, candidateId, candidateNum }) {
    const [talent, setTalent] = useState({ performance: '', material: '', impact: '' })
    const [swimwear, setSwimwear] = useState({ beauty: '', presence: '', poise: '' })
    const [press, setPress] = useState({ intelligence: '', beauty: '', appeal: '' })
    const [formal, setFormal] = useState({ attire: '', presence: '', poise: '' })
    const [question, setQuestion] = useState({ intelligence: '', poise: '' })
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [submit, setSubmit] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = data => {
        setTalent({ performance: data.talentperformance, material: data.talentmaterial, impact: data.talentimpact })
        console.log(data)
        submitScore()
    };

    const beforeSubmit = () => {
        setConfirm(true)
    }

    const submitState = () => {
        setSubmit(true)
        localStorage.setItem('submitTalent', true)
        localStorage.setItem(topic + candidateNum, candidateId)
    }

    async function submitScore(data) {
        try {
            if (topic === 'talent') {
                setLoading(true)
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
                submitState()
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
        <div className='flex gap-10'>

            <div>
                <h1>{topic}</h1>
                <h2>{judge}</h2>
                <h3>{candidate}</h3>
                <h3>{candidateId}</h3>
            </div>
            {localStorage.getItem('submitTalent') === 'true' && localStorage.getItem(topic + candidateNum) === candidateId ? (<div>Submitted</div>) : (<div className='flex gap-4'>
                {topic === 'talent' ? (
                    <form onSubmit={handleSubmit(submitScore)} className='flex gap-5'>
                        <input className={`border-2 relative p-3 text-md font-bold rounded-3xl ${errors.talentperformance && "border-l-[2rem] border-red-400"} transition-all`} type="number" placeholder='Performance' {...register("talentperformance", { required: true, max: 50, min: 0, maxLength: 2 })} />

                        <input className={`border-2 relative p-3 text-md font-bold rounded-3xl ${errors.talentmaterial && "border-l-[2rem] border-red-400"} transition-all`} type="number" placeholder='Performance' {...register("talentmaterial", { required: true, max: 50, min: 0, maxLength: 2 })} />

                        <input className={`border-2 relative p-3 text-md font-bold rounded-3xl ${errors.talentimpact && "border-l-[2rem] border-red-400"} transition-all`} type="number" placeholder='Performance' {...register("talentimpact", { required: true, max: 50, min: 0, maxLength: 2 })} />

                        {submit === false && confirm === false ? (<button onClick={beforeSubmit} className='p-10 rounded-full bg-blue-400 text-2xl font-bold text-white cursor-pointer hover:bg-blue-300'>Submit</button>) : (<input className={`p-10 rounded-full bg-red-400 text-2xl font-bold text-white cursor-pointer hover:bg-red-300 ${loading && "animate-spin"}`} type="submit" value={loading ? "C" : "Confirm?"} />)}
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