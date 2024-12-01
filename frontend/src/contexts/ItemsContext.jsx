import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserContext } from "./UserContext";
import MenuItems from "../MockData/MenuItems.json";
import SupplierProducts from "../MockData/SupplierProducts.json";

// יצירת הקונטקסט
const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
    const { userBaseData: user } = useUserContext();

    const [loadingItems, setLoadingItems] = useState(true);
    const [userItems, setUserItems] = useState();
    const [categories, setCategories] = useState();
    const [allProducts, setAllProducts] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    // Function to extract all products with their categories using flatMap
    const extractAllProducts = (menuData) => {
        return menuData.categories.flatMap(category => {
            const directItems = category.items  // Changed from category.item()
                ? [{
                    categoryName: category.name,
                    categoryId: category.id,
                    subCategoryName: null,
                    items: category.items
                }]
                : []
            const subCategoriesItems = category.subCategories
                ? category.subCategories.map(subCategory => ({
                    categoryName: category.name,
                    categoryId: category.id,
                    subCategoryName: subCategory.name,
                    subCategoryId: subCategory.id,
                    items: subCategory.items
                }))
                : []
            return [...directItems, ...subCategoriesItems]
        })
    }

    // Function to extract all unique ingredients with base quantities using flatMap
    const extractIngredients = (menuData) => {
        const allIngredients = menuData.categories.flatMap(category => {
            const categoryIngredients = category.items
                ? category.items.flatMap(item => item.ingredients)
                : []

            const subCategoryIngredients = category.subCategories
                ? category.subCategories.flatMap(subCategory =>
                    subCategory.items.flatMap(item => item.ingredients)
                )
                : []
            return [...categoryIngredients, ...subCategoryIngredients]
        })

        // Reduce ingredients to combine quantities
        return Object.values(allIngredients.reduce((acc, ingredient) => {
            const baseQuantity = ingredient.amountInGrams * 1.2

            if (acc[ingredient.id]) {
                acc[ingredient.id].baseQuantity += baseQuantity
            } else {
                acc[ingredient.id] = {
                    id: ingredient.id,
                    name: ingredient.name,
                    baseQuantity,
                    stockQuantity: 0,
                    uniteType: 'grams'
                }
            }
            return acc
        }, {}))
    }

    useEffect(() => {
        setLoadingItems(true);
        // setUserItems(
        //     user?.accountType === 'supplier'
        //         ? SupplierProducts
        //         : MenuItems
        // );
        // setCategories(
        //     user?.accountType === 'supplier'
        //         ? SupplierProducts
        //         : MenuItems.categories
        //             .map(category => ({
        //                 name: category.name,
        //                 subCategories: category.subCategories?.map(sub => sub.name) || []
        //
        //             }) || [])
        //
        // );
        //
        // console.log('User Items Set');
        // console.log('user items', userItems)
        // console.log('user categories',categories)

        const currentUserItems = user?.accountType === 'supplier'
            ? SupplierProducts
            : MenuItems
        setUserItems(currentUserItems)

        if (user?.accountType !== 'supplier') {
            // Set categories
            const extractedCategories  = MenuItems.categories.map(category => ({
                id: category.id,
                name: category.name,
                subCategories: category.subCategories?.map(sub => sub.name) || []
            }))
            setCategories(extractedCategories)

            // Extract all products with categories
            const extractedProducts = extractAllProducts(MenuItems)
            setAllProducts(extractedProducts)

            // Extract and set ingredients
            const extractedIngredients = extractIngredients(MenuItems)
            setIngredients(extractedIngredients)
        } else {
            setCategories(SupplierProducts)
        }

        setLoadingItems(false);
        console.log('ingredients:', ingredients)
        console.log('all products:', allProducts)
        console.log('categories:', categories)
        return () => {
            setUserItems(null);
            setCategories(null);
            setAllProducts([]);
            setIngredients([]);
        };
    }, [user]);

    // Function to filter products by category and subcategory
    const filterProducts = (categoryId, subCategoryId = null) => {
        return allProducts.filter(product =>
        product.categoryId === categoryId &&
            (!subCategoryId || product.subCategoryId === subCategoryId)
        )
    }

    // Function to update ingredient stock
    const updateIngredientStock = (ingredientId, newQuantity) => {
        setIngredients(prevIngredients => prevIngredients.map(ingredient =>
            ingredient.id === ingredientId
                ? { ...ingredient, stockQuantity: newQuantity }
                : ingredient
        ))
    }

    return (
        <ItemsContext.Provider value={{userItems, categories, ingredients, allProducts, loadingItems, filterProducts, updateIngredientStock, setIngredients}}>
            {children}
        </ItemsContext.Provider>
    );
};

// hook לשימוש בקונטקסט
export const useItemsContext = () => useContext(ItemsContext);
