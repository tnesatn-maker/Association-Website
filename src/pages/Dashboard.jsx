import React from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuthState } from '../components/useAuthState'
import { db, storage } from '../firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function DashboardInner(){
  const { user } = useAuthState()
  const [form, setForm] = React.useState({
    companyName:'', contactPerson:'', city:'', services:'', about:'', phone:'', website:'', public:true
  })
  const [certificateFile, setCertificateFile] = React.useState(null)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(()=>{
    (async ()=>{
      const snap = await getDoc(doc(db,'members', user.uid))
      if(snap.exists()){
        setForm({ ...form, ...snap.data() })
      }
    })()
  // eslint-disable-next-line
  },[user?.uid])

  const save = async ()=>{
    setSaving(true)
    let certificateUrl = form.certificateUrl
    if(certificateFile){
      const r = ref(storage, `certificates/${user.uid}/${certificateFile.name}`)
      await uploadBytes(r, certificateFile)
      certificateUrl = await getDownloadURL(r)
    }
    await setDoc(doc(db,'members', user.uid), {
      ...form,
      certificateUrl,
      updatedAt: serverTimestamp(),
      email: user.email
    }, { merge: true })
    alert('Profile saved')
    setSaving(false)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="card">
        <h1 className="text-xl font-semibold">My Member Profile</h1>
        <div className="grid gap-3 mt-4">
          {['companyName','contactPerson','city','services','phone','website'].map(k=> (
            <input key={k} className="border rounded-xl p-2" placeholder={k} value={form[k]||''} onChange={e=>setForm({...form, [k]: e.target.value})} />
          ))}
          <textarea className="border rounded-xl p-2" rows="4" placeholder="About" value={form.about||''} onChange={e=>setForm({...form, about: e.target.value})} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.public} onChange={e=>setForm({...form, public: e.target.checked})} />
            Show my profile in public directory
          </label>
          <div>
            <label className="block text-sm font-medium">Upload TNESA Certificate (PDF/Image)</label>
            <input type="file" accept=".pdf,image/*" onChange={e=>setCertificateFile(e.target.files[0])} />
            {form.certificateUrl && <a className="text-tnesa-primary underline block mt-2" href={form.certificateUrl} target="_blank">View current certificate</a>}
          </div>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?'Saving...':'Save Profile'}</button>
        </div>
      </section>
      <aside className="card">
        <h2 className="font-semibold">Badges & Verification</h2>
        <p className="text-sm text-gray-600">Badges are assigned by TNESA admins. Keep your profile up to date for verification.</p>
        <ul className="mt-4 text-sm text-gray-700 space-y-1 list-disc pl-5">
          <li>Gold/Platinum/Silver badge represents experience & contribution</li>
          <li>Verified badge indicates documents and membership have been validated</li>
          <li>Your certificate appears on your public profile</li>
        </ul>
      </aside>
    </div>
  )
}

export default function Dashboard(){
  return (
    <ProtectedRoute>
      <DashboardInner />
    </ProtectedRoute>
  )
}
