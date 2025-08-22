import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthState } from './components/useAuthState'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'

export default function App(){
  const { user, loading } = useAuthState()
  const nav = useNavigate()

  const doSignOut = async () => {
    await signOut(auth)
    nav('/')
  }

  return (
    <div>
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold text-tnesa-dark text-lg">TNESA</Link>
          <div className="flex items-center gap-4">
            <Link to="/directory">Directory</Link>
            {user && <Link to="/dashboard">Dashboard</Link>}
            {user && user?.isAdmin && <Link to="/admin">Admin</Link>}
            {loading ? <span>...</span> : user ? (
              <button className="btn" onClick={doSignOut}>Sign out</button>
            ) : (
              <>
                <Link to="/signin" className="btn">Sign in</Link>
                <Link to="/signup" className="btn btn-primary">Join</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8 min-h-[70vh]">
        <Outlet />
      </main>
      <footer className="text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} TNESA — Tamil Nadu Electronic Security Association
      </footer>
    </div>
  )
}
