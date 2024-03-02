import { LightningElement, wire } from 'lwc';
import getOpenOrderDetails from '@salesforce/apex/OrderDetailsController.getOpenOrderDetails';

export default class OrderDetails extends LightningElement {
    @wire(getOpenOrderDetails) openOrderDetails;
}
