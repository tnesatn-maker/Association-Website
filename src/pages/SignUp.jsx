import React from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'

export default function SignUp(){
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [companyName, setCompanyName] = React.useState('')
  const [contactPerson, setContactPerson] = React.useState('')
  const [city, setCity] = React.useState('')
  const [err, setErr] = React.useState('')
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    setErr('')
    try{
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db,'members', cred.user.uid), {
        companyName, contactPerson, city,
        createdAt: serverTimestamp(),
        badgeLevel: 'Silver',
        verified: false,
        public: true,
        avgRating: 0
      })
      nav('/dashboard')
    }catch(e){
      setErr(e.message)
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold mb-4">Join TNESA</h1>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <form className="grid gap-3" onSubmit={submit}>
        <input className="border rounded-xl p-2" placeholder="Company Name" value={companyName} onChange={e=>setCompanyName(e.target.value)} />
        <input className="border rounded-xl p-2" placeholder="Contact Person" value={contactPerson} onChange={e=>setContactPerson(e.target.value)} />
        <input className="border rounded-xl p-2" placeholder="City" value={city} onChange={e=>setCity(e.target.value)} />
        <input className="border rounded-xl p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border rounded-xl p-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary" type="submit">Create Account</button>
      </form>
      <p className="text-sm mt-3">Already a member? <Link className="text-tnesa-primary underline" to="/signin">Sign in</Link></p>
    </div>
  )
}
