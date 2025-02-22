'use client'
import { useState, FormEvent, useEffect } from 'react';
import Nav from '../Components/nav';
import Link from 'next/link';
import {Citation} from '@/app/otaku'
import axios from 'axios'
const Citations = () => {

    // ########################### CONSTANTES #################################### //
        const apiUrl = process.env.NEXT_PUBLIC_API
    // ########################### VARIABLES #################################### //
        const [citations, setCitations] = useState<Citation[]>([])
        const [count, setCount] = useState(0)
        const [active, setActive] = useState(1)
        const [next, setNext] = useState('')
        const [prev, setPrev] = useState('')
        const [cit, setCit] = useState<Citation>()
        const [numbers, setNumbers] = useState<number[]>([])
    // ########################### MOUNTED #################################### //
    useEffect(()=>{
        axios.get(`${apiUrl}/api/citations/all`).then((resp)=>{
           setCitations(resp.data._embedded.citationList)
           setCount(resp.data.page.totalPages)
           setPrev(resp.data._links.prev ? resp.data._links.prev.href : "")
           setNext(resp.data._links.next ? resp.data._links.next.href : "")
        
           let n = resp.data.page.totalPages
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
            setCitations(resp.data._embedded.citationList)
            setCount(resp.data.page.totalPages)
            setPrev(resp.data._links.prev ? resp.data._links.prev.href : "")
            setNext(resp.data._links.next ? resp.data._links.next.href : "")
            setActive(parseInt(link.substring(link.length-1, link.length)))
            let n = resp.data.page.totalPages
            let tab = []
            for (let i = 0; i < n; i++) {
                 tab.push(i+1)
            }
            setNumbers(tab)
         })
    }

    const moveTo = (num : number) =>{
        axios.get(`${apiUrl}/api/citations/all?page=${num-1}&size=9`).then((resp)=>{
            setCitations(resp.data._embedded.citationList)
            setCount(resp.data.page.totalPages)
            setPrev(resp.data._links.prev ? resp.data._links.prev.href : "")
            setNext(resp.data._links.next ? resp.data._links.next.href : "")
            setActive(num)
            let n = resp.data.page.totalPages
            let tab = []
            for (let i = 0; i < n; i++) {
                 tab.push(i+1)
            }
            setNumbers(tab)
         })
    }
    const selectCit = (c : Citation)=>{
        setCit(c)
        console.log(c)
    }
    const delCit = ()=>{
        setCit(undefined)
    }


    // ########################### HTML #################################### //


    return (
        <>
            <Nav></Nav>
            <div className=''>
                <h1 className='align-center text-primary  font-Bebas font-bold lg:text-[2.5rem] leading-10 align-middle flex justify-center xs:text-[1.5rem]'><span className='bg-white'>TESTEZ VOTRE VITESSE AVEC CES CITATIONS</span></h1>
                <div className='grid lg:grid-cols-3 w-3/4 gap-4 mx-auto mt-8 object-fit xs:grid-cols-1'>
                    {citations.map((el, i) => (
                        <div key={i}>
                            <div className='border-2 border-white h-[175px] object-cover overflow-hidden rounded-t-2xl relative group'>
                                <img alt='anime' src={`/${el.url}`} className='object-cover h-full w-full'></img>
                                <button className='font-Bebas bg-black bg-opacity-75 text-white absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center gap-4 flex-col group-hover:opacity-100 opacity-0 duration-300' onClick={()=>{selectCit(el)}}>
                                    <span>{el.persoName}</span>
                                    <span>{el.animeName}</span>
                                </button>
                            </div>
                            <Link href={`citations/${el.id}`} className='border-2 border-white mt-2 w-full text-center text-white bg-white bg-opacity-25 rounded-b-2xl block py-1 hover:bg-primary hover:bg-opacity-25 duration-300'>Citation #{el.id}</Link>
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
            {cit && (
            <div className='lg:px-56 xs:z-0 xs:px-4 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-70 flex flex-col justify-center'>
                <div className='lg:text-xl font-semibold xs:text-lg'>
                    <span className='bg-white text-primary mr-2 p-1 border-2 border-white xs:hidden lg:inline'>Citation #{cit?.id}</span>
                    <span className='border-2 border-white text-white p-1'>{cit?.persoName}</span>
                    <button className='bg-white text-primary p-1 border-2 border-white float-right flex items-center'onClick={()=>{delCit()}}><svg viewBox="0 0 448 512" className='h-6 w-6 mr-2 fill-primary inline'><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>Retour</button>
                </div>
                <div className='lg:m-8 h-[460px] border-2 border-white xs:m-4'>
                    {/* <input type="text" /> */}
                    <div className='relative h-[400px] overflow-hidden'>
                        <img src={`/${cit?.url}`} alt="" className='z-0 h-full w-full object-cover' />
                        <div className='absolute top-0 bottom-0 left-0 right-0 bg-white bg-opacity-65 z-0'></div>
                        <div className='absolute text-primary top-0 left-0 right-0 bottom-0 lg:text-[3rem] xs:text-[2rem] xs:p-4 lg:p-8 h-[400px] overflow-scroll duration-300' id='container'>
                            {cit.text.split(' ').map((el, i) => (
                                <span key={i}>
                                    {el.split('').map((l, j) => (
                                        <span key={j} className='lettre'>{l}</span>
                                    ))}
                                    <span className='lettre'> </span>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className='bg-primary w-full h-[55px] flex justify-between'>
                    </div>
                </div>
            </div>
            )}
        </>
    )


};

export default Citations;
