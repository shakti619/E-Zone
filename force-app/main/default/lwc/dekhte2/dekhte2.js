import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProducts from '@salesforce/apex/dekhte2.getProducts';
import addToCart from '@salesforce/apex/dekhte2.addToCart';

export default class Dekhte2 extends LightningElement {
    @track products = [];
    
    
    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data.map(product => {
                const heroImage = product.Product_Images__r ? product.Product_Images__r.find(image => image.Hero_Image__c === true) : null;
                return {
                    ...product,
                    Hero_Image_URL__c: heroImage ? heroImage.URL__c : 'https://www.shutterstock.com/shutterstock/photos/1336706924/display_1500/stock-vector-block-icon-unavailable-icon-1336706924.jpg',
                    selectedQuantity: 0,
                    stock: product.TotalQuantity__c > 0 ? "IN-STOCK" : "OUT-OF-STOCK"
                };
            });
        } else if (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Method to handle adding a product to the cart
    handleAddToCart(event) {
        const productId = event.target.dataset.productId;
        console.log(productId)
        const productToAdd = this.products.find(product => product.Id === productId);
        console.log(productToAdd.selectedQuantity)
        // Check if product is out of stock
         if (productToAdd.stock === "OUT-OF-STOCK") {
            this.showToast('error', 'Product Out of Stock', 'This product is currently out of stock');
            
        } 



        console.log(productId)
        addToCart({ productId: productId, quantity: productToAdd.selectedQuantity })
            .then(() => {
               
                this.showToast('success', 'Product Added to Cart', 'Product added successfully');
                productToAdd.selectedQuantity = 0;
            })
            .catch(error => {
                // Show error toast
                this.showToast('error', 'Error Adding to Cart', 'An error occurred while adding the product to the cart');
                console.error('Error adding product to cart:', error);
            });
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
