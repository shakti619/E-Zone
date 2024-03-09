public with sharing class addressComponent {
    @AuraEnabled(cacheable=true)
    public static List<Address_Book__c> getAddressList() {
        return [SELECT Id, Name, Street__c, City__c, State__c,Country__c, User__c, Postal_Code__c FROM Address_Book__c];

    }

    // Apex Controller

    @AuraEnabled
    public static void updateAddress(String Name, String street, String city, String state, Integer postalCode, String landmark) {
        
            list<Address_Book__c> address = [SELECT Id FROM Address_Book__c ];
            Address_Book__c addressToUpdate = !address.isEmpty() ? address[0] : null;
            if (addressToUpdate == null) {
                Address_Book__c newAddress = new Address_Book__c();
                newAddress.Name = Name;
                newAddress.Street__c = street;
                newAddress.City__c = city;
                newAddress.State__c = state;
                
                newAddress.Postal_Code__c = postalCode;
                newAddress.Land_Mark__c = landmark;
                insert newAddress;

               
            } else {
                addressToUpdate.Name = Name;
                addressToUpdate.Street__c = street;
                addressToUpdate.City__c = city;
                addressToUpdate.State__c = state;
                
                addressToUpdate.Postal_Code__c = postalCode;
                addressToUpdate.Land_Mark__c = landmark;
                update addressToUpdate;
                
            }
        
    }
}
