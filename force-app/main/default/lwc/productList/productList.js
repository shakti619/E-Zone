import { LightningElement, wire } from 'lwc';
import getProductList from '@salesforce/apex/ProductListController.getProductList';
import addToCart from '@salesforce/apex/CartController.addToCart';


export default class ProductList extends LightningElement {
    products = [];
    
    @wire(getProductList)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data.map(product => ({
                ...product,
                heroImageUrl: '/img/sample.jpg', 
                quantity: 0 
            }));
        } else if (error) {
            console.error('Error fetching product list:', error);
        }
    }

    handleIncrement(event) {
        
        alert("hehehehehe")
        const productId = event.currentTarget.dataset.id;
        this.products = this.products.map(product => {
            if (product.productId === productId) {
                product.quantity += 1;
            }
            return product;
        });
    }

    handleDecrement(event) {
        const productId = event.currentTarget.dataset.id;
        this.products = this.products.map(product => {
            if (product.productId === productId && product.quantity > 0) {
                product.quantity -= 1;
            }
            return product;
        });
    }

    handleAddToCart(event) {
        const productId = event.currentTarget.dataset.id;
        const selectedProduct = this.products.find(product => product.productId === productId);
        if (selectedProduct.isInStock) {
            // Call Apex method to add product to cart
            addToCart({ productId: productId, quantity: selectedProduct.quantity })
                .then(result => {
                    // Show success toast if added to cart
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Product added to cart.',
                            variant: 'success'
                        })
                    );
                })
                .catch(error => {
                    // Show error toast if any error happens
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
        } else {
            // Show error toast if the product is out of stock
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Product is out of stock.',
                    variant: 'error'
                })
            );
        }
    }
}