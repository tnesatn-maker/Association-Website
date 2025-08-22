import React from 'react'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'

export default function SignIn(){
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [err, setErr] = React.useState('')
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    setErr('')
    try{
      await signInWithEmailAndPassword(auth, email, password)
      nav('/dashboard')
    }catch(e){
      setErr(e.message)
    }
  }

  const signInGoogle = async ()=>{
    try{
      await signInWithPopup(auth, googleProvider)
      nav('/dashboard')
    }catch(e){ setErr(e.message) }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <form className="grid gap-3" onSubmit={submit}>
        <input className="border rounded-xl p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border rounded-xl p-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary" type="submit">Sign in</button>
      </form>
      <button className="btn mt-3 w-full" onClick={signInGoogle}>Continue with Google</button>
      <p className="text-sm mt-3">New here? <Link className="text-tnesa-primary underline" to="/signup">Create an account</Link></p>
    </div>
  )
}
