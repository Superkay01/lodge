import Container from '@/app/ui/Container'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='border-t sticky top-0 z-50 bg-royal-blue backdrop-blur space-y-3'>
        <Container className='py-3 grid md:grid-cols-3 gap-8'>
            <div className="">
                <h4 className='font-semibold text-white'>Lodgelink</h4>
                <p className='text-sm opacity-80 mt-2 text-white'>Modern student housing marketplace.</p>
            </div>
            <div className="">
                <h5 className='font-semibold text-white'>Explore</h5>
                <ul className='mt-2 space-y-2 text-sm'>
                    <li><Link href="/listings" className="text-white hover:text-green-300">Listings</Link></li>
                    <li><Link href='/faqs' className="text-white hover:text-green-300">Faqs</Link></li>
                    <li><Link href='/about' className="text-white hover:text-green-300">About</Link></li>
                </ul>
            </div>
            <div className="">
                <h5 className="font-semibold text-white">Legal</h5>
                <ul className="mt-2 space-y-1 text-sm">
                    <li><Link href="/privacy" className="text-white hover:text-green-300">Privacy</Link></li>
                    <li><Link href="/terms" className="text-white hover:text-green-300">Terms</Link></li>
                </ul>
            </div>
        </Container>
        <div className="border-t py-4 text-center text-xs opacity-90 text-white">© {new Date().getFullYear()} LodgeLink</div>
    </footer>
  )
}

export default Footer