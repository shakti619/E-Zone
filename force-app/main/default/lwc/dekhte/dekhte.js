import { LightningElement, wire, track } from 'lwc';
import getProducts from '@salesforce/apex/dekhte.getProducts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCartDetails from '@salesforce/apex/dekhte.getCartDetails'
import addToCart from '@salesforce/apex/dekhte.addToCart';

export default class Dekhte extends LightningElement {

    @track products = [];
    @track cart = [];

    // Retrieve cart details from the server
    @wire(getCartDetails)
    wiredCart({ error, data }) {
        if (data) {
            this.cart = data.map(cartItem => ({ productId: cartItem.Product__c, quantity: cartItem.Quantity__c }));
            
        } else if (error) {
            console.error('Error fetching cart details:', error);
        }
    } 

    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data.map(product => {
                const heroImage = product.Product_Images__r.find(image => image.Hero_Image__c === true);
                console.log('time1')
                return {
                    ...product,
                    Hero_Image_URL__c: heroImage ? heroImage.URL__c : 'https://www.shutterstock.com/shutterstock/photos/1336706924/display_1500/stock-vector-block-icon-unavailable-icon-1336706924.jpg',
                    selectedQuantity: 0,
                    stock: product.TotalQuantity__c > 0 ? "IN-STOCK" : "OUT-OF-STOCK"};
                    

        } )}
        else if (error) {
            console.error('Error fetching products:', error);
        }
    }

    handleAddToCart(event) {
        const productId = event.target.dataset.productId;
        console.log('timew')
        const productToAdd = this.products.find(product => product.Id === productId);

        if (productToAdd.stock === "OUT-OF-STOCK") {
            // Show error toast for out of stock product
            this.showToast('error', 'Product Out of Stock', 'This product is currently out of stock');
            return;
        }

        if (productToAdd.selectedQuantity > 0) {
            addToCart({ productId: productId, quantity: productToAdd.selectedQuantity })
                .then(() => {
                    console.log()
                    // Show success toast for product added to cart
                    this.showToast('success', 'Product Added to Cart', 'Product added successfully');

                    // Reset selectedQuantity to 0 after adding to cart
                    productToAdd.selectedQuantity = 0;
                })
                .catch(error => {
                    // Show error toast for any other error
                    this.showToast('error', 'Error Adding to Cart', 'An error occurred while adding the product to the cart');
                    console.error('Error adding product to cart:', error);
                });
                console.log()        }
    }

    handleIncreaseQuantity(event) {
        const productId = event.target.dataset.productId;
        const productToUpdate = this.products.find(product => product.Id === productId);
        if (productToUpdate && productToUpdate.selectedQuantity < productToUpdate.RemainingQuantity__c) {
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

    showToast(variant, title, message) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    
}










