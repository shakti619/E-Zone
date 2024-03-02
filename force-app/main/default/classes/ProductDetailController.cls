public with sharing class ProductDetailController {
    @AuraEnabled(cacheable=true)
    public static List<ProductImageWrapper> getProductImages(String productId) {
        List<ProductImageWrapper> imageList = new List<ProductImageWrapper>();

        try {
            // Query for Product Images related to the given Product Id
            List<Product_Image__c> images = [SELECT Id, Name, URL__c, Description__c FROM Product_Image__c WHERE Product__c = :productId];

            // Convert the Product Image records into a wrapper class for easy serialization
            for (Product_Image__c image : images) {
                imageList.add(new ProductImageWrapper(image.Id, image.Name, image.URL__c, image.Description__c));
            }
        } catch (Exception ex) {
            // Handle exception as needed
            System.debug('Error fetching product images: ' + ex.getMessage());
        }

        return imageList;
    }

    // Wrapper class for Product Image records
    public class ProductImageWrapper { 
        @AuraEnabled
        public String imageId;
        @AuraEnabled
        public String name;
        @AuraEnabled
        public String url;
        @AuraEnabled
        public String description;

        public ProductImageWrapper(String id, String imgName, String imgUrl, String imgDesc) {
            imageId = id;
            name = imgName;
            url = imgUrl;
            description = imgDesc;
        }
    }
}
