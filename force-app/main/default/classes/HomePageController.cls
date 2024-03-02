public with sharing class HomePageController {
    @AuraEnabled(cacheable=true)
    public static HomePageDetails getHomePageDetails() {
        HomePageDetails homePageDetails = new HomePageDetails();

        // Retrieve cart details
        homePageDetails.cartDetails = [SELECT Id, Name, Status__c, Quantity__c, Amount__c, Customer__r.Name
                                       FROM Cart__c WHERE Status__c = 'Open' LIMIT 1];

        // Retrieve open orders
        homePageDetails.openOrders = [SELECT Id, Name, Total_Items__c, Total__c, Payment_Status__c
                                      FROM Order__c WHERE Status__c = 'Open' LIMIT 1];

        // Retrieve recent orders
        homePageDetails.recentOrders = [SELECT Id, Name, Total_Items__c, Total__c,          Payment_Status__c
                                        FROM Order__c WHERE Status__c = 'Delivered' ORDER BY CreatedDate DESC LIMIT 5];

        return homePageDetails;
    }

    // Wrapper class for holding home page details
    public class homePageDetails {
        @AuraEnabled public Cart__c cartDetails;
        @AuraEnabled public Order__c openOrders;
        @AuraEnabled public List<Order__c> recentOrders;
    }
}
