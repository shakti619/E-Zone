public with sharing class HomePageController {
    @AuraEnabled(cacheable=true)
    public static List<Cart__c> getCart() {
        

        return [SELECT Id, Name, Status__c, Quantity__c, Amount__c 
                                       FROM Cart__c WHERE Status__c = 'Open' ];

         

      
    }
    @AuraEnabled(cacheable=true)
    public static List<Order__c> getOrder() {
        return [SELECT Id, Name, Payment_Status__c, Total__c, Billing_Address__c 
                                       FROM Order__c WHERE Status__c = 'Open' ];
    }

   
    
}
