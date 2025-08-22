import React from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import Badge from '../components/Badge'

export default function Directory(){
  const [members, setMembers] = React.useState([])
  const [search, setSearch] = React.useState('')
  const [filter, setFilter] = React.useState('All')

  React.useEffect(()=>{
    (async ()=>{
      const q = collection(db, 'members')
      const snap = await getDocs(q)
      const rows = snap.docs.map(d=>({ id:d.id, ...d.data() }))
      setMembers(rows.filter(m=>m.public === true))
    })()
  },[])

  const filtered = members.filter(m=>{
    const match = (m.companyName||'').toLowerCase().includes(search.toLowerCase()) || (m.city||'').toLowerCase().includes(search.toLowerCase())
    const badge = filter==='All' ? true : (m.badgeLevel===filter)
    return match && badge
  })

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Installer Directory</h1>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by company or city" className="border rounded-xl p-2 w-full md:w-1/2" />
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="border rounded-xl p-2">
          <option>All</option>
          <option>Gold</option>
          <option>Platinum</option>
          <option>Silver</option>
        </select>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(m=> (
          <Link to={`/profile/${m.id}`} key={m.id} className="card hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{m.companyName || 'Unnamed Company'}</h3>
                <p className="text-sm text-gray-600">{m.contactPerson} • {m.city}</p>
              </div>
              <Badge level={m.badgeLevel} verified={m.verified} />
            </div>
            <p className="mt-3 text-gray-700 line-clamp-3">{m.services || 'CCTV, Access Control, Networking'}</p>
            <div className="mt-3 text-sm text-gray-500">Avg Rating: {m.avgRating?.toFixed?.(1) ?? '—'}</div>
          </Link>
        ))}
      </div>
      {filtered.length===0 && <p className="text-gray-500">No installers found.</p>}
    </div>
  )
}
