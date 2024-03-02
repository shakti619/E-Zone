import { LightningElement, wire } from 'lwc';
import getProductListPageUrl from '@salesforce/apex/NavigationController.getProductListPageUrl';

export default class Navigation extends LightningElement {
    @wire(getProductListPageUrl) productListPageUrl;
}
