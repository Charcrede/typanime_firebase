'use client'
import { useState, FormEvent, useEffect } from 'react';
import Nav from '../Components/nav';
import { SYNOPSIS } from '@/app/mockOtaku_second';
import Image from 'next/image';
import image from '../../../public/assets/citations/img/12.jpg'
import Link from 'next/link';
import {Synopsis} from '@/app/otaku'
import axios from 'axios';
const Synops = () => {

   // ########################### CONSTANTES #################################### //
   const apiUrl = process.env.NEXT_PUBLIC_API
   // ########################### VARIABLES #################################### //
       const [synopsis, setSynopsis] = useState<Synopsis[]>([])
       const [count, setCount] = useState(0)
       const [active, setActive] = useState(1)
       const [next, setNext] = useState('')
       const [prev, setPrev] = useState('')
       const [numbers, setNumbers] = useState<number[]>([])
    // ########################### MOUNTED #################################### //

    useEffect(()=>{
        axios.get(`${apiUrl}/api/synopsis`).then((resp)=>{
           setSynopsis(resp.data.results)
           setCount(resp.data.count)
           setPrev(resp.data.prev)
           setNext(resp.data.next)
        
           let n = resp.data.count / 6
           let tab = []
           for (let i = 0; i < n; i++) {
                tab.push(i+1)
           }
           setNumbers(tab)
        })
    },[])

    // ########################### WATCHER #################################### //


    // ########################### METHODS #################################### //

    const move = (link : string) =>{
        axios.get(`${link}`).then((resp)=>{
            setSynopsis(resp.data.results)
            setCount(resp.data.count)
            setPrev(resp.data.previous)
            setNext(resp.data.next)
            setActive(parseInt(link.substring(link.length-1, link.length)))
            let n = resp.data.count / 6
            let tab = []
            for (let i = 0; i < n; i++) {
                 tab.push(i+1)
            }
            setNumbers(tab)
         })
    }

    const moveTo = (num : number) =>{
        axios.get(`${apiUrl}/api/synopsis/?page=${num}`).then((resp)=>{
            setSynopsis(resp.data.results)
            setCount(resp.data.count)
            setPrev(resp.data.previous)
            setNext(resp.data.next)
            setActive(num)
            let n = resp.data.count / 6
            let tab = []
            for (let i = 0; i < n; i++) {
                 tab.push(i+1)
            }
            setNumbers(tab)
         })
    }


    // ########################### HTML #################################### //


    return (
        <>
            <Nav></Nav>
            <div className=''>
                <h1 className='align-center text-primary  font-Bebas font-bold xs:text-[1.5rem] lg:text-[2.5rem] leading-10 align-middle flex justify-center'><span className='bg-white'>TESTEZ VOTRE VITESSE AVEC CES SYNOPSIS</span></h1>
                <div className='grid xs:grid-cols-1 lg:grid-cols-3 w-3/4 gap-4 mx-auto mt-8 object-fit'>
                    {synopsis.map((el, i) => (
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
                <div className='flex justify-center items-center mt-8 gap-4 font-bold'>
                    <button onClick={()=>{move(prev)}} className='bg-white text-primary rounded-lg px-4 py-2 border border-white hover:bg-primary hover:text-white duration-300'>Précédent</button>
                    {numbers.map((el,i)=>(
                        <button key={i} onClick={()=>{moveTo(el)}} className={`${active == el ? 'bg-white text-primary' : 'bg-primary text-white'} border border-white w-10 h-10 rounded-lg`}>{el}</button>
                    ))}
                    <button onClick={()=>{move(next)}} className='bg-white text-primary rounded-lg px-4 py-2 border border-white hover:bg-primary hover:text-white duration-300'>Suivant</button>
                </div>
            </div>
        </>
    )


};

export default Synops;
