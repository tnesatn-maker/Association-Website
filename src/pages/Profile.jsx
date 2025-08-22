import React from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import StarRating from '../components/StarRating'
import Badge from '../components/Badge'
import { useAuthState } from '../components/useAuthState'

export default function Profile(){
  const { id } = useParams()
  const [member, setMember] = React.useState(null)
  const [ratings, setRatings] = React.useState([])
  const [myRating, setMyRating] = React.useState(0)
  const [comment, setComment] = React.useState('')
  const { user } = useAuthState()

  React.useEffect(()=>{
    (async ()=>{
      const snap = await getDoc(doc(db,'members', id))
      if (snap.exists()) setMember({ id:snap.id, ...snap.data() })
      const rs = await getDocs(collection(db, 'members', id, 'ratings'))
      setRatings(rs.docs.map(d=>({ id:d.id, ...d.data() })))
    })()
  },[id])

  const avg = ratings.length ? ratings.reduce((s,r)=>s+(r.value||0),0)/ratings.length : 0

  const submitRating = async ()=>{
    if(!user){ alert('Please sign in to rate'); return }
    const existing = ratings.find(r=>r.by === user.uid)
    if(existing){ alert('You have already rated this installer.'); return }
    await addDoc(collection(db, 'members', id, 'ratings'), {
      by: user.uid, value: myRating, comment, createdAt: serverTimestamp()
    })
    alert('Thanks for your rating!')
    window.location.reload()
  }

  if(!member) return <div>Loading...</div>

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{member.companyName}</h1>
            <p className="text-gray-600">{member.contactPerson} • {member.city}</p>
          </div>
          <Badge level={member.badgeLevel} verified={member.verified} />
        </div>
        <p className="mt-4 text-gray-700 whitespace-pre-wrap">{member.about || ''}</p>

        <h2 className="mt-6 font-semibold">Services</h2>
        <p className="text-gray-700">{member.services}</p>

        <h2 className="mt-6 font-semibold">Ratings</h2>
        <div className="flex items-center gap-2">
          <StarRating value={avg} readOnly size={20} />
          <span className="text-sm text-gray-600">{avg ? avg.toFixed(1) : 'No ratings yet'}</span>
        </div>

        <ul className="mt-3 space-y-3">
          {ratings.map(r=> (
            <li key={r.id} className="border rounded-xl p-3">
              <div className="flex items-center justify-between">
                <StarRating value={r.value} readOnly size={16} />
                <span className="text-xs text-gray-500">{r.createdAt?.toDate?.().toLocaleString?.() || ''}</span>
              </div>
              <p className="text-sm mt-1">{r.comment}</p>
            </li>
          ))}
        </ul>
      </div>
      <aside className="card">
        <h2 className="font-semibold">Rate this installer</h2>
        <div className="mt-2">
          <StarRating value={myRating} onChange={setMyRating} />
          <textarea className="border rounded-xl mt-3 w-full p-2" rows="3" placeholder="Share your experience" value={comment} onChange={e=>setComment(e.target.value)} />
          <button className="btn btn-primary mt-3 w-full" onClick={submitRating}>Submit Rating</button>
        </div>
        {member.certificateUrl && (
          <div className="mt-6">
            <h3 className="font-semibold text-sm">TNESA Certificate</h3>
            <a href={member.certificateUrl} target="_blank" className="text-tnesa-primary underline">View Certificate</a>
          </div>
        )}
        <div className="mt-6 text-sm text-gray-600">
          <div>Email: {member.email}</div>
          <div>Phone: {member.phone}</div>
          <div>Website: {member.website}</div>
        </div>
      </aside>
    </div>
  )
}
