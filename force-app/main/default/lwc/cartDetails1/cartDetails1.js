import { LightningElement, wire, track } from 'lwc';
import OpenCartItems from '@salesforce/apex/cartDetails1.OpenCartItems';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { createRecord } from 'lightning/uiRecordApi';
import ORDER_OBJECT from '@salesforce/schema/Order__c';
import ORDER_LINE_ITEM_OBJECT from '@salesforce/schema/Order_Line_Item__c';
export default class CartDetails1 extends LightningElement {
    @track Items = [];
    @track error;
    @track total;
    @track coupans = [];
    @track couponCode;
    @track discountPercentage=''
    @track order
    showModal = false;
    showCart=true; 
    showPayments=false;
    

    @wire(OpenCartItems)
    wiredOpenCart({ error, data }) {
        if (data) {
            this.Items = data.map(item => ({
                ...item,
                
                UnitPrice: item.Unit_Price__c,
                Quantity: item.Quantity__c,
                Total: item.Total_Amount__c
            }));
           
            this.total = this.Items.reduce((acc, item) => acc + item.Total, 0);
        } else if (error) {
            this.error = error;
        }
    }

    handleCouponCodeChange(event) {
        this.couponCode = event.target.value;
        this.coupans = ['Save10', 'Save20', 'Save30', 'Save40', 'Save50'];
        console.log('couponCode', this.couponCode);
    }

    handleApplyCoupon() {
        if (this.coupans.includes(this.couponCode)) {
            this.discountPercentage = parseInt(this.couponCode.replace('Save', ''));
            
            this.total = this.total - (this.total * (this.discountPercentage / 100));
            
            // Show toast message for successful coupon application
            const toastEvent = new ShowToastEvent({
                title: 'Success',
                message: 'Coupon applied successfully Saved ' + this.discountPercentage + '%',
                variant: 'success'
            });
            this.dispatchEvent(toastEvent);
            
            // Disable coupon input field after adding the discount
            this.template.querySelector('.coupon-input').disabled = true;
            
            // Remove the applied coupon from the list
            const index = this.coupans.indexOf(this.couponCode);
            if (index !== -1) {
                this.coupans.splice(index, 1);
            }
            
        } else {
            // Show toast message for no such coupon available
            const toastEvent = new ShowToastEvent({
                title: 'Error',
                message: 'No such coupon available',
                variant: 'error'
            });
            this.dispatchEvent(toastEvent);
        }
    

        

        
    }

    
    

    handleIncrease(event) {
        const productId = event.target.dataset.productId;
        console.log('productId', productId);
        const productToUpdate = this.Items.find(product => product.Id === productId);
        console.log('productToUpdate', productToUpdate.Name);
        console.log('productToUpdate', productToUpdate);
        if (productToUpdate && productToUpdate.Quantity > 0) {
            productToUpdate.Quantity++;
            productToUpdate.Total = productToUpdate.UnitPrice * productToUpdate.Quantity;
            this.total = this.Items.reduce((acc, item) => acc + item.Total, 0);
        }
        const recordInput = {
            fields: {
                Id: productId,
                Quantity__c: productToUpdate.Quantity
            }
        };

        // Call the updateRecord method
        updateRecord(recordInput)
            .then(() => {
                console.log('Record updated successfully');
            })
            .catch(error => {
                console.error('Error updating record:', error);
            }); 
        }
    

    handleDecrease(event) {
        const productId = event.target.dataset.productId;
        console.log('productId', productId);
        const productToUpdate = this.Items.find(product => product.Id === productId);
        console.log('productToUpdate', productToUpdate);
        if (productToUpdate && productToUpdate.Quantity > 1) {
            productToUpdate.Quantity--;
            productToUpdate.Total = productToUpdate.UnitPrice * productToUpdate.Quantity;
            this.total = this.Items.reduce((acc, item) => acc + item.Total, 0);

            const recordInput = {
                fields: {
                    Id: productId,
                    Quantity__c: productToUpdate.Quantity
                }
            };
            
    
            // Call the updateRecord method
            updateRecord(recordInput)
                .then(() => {
                    console.log('Record updated successfully');
                })
                .catch(error => {
                    console.error('Error updating record:', error);
                }); 
        }
       
    }

    //ORDER CREATION
    orderHandler() {
        const fields = {
              
            
            Amount__c: this.total,
            Status__c: 'In Process',
            Payment_Status__c:'COD', 
            Payment_Method__c: 'COD',
        
        };
        

        const recordInput = { apiName: ORDER_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(order => {
                console.log('New order created with Id: ', order.id);
                this.order = order;
                const toast= new ShowToastEvent({
                    title: 'Success',
                    message: 'Order created successfully',
                    variant: 'success'
                });
                this.dispatchEvent(toast);

                const fields1 = {};
                this.Items.forEach(item => {
                    fields1.Order__c = this.order.id;
                    
                    fields1.Quantity__c = item.Quantity;
                    fields1.Unit_Price__c = item.UnitPrice;
                    
                    const recordInput1 = { apiName: ORDER_LINE_ITEM_OBJECT.objectApiName, fields: fields1 };
                    createRecord(recordInput1)
                        .then(orderLineItem => {
                            console.log('New order line item created with Id: ', orderLineItem.id);
                        })
                        .catch(error => {
                            console.error('Error creating new order line item: ', error);
                        });
                });
                this.showModal = true;
                this.showCart = false;

                
            })
            .catch(error => {
                console.error('Error creating new order: ', error);
            });

             }

             handleCancel(){
                this.showModal = false;
                this.showCart = true;
            };

            handleConfirm(){
                this.showPayments = true;
                this.showModal = false;
                
            };

            }