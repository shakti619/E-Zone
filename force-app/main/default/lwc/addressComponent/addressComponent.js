import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const fields = [
    'User.Addresses__c'
];

export default class AddressComponent extends LightningElement {
    addresses = [];

    @wire(getRecord, { recordId: '$recordId', fields })
    wiredRecord({ error, data }) {
        if (data) {
            this.addresses = JSON.parse(data.fields.Addresses__c.value);
        } else if (error) {
            console.error('Error retrieving user addresses:', error);
        }
    }

    handleSuccess(event) {
        // Refresh data after successful save
        this.addresses.push(event.detail.id);
    }
}
