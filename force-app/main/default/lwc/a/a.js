// categoryProductList.js
import { LightningElement, api, wire } from 'lwc';
import getProductCategoriesByCategoryId from '@salesforce/apex/a.getProductCategoriesByCategoryId';
import getCategories from '@salesforce/apex/a.getCategories';
import {getRecord} from 'lightning/uiRecordApi';
import PRODUCT_CATEGORY_OBJECT from '@salesforce/schema/Product_Category__c';
import PRODUCT_LOOKUP_FIELD from '@salesforce/schema/Product_Category__c.Product__c';

export default class a extends LightningElement {
    @track categories;
    @track productCategories;
    @track products;
    @api categoryId;

    @wire(getCategories)
    wiredCategories({ error, data }) {
        if (data) {
            this.categories = data;
        } else if (error) {
            console.error('Error fetching categories:', error);
        }
    }
    



    /* @wire(getCategoriesWithProductCategories, { categoryId: '$categoryId' })
    productCategories;
    categoryId; */
    handleCategoryClick(event) {
        this.categoryId = event.target.dataset.categoryId;
        console.log('Category Id:', this.categoryId);
        getProductCategoriesByCategoryId({ categoryId: this.categoryId }).then(result => {
        this.productCategories = result})
        console.log('Product Categories:', this.productCategories);
    }


    handleProductCategoryClick(event) {
        this.ProductCategoryId = event.target.dataset.productCategoryId;
        console.log('Product Category Id:', this.ProductCategoryId);
        
        
    }
    /* get productCategories() {
        return this.productCategories.data;
    }
    get categories() {
        return this.categories.data;
    }
    get error() {
        return this.categories.error;
    }
    get error() {
        return this.productCategories.error;
    }

 */
}
