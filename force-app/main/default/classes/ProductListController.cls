public with sharing class ProductListController {
    @AuraEnabled(cacheable=true)
    public static List<ProductWrapper> getProductList() {
        List<ProductWrapper> productList = new List<ProductWrapper>();

        // Retrieve products
        List<Product2> products = [SELECT Id, Name, list_Price__c, Description, RemainingQuantity__c FROM Product2 LIMIT 100];

        for (Product2 product : products) {
            productList.add(new ProductWrapper(product));
        }

        return productList;
    }

    // Wrapper class for holding product details
    public class ProductWrapper {
        @AuraEnabled public String productId;
        @AuraEnabled public String productName;
        @AuraEnabled public Decimal productPrice;
        @AuraEnabled public String shortDescription;
        @AuraEnabled public Decimal remainingQuantity;

        public ProductWrapper(Product2 product) {
            productId = product.Id;
            productName = product.Name;
            productPrice = product.list_Price__c;
            shortDescription = product.Description;
            remainingQuantity = product.RemainingQuantity__c;
        }
    }
}
