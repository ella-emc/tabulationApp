import React, { useEffect } from 'react'
import { pb } from '../pocketbase.js'
import { Toaster, toast } from 'react-hot-toast'

function AdminView() {
    const [account, setAccount] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState({ user: false, pass: false })


    function login() {
        async function getAccount() {
            try {
                toast.loading("Checking details")
                const authData = await pb.collection('Admin').getFullList()
                console.log(authData)
                let dat = authData.find(arr => arr.username === account && arr.password === password) || "not found"
                console.log(dat)
                if (dat === "not found") {
                    toast.dismiss()
                    toast.error("Account not found")
                } else if (dat.loggedIn === true) {
                    toast.dismiss()
                    toast.error("Account already logged in")
                } else {
                    toast.dismiss()
                    toast.success("Account found")
                    localStorage.setItem("admin", dat.id)
                    await pb.collection('Admin').update(dat.id, { loggedIn: true })
                    window.location.href = "/adminview/dashboard"
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (account === "" && password === "") {
            toast.error("Please fill in the form")
            setError({ user: true, pass: true })
            return
        } else if (account === "") {
            setError({ user: true })
            return
        } else if (password === "") {
            setError({ pass: true })
            return
        } else {
            getAccount()
        }

    }


    return (
        <>
            <Toaster />
            <div className="flex w-full h-full bg-fuchsia-100 flex-col justify-center items-center">
                <img src="/img/mmbu23_logo.png" className='w-48 mb-12' alt="" srcset="" />
                <span className='text-4xl mb-7'>Welcome, <span className='text-fuchsia-600'>Admin</span></span>
                <div className='flex flex-col'>
                    <span className='ms-4'>Username</span>
                    <input onChange={(e) => setAccount(e.target.value)} className={`w-80 h-12 p-4 border-2 border-fuchsia-700 shadow-xl shadow-black-100 text-base rounded-xl ${error.user && "border-red-400"}`} type="text" placeholder="Username" />
                    <span className='ms-4 mt-7'>Password</span>
                    <input onChange={(e) => setPassword(e.target.value)} className={`w-80 h-12 p-4 border-2 border-fuchsia-700 shadow-xl shadow-black-100 text-base rounded-xl ${error.pass && "border-red-400"}`} type="password" placeholder="Password" />
                </div>
                <button onClick={login} className="w-52 h-[8vh] mt-12 border-2 text-3xl rounded-xl bg-fuchsia-800 text-white hover:bg-fuchsia-400">Login</button>
                {/* {account + " " + password} */}
            </div>
        </>
    )
}

export default AdminView