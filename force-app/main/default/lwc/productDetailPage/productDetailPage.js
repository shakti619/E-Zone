import { LightningElement, wire } from 'lwc';
import getProducts from '@salesforce/apex/ProductController1.getProducts';


export default class productDetailPage extends LightningElement {
    product;
    selectedQuantity = 1;

    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            
                this.product = data;
            }
         else if (error) {
            console.error('Error retrieving products:', error);
        }
    
    }

    get isInStock() {
        return this.product.RemainingQuantity__c > 0;
    }

    handleIncrement() {
        this.selectedQuantity++;
    }

    handleDecrement() {
        if (this.selectedQuantity > 1) {
            this.selectedQuantity--;
        }
    }

    handleAddToCart() {
        if (this.product.TotalQuantity__c > 0) {
            // Product is in stock, add to cart logic
            const event = new CustomEvent('addtocart', {
                detail: {
                    productId: this.product.Id,
                    quantity: this.selectedQuantity
                }
            });
            this.dispatchEvent(event);
            this.showToast('success', 'Product Added to Cart', 'Product added successfully');
        } else {
            // Product is out of stock
            this.showToast('error', 'Product Out of Stock', 'This product is currently out of stock');
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
