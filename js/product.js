
{
    id,
    name,
    slug,
    category,
    price,
    oldPrice,
    rating,
    reviews,
    stock,
    sizes,
    image,
    gallery,
    description,
    notes
}   

/*=========================================
GLOBAL ELEMENTS
=========================================*/

const mainImage=document.getElementById("mainProductImage");
const thumbnails=document.querySelectorAll(".thumbnail");
const sizeButtons=document.querySelectorAll(".size-btn");
const quantityInput=document.getElementById("quantity");
const minusBtn=document.querySelector(".qty-minus");
const plusBtn=document.querySelector(".qty-plus");
const addCartBtn=document.querySelector(".add-cart-btn");
const wishlistBtn=document.querySelector(".wishlist-btn");

/*=========================================
IMAGE GALLERY
=========================================*/

thumbnails.forEach(thumbnail=>{

    thumbnail.addEventListener("click",()=>{

        thumbnails.forEach(item=>item.classList.remove("active"));

        thumbnail.classList.add("active");

        mainImage.src=thumbnail.src;

    });

});

/*=========================================
SIZE SELECTOR
=========================================*/

sizeButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        sizeButtons.forEach(size=>size.classList.remove("active"));

        button.classList.add("active");

    });

});

/*=========================================
QUANTITY
=========================================*/

if(minusBtn){

    minusBtn.addEventListener("click",()=>{

        let value=parseInt(quantityInput.value);

        if(value>1){

            quantityInput.value=value-1;

        }

    });

}

if(plusBtn){

    plusBtn.addEventListener("click",()=>{

        let value=parseInt(quantityInput.value);

        quantityInput.value=value+1;

    });

}

/*=========================================
ADD TO CART
=========================================*/

if(addCartBtn){

    addCartBtn.addEventListener("click",()=>{

        showToast("Product added to cart.");

    });

}

/*=========================================
WISHLIST
=========================================*/

if(wishlistBtn){

    wishlistBtn.addEventListener("click",()=>{

        wishlistBtn.classList.toggle("active");

        if(wishlistBtn.classList.contains("active")){

            showToast("Added to wishlist.");

        }else{

            showToast("Removed from wishlist.");

        }

    });

}