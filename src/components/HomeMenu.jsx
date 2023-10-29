import React from 'react'

function HomeMenu() {
    const [picked, setPicked] = React.useState("")
    return (
        <div>
            <div className="w-screen h-screen flex justify-center items-center bg-blue-200">
                <div
                    className="w-[80vw] h-[80vh] flex flex-col gap-20 justify-center items-center bg-white rounded-3xl"
                >
                    <h1 className="text-3xl font-bold">Select the event</h1>
                    <div className="flex gap-10">
                        <h2 onClick={() => setPicked("closed")} className={`text-2xl font-bold p-10 border-2 rounded-xl ${picked === "closed" && "border-blue-600"} cursor-pointer hover:bg-blue-100`}>
                            Closed-Door Interview
                        </h2>
                        <h2 onClick={() => setPicked("coronation")} className={`text-2xl font-bold p-10 border-2 rounded-xl ${picked === "coronation" && "border-blue-600"} cursor-pointer hover:bg-blue-100`}>
                            Coronation Night
                        </h2>
                    </div>
                    {picked && (
                        <>
                            <h1 className='text-3xl font-bold'>Pick the interface</h1>
                            <div className='flex gap-10'>
                                <a href="/judges">
                                    <div className='border-2 p-10 w-60 text-center uppercase text-2xl rounded-2xl cursor-pointer hover:bg-blue-100'>
                                        Judges
                                    </div>
                                </a>
                                <a href="/adminview">
                                    <div className='border-2 p-10 w-60 text-center uppercase text-2xl rounded-2xl cursor-pointer hover:bg-blue-100'>
                                        Admin
                                    </div>
                                </a>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}

export default HomeMenu