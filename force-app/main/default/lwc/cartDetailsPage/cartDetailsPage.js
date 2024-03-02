import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCartItems from '@salesforce/apex/CartController.getCartItems';
import deleteCartItem from '@salesforce/apex/CartController.deleteCartItem';
import applyCouponCode from '@salesforce/apex/CartController.applyCouponCode';

export default class CartDetailsPage extends LightningElement {
    cartItems = [];
    totalAmount = 0;
    showCouponModal = false;
    couponCode = '';

    @wire(getCartItems)
    wiredCartItems({ error, data }) {
        if (data) {
            this.cartItems = data;
            this.calculateTotalAmount();
        } else if (error) {
            console.error('Error fetching cart items:', error);
        }
    }

    calculateTotalAmount() {
        this.totalAmount = this.cartItems.reduce((total, cartItem) => {
            return total + (cartItem.Quantity__c * cartItem.Product__r.Price__c);
        }, 0);
    }

    handleIncrement(event) {
        const cartItemId = event.currentTarget.dataset.id;
        const cartItem = this.cartItems.find(item => item.Id === cartItemId);
        cartItem.Quantity__c++;
        this.calculateTotalAmount();
    }

    handleDecrement(event) {
        const cartItemId = event.currentTarget.dataset.id;
        const cartItem = this.cartItems.find(item => item.Id === cartItemId);
        if (cartItem.Quantity__c > 1) {
            cartItem.Quantity__c--;
            this.calculateTotalAmount();
        }
    }

    handleDelete(event) {
        const cartItemId = event.currentTarget.dataset.id;
        deleteCartItem({ cartItemId })
            .then(() => {
                // Remove the deleted cart item from the list
                this.cartItems = this.cartItems.filter(item => item.Id !== cartItemId);
                this.calculateTotalAmount();
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Cart item deleted successfully.',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                console.error('Error deleting cart item:', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Failed to delete cart item.',
                        variant: 'error'
                    })
                );
            });
    }

    openCouponModal() {
        this.showCouponModal = true;
    }

    handleCouponChange(event) {
        this.couponCode = event.target.value;
    }

    applyCoupon() {
        applyCouponCode({ couponCode: this.couponCode })
            .then(result => {
                // Handle coupon code application logic
                this.showCouponModal = false;
            })
            .catch(error => {
                console.error('Error applying coupon code:', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Failed to apply coupon code.',
                        variant: 'error'
                    })
                );
            });
    }
}
