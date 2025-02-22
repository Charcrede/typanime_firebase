'use client'
import React, { useEffect, useState } from "react";
import Nav from "../Components/nav";
import CustomSelect from "../Components/select";
import axios from "axios";
import { Citation, Synopsis } from "../otaku";
import Citations from "../citations/page";
import { useRouter } from "next/navigation";

export default function Challenges() {
    // ########################### CONSTANTES #################################### //
    const apiUrl = process.env.NEXT_PUBLIC_API;
    const router = useRouter()


    // ########################### VARIABLES #################################### //
  const [challenges, setChallenges] = useState<any[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [synopsis, setSynopsis] = useState<Synopsis[]>([])
  
  const [newChallenge, setNewChallenge] = useState<{name : string, opt : Citation | Synopsis | null}>({ name: "", opt : null });
// ########################### MOUNTED #################################### //
useEffect(()=>{
    axios.get(`${apiUrl}/api/citations/allC`).then((resp)=>{
        setCitations(resp.data)
        
     })
     axios.get(`${apiUrl}/api/synopsis/allS`).then((resp)=>{
      setSynopsis(resp.data)
      
   })
   axios.get(`${apiUrl}/api/challenges/all`).then((resp)=>{
    setChallenges(resp.data.content)
   })
},[])

// ########################### WATCHER #################################### //




// ########################### METHODS #################################### //


  const createChallenge = () => {
    let challengeDTO ;
    if (newChallenge.opt && "persoName" in newChallenge.opt) {
      challengeDTO = {"name" : newChallenge.name, "citationId" : newChallenge.opt.id}
    }else if (newChallenge.opt && "anime" in newChallenge.opt) {
      challengeDTO = {"name" : newChallenge.name, "synopsisId" : newChallenge.opt.id}
    }
    axios.post(`${apiUrl}/api/challenges/create`, challengeDTO, {headers : {Authorization : `Bearer ${localStorage.getItem('k')}`}}).then((resp)=>{
      axios.get(`${apiUrl}/api/challenges/all`).then((resp)=>{
        setChallenges(resp.data.content)
       })
    })
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link)
      .then(() => alert("Lien copié dans le presse-papier !"))
      .catch(() => alert("Erreur lors de la copie du lien."));
  };

  const joinChallenge = (id: number) => {
    router.push("/challenges/"+id)
  };
// ########################### HTML #################################### //
  return (
    <div className="p-4">
        <Nav></Nav>
        <h1 className='align-center text-white  font-Bebas font-bold xs:text-[1.5rem] lg:text-[2.5rem] align-middle flex justify-center'>Challenges</h1>

      {/* Liste des challenges */}
      <div className='grid lg:grid-cols-3 w-3/4 gap-4 mx-auto mt-8 object-fit xs:grid-cols-1'>
        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-xl font-bold font-Bebas">{challenge.name}</h2>
            <p className="mt-2 font-Bebas"><span className="text-primary">Nombre de participant :</span> {challenge.statList.length}</p>
            <p className="mt-2 font-Bebas"><span className="text-primary">Nombre de caractères :</span> {challenge.synopsis ? challenge.synopsis.text.length : challenge.citation.text.length}</p>
            <div className="mt-4 flex justify-between">
              <button 
                onClick={() => copyLink(`http://localhost:3000/challenges/${challenge.id}`)}
                className="px-3 py-1 bg-primary text-white rounded hover:bg-blue-600"
              >
                Copier le lien
              </button>
              <button 
                onClick={() => joinChallenge(challenge.id)}
                className="px-3 py-1 bg-gray-200 text-primary rounded hover:bg-gray-300"
              >
                Rejoindre
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire de création de challenge */}
      <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-md w-3/4 mx-auto">
        <h2 className="text-2xl font-bold mb-4 font-Bebas">Créer un nouveau challenge</h2>
        <div className="flex flex-col space-y-4">
          <input 
            type="text" 
            placeholder="Nom du challenge" 
            value={newChallenge.name} 
            onChange={(e) => setNewChallenge({ ...newChallenge, name: e.target.value })} 
            className="px-3 py-2 border rounded"
          />
          <p>{newChallenge.opt ? "persoName" in newChallenge.opt ? newChallenge.opt.persoName[0] == "A" || newChallenge.opt.persoName[0] == "E" || newChallenge.opt.persoName[0] == "I" || newChallenge.opt.persoName[0] == "O" || newChallenge.opt.persoName[0] == "U" || newChallenge.opt.persoName[0] == "Y" ? "Citation d'" + newChallenge.opt.persoName : "Citation de " + newChallenge.opt.persoName : newChallenge.opt.anime[0] == "A" || newChallenge.opt.anime[0] == "E" || newChallenge.opt.anime[0] == "I" || newChallenge.opt.anime[0] == "O" || newChallenge.opt.anime[0] == "U" || newChallenge.opt.anime[0] == "Y" ? "Synopsis d'" + newChallenge.opt.anime : "Synopsis de " + newChallenge.opt.anime : "veuillez choisir une citation ou un synopsis"}</p>
          <div className="flex gap-2">

          <CustomSelect options={citations} placeholder="Veuilez sélectionner une citation" onSelect={(option)=>{setNewChallenge({ ...newChallenge, opt: option })}}></CustomSelect>
          <CustomSelect options={synopsis} placeholder="Veuilez sélectionner un synopsis" onSelect={(option)=>{setNewChallenge({ ...newChallenge, opt: option })}}></CustomSelect>
          </div>
          <button onClick={createChallenge}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  );
}
