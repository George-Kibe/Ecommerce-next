import { useEffect, useState } from "react"
import { makeRequest } from "../makeRequest"

const useFetch = (url) => {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        try{
            setLoading(true);
            const response = await makeRequest.get(url);
            setProducts(response.data.data);
            //console.log(response.data.data);
        }catch(error){
            setError(true);
        }
        setLoading(false);
      }
      fetchData();        
    }, [url]);
      //console.log(products, loading, error)
    return {products, loading, error};
};

export default useFetch;