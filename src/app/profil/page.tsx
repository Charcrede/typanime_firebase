'use client'
import { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Nav from '../Components/nav';
import { useRouter } from 'next/navigation';


const Profil = () => {

  // ########################### CONSTANTES #################################### //
  const apiUrl = process.env.NEXT_PUBLIC_API

  // ########################### VARIABLES #################################### //
  const [user, setUser] = useState<any>()
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stats, setStats] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const router = useRouter();


  // ########################### MOUNTED #################################### //
  useEffect(() => {
    let k = localStorage.getItem('k');
    if (!k) {
      router.push("/auth/login")
    }
    axios.get(`${apiUrl}/api/user`, { headers: { Authorization: `Bearer ${localStorage.getItem('k')}` } }).then((resp) => {
      setUser(resp.data)
    })

  }, [])


  // ########################### WATCHER #################################### //


  // ########################### METHODS #################################### //

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
    if (!isDialogOpen) {
      axios.get(`${apiUrl}/api/stats/last10/${user.username}`, { headers: { Authorization: `Bearer ${localStorage.getItem('k')}` } }).then((resp) => {
        setStats(resp.data)
      })
    }
  };

  const initReset = () => {
    setShowModal(true)
  }

  const resetStat = () => {
    axios.delete(`${apiUrl}/api/stats/user/${user.username}`, { headers: { Authorization: `Bearer ${localStorage.getItem('k')}` } }).then((resp) => {
      setUser(resp.data);
      setShowModal(false)
    })
  }

  const logout = ()=>{
    localStorage.removeItem('k');
    router.push("/auth/login")
  }


  // ########################### HTML #################################### //


  return (
    <div className="min-h-screen">
      <Nav></Nav>
      <h1 className='align-center text-white  font-Bebas font-bold xs:text-[1.5rem] lg:text-[2.5rem] align-middle flex justify-center'>Profil</h1>
      {user && (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-primary max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold font-Bebas">Nom :</h2>
              <p className="text-lg text-black font-bold font-Bebas">{user.username}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold font-Bebas">Email :</h2>
              <p className="text-lg text-black font-bold font-Bebas">{user.email}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold font-Bebas">Vitesse moyenne :</h2>
              <p className="text-lg text-black font-bold font-Bebas">{user.speed ? user.speed / user.count : '0.00'} Mots Par Minute</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold font-Bebas">Précision moyenne :</h2>
              <p className="text-lg text-black font-bold font-Bebas">{user.accuracy ? user.accuracy / user.count : '0.00'}%</p>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Progression :</h2>
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-primary" style={{ width: `${user.progress}%` }}></div>
            </div>
            <span className='font-Bebas ml-2'>{user.progress}%</span>
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={toggleDialog}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-800 transition"
            >
              Voir l'historique des jeux
            </button>
            <button
              onClick={initReset}
              className="px-6 py-3 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 ml-4 transition"
            >
              Réinitialiser les statistiques
            </button>
          </div>
        </div>
      )}

      {/* Modal pour afficher l'historique des jeux */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-blue-900 rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">Historique des jeux</h2>
            <div className="space-y-3">
              {stats.map((el, i) => (
                <p key={i}>{el.synopsis ? "Synopsis #" + el.synopsis.id : "Citation #" + el.citation.id} : {el.speed} mots/min, {el.accuracy}% précision</p>
              ))}
            </div>
            <button
              onClick={toggleDialog}
              className="mt-6 px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition w-full"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-blue-900 rounded-lg shadow-lg p-6 w-96">
            <div className="space-y-3 text-black font-Bebas text-xl">
              <p>Voulez-vous vraiment réinitialiser vos statis ? </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowModal(false) }}
                className="mt-6 px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition w-full"
              >
                Annuler
              </button>
              <button
                onClick={resetStat}
                className="mt-6 px-6 py-3 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition w-full"
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='relative group w-fit ml-4'>
        <button className='flex items-center text-2xl gap-2 font-bold font-Bebas text-white px-2' onClick={logout}>
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
          </svg>
          Deconnexion
        </button>
        <div className='border border-2 rounded-2xl w-0 group-hover:w-full duration-300'></div>
      </div>
    </div>
  );
}

export default Profil;