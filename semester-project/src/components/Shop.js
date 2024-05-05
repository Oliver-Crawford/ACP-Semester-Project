import axios from 'axios';
import { useEffect, useState } from 'react';


const Shop = () => {
    const [data, setData] = useState([]);
    useEffect(() =>{
    axios.get('http://localhost:8080/GetAllProducts')
        .then(response =>{
            setData(response.data);
        })
        .catch(err =>{
            console.log("FAILURE");
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
            <nav class="navbar navbar-expand-sm bg-light justify-content-center">
                <ul class="navbar-nav">
                    <a href="/Cart" class="btn btn-primary">Cart</a>
                </ul>
            </nav>
            {data.map(item => (
              <div key={item.id} class="card d-inline-flex">
                <div class="card-header">
                  {item.name}
                </div>
                <div class="card-body">
                  <img src={"./images/"+item.image} alt={item.name} width="256" />
                </div>
                <div class="card-footer">
                <a href="#" onClick={handleClick} data-id={item.id} data-amount={item.amount} data-name={item.name} class="btn btn-primary">Order</a><br/>
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