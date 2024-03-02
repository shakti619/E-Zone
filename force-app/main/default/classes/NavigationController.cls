public with sharing class NavigationController {
    @AuraEnabled
    public static String getProductListPageUrl() {
        return '/lightning/n/ProductListPage';
    }
}
