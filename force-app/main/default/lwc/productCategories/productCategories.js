import { LightningElement, wire } from 'lwc';
import getProductCategories from '@salesforce/apex/ProductCategoriesController.getProductCategories';
import getCategories from '@salesforce/apex/ProductCategoriesController.getCategories'; 

export default class productCategories extends LightningElement {
    ProductCategories;
    categories;
    products;

    @wire(getProductCategories)
    wiredCategories({ error, data }) {
        if (data) {
            this.ProductCategories = data

            console.log('ProductCategories:', this.ProductCategories);  
        } else if (error) {
            console.error('Error fetching categories:', error);
        }}
    
    @wire(getCategories)
    wiredCategories({ error, data }) {
        if (data) {
            /* this.categories = data.map(category => ({...category,
                productCat: this.ProductCategories.find(productCat => productCat.categories__c===category.Id) })); */
            this.categories = data;
            console.log('categories:', this.categories);  
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