import { LightningElement,track,wire } from 'lwc';
import getAddressList from '@salesforce/apex/addressComponent.getAddressList';
import updateAddress from '@salesforce/apex/addressComponent.updateAddress';


export default class AddressComponent extends LightningElement {
  
    
    @track showForm = false;
    @track Name
    @track addresses = [];
    @track Street = '';
    @track State = '';
    @track city = '';
    @track country = '';
    @track postalCode = '';
    @track landmark = '';;
    
    handleInputChange(event) {
        /* this.recordId = event.currentTarget.dataset.field === 'Customer_User__c' ? event.currentTarget.value : this.recordId; */
        this.Name = event.currentTarget.dataset.field === 'Name' ? event.currentTarget.value : this.Name;
        console.log('Name',this.Name);
        this.Street = event.currentTarget.dataset.field === 'Street__c' ? event.currentTarget.value : this.Street;
        console.log('Street',this.Street);
        this.State = event.currentTarget.dataset.field === 'State__c' ? event.currentTarget.value : this.State;
        console.log('State',this.State);
        this.city = event.currentTarget.dataset.field === 'City__c' ? event.currentTarget.value : this.city;
        console.log('City',this.city);
       /*  this.country = event.currentTarget.dataset.field === 'Country__c' ? event.currentTarget.value : this.country; */
        console.log('Country',this.country);
        this.postalCode = event.currentTarget.dataset.field === 'PostalCode__c' ? event.currentTarget.value : this.postalCode;
        console.log('PostalCode',this.postalCode);
        this.landmark = event.currentTarget.dataset.field === 'LandMark__c' ? event.currentTarget.value : this.landmark;
    };
    handleSubmit() {
        console.log('Name',this.Name);
        updateAddress({
            Name: this.Name, // Id of the record to update
            Street: this.Street,
            city: this.city,
            state: this.State,
            /* country: this.country, */
            postalCode: this.postalCode,
            landmark: this.landmark
            
        }).then(result => {
            // Handle success
            console.log('Address Updated');
            this.showForm = false;
        })
        console.log('Name',this.Name);
        console.log('Street',this.Street);  
        console.log('State',this.State);  
        console.log('City',this.city);  
        
    }
    handleEdit() {
        this.showForm = false;
    }
    handleAddAddress() {
        this.showForm = true;}


    connectedCallback() {
        this.loadAddresses();
    }

    loadAddresses() {
        getAddressList()
            .then(result => {
                this.addresses = result;
                console.log('Addresses loaded', result);
               
            })
            .catch(error => {
                console.error('Error fetching addresses', error);
            });
    }

    handleShippingStreetChange(event) {
        this.shippingStreet = event.target.value;
    }

    handleBillingStreetChange(event) {
        this.billingStreet = event.target.value;
    }

    handleFormSubmit() {
        updateAddress({
            recordId: this.recordId, // Id of the record to update
            street: this.street,
            city: this.city,
            state: this.state,
            country: this.country,
            postalCode: this.postalCode,
            landmark: this.landmark
        })
        .then(result => {
            // Handle success
        })
        .catch(error => {
            // Handle error
        });
    }

   /*  saveAddresses() {
        const addressesToSave = [
            { Type: 'Shipping', Street: this.shippingStreet },
            { Type: 'Billing', Street: this.billingStreet }
            // Add other address fields here
        ];

        saveAddresses({ addresses: addressesToSave })
            .then(result => {
                // Handle success
                this.loadAddresses(); // Refresh addresses after save
            })
            .catch(error => {
                console.error('Error saving addresses', error);
            });
    } */
}
