import axios from 'axios';
import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Order = () => {
    var api = 'http://localhost:8080/';
    var total = 0.0;
    var itemsEffected = new Map([]);
    const navigate = useNavigate();
    const fetchProducts = async() =>{
        console.log("Products!");
        try{
            const response = await axios.get(api+'GetAllProducts');
            return response.data;
        } catch(e){
            console.log("GetAllProducts Failed\n"+e);
        }
        
    }
    const postOrders = async(products) =>{
        console.log("Orders!");
        
        if(products == undefined || products.length == 0){
            console.log("Products undefined")
            return;
        }
        products.forEach(item =>{
            var amount = parseInt(localStorage.getItem(item.id));
            if(!isNaN(amount) && amount > 0){
                total += parseFloat(item.price) * amount;
                itemsEffected.set(item.id, amount)
            }

        });
        var returnInfo = {
            total: total
        }
        try{
            const response = await axios.post(api+'PostOrders', returnInfo);
            return response;
        } catch(e){
            console.log("PostOrders Failed\n"+e);
        }
    }
    const postOrderItems = async(orderId) =>{
        console.log("OrderItems!");
        await itemsEffected.forEach((value, key)=>{
            var returnInfo ={
                itemId: key,
                amount: value,
                orderId: orderId
            }
            console.log(returnInfo);
            axios.post(api+'PostOrderItems', returnInfo)
            .then(response =>{
                return response;
            })
            .catch(err =>{
                console.log("PostOrders Failed\n"+err);
            });
        });
    }
    const patchProducts = async(products) =>{
        console.log("patchProducts!");
        await itemsEffected.forEach((value, key) =>{
            var productsAmount = products[key-1].amount - value;
            var returnInfo ={
                id: key,
                amount: productsAmount
            }
            console.log(returnInfo + "\n" + products[key-1].amount);
            axios.post(api+'PatchProducts', returnInfo)
            .then(response =>{
                return response;
            })
            .catch(e =>{
                console.log("patchProducts Failed\n"+e)
            })
            
        })
    }

    useEffect(() =>{
        console.log("UseEffect!");
        const fetchData = async () =>{
            console.log("fetchData!");
            try{
                //the async function need to return into a variable otherwise it will just skip over it... for some reason
                //curse you chat-gpt
                var products = await fetchProducts();
                console.log(products);
                var orders = await postOrders(products);
                console.log(orders.data.insertId);
                var OrderItems = await postOrderItems(orders.data.insertId);
                console.log(OrderItems);
                var patchProductsRes = await patchProducts(products);
                console.log(patchProductsRes);
                localStorage.clear();
                const timeout = setTimeout(() => {
                    navigate('/');
                }, 2000); 
                return () => clearTimeout(timeout);
            }catch(err){
                console.log(err);
            }
        }
        fetchData();
    }, []);
    

}
export default Order;