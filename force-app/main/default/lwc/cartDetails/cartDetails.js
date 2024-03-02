import { LightningElement, wire } from 'lwc';
import getOpenCartDetails from '@salesforce/apex/CartDetailsController.getOpenCartDetails';

export default class CartDetails extends LightningElement {
    @wire(getOpenCartDetails) cartDetails;
}
