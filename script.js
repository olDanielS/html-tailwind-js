const menu = document.getElementById('menu');
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn =document.getElementById('close-modal-btn') 
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');

let cart = [];

cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex";
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
})

cartModal.addEventListener("click", function (event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
})


menu.addEventListener("click", function(event){
    let parentTarget = event.target.closest(".add-to-cart-btn")//Verify all items closest of button

    if(parentTarget){
        const name = parentTarget.getAttribute("data-name")
        const price = parseFloat(parentTarget.getAttribute("data-price"));  
        
        addToCart(name, price)
    }
})

function addToCart(name, price){

    const alreadyExistItem = cart.find(item => item.name === name)
  
    if(alreadyExistItem){
        alreadyExistItem.amount += 1;
         
    }else{
        cart.push({
            name,
            price,
            amount: 1
        })
    }

    updateCartModal();
}

function updateCartModal(){
    cartItemContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">    
                <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.amount}</p>
                <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
                </div>
                <div>
                    <button class="remove-from-cart-btn" data-name=${item.name}>
                        Remover
                    </button>
                </div>
            </div>
        `
        total += item.price*item.amount;

        cartItemContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

cartItemContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name");
        
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.amount > 1){
            item.amount -=1;
            updateCartModal();
            return
        }
        cart.splice(index, 1)
        updateCartModal();
    }


}

addressInput.addEventListener("input", function (event){
    let inputValue = event.target.value;
    
    if(inputValue != ""){
        addressWarn.classList.add("hidden");
        addressInput.classList.remove("border-red-500");
    }

});

checkoutBtn.addEventListener("click", function (event){
    const isOpen =  checkRestaurantOpen();; 
    
    if(!isOPen){
        Toastify({
            text: "Ops, o restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();
        return;
    }

    if(cart.length === 0 )return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return
    }

    const formatData = cart.map(item => {
        return(
            `${item.name} Quantidade(${item.amount} - Valor R$${item.price}) |`
        )
    }).join("") //array format to text
    console.log(formatData)

    const message = encodeURIComponent(formatData);
    const phone = "73999308167";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,"_blank")

    cart = [];
    updateCartModal();
})

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >=18 && hora <22;
}

const spanItem = document.getElementById("date-span");
const isOPen = checkRestaurantOpen();

if(isOPen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.add("bg-red-500");
    spanItem.classList.remove("bg-green-600");
}