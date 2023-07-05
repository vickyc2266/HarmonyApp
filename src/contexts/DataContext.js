import React, { createContext, useContext} from 'react';
import { doc, collection, query, where, getDocs, getDoc,  setDoc, addDoc } from "firebase/firestore"

import { useAuth } from "./AuthContext"
import {db} from "../firebase"
const DataProviderContext = createContext();

export const useData = () => {
  return useContext(DataProviderContext);
};

export function DataProvider({ children }) {
  const {currentUser} = useAuth();
 
  
  const getPublicHarmonisations = async (docID) => {
    if (docID) {
        const h = await getDoc(doc(db, "harmonisations", docID)) 
        if (h.exists())
            return h.data()
        else
            return Promise.reject(Error(`No such harmonisation: .${docID}`))
    } else {
        const q = query(collection(db, "harmonisations"), where("public", "==", true)); 
        const querySnapshot = await getDocs(q);
        let ph = [];
        querySnapshot.forEach((doc) => {
            ph.push(doc.data());
        });
        if(ph.length)
            return ph
        else
            return Promise.reject(Error(`No public harmonisations`))
    }
  }
  
   const getMyHarmonisations = async() => {
      const q = query(collection(db, "harmonisations"), where("uid", "==", currentUser.id)); 
      const querySnapshot = await getDocs(q);
      let h = [];
      querySnapshot.forEach((doc) => {
          h.push(doc.data())
      });
      if (h.length) {
          return h;
      } else {
          return Promise.reject(Error(`No saved harmonisations`))
      }
  }
  
  
  // returns a promise
   const storeHarmonisation  = async (harmonisation, docID) => { 
      harmonisation.uid = currentUser.uid;
      // if docID is specified check it is owned by current user
      if (docID) {
          const doc = await getDoc(doc(db, "harmonisations", docID)) 
          if (doc.exists() && doc.data.uid != currentUser.uid) {
              Promise.reject(Error(`Specified docID is not owned by current user`))
          }
          return setDoc(doc(db, 'harmonisations', docID), harmonisation)
      } else {
          return addDoc(collection(db, 'harmonisations'), harmonisation);
      }
  }

  return (
    <DataProviderContext.Provider value={
        {
            storeHarmonisation,
            getMyHarmonisations,
            getPublicHarmonisations
        }}>
      {children}
    </DataProviderContext.Provider>
  );
};