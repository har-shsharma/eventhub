'use client'
import Preloader from "./components/preloader/Preloader";
import Auth from "./components/auth/Auth";
import Loader from "./components/loader/Loader";
import { useAuth } from "./context/AuthContext";

export default function Home() {

  const {loadingAnimation} = useAuth();

  return (
      <>
      <Preloader/>
      <Auth/>
      {loadingAnimation && <Loader/>}
      </>
  );
}
