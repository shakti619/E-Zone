public with sharing class dekhte2 {
    
    // Method to fetch products with their images
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts() {
        return [
            SELECT Id, Name, list_price__c, Description, TotalQuantity__c, RemainingQuantity__c,
                (SELECT Hero_Image__c, URL__c, Name FROM Product_Images__r) 
            FROM Product2
        ];
    }

    // Method to add a product to the cart
    @AuraEnabled
    public static void addToCart(String productId, Integer quantity) {
        try {
            if (String.isNotBlank(productId) && quantity > 0) {
                // Retrieve selected product details
                // Retrieve selected product details
         Product2 selectedProduct = [SELECT Id, Name, list_price__c, RemainingQuantity__c FROM Product2 WHERE Id = :productId LIMIT 1];

  // Check if there is enough quantity left
   if (selectedProduct.RemainingQuantity__c >= quantity) {
    // Deduct the quantity from the remaining quantity
    selectedProduct.RemainingQuantity__c -= quantity;
    update selectedProduct;
} else {
    // Handle the case when there is not enough quantity left
    throw new AuraHandledException('Not enough quantity left for this product.');
}
                
                // Find existing open cart for the user
                List<Cart__c> carts = [SELECT Id FROM Cart__c WHERE Status__c = 'Open' LIMIT 1];
                Cart__c cart = !carts.isEmpty() ? carts[0] : null; 
                
                if (cart == null) {
                    // No open cart found, create a new cart
                    cart = new Cart__c(Status__c = 'Open');
                    insert cart;
                }
                
                // Find existing cart item for the product in the cart
                List<Cart_Items__c> existingCartItems = [SELECT Id, Quantity__c FROM Cart_Items__c WHERE Cart__c = :cart.Id AND Product__c = :productId LIMIT 1];
                Cart_Items__c existingCartItem = !existingCartItems.isEmpty() ? existingCartItems[0] : null;
                
                if (existingCartItem != null) {
                    // Product already exists in the cart, update the quantity
                    existingCartItem.Quantity__c += quantity;
                    update existingCartItem;
                } else {
                    // Product not yet added to the cart, create a new cart item
                    Cart_Items__c cartItem = new Cart_Items__c(
                        Cart__c = cart.Id,
                        Product__c = productId,
                        Quantity__c = quantity,
                        Amount__c = selectedProduct.list_price__c * quantity,
                        Name = selectedProduct.Name,
                        Unit_Price__c = selectedProduct.list_price__c
                    );
                    insert cartItem;
                }
                selectedProduct.RemainingQuantity__c -= quantity;
                update selectedProduct;
            }
        } catch (DmlException e) {
            // Handle DML exceptions
            System.debug('Error adding product to cart: ' + e.getMessage());
            throw new AuraHandledException('An error occurred while adding the product to the cart: ' + e.getMessage());
        } catch (Exception e) {
            // Handle any other exceptions
            System.debug('Error: ' + e.getMessage());
            System.debug(e.getStackTraceString()); // This line logs the complete stack trace
            throw new AuraHandledException('An unexpected error occurred: ' + e.getMessage()); 
        }
    }
} 


