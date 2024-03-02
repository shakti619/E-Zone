public with sharing class OrderDetailsController {
    @AuraEnabled(cacheable=true)
    public static List<Order__c> getOpenOrderDetails() {
        
        return [SELECT Id, Name, Total_Items__c, Total__c, Payment_Status__c, Shipping_Address__c FROM Order__c WHERE Status__c = 'Open'];
    }
}
