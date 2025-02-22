"use client";

import { signInWithGoogle, signInWithGitHub, signInWithFacebook, logout } from "../auth";
import { useState } from "react";

export default function AuthPage() {
  const [user, setUser] = useState(null);

  const handleSignIn = async (provider) => {
    let userData;
    if (provider === "google") userData = await signInWithGoogle();
    if (provider === "github") userData = await signInWithGitHub();
    if (provider === "facebook") userData = await signInWithFacebook();

    setUser(userData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Connexion Firebase</h2>

      {user ? (
        <div className="text-center">
          <p className="mb-2">Bienvenue, {user.displayName} !</p>
          <button className="bg-red-500 text-white p-2 rounded" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      ) : (
        <>
          <button className="bg-blue-500 text-white p-2 rounded mb-2" onClick={() => handleSignIn("google")}>
            Se connecter avec Google
          </button>
          <button className="bg-gray-800 text-white p-2 rounded mb-2" onClick={() => handleSignIn("github")}>
            Se connecter avec GitHub
          </button>
          <button className="bg-blue-700 text-white p-2 rounded mb-2" onClick={() => handleSignIn("facebook")}>
            Se connecter avec Facebook
          </button>
        </>
      )}
    </div>
  );
}
