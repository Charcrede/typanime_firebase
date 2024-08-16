'use client'
import { useState, FormEvent } from 'react';
import Nav from '../Components/nav';
import { SYNOPSIS } from '@/app/mockOtaku_second';
import Image from 'next/image';
import image from '../../../public/assets/citations/img/12.jpg'
import Link from 'next/link';
const Synopsis = () => {

    // ########################### CONSTANTES #################################### //

    // ########################### VARIABLES #################################### //


    // ########################### MOUNTED #################################### //



    // ########################### WATCHER #################################### //


    // ########################### METHODS #################################### //




    // ########################### HTML #################################### //


    return (
        <>
            <Nav></Nav>
            <div className=''>
                <h1 className='align-center text-primary  font-Bebas font-bold xs:text-[1.5rem] lg:text-[2.5rem] leading-10 align-middle flex justify-center'><span className='bg-white'>TESTEZ VOTRE VITESSE AVEC CES SYNOPSIS</span></h1>
                <div className='grid xs:grid-cols-1 lg:grid-cols-3 w-3/4 gap-4 mx-auto mt-8 object-fit'>
                    {SYNOPSIS.map((el, i) => (
                        <div key={i}>
                            <div className='border-2 border-white h-[350px] object-cover overflow-hidden rounded-t-2xl relative group'>
                                <img alt='anime' src={`/${el.url}`} className='object-cover h-full w-full'></img>
                                <div className='font-Bebas bg-black bg-opacity-75 text-white absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center gap-4 flex-col group-hover:opacity-100 opacity-0 duration-300'>
                                    <span>{el.anime}</span>
                                    <span>{el.texte.length} caractères</span>
                                </div>
                            </div>
                            <Link href={`synopsis/${el.id}`} className='border-2 border-white mt-2 w-full text-center text-white bg-white bg-opacity-25 rounded-b-2xl block py-1 hover:bg-primary hover:bg-opacity-25 duration-300'>Synopsis #{el.id}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )


};

export default Synopsis;
