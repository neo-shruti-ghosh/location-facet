import { useEffect, useState } from 'react';
import './HomePage.css';
import { Country, getCountries } from '../utils/apiService';

function HomePage() {
    const [data, setData] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        const response = await getCountries();
        if(response){
            console.log("RESPONSE", response)
            setData(response)
        }
    } 

    useEffect(()=>{
        getData();
    }, [])
  return (
    <div className="HomePage">
      Hello
    </div>
  );
}

export default HomePage;
