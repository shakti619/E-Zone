Public with sharing class ProductCategoriesController {
    @AuraEnabled(cacheable=true)
    public static List<Product_Categories__c> getProductCategories() {
        return [SELECT Id, Name, Sequence__c, (SELECT Id, Name From Product2__r), Categories__c FROM Product_Categories__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Categories__c> getCategories() {
        return [SELECT Id, Name, Sequence__c, 
        Parent_Category__c FROM Categories__c];
    }
}
