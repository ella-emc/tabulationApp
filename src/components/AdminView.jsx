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
            <div className="flex w-[80vw] h-[80vh] bg-white rounded-3xl flex-col gap-20 justify-center items-center">
                <input onChange={(e) => setAccount(e.target.value)} className={`w-[40vw] h-[8vh] p-10 border-2 text-2xl rounded-xl ${error.user && "border-red-400"}`} type="text" placeholder="Username" />
                <input onChange={(e) => setPassword(e.target.value)} className={`w-[40vw] h-[8vh] p-10 border-2 text-2xl rounded-xl ${error.pass && "border-red-400"}`} type="password" placeholder="password" />
                <button onClick={login} className="w-[40vw] h-[8vh] border-2 text-3xl rounded-xl bg-blue-200 hover:bg-blue-300">Login</button>
                {account + " " + password}
            </div>
        </>
    )
}

export default AdminView