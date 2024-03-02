public with sharing class ProductCategoriesController {
    @AuraEnabled(cacheable=true)
    public static List<CategoryWrapper> getProductCategories() {
        List<CategoryWrapper> categories = new List<CategoryWrapper>();

        // Query for your Categories__c and populate the categories
        List<Categories__c> categoryRecords = [SELECT Id, Name, Parent_Category__c FROM Categories__c];
        
        // Map to hold parent categories and their subcategories
        Map<Id, CategoryWrapper> categoryMap = new Map<Id, CategoryWrapper>();

        for (Categories__c categoryRecord : categoryRecords) {
            CategoryWrapper categoryWrapper = new CategoryWrapper(
                categoryRecord.Id, categoryRecord.Name, new List<CategoryWrapper>()
            );

            if (categoryRecord.Parent_Category__c == null) {
                // Parent Category
                categories.add(categoryWrapper);
            } else {
                // Subcategory
                if (categoryMap.containsKey(categoryRecord.Parent_Category__c)) {
                    categoryMap.get(categoryRecord.Parent_Category__c).subcategories.add(categoryWrapper);
                }
            }

            categoryMap.put(categoryRecord.Id, categoryWrapper);
        }

        return categories;
    }

    // Wrapper class for holding category information
    public class CategoryWrapper {
        @AuraEnabled public String categoryId;
        @AuraEnabled public String categoryName;
        @AuraEnabled public List<CategoryWrapper> subcategories;

        public CategoryWrapper(String categoryId, String categoryName, List<CategoryWrapper> subcategories) {
            this.categoryId = categoryId;
            this.categoryName = categoryName;
            this.subcategories = subcategories;
        }
    }
}
