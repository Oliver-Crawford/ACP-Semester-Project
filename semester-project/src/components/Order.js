import axios from 'axios';
import { useEffect, useState } from 'react';

const Order = () => {
    var api = 'http://localhost:8080/';
    var [data, setData] = useState([]);
    useEffect(() =>{
        axios.get(api+'GetAllProducts')
        .then(response =>{
            setData(response.data);
        })
        .catch(err =>{
            console.log("GetAllProducts Failed\n"+err);
        });
    }, []);
    console.log(data);
    useEffect(() =>{
        axios.get(api+'PostOrders')
        .then(response =>{
            setData(response.data);
        })
        .catch(err =>{
            console.log("PostOrders Failed\n"+err);
        });
    });
    console.log(data);

    
}
export default Order;