import { LightningElement, wire, track, api } from 'lwc';
import getProducts from '@salesforce/apex/ProductController1.getProducts';
import getCartDetails from '@salesforce/apex/ProductController1.getCartDetails';
export default class ProductListPage1 extends LightningElement {
    @track products = [];
    @track cart = [];

    @wire(getCartDetails)
wiredCart({ error, data }) {
    if (data) {
        this.cart = data.map(cart => cart.Id);
    } else if (error) {
        console.error('Error fetching cart details:', error);
    }
}


    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {


            this.products = data.map(product => {
                const heroImage = product.Product_Images__r.find(image => image.Hero_Image__c === true);

                return {
                    ...product,
                    Hero_Image_URL__c: heroImage ? heroImage.URL__c : 'https://www.shutterstock.com/shutterstock/photos/1336706924/display_1500/stock-vector-block-icon-unavailable-icon-1336706924.jpg',
                    selectedQuantity: 0,
                    stock: product.TotalQuantity__c > 0 ? "IN-STOCK" : "OUT-OF-STOCK"


                };
            });
        }

        else if (error) {
            console.error('Error fetching products:', error);
        }
    }
    /* get stockbutton(){
     const stock  = this.template.querySelector(".stock")
     if(this.products.stock="IN-STOCK"){
     stock.classList.add('.slds-badge .slds-theme_success')}} */



    handleAddToCart(event) {

        const productId = event.target.dataset.productId;

        console.log(productId);
        const productToAdd = this.products.find(product => product.Id === productId);

        console.log(productToAdd.Id);
        
        
        if (productToAdd.stock == "OUT-OF-STOCK") {
            alert("ITEM IS OUT OF STOCK")
        }

        //to check cart mai pehle se hai ki nhi
        if (productToAdd && productToAdd.selectedQuantity > 0) {
            const existingCartItemIndex = this.cart.findIndex(item => item.Id === productId);
            console.log(existingCartItemIndex);
            //agar already cart mai  hai
            if (existingCartItemIndex !== -1) {

                this.cart[existingCartItemIndex].Quantity__c += productToAdd.selectedQuantity;
                console.log(productToAdd.selectedQuantity)
                //agar nhi hai toh lo bhai
            } else {
                const cartItem = {
                    Id: productToAdd.Id,
                    Name: productToAdd.Name,
                    Price: productToAdd.list_price__c,
                    Quantity: productToAdd.selectedQuantity
                };
                this.cart.push(cartItem);
                console.log(this.cart);
                console.log('Added')
            }
            // firse add to cart ke baad quantity zero
            productToAdd.selectedQuantity = 0;
        }

    }




    handleIncreaseQuantity(event) {
        const productId = event.target.dataset.productId;
        const productToUpdate = this.products.find(product => product.Id === productId);
        if (productToUpdate && productToUpdate.selectedQuantity < productToUpdate.TotalQuantity__c) {
            productToUpdate.selectedQuantity++;
        }
    }

    handleDecreaseQuantity(event) {
        const productId = event.target.dataset.productId;
        const productToUpdate = this.products.find(product => product.Id === productId);
        if (productToUpdate && productToUpdate.selectedQuantity > 0) {
            productToUpdate.selectedQuantity--;
        }
    }

    navigateToProductDetail(event) {
        // likhenge 
    }

    handleOnClick(e) {
        console.log(this.cart.id)
    }



}










