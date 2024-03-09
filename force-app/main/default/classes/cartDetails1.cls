public with sharing class cartDetails1 {
    @AuraEnabled(cacheable=true)
    public static list<Cart_Items__c> OpenCartItems() {
        return [SELECT Id,Name, Quantity__c, Total_Amount__c, Unit_Price__c FROM Cart_Items__c WHERE Cart__r.Status__c = 'Open'];
        }
        @AuraEnabled
        public static void updateQuantity(Id recordId, Integer Quantity) {
            Cart_Items__c cartItem = [SELECT Id, Quantity__c, Total_Amount__c, Unit_Price__c FROM Cart_Items__c WHERE Id = :recordId];
            cartItem.Quantity__c = quantity;
            
            update cartItem;
        }



}