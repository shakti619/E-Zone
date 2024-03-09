import { LightningElement, wire } from 'lwc';
import getCart from '@salesforce/apex/HomePageController.getCart';
import getOrder from '@salesforce/apex/HomePageController.getOrder';
import { NavigationMixin } from 'lightning/navigation';
export default class HomePage extends LightningElement {
openCart;
openOrder;

@wire(getCart)
handleGetCart({ data, error }) {
    if (data) {
        this.openCart = data;
        console.log('Cart:', this.openCart);
    } else if (error) {
        console.error('Error fetching cart:', error);
    }
}
@wire(getOrder)
handleGetOrder({ data, error }) {
    if (data) {
        this.openOrder = data;
        console.log('Order:', this.openOrder);
    } else if (error) {
        console.error('Error fetching order:', error);
    }
}

handleNavigation() {
    this[NavigationMixin.Navigate]({
        type: 'standard__webPage',
        attributes: {
            url: 'https://www.google.com/'
        }
    });
}

}


