import { LightningElement, wire } from 'lwc';
import getHomePageDetails from '@salesforce/apex/HomePageController.getHomePageDetails';

export default class HomePageComponent extends LightningElement {
    homePageDetails = {}; // Initialize as an empty object

    @wire(getHomePageDetails)
    wiredHomePageDetails({ error, data }) {
        if (data) {
            this.homePageDetails = data;
        } else if (error) {
            console.error('Error fetching home page details:', error);
        }
    }
}
