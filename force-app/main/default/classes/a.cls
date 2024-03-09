public with sharing class a{
    @AuraEnabled(cacheable=true)
    public static List<Categories__c> getCategories() {
        return [SELECT Id, Name,
                       (SELECT Id, Name, Product__r.Name, Product__r.Id
                        FROM Product_categories__r)
                FROM Categories__c];
    }
    @AuraEnabled(cacheable=true)
    public static List<Product_Categories__c> getProductCategoriesByCategoryId(Id categoryId) {
        return [SELECT Id, Name
                       FROM Product_Categories__c 
                       WHERE Categories__c = :categoryId];
                      
}


}


