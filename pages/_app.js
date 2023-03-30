import '@/styles/globals.css'
import Navbar from "../components/NavBar";
import {Toaster} from "react-hot-toast";
import {useUserData} from "../lib/hooks";
import { UserContext } from '../lib/context';

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData }>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}
export default MyApp;