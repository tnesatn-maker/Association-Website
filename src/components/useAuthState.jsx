import React from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

export function useAuthState(){
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      if(u){
        // fetch profile for admin flag and association data
        const snap = await getDoc(doc(db, 'members', u.uid))
        const data = snap.exists() ? snap.data() : {}
        setUser({ ...u, ...data })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return ()=>unsub()
  },[])

  return { user, loading }
}
