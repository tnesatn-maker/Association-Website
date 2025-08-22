import React from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import { db } from '../firebase'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { useAuthState } from '../components/useAuthState'

function AdminInner(){
  const { user } = useAuthState()
  const [members, setMembers] = React.useState([])

  React.useEffect(()=>{
    (async ()=>{
      const snap = await getDocs(collection(db,'members'))
      setMembers(snap.docs.map(d=>({ id:d.id, ...d.data() })))
    })()
  },[])

  const setBadge = async (id, badgeLevel)=>{
    await updateDoc(doc(db,'members', id), { badgeLevel })
    setMembers(members.map(m=>m.id===id?{...m,badgeLevel}:m))
  }

  const setVerified = async (id, verified)=>{
    await updateDoc(doc(db,'members', id), { verified })
    setMembers(members.map(m=>m.id===id?{...m,verified}:m))
  }

  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-4">Admin — Manage Members</h1>
      {(!user?.isAdmin) && <p className="text-red-600">Note: Your account is not marked as admin. Set <code>isAdmin: true</code> on your user document to access admin controls.</p>}
      <div className="overflow-auto">
        <table className="min-w-full border mt-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Company</th>
              <th className="p-2">City</th>
              <th className="p-2">Badge</th>
              <th className="p-2">Verified</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m=> (
              <tr key={m.id} className="border-t">
                <td className="p-2">{m.companyName}<div className="text-xs text-gray-500">{m.email}</div></td>
                <td className="p-2 text-center">{m.city}</td>
                <td className="p-2 text-center">{m.badgeLevel || '-'}</td>
                <td className="p-2 text-center">{m.verified ? 'Yes' : 'No'}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    {['Silver','Gold','Platinum'].map(b=> (
                      <button key={b} className="btn" onClick={()=>setBadge(m.id,b)}>{b}</button>
                    ))}
                    <button className="btn" onClick={()=>setVerified(m.id, !m.verified)}>{m.verified?'Unverify':'Verify'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Admin(){
  return (
    <ProtectedRoute>
      <AdminInner />
    </ProtectedRoute>
  )
}
