'use client'
import Nav from '@/app/Components/nav';
import { CITATIONS } from '@/app/mockOtaku';
import Link from 'next/link';
import { useState, FormEvent, useEffect, SetStateAction, useRef } from 'react';
import seiko from '../../../../public/assets/pngegg (4).png'
import shippai from '../../../../public/assets/anime-33.png'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Citation } from '@/app/otaku';
import axios from 'axios';

const Citations = ({ params: { id } }: { params: { id: string } }) => {

    // ########################### CONSTANTES #################################### //
    const [cit, setCit] = useState<Citation>()
    const apiUrl = process.env.NEXT_PUBLIC_API
    const [text, setText] = useState<string[]>([])
    const router = useRouter()

    // ########################### VARIABLES #################################### //
    const [words, setWords] = useState<string[]>([])
    const [letters, setLetters] = useState<string[][]>([])
    const [entry, setEntry] = useState('')
    const [i, setI] = useState(0)
    const [spans, setSpans] = useState<any>()
    const [container, setContainer] = useState<any>()
    const [time, setTime] = useState(0)
    const [accuracy, setAccuracy] = useState(0)
    const [speed, setSpeed] = useState(0)
    const [key, setKey] = useState(0)
    const [activeTimer, setActiveTimer] = useState(0)
    const [errorCount, setErrorCount] = useState(0)
    const [mention, setMention] = useState('')
    const [pause, setPause] = useState(false)
    const [input, setInput] = useState<any>()
    const [audio, setAudio] = useState<any>()
    const [aShippai, setAShippai] = useState<any>()
    const [aSeiko, setASeiko] = useState<any>()
    const entryRef = useRef(entry)
    const autoPause = useRef(0)
    const stopTimer = useRef<any>()
    let en = ''
    // ########################### MOUNTED #################################### //

    useEffect(() => {
        
        axios.get(`${apiUrl}/api/citations/${id}`).then((resp) => {
            setCit(resp.data)
            setTimeout(() => {

            let sps = document.querySelectorAll(".lettre")
            setSpans(sps)
            setContainer(document.getElementById("container"))
            setInput(document.getElementById("input"))

            sps[i].classList.add("border-b-2")
            sps[i].classList.add("border-b-primary")
        }, 50);
        })
        setAudio(new Audio('/assets/sounds/keypress.wav'))
        setAShippai(new Audio('/assets/sounds/shippai.mp3'))
        setASeiko(new Audio('/assets/sounds/seiko.mp3'))

    }, [])

    // ########################### WATCHER #################################### //
    useEffect(() => {
        if (cit) {
            setWords(cit.text.split(" "))
            let tab: string[][] = []
            for (let i = 0; i < cit.text.split(" ").length; i++) {
                const el = cit.text.split(" ")[i];
                tab.push(el.split(""))
            }
            setLetters(tab)
            setText(cit.text.split(""))
        }
    }, [cit])
    useEffect(() => {
        setTimeout(() => {

            let sps = document.querySelectorAll(".lettre")
            setSpans(sps)
            setContainer(document.getElementById("container"))
            setInput(document.getElementById("input"))

            sps[i].classList.add("border-b-2")
            sps[i].classList.add("border-b-primary")
        }, 50);
    }, [key])

    useEffect(() => {
        if (activeTimer == 1) {
            timing(0)
        }
    }, [activeTimer])

    useEffect(() => {
        entryRef.current = entry
    }, [entry])

    // ########################### METHODS #################################### //

    const handleChange = (e: {
        nativeEvent: any; target: { value: string; };
    }) => {
        audio.currentTime = 0
        audio.play()
        autoPause.current = 0
        let ent = e.target.value
        setEntry(ent)
        en = ent
        let l = ent.length
        setI(l - 1)

        if (spans) {
            // marquer la lettre suivante
            spans[l].classList.add("border-b-2")
            spans[l].classList.add("border-b-primary")
            if (l) {
                spans[l - 1].classList.remove("border-b-2")
                spans[l - 1].classList.remove("border-b-primary")
            }


            // marquer l'état réussi ou échoué d'une lettre
            if (e.nativeEvent.inputType == 'deleteContentBackward') {
                spans[l].classList.remove("bg-green-500")
                spans[l].classList.remove("bg-red-500")
                spans[l].classList.remove("text-white")

                // reculer la marque lorsqu'on supprime
                spans[l + 1].classList.remove("border-b-2")
                spans[l + 1].classList.remove("border-b-primary")
                // scroller automatiquement lorsqu'on remonte
                if ((spans[i].offsetTop + ((spans[i].offsetHeight * 2)) > container.offsetHeight) && spans[i].offsetTop > spans[i - 1].offsetTop) {
                    container.scrollTop = container.scrollTop - spans[i].offsetHeight - 15;
                }
            } else {
                setActiveTimer(activeTimer + 1)

                if (text[l - 1] == ent.split("")[ent.length - 1]) {
                    spans[l - 1].classList.add("bg-green-500")
                    spans[l - 1].classList.add("text-white")
                } else {
                    spans[l - 1].classList.add("bg-red-500")
                    spans[l - 1].classList.add("text-white")
                    spans[l - 1].classList.add("retry")
                    setErrorCount(errorCount + 1)
                }

                // scroller automatiquement lorsqu'on descend
                if ((spans[i].offsetTop + ((spans[i].offsetHeight * 2)) > container.offsetHeight) && spans[i].offsetTop > spans[i - 1].offsetTop) {
                    container.scrollTop = container.scrollTop + spans[i].offsetHeight + 25;
                }
            }

            // Calculer la précision
            setAccuracy(Math.floor(((activeTimer - errorCount) / activeTimer) * 100));

            // Arrêter le timer à la fin
            if (l == text.length) {
                clearInterval(stopTimer.current)
                // Afficher shippai ou seiko
                if (speed > 40) {
                    setMention('seiko')
                    aSeiko.currentTime = 0
                    aSeiko.play()
                } else {
                    setMention('shippai')
                    aShippai.currentTime = 0
                    aShippai.play()
                }
            }


        }
        // Quitter la pause
        if (pause) {
            play()
        }
    }

    const doubler = (num: number) => {
        return num < 10 ? '0' + num : num
    }

    const timing = (num: number) => {
        let t = num
        let intervalId = setInterval(() => {
            autoPause.current = autoPause.current + 1
            console.log(entryRef.current);
            if (entryRef.current.length > 4) {
                let s = (Math.ceil((entryRef.current.split("").length * 60) / (t * 5)));
                if (s < 0) {
                    setSpeed(0);
                } else {
                    setSpeed(s);
                }
                console.log(s);

            }
            if (autoPause.current >= 5) {
                pauser();
            }
            t++
            setTime(t)
            // console.log(entryRef);

        }, 1000);
        stopTimer.current = intervalId
        // clearInterval(intervalId)
    }

    const pauser = () => {
        clearInterval(stopTimer.current)
        autoPause.current = 0
        setPause(true)
        input.focus()

    }

    const play = () => {
        timing(time);
        setPause(false)
    }

    const restart = () => {
        setKey(key + 1)
        clearInterval(stopTimer.current)
        input.focus()
        setEntry('')
        setPause(false)
        autoPause.current = 0
        setSpeed(0)
        setAccuracy(0)
        setMention('')
        setActiveTimer(0)
        setI(0)
        setTime(0)
        setErrorCount(0)
        container.scrollTop = 0
    }


    // ########################### HTML #################################### //


    return (
        < >
            <Nav></Nav>
            <div className='lg:px-56 xs:z-0 xs:px-4'>
                <div className='lg:text-xl font-semibold xs:text-lg'>
                    <span className='bg-white text-primary mr-2 p-1 border-2 border-white xs:hidden lg:inline'>Citation #{cit?.id}</span>
                    <span className='border-2 border-white text-white p-1'>{cit?.perso_name}</span>
                    <Link className='bg-white text-primary p-1 border-2 border-white float-right flex items-center' href={'/citations'}><svg viewBox="0 0 448 512" className='h-6 w-6 mr-2 fill-primary inline'><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>Retour</Link>
                </div>
                <div className='lg:m-8 h-[460px] border-2 border-white xs:m-4' key={key}>
                    {/* <input type="text" /> */}
                    <div className='relative h-[400px] overflow-hidden'>
                        <img src={`/${cit?.url}`} alt="" className='z-0 h-full w-full object-cover' />
                        <div className='absolute top-0 bottom-0 left-0 right-0 bg-white bg-opacity-65 z-0'></div>
                        <div className='absolute text-primary top-0 left-0 right-0 bottom-0 lg:text-[3rem] xs:text-[2rem] xs:p-4 lg:p-8 h-[400px] overflow-scroll duration-300' id='container'>
                            {letters.map((el, i) => (
                                <span key={i}>
                                    {el.map((l, j) => (
                                        <span key={j} className='lettre'>{l}</span>
                                    ))}
                                    <span className='lettre'> </span>
                                </span>
                            ))}
                        </div>
                        {mention && (
                            <div className='absolute top-0 left-0 bottom-0 right-0 bg-black bg-opacity-85 font-Bebas text-[5rem] flex items-center justify-center flex-col'>
                                <Image alt='chibi naruto' src={mention == 'seiko' ? seiko : shippai} width={125} height={125} className=''></Image>
                                <span className={`${mention == 'shippai' ? 'text-red-500' : 'text-green-500'}`}>{mention}</span>
                            </div>
                        )}
                        {pause && (
                            <div className='absolute top-0 left-0 bottom-0 right-0 bg-black bg-opacity-85 font-Bebas text-[5rem] flex items-center justify-center gap-4 flex-col'>
                                <div className=' flex items-center justify-center gap-8'>
                                    <svg viewBox="0 0 512 512" className='fill-[rgb(255,255,255,0.75)] w-20 h-20'><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM224 192V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32s32 14.3 32 32zm128 0V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32s32 14.3 32 32z" /></svg>
                                    <span className="text-white text-opacity-75">pause</span>
                                </div>
                                <span className='text-xl text-white'>Continuer à saisir pour recommencer</span>
                            </div>
                        )}
                        <div>
                            <input id='input' autoCorrect='off' autoComplete='off' autoCapitalize="off" type="text" autoFocus className='absolute top-0 left-0 right-0 bottom-0 opacity-0' value={entry} onChange={(e) => handleChange(e)} />
                        </div>
                    </div>
                    <div className='bg-primary w-full h-[55px] flex justify-between'>
                        <div className='my-auto ml-4'>
                            <span className='font-Bebas text-white text-[2.5rem] font-bold mx-2'>{doubler(speed)} MPM</span>
                            <span className='font-Bebas text-white text-[2.5rem] font-bold mx-2'> {doubler(accuracy)}%</span>
                        </div>
                        <div className='lg:flex p-2 gap-4 xs:hidden'>
                            <Link href={`/citations/${parseInt(id) - 1}`} className='flex justify-center items-center rounded-full bg-white px-2'><svg viewBox="0 0 512 512" className='w-5 h-5 fill-primary fill-primary fill-primary'><path d="M493.6 445c-11.2 5.3-24.5 3.6-34.1-4.4L288 297.7V416c0 12.4-7.2 23.7-18.4 29s-24.5 3.6-34.1-4.4L64 297.7V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V96C0 78.3 14.3 64 32 64s32 14.3 32 32V214.3L235.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S288 83.6 288 96V214.3L459.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S512 83.6 512 96V416c0 12.4-7.2 23.7-18.4 29z" /></svg></Link>

                            <button onClick={pause ? () => { input.focus() } : () => { pauser() }} className='flex justify-center items-center rounded-full bg-white px-2'><svg viewBox="0 0 320 512" className='w-5 h-5 fill-primary fill-primary fill-primary duration-500'>
                                {!pause && (
                                    <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" />
                                )}
                                {pause && (
                                    <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                                )}
                            </svg>
                            </button>

                            <button onClick={() => { restart() }} className='flex justify-center items-center rounded-full bg-white px-2'><svg viewBox="0 0 512 512" className='w-5 h-5 fill-primary fill-primary fill-primary'><path d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z" /></svg></button>

                            <Link href={`/citations/${parseInt(id) + 1}`} className='flex justify-center items-center rounded-full bg-white px-2'><svg viewBox="0 0 512 512" className='w-5 h-5 fill-primary fill-primary fill-primary'><path d="M18.4 445c11.2 5.3 24.5 3.6 34.1-4.4L224 297.7V416c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4L448 297.7V416c0 17.7 14.3 32 32 32s32-14.3 32-32V96c0-17.7-14.3-32-32-32s-32 14.3-32 32V214.3L276.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S224 83.6 224 96V214.3L52.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S0 83.6 0 96V416c0 12.4 7.2 23.7 18.4 29z" /></svg></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className='top-0 left-0 bottom-0 right-0 flex items-center flex-col bg-black bg-opacity-50 backdrop-blur-sm py-16 xs:fixed lg:hidden'>
                <Image src={'/assets/anya-forger-shocked-face.png'} alt='anya forger' width={200} height={200} className='mb-8 mt-6'></Image>
                <span className='text-2xl text-center px-8 font-bold text-white font-Metropolis'>Tu dois utiliser un ordinateur pour pouvoir jouer et tester ta vitesse</span>
                <Link href={'/citations'} className='mt-4 mx-auto text-primary uppercase font-ProductSans text-2xl bg-white rounded-full px-4 font-bold hover:text-white hover:bg-primary duration-300 border border-white'>Retour</Link>
            </div>
        </>
    )


};

export default Citations;
