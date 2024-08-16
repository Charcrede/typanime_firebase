'use client'
import { useState, FormEvent, useEffect } from 'react';
import Nav from './Components/nav';
import Image from 'next/image';
import fairytail from '../../public/assets/images-load/Sanstitre1.png'
import ichigo from '../../public/assets/ichigo.png'
import luffy from '../../public/assets/luffy.png'
import Link from 'next/link';
const Home = () => {

  // ########################### CONSTANTES #################################### //
  const [url, setUrl] = useState<string>('');
  const [name, setName] = useState<string[]>('DES SYNOPSIS ET CITATIONS MANGA POUR TESTER VOTRE VITESSE DE SAISIE'.split(" "));

  // ########################### VARIABLES #################################### //


  // ########################### MOUNTED #################################### //



  // ########################### WATCHER #################################### //

  // ########################### METHODS #################################### //




  // ########################### HTML #################################### //


  return (
    <>
      <Nav></Nav>
      <div className='lg:px-32 xs:p-8'>

        <div className='xs:relative'>
          <div className='flex lg:flex-row justify-center gap-8 xs:flex-col xs:items-center xs:mt-8'>
            <Image src={ichigo} alt='ichigo' width={175} height={175} className='border-2 border-dotted rounded-full xs:mt-20 lg:mt-0'></Image>
            <Image src={luffy} alt='luffy' width={175} height={175} className='border-2 border-dotted rounded-full'></Image>
          </div>
          <p className='font-Bebas lg:static lg:text-[4rem] text-white text-center xs:text-[2rem] xs:absolute xs:-top-16'>

            DES SYNOPSIS ET CITATIONS <span className='text-[#f2c3b0]'>MANGA</span> POUR TESTER VOTRE VITESSE DE SAISIE
          </p>
          <div className='w-full mt-4 flex justify-center'> 
            <Link href={'/citations'} className='mx-auto text-primary uppercase font-ProductSans text-2xl bg-white rounded-full px-4 font-bold hover:text-white hover:bg-primary duration-300 border border-white'>Commencer</Link>
          </div>
        </div>
      </div>
    </>
  )


};

export default Home;
