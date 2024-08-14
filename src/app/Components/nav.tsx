'use client'
import { useState, FormEvent, use, useEffect } from 'react';
import logoW from '../../../public/assets/images/charcrelogo/1.png'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Nav = () => {

    // ########################### CONSTANTES #################################### //
   const router = usePathname();
    // ########################### VARIABLES #################################### //
    const [active, setActive] = useState('');

    // ########################### MOUNTED #################################### //
    useEffect(() => {
     setActive(router.split('/')[1])
     
    }, [])


    // ########################### WATCHER #################################### //


    // ########################### METHODS #################################### //




    // ########################### HTML #################################### //


    return (
        <>
            <header>
                <nav className='flex justify-between my-8 mx-4'>
                    <span className='text-white text-2xl font-bold font-Metropolis'>OTAKU TYPE</span>
                    <ul className='flex py-0 m-0 font-ProductSans bg-white rounded-full items-center p-1 font-bold text-primary'>
                        <li><Link className={`${active == '' ? 'text-white bg-primary' : 'text-primary' } px-2 py-1 rounded-full`} href={'/'}>Acceuil</Link></li>
                        <li><Link className={`${active == 'citations' ? 'text-white bg-primary' : 'text-primary' } px-2 py-1 rounded-full`} href={'/citations'}>Citations</Link></li>
                        <li><Link className={`${active == 'synopsis' ? 'text-white bg-primary' : 'text-primary' } px-2 py-1 rounded-full`} href={'/synopsis'}>Synopsis</Link></li>
                    </ul>
                </nav>
            </header>
        </>
    )


};

export default Nav;
