
public with sharing class ProductController1 {
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts() {
        return [
            SELECT Id, Name, list_price__c, Description, TotalQuantity__c, RemainingQuantity__c,
                (SELECT Hero_Image__c, URL__c,Name FROM Product_Images__r ) 
            FROM Product2
        ];
    }
    
    

    @AuraEnabled(cacheable=true)
    public static List<Cart__c> getCartDetails() {
        return [
            SELECT Id, Quantity__c, Amount__c,(SELECT Id,Product__c FROM Cart_Items__r )
            FROM Cart__c
        ];
    }

    public static void addToCart(String productId, Integer quantity) {
        // Retrieve the current user's cart (assuming each user has only one open cart)
        Cart__c cart = [SELECT Id, Status__c FROM Cart__c WHERE Status__c = 'Open' AND Customer__c = :UserInfo.getUserId() LIMIT 1];

        if (cart == null) {
            // No open cart found for the user, create a new cart
            cart = new Cart__c(Status__c = 'Open', Customer__c = UserInfo.getUserId());
            insert cart;
        }

        // Check if the product is already added to the cart
        Cart_Item__c existingCartItem = [SELECT Id, Quantity__c FROM Cart_Item__c WHERE Cart__c = :cart.Id AND Product__c = :productId LIMIT 1];

        if (existingCartItem != null) {
            // Product already exists in the cart, update the quantity
            existingCartItem.Quantity__c += quantity;
            update existingCartItem;
        } else {
            // Product not yet added to the cart, create a new cart item
            Cart_Item__c cartItem = new Cart_Item__c(Cart__c = cart.Id, Product__c = productId, Quantity__c = quantity);
            insert cartItem;
        }
    }

}

    
