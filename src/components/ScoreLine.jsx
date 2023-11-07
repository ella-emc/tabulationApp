
import { useEffect, useState } from 'react'
import { pb } from '../pocketbase'
import { useForm } from 'react-hook-form';
import { Form, Formik } from 'formik';
import Input from './Input';
import { motion } from "framer-motion"
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

    const [isLocked, setIsLocked] = useState(false);


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
    const [topics, setTopics] = useState('')

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
        if (topic === 'swimwear') {
            localStorage.setItem(topic + candidateNum + candidateGender + 'score', data.swimwearbeauty + " " + data.swimwearpresence + " " + data.swimwearpoise)
        } else if (topic === 'formal') {
            localStorage.setItem(topic + candidateNum + candidateGender + 'score', data.formalattire + " " + data.formalpresence + " " + data.formalpoise)
        } else if (topic === 'question') {
            localStorage.setItem(topic + candidateNum + candidateGender + 'score', data.questionintelligence + " " + data.questionpoise)
        }

    }

    /**
     * Submits the score to the database based on the topic
     * @param {Object} data - The form data submitted by the user
     */
    async function submitScore(data) {
        try {
            if (topic === 'swimwear') {
                try {
                    setLoading(true)
                    onSubmit(data)
                    await pb.collection('Scores').create({
                        topic: topic,
                        subtopic: "beauty",
                        score: data.swimwearbeauty,
                        judge: judge,
                        candidate: candidateId
                    })
                    await pb.collection('Scores').create({
                        topic: topic,
                        subtopic: "material",
                        score: data.swimwearpresence,
                        judge: judge,
                        candidate: candidateId
                    })
                    await pb.collection('Scores').create({
                        topic: topic,
                        subtopic: "impact",
                        score: data.swimwearpoise,
                        judge: judge,
                        candidate: candidateId
                    })
                    await pb.collection('ScoreFinal').create({
                        segment: topic,
                        score: parseInt(data.swimwearpoise) + parseInt(data.swimwearpresence) + parseInt(data.swimwearbeauty),
                        judge: judge,
                        candidate: candidateId
                    })
                    setLoading(false)
                    submitState(data)
                } catch (error) {
                    console.log(error);
                    setLoading(false)
                }
            } else if (topic === 'formal') {
                try {
                    setLoading(true)
                    onSubmit(data)
                    await pb.collection('Scores').create({
                        topic: topic,
                        subtopic: "attire",
                        score: data.formalattire,
                        judge: judge,
                        candidate: candidateId
                    })
                    await pb.collection('Scores').create({
                        topic: topic,
                        subtopic: "presence",
                        score: data.formalpresence,
                        judge: judge,
                        candidate: candidateId
                    })
                    await pb.collection('Scores').create({
                        topic: topic,
                        subtopic: "poise",
                        score: data.formalpoise,
                        judge: judge,
                        candidate: candidateId
                    })
                    setLoading(false)
                    submitState(data)
                } catch (error) {
                    console.log(error);
                    setLoading(false)
                }
            } else if (topic === 'question') {
                try {
                    setLoading(true)
                    onSubmit(data)
                    await pb.collection('Scores').create({
                        topic: topic,
                        subtopic: "intelligence",
                        score: data.questionintelligence,
                        judge: judge,
                        candidate: candidateId
                    })
                    await pb.collection('Scores').create({
                        topic: topic,
                        subtopic: "poise",
                        score: data.questionpoise,
                        judge: judge,
                        candidate: candidateId
                    })
                    setLoading(false)
                    submitState(data)
                } catch (error) {
                    console.log(error);
                    setLoading(false)
                }
            }

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='flex py-3 px-3'>
            {/* <button onClick={() => console.log(prevScore.filter(item => item.judge === localStorage.getItem('judge') && item.id === candidateId))}>dump json</button> */}
            <div>
                {/* <h1 className='font-bold text-2xl'>{candidateId}</h1> */}
                {/* <h1>{topic}</h1> */}
                {/* <h2>{judge}</h2> */}
                {/* <h3 className='font-semibold text-xl'>{candidateNum}</h3> */}
                {/* <h3>{candidateId}</h3> */}
            </div>
            {localStorage.getItem('judge') === judge && localStorage.getItem(topic + candidateNum + candidateGender) === candidateId ? (<div className='flex gap-6' >{localStorage.getItem(`${topic + candidateNum + candidateGender}score`).split(" ").map((num, i) => (
                <span className='w-56 text-center' key={i}>{num}% </span>
            ))} <p className='font-bold uppercase text-green-600'>Submitted!</p></div>) : (<div className='flex gap-4'>
                {topic === 'swimwear' ? (
                    <Formik initialValues={{
                        BOF: "",
                        SP: "",
                        PAB: "",
                    }}
                        onSubmit={(value, action) => {
                            if(!isLocked){
                                setIsLocked(true)
                                return;
                            }
                            console.log(value)
                            action.resetForm();
                            setIsLocked(false)
                        }}

                    >
                        <Form className='grid grid-cols-4 gap-4'>
                            <Input type="number" name="BOF" placeholder="Beauty of Figure" disabled={isLocked} />
                            <Input type="number" name="SP" placeholder="Stage Presence" disabled={isLocked} />
                            <Input type="number" name="PAB" placeholder="Poise and Bearing" disabled={isLocked} />

                            <motion.button whileTap={{scale: 0.9}} type={!isLocked ? "submit" : "button"} className='border border-gray-400 bg-fuchsia-800 text-white text-lg font-bold rounded-[5px]' >{isLocked ? "Submit" : "Lock"}</motion.button>
                        </Form>
                    </Formik>
                ) : topic === 'formal' ? (
                    <>
                        <span>Formal</span>
                        {/* <form onSubmit={handleSubmit(submitScore)} className='flex w-fit h-14 gap-6'>
                            <input className={`border-2 relative w-52 p-3 text-md font-medium rounded-3xl ${errors.formalattire && "border-l-[2rem] border-red-400"} transition-all`} type="number" placeholder='Attire and Carriage' {...register("formalattire", { required: true, max: 15, min: 0, maxLength: 2 })} />

                            <input className={`border-2 w-52 relative p-3 text-md font-medium rounded-3xl ${errors.formalpresence && "border-l-[2rem] border-red-400"} transition-all`} type="number" placeholder='Stage Presence' {...register("formalpresence", { required: true, max: 5, min: 0, maxLength: 1 })} />

                            <input className={`border-2 w-52 relative p-3 text-md font-medium rounded-3xl ${errors.formalpoise && "border-l-[2rem] border-red-400"} transition-all`} type="number" placeholder='Poise and Bearing' {...register("formalpoise", { required: true, max: 5, min: 0, maxLength: 1 })} />

                            {submit === false && confirm === false ? (<button onClick={beforeSubmit} className={`px-5 rounded-full text-xl text-center font-bold text-white cursor-pointer ${candidateGender === "male" ? "bg-sky-400 hover:bg-sky-300" : "bg-pink-400 hover:bg-pink-300"}`}>Submit</button>) : (<input className={`px-5 rounded-full bg-red-400 text-xl font-bold text-white cursor-pointer disabled:opacity-70 hover:bg-red-300 ${loading && "animate-spin"}`} disabled={loading} type="submit" value={loading ? "C" : `Confirm? ${parseInt(watch("formalattire") || 0) + parseInt(watch("formalpresence") || 0) + parseInt(watch("formalpoise") || 0)}%`} />)}
                        </form> */}
                    </>
                ) : topic === 'question' ? (
                    <>
                        <span>Questio</span>
                        {/* <form onSubmit={handleSubmit(submitScore)} className='flex w-fit h-14 gap-12'>
                        <input className={`border-2 relative w-64 p-3 text-md font-medium rounded-3xl ${errors.questionintelligence && "border-l-[2rem] border-red-400"} transition-all`} type="number" placeholder='Intelligence' {...register("questionintelligence", { required: true, max: 25, min: 0, maxLength: 2 })} />

                        <input className={`border-2 w-64 relative p-3 text-md font-medium rounded-3xl ${errors.questionpoise && "border-l-[2rem] border-red-400"} transition-all`} type="number" placeholder='Poise and Personality' {...register("questionpoise", { required: true, max: 25, min: 0, maxLength: 2 })} />

                        {submit === false && confirm === false ? (<button onClick={beforeSubmit} className={`px-5 rounded-full text-xl text-center font-bold text-white cursor-pointer ${candidateGender === "male" ? "bg-sky-400 hover:bg-sky-300" : "bg-pink-400 hover:bg-pink-300"}`}>Submit</button>) : (<input className={`px-5 rounded-full bg-red-400 text-xl font-bold text-white cursor-pointer disabled:opacity-70 hover:bg-red-300 ${loading && "animate-spin"}`} disabled={loading} type="submit" value={loading ? "C" : `Confirm? ${parseInt(watch("questionintelligence") || 0) + parseInt(watch("questionpoise") || 0)}%`} />)}
                    </form> */}
                    </>
                ) : 'no topic'}
            </div>)}
        </div>
    )
}

export default ScoreLine