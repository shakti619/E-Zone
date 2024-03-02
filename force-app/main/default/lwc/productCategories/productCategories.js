import { LightningElement, wire } from 'lwc';
import getProductCategories from '@salesforce/apex/ProductCategoriesController.getProductCategories';

export default class productCategories extends LightningElement {
    categories;

    @wire(getProductCategories)
    wiredCategories({ error, data }) {
        if (data) {
            this.categories = data;
        } else if (error) {
            console.error('Error fetching categories:', error);
        }
    }

    handleCategoryClick(event) {
        const categoryId = event.currentTarget.key;
        // You can add logic to handle the click event, for example, navigating to a page
        console.log('Category clicked:', categoryId);
    }
}
