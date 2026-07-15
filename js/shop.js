/*=========================================
GLOBAL VARIABLES
=========================================*/

let allProducts=[];
let filteredProducts=[];
let currentPage=1;
const productsPerPage=8;

const productsContainer=document.getElementById("productsContainer");
const paginationContainer=document.getElementById("pagination");
const productCount=document.getElementById("productCount");
const searchInput=document.getElementById("searchInput");
const categoryFilter=document.getElementById("categoryFilter");
const sortProducts=document.getElementById("sortProducts");

/*=========================================
INITIALIZE SHOP
=========================================*/

document.addEventListener("DOMContentLoaded",async()=>{

if(!productsContainer) return;

showLoader(productsContainer);

allProducts=await getProducts();

filteredProducts=[...allProducts];

populateCategories();

updateProducts();

});

/*=========================================
UPDATE PRODUCTS
=========================================*/

function updateProducts(){

const paginatedProducts=paginate(
filteredProducts,
currentPage,
productsPerPage
);

renderProducts(
paginatedProducts,
productsContainer
);

productCount.textContent=`Showing ${filteredProducts.length} Products`;

createPagination(
filteredProducts.length,
productsPerPage,
currentPage,
paginationContainer,
changePage
);

}

/*=========================================
PAGE CHANGE
=========================================*/

function changePage(page){

currentPage=page;

updateProducts();

scrollToTop();

}

/*=========================================
CATEGORY DROPDOWN
=========================================*/

function populateCategories(){

const categories=[
...new Set(
allProducts.map(product=>product.category)
)
];

categoryFilter.innerHTML=`
<option value="all">All Categories</option>
`;

categories.forEach(category=>{

categoryFilter.innerHTML+=`
<option value="${category}">
${category}
</option>
`;

});

}