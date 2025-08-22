import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <section>
        <h1 className="text-3xl md:text-4xl font-bold text-tnesa-dark">TNESA — CCTV System Integrator Directory</h1>
        <p className="mt-4 text-gray-700">Find verified installers across Tamil Nadu. Rate your installer, check badges (Gold/Platinum), and view certificates issued by the Association.</p>
        <div className="mt-6 flex gap-3">
          <Link className="btn btn-primary" to="/directory">Browse Installers</Link>
          <Link className="btn" to="/signup">Become a Member</Link>
        </div>
      </section>
      <section className="card">
        <h2 className="font-semibold text-lg mb-2">Key Features</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Star ratings from customers</li>
          <li>Gold / Platinum badges</li>
          <li>Verified Installer badge</li>
          <li>Member dashboard with TNESA certificate</li>
          <li>Admin panel to review & verify members</li>
        </ul>
      </section>
    </div>
  )
}
