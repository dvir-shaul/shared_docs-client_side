import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export const useGetTokenFromLocalStorage = () => {
  const history = useHistory();

  const redirect = () => {
    // if (!localStorage.getItem("token")) history.push("/login");
  };

  useEffect(() => {
    window.addEventListener("storage", redirect);
    return () => window.removeEventListener("storage", redirect);
  });

  return localStorage.getItem("token");
};
