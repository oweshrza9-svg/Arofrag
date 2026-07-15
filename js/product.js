const params=new URLSearchParams(window.location.search);
const productId=params.get("id");

const mainImage=document.getElementById("mainProductImage");
const productCategory=document.querySelector(".product-category");
const productTitle=document.querySelector(".product-title");
const currentPrice=document.querySelector(".current-price");
const oldPrice=document.querySelector(".old-price");
const reviews=document.querySelector(".reviews");
const description=document.querySelector(".product-description");
const stock=document.querySelector(".product-stock strong");
const thumbnailGallery=document.querySelector(".thumbnail-gallery");
const sizeContainer=document.querySelector(".size-selector");
const quantityInput=document.getElementById("quantity");
const minusBtn=document.querySelector(".qty-minus");
const plusBtn=document.querySelector(".qty-plus");
const addCartBtn=document.querySelector(".add-cart-btn");
const wishlistBtn=document.querySelector(".wishlist-btn");
/*=========================================
INITIALIZE
=========================================*/

document.addEventListener("DOMContentLoaded",async()=>{

    const products=await getProducts();

    const product=getProductById(products,productId);

    if(!product) return;

    renderProduct(product);

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

        const selectedSize=document.querySelector(".size-btn.active").textContent;

        const quantity=parseInt(quantityInput.value);

        addToCart({
            id:productId,
            name:productTitle.textContent,
            price:Number(currentPrice.textContent.replace(/[^\d]/g,"")),
            image:mainImage.src
        },selectedSize,quantity);

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
/*=========================================
RENDER PRODUCT
=========================================*/

function renderProduct(product){

    productCategory.textContent=product.category;

    productTitle.textContent=product.name;

    currentPrice.textContent=formatPrice(product.price);

    oldPrice.textContent=formatPrice(product.oldPrice);

    reviews.textContent=`(${product.reviews} Reviews)`;

    description.textContent=product.description;

    stock.textContent=product.stock>0?"In Stock":"Out of Stock";

    mainImage.src=product.image;

    createGallery(product.gallery);

    createSizes(product.sizes);

}


/*=========================================
GALLERY
=========================================*/

function createGallery(images){

    thumbnails.innerHTML="";

    images.forEach((image,index)=>{

        thumbnails.innerHTML+=`
        <img
            class="thumbnail ${index===0?"active":""}"
            src="${image}"
            alt="Product Image">
        `;

    });

    document.querySelectorAll(".thumbnail").forEach(item=>{

        item.addEventListener("click",()=>{

            document.querySelectorAll(".thumbnail").forEach(img=>img.classList.remove("active"));

            item.classList.add("active");

            mainImage.src=item.src;

        });

    });

}
/*=========================================
SIZES
=========================================*/
function createSizes(sizes){

    const title = sizeContainer.querySelector("h4");

    sizeContainer.innerHTML = "";
    sizeContainer.appendChild(title);
    sizes.forEach((size,index)=>{

        sizeContainer.innerHTML += `
            <button class="size-btn ${index===0 ? "active" : ""}">
                ${size}
            </button>
        `;

    });

    const buttons = document.querySelectorAll(".size-btn");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{
            buttons.forEach(btn=>btn.classList.remove("active"));
            button.classList.add("active");

        });

    });

}
/*=========================================
RELATED PRODUCTS
=========================================*/

function renderRelatedProducts(products,currentProduct){

    const container=document.getElementById("relatedProducts");

    if(!container) return;

    const related=products
        .filter(product=>
            product.category===currentProduct.category &&
            product.id!==currentProduct.id
        )
        .slice(0,4);

    container.innerHTML="";

    related.forEach(product=>{

        container.innerHTML+=`
        <article class="related-card">

            <img src="${product.image}" alt="${product.name}">

            <div class="related-info">

                <span>${product.category}</span>

                <h3>${product.name}</h3>

                <p>${formatPrice(product.price)}</p>

                <a href="product.html?id=${product.id}" class="view-product">
                    View Product
                </a>

            </div>

        </article>
        `;

    });

}