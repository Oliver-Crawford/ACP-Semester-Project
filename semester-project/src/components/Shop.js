import axios from 'axios';
import { useEffect, useState } from 'react';


const Shop = () => {
    var [data, setData] = useState([]);
    useEffect(() =>{
        axios.get('http://localhost:8080/GetAllProducts')
        .then(response =>{
            setData(response.data);
        })
        .catch(err =>{
            console.log("GetAllProducts Failed\n"+err);
        });
    }, []);
    const handleClick = (event) => {
        event.preventDefault();
        const id = event.target.dataset.id;
        const available = event.target.dataset.amount;
        if(isNaN(parseInt(localStorage.getItem(id))) ){
            localStorage.setItem(id, 0);
        }
        var amount = parseInt(localStorage.getItem(id));
        if(amount >= available){
            alert(`not enough ${event.target.dataset.name}!`)
        } else{
            localStorage.setItem(id, ++amount);
        }
    };
    return(
        <div className="Shop">
            {data.map(item => (
              <div key={item.id} className="card d-inline-flex">
                <div className="card-header">
                  {item.name}
                </div>
                <div className="card-body">
                  <img src={"./images/"+item.image} alt={item.name} width="256" />
                </div>
                <div className="card-footer">
                <div className="d-flex justify-content-around">
                    <a href="#" onClick={handleClick} data-id={item.id} data-amount={item.amount} data-name={item.name} className="btn btn-primary">Order</a>
                </div>
                {item.description}<br />
                ${item.price}<br />
                Available: {item.amount}<br />
                </div>
              </div>
            ))}
        </div>
    );
}

export default Shop;