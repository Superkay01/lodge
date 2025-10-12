'use client'

import React, {useState} from 'react'


const page = () => {
    const [search, setSearch] = useState('');
    const openCreate = () => {
    console.log('Open property creation modal');
    }
  return (
    <section className="rounded-2xl bg-[var(--color-white)] ring-black/5 shadow">
        {/* Header & Guide */}
        <div className="p-4 border-b" style={{background: 'var(--color-light-blue)'}}>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className='text-xl font-semibold' style={{color: 'var(--color-royal-blue)'}}>Properties for Sale</h2>
            
                    <p className='text-xs mt-1 max-w-3xl' style={{color: 'var(--color-royal-blue)'}}>This section is for people who want to <strong>sell properties</strong>. Add detailed information, upload <strong>multiple Image</strong> and <strong> one short video (≤ 2 mins)</strong>, and keep your listing updated anytime.</p>
                </div>
                <button onClick={openCreate}
                className='px-4 py-2 rounded-xl shadow text-[var(--color-white)] hover:opacity-90'
                style={{background: 'var(--color-royal-blue)]'}}
                >
                    + New Property
                </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder= "Search by title or location..."
                className='rounded-lg border p-2.5 min-h-[44px] w-full sm:w-[420px] focus:outline-none'
                style={{borderColor: '#e5e7eb', boxShadow: '0 0 0 2px transparent'}} />
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="text-left border-t" style={{color: 'var(--color-medium-gray)'}}>
                        <th className='py-3 pl-4 pr-3'>Property</th>
                        <th className='py-3 px-3'>Location</th>
                        <th className='py-3 px-3 '>Bedroom</th>
                        <th className='py-3 px-3 '>Bathroom</th>
                        <th className='py-3 px-3 '>Price</th>
                        <th className='py-3 px-3 '>Status</th>
                        <th className='py-3 px-4  text-right'>Actions</th>

                    </tr>
                </thead>
            </table>
        </div>
    </section>
  )
}

export default page