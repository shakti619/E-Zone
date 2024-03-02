public with sharing class CartController {
    
    @AuraEnabled
    public static void addToCart(Id productId, Integer quantity) {
        // Check if the product is available (In Stock)
        Product2 product = [SELECT Id, Name, RemainingQuantity__c FROM Product2 WHERE Id = :productId];
        if (product.RemainingQuantity__c >= quantity) {
            // Product is available, add it to the cart (implement your logic here)
            // Example: Create a CartItem record
            Cart_Items__c cartItem = new Cart_Items__c();
            CartItem.Product__c = productId;
            CartItem.Quantity__c = quantity;
            CartItem.Amount__c = 
            CartItem.Quantity__c=
            insert cartItem;
            
            // Show a success toast
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.INFO, 'Product added to cart.'));
        } else {
            // Product is out of stock, show an error toast
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, 'Product is out of stock.'));
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Cart_Items__c> getCartItems() {
        // Implement logic to retrieve cart items (replace with your actual logic)
        return [SELECT Id, Product__c, Quantity__c, Product__r.Name, Product__r.list_price__c, Product__r.Description FROM Cart_Items__c];
    }
    
    @AuraEnabled
    public static void deleteCartItem(Id cartItemId) {
        // Implement logic to delete cart item (replace with your actual logic)
        delete new Cart_Items__c(Id = cartItemId);
    }
    
    @AuraEnabled
    public static void applyCouponCode(String couponCode) {
        // Implement logic to apply coupon code (replace with your actual logic)
        // Example: Check if coupon code is valid and apply discount
        // Note: This is just a placeholder implementation, replace with your actual logic
        if (couponCode == 'SAVE10') {
            // Apply 10% discount
            // Implementation logic goes here
        } else {
            // Invalid coupon code, display error message
            throw new AuraHandledException('Invalid coupon code');
        }
    }
}





