public with sharing class CartDetailsController {
    @AuraEnabled(cacheable=true)
    public static Cart__c getOpenCartDetails() {
        return [SELECT Id, Name, Status__c, Quantity__c, Amount__c, Customer__r.Name
        FROM Cart__c WHERE Status__c = 'Open' LIMIT 1];
    }
}
