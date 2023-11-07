import React from "react";

const useLocalStorage = (key) => {
  const setItem = (value) =>{
    try{
      window.localStorage.setItem(key,JSON.stringify(value))
    }catch(e){
      console.log(e)
    }
  }

  const getItem = () =>{
    try{
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : undefined
    }catch(e){
      console.log(e)
    }
  }
};

export default useLocalStorage;
