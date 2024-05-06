import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Cart = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
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
        var amount = parseInt(localStorage.getItem(id));
        const boolTrueRegex = new RegExp('true|1');
        if(boolTrueRegex.test(event.target.dataset.state)){
          if(amount >= available){
            alert(`not enough ${event.target.dataset.name}!`)
          } else{
            localStorage.setItem(id, ++amount);
            const timeout = setTimeout(() => {
              navigate('/Cart');
            }, 2000); 
            return () => clearTimeout(timeout);
          }
        } else{
          localStorage.setItem(id, --amount);
          const timeout = setTimeout(() => {
            navigate('/Cart');
          }, 2000); 
          return () => clearTimeout(timeout);
        }
        
        
    };
  return (
    <div className="Cart">
      {data
      .filter(item => {
        return parseInt(localStorage.getItem(item.id)) > 0;
      })
      .map(item => (
        <div key={item.id} className="card d-inline-flex">
          <div className="card-header">
            {item.name}
          </div>
          <div className="card-body">
            <img src={"./images/"+item.image} alt={item.name} width="256" />
          </div>
          <div className="card-footer">
          <div className="d-flex justify-content-around">
            <a href="#" onClick={handleClick} data-id={item.id} data-amount={item.amount} data-name={item.name} data-state={true} className="btn btn-primary">Add</a>
            <a href="#" onClick={handleClick} data-id={item.id} data-amount={item.amount} data-name={item.name} data-state={false} className="btn btn-primary">Remove</a>
          </div>
            In Cart: {localStorage.getItem(item.id)}<br />
            {item.description}<br />
            ${item.price}<br />
            Available: {item.amount}<br />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cart;