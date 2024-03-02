public with sharing class ProductController {
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts() {
        return [SELECT Id, Name, Hero_Image__c, Price__c, Short_Description__c, In_Stock__c, Quantity__c FROM Product__c LIMIT 10];
    }
}
