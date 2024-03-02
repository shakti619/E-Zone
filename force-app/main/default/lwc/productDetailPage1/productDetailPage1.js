// productDetailPage.js
import { LightningElement, wire, api } from 'lwc';
import getProductById from '@salesforce/apex/ProductController1.getProductById';

export default class ProductDetailPage1 extends LightningElement {
    @api recordId;
    product;
    heroImageURL;
    quantity = 1;

    @wire(getProductById, { productId: '$recordId' })
    wiredProduct({ error, data }) {
        if (data) {
            this.product = data;
            this.heroImageURL = this.product.Product_Images__r.length > 0 ? this.product.Product_Images__r[0].URL__c : null;
        } else if (error) {
            console.error('Error fetching product details:', error);
        }
    }

    handleQuantityChange(event) {
        this.quantity = parseInt(event.target.value, 10);
    }

    handleAddToCart() {
        const selectedEvent = new CustomEvent('addtocart', {
            detail: {
                productId: this.product.Id,
                quantity: this.quantity
            }
        });
        this.dispatchEvent(selectedEvent);
    }
}
