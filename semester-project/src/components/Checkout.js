import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    var [data, setData] = useState([]);
    const navigate = useNavigate();
    useEffect(() =>{
        axios.get('http://localhost:8080/GetAllProducts')
        .then(response =>{
            setData(response.data);
        })
        .catch(err =>{
            console.log("GetAllProducts Failed\n"+err);
        });
    }, []);
    const handleClick = (event) =>{
        event.preventDefault();
        try{
            const timeout = setTimeout(() => {
                navigate('/Order');
            }, 2000); 
            return () => clearTimeout(timeout);
        } catch(e){
            console.log(e);
        }
    }
    var total = 0.0;
    return(
        <div className="Checkout pt-5 d-flex justify-content-center">
            <div className="container">
                <p className="h2">Items:</p>
                {
                    data
                    .filter(item => {
                        var amount = parseInt(localStorage.getItem(item.id))
                        if(amount > 0){
                            total += amount * parseFloat(item.price);
                            return true;
                        }
                        return false;
                    })
                    .map(item => (
                        <div key={item.id} className="">
                            <p className="h4">{localStorage.getItem(item.id)} {item.name}: ${parseFloat(item.price) * parseInt(localStorage.getItem(item.id))}</p>
                        </div>
                    ))
                }
                
            </div>
            <div className="container d-flex align-self-center justify-content-around"><p className="h1">Total: ${total}</p></div>
            <a href="#" onClick={handleClick} className="btn btn-primary">Order Items</a>
        </div>
    );

}

export default Checkout;