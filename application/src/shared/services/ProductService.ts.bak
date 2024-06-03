import { Product } from "../../models/Product"
import { Review } from "../../models/Review"
import { SpecialConfig } from "../../models/SpecialConfig"

let products: Product[] = [
    {
        id: 1,
        title: "Barley Cup - Organic Instant Barley Beverage 100g",
        description: "A natural alternative to coffee without caffeine made from grains, suitable for people looking to drop caffeine in their diet for example pregnant or breastfeeding mums adults a coffee like drink before bed. In some countries it is offered to children as a 'starter' drink instead of coffee.",
        price: 11.95,
        reviews: [],
        photoUrl: "https://cdn11.bigcommerce.com/s-kkzirv2h8i/images/stencil/1280x1280/products/12664/9985/barleycup-organic-100g__48365.1712295948.jpg?c=1",
        sources: ["https://mosesandco.com.au/barley-cup-organic-instant-barley-beverage-100g/"],
        isSpecial: false,
    },
    {
        id: 2,
        title: "GF Precinct - Buckwheat & Chia 600g",
        description: "A delicious & nutritious loaf with a soft, moist & chewy texture, perfect for sandwiches or toasted. Handcrafted locally in a completely gluten free bakery. Australian owned.",
        price: 10.29,
        reviews: [],
        photoUrl: "https://cdn11.bigcommerce.com/s-kkzirv2h8i/images/stencil/1280x1280/products/7540/9122/Precinct_Loaf_Buckwheat_VIS_LR__78579.1663289886.png?c=1",
        sources: ["https://mosesandco.com.au/gf-precinct-buckwheat-chia-600g/"],
        isSpecial: false,
    },
    {
        id: 3,
        title: "Cocosoul - Organic Coconut Milk 1.25L",
        description: "Cocosoul organic coconut milk has natural fat, which is called medium chain triglycerides, also known as lauric acid, your body absorbs these fats naturally and easy to digest, MCT's does not store as fat in your system.",
        price: 11.95,
        reviews: [],
        photoUrl: "https://cdn11.bigcommerce.com/s-kkzirv2h8i/images/stencil/1280x1280/products/4939/2062/eyJpZCI6IjgxN2ViNjZlM2YyNGI2YWJjZjA3YzRiZGYxZjA2OGYzLmpwZyIsInN0b3JhZ2UiOiJwdWJsaWNfc3RvcmUifQ_signature_ef1a57e0daf72d6b6b77b2e31dec02c745f21c2895834a37577a88c47ff23aaa__47109.1591500977.png?c=1",
        sources: ["https://mosesandco.com.au/cocosoul-organic-coconut-milk-1250ml/"],
        isSpecial: false,
    },
    {
        id: 4,
        title: "Vego - Vegan Hazelnut Spread 350g",
        description: "A smooth and creamy hazelnut chocolate paste, filled with hazelnuts pieces for a sweet and crunchy sandwich spread with uncompromised flavour. Great for lunches, morning toast or straight from the jar. This chocolate spread is vegan friendly and contains Fair Trade and Organic ingredients while being gluten and palm oil free.",
        price: 11.49,
        reviews: [],
        photoUrl: "https://cdn11.bigcommerce.com/s-kkzirv2h8i/images/stencil/1280x1280/products/12653/9967/vego-hazelnut-spread-350g__28459.1710704741.jpg?c=1",
        sources: ["https://mosesandco.com.au/vego-vegan-hazelnut-spread-350g/"],
        isSpecial: false,
    },
    {
        id: 5,
        title: "Vego - Vegan Whole Hazelnut Chocolate Bar 65g",
        description: "The Vego bar is possibly one of the tastiest vegan chocolate bars in the world. Organic, Fairly traded and Gluten-Free, it is made of the finest chocolate with hazelnut paste added in, resulting in a smooth and creamy chocolate, and generously packed with whole hazelnuts.",
        price: 4.65,
        reviews: [],
        photoUrl: "https://cdn11.bigcommerce.com/s-kkzirv2h8i/images/stencil/1280x1280/products/5284/1427/ve01__61220.1591339525.jpg?c=1",
        sources: ["https://mosesandco.com.au/vego-vegan-whole-hazelnut-chocolate-bar-65g/"],
        isSpecial: false,
    },
    {
        id: 6,
        title: "A.B.C. Spread 1kg",
        description: "Made & Packed in Australia from 40% ingredients of Australia.",
        price: 27.75,
        reviews: [],
        photoUrl: "https://naturallyonhigh.com.au/wp-content/uploads/2019/08/a.b.c.-spread.jpg",
        sources: ["https://naturallyonhigh.com.au/product/a-b-c-spread-1box/"],
        isSpecial: false,
    },
    {
        id: 7,
        title: "Al-Rabih Orange Blossom Water",
        description: "This Orange Flower Water is an essential, non-alcoholic water made out of bitter orange blossoms. A traditional ingredient for drinks and food in North Africa, Middle East and Mediterranean area. Use in classic drinks like the Ramos Gin Fizz and the Wallick - a Martini Cocktail variation.",
        price: 8.49,
        reviews: [],
        photoUrl: "https://naturallyonhigh.com.au/wp-content/uploads/2020/08/al-rabih-orange-blossom-water-250ml.jpg",
        sources: ["https://naturallyonhigh.com.au/product/al-rabih-orange-blossom-water/"],
        isSpecial: false,
    },
    {
        id: 8,
        title: "Alter Eco Organic Chocolate - SuperDark Crisp Mint",
        description: "Chocolate and mint have never been so mouth-watering. The recipe is simple: our deepest dark, silky-smooth, 90% cacao is contrasted with a refreshing hint of peppermint crisp and a mellowing touch of Madagascar bourbon vanilla bean. The difference is in the details: expert Swiss chocolates, the finest organic ingredients, and a rain forest that stays a little cooler with every bar.",
        price: 5.29,
        reviews: [],
        photoUrl: "https://naturallyonhigh.com.au/wp-content/uploads/2020/09/ALTER-ECO-Organic-Dark-Chocolate-Crisp-Mint.jpg",
        sources: ["https://naturallyonhigh.com.au/product/alter-eco-organic-chocolate-superdark-crisp-mint/"],
        isSpecial: false,
    },
    {
        id: 9,
        title: "Alter Eco Organic Chocolate - Grass Fed Milk with Rice Crunch",
        description: "Grass fed milk and toasted rice combine for a nostalgic crunch. The best chocolate deserves the best ingredients. That’s why we only use the highest quality, grass fed milk from open pastured cows in alpine valleys. Chocolate as it was meant to be, no compromises.",
        price: 5.59,
        reviews: [],
        photoUrl: "https://naturallyonhigh.com.au/wp-content/uploads/2020/09/ALTER-ECO-Organic-Chocolate-Grass-Fed-Milk-with-Rice-Crunch.jpg",
        sources: ["https://naturallyonhigh.com.au/product/alter-eco-organic-chocolate-grass-fed-milk-with-rice-crunch/"],
        isSpecial: false,
    },
    {
        id: 10,
        title: "Alter Eco Organic Chocolate - Deepest Dark Super Blackout",
        description: "If you've tried and loved this award-winning Blackout bar, it's time to step into the heart of dark. At 90% cacao, this deep, fruity-malty Ecuadorian chocolate packs all the intensity of the darkest dark bar with the smooth, creamy bite every chocolate lover craves. Just a touch of Madagascar vanilla rewards fearless flavour seekers, while all that cacao offers the health conscious some melt-in-your-mouth benefits.",
        price: 5.29,
        reviews: [],
        photoUrl: "https://naturallyonhigh.com.au/wp-content/uploads/2020/09/Alter-Eco-Organic-Chocolate-Super-Blackout.jpg",
        sources: ["https://naturallyonhigh.com.au/product/alter-eco-organic-chocolate-deepest-dark-super-blackout/"],
        isSpecial: false,
    },
    {
        id: 11,
        title: "Alter Eco Organic Chocolate - Deep Dark Salted Almonds",
        description: "Almond lovers, here's something to sink your teeth into. Roasty-toasty almonds swim in deep, dark Ecuadorian chocolate, with a sprinkling of coveted fleur de sel de Guérande to heighten each and every flavor. This is how a classic standby becomes a sophisticated addiction.",
        price: 5.59,
        reviews: [],
        photoUrl: "https://naturallyonhigh.com.au/wp-content/uploads/2020/09/ALTER-ECO-Organic-Chocolate-Deep-Dark-Salted-Almonds.jpg",
        sources: ["https://naturallyonhigh.com.au/product/alter-eco-organic-chocolate-deep-dark-salted-almonds/"],
        isSpecial: false,
    },
    {
        id: 12,
        title: "Anna Park Certified Organic Yerba Mate 500g",
        description: "Anna Park Yerba Mate is a powerful and all natural, appetite curbing tea that provides energy, improves digestion and boosts your immune system.",
        price: 17.99,
        reviews: [],
        photoUrl: "https://naturallyonhigh.com.au/wp-content/uploads/2020/08/Anna-Park-Yerba-Mate-500g.jpg",
        sources: ["https://naturallyonhigh.com.au/product/anna-park-certified-organic-yerba-mate-500g/"],
        isSpecial: false,
    },
    {
        id: 13,
        title: "Rice up - Organic Wholegrain Rice Cakes (Amaranth & Millet) 100g",
        description: "Looking for a tasty, organic and healthy snack? Then these delicious brown rice cakes from Rice Up are sure to satisfy! Made with popped whole grains and 7 super seeds, these rice cakes are ideal for snacking on the go, lunch at work or school, or as a tasty afternoon treat!",
        price: 3.95,
        reviews: [],
        photoUrl: "https://keworganics.com.au/cdn/shop/products/image_23c0bca6-db80-4b57-8a44-b62e68cca8ae.jpg?v=1681017515",
        sources: ["https://keworganics.com.au/products/rice-up-organic-wholegrain-rice-cakesamaranth-millet-100g", "https://www.catch.com.au/product/3-x-rice-up-organic-rice-cakes-7-super-seeds-120g-7246373/?offer_id=36652534&ref=gmc&st=123&gad_source=1&gclid=Cj0KCQjwztOwBhD7ARIsAPDKnkBDVKMy6zQy9q9k3yV-lMDmPyWtCX4Us83cU_BQy2L6ykHbw0rARmAaAjilEALw_wcB"],
        isSpecial: false,
    },
    {
        id: 14,
        title: "Global Organics Strong Dijon Mustard 200 g",
        description: "Global Organic Strong Dijon Mustard spreads smoothly and has a tangy taste that will excite your taste buds. Perfect for spreading on sandwiches, salad dressings, or can be added to cooking sauces.",
        price: 6.99,
        reviews: [],
        photoUrl: "https://keworganics.com.au/cdn/shop/products/image_7248b89a-022a-4967-8947-e33bc31eba11.jpg?v=1681011914",
        sources: ["https://keworganics.com.au/products/globall-organics-strong-dijon-mustard-200g", "https://www.amazon.com.au/Global-Organics-Strong-Dijon-Mustard/dp/B07MVRNLKX/ref=asc_df_B07MVRNLKX/?tag=googleshopdsk-22&linkCode=df0&hvadid=347627071398&hvpos=&hvnetw=g&hvrand=14176713783804059736&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9060880&hvtargid=pla-899957837451&mcid=f88de03067ad3daebb2cb1c88f955bcb&th=1"],
        isSpecial: false,
    },
    {
        id: 15,
        title: "2die4 - Organic Brazils 120g",
        description: "Well, they're actually not only from Brazil... They're from the beautiful forests of South America. Once they're activated though, it's like they're from heaven. Specifications: Made in Byron Bay using Brazil Nuts from Bolivia. Vegan. Ingredients: Organic Brazil Nuts, Organic Australian Salt.",
        price: 11.55,
        reviews: [],
        photoUrl: "https://keworganics.com.au/cdn/shop/products/image_c47d7a8c-61b8-47d7-840f-ba769e704bd2.jpg?v=1676078355",
        sources: ["https://keworganics.com.au/products/2die4-organic-brazils120g", "https://www.cityhealth.com.au/p/9340755000209?gad_source=1&gclid=Cj0KCQjwztOwBhD7ARIsAPDKnkAp0fxUiE-YedN02lKvUa1dyTAEqGI8q0FITfW4KgLC74fZRnei0OcaApCOEALw_wcB"],
        isSpecial: false,
    },
]

/**
 * Generate random number given a min and max range
 * @param min 
 * @param max 
 * @returns 
 */
function GenerateRandomNumber(min: number, max: number): number {
    return min + Math.round(Math.random() * (max - min))
}

/**
 * Auto generate simple review
 * @returns 
 */
function GenerateReview(): Review[] {
    const reviews = [
        {
            rating: 1.0,
            message: "Worst",
        },
        {
            rating: 2.0,
            message: "Bad",
        },
        {
            rating: 3.0,
            message: "Good",
        },
        {
            rating: 4.0,
            message: "Exellent",
        },
        {
            rating: 5.0,
            message: "Best",
        }]
    return [
        reviews[GenerateRandomNumber(0, 4)],
        reviews[GenerateRandomNumber(0, 4)],
        reviews[GenerateRandomNumber(0, 4)]
    ]
}

/**
 * Get the products from the storage if exists, otherwise it is going to
 * generate a list of products and populate the storage with it. This 
 * function also determines the special products.
 * @returns 
 */
export function GetProducts(): Product[] {
    const productsJson = localStorage.getItem("product")
    const specialConfigJson = localStorage.getItem("specialConfig")
    let isStoreProduct = false

    let specialConfig: SpecialConfig
    if (productsJson == null) {
        products.forEach(element => {
            element.reviews = element.reviews.concat(GenerateReview())
        });
        isStoreProduct = true
    } else {
        products = JSON.parse(productsJson)
    }

    // Determine the special products randomly
    const currentDateTimestamp = new Date(Date.now()).setHours(0, 0, 0, 0)
    const currentDate = new Date(currentDateTimestamp)
    const currentWeekday = (currentDate.getDay() + 1)
    const daysToNextWeek = 8 - currentWeekday
    if (specialConfigJson == null) {
        specialConfig = {
            seedTimestamp: currentDate.setDate(currentDate.getDate() - currentWeekday),
            expiryTimestamp: currentDate.setDate(currentDate.getDate() + daysToNextWeek),
        }
        localStorage.setItem("specialConfig", JSON.stringify(specialConfig))
        isStoreProduct = true
    } else {
        specialConfig = JSON.parse(specialConfigJson)
        if (currentDateTimestamp >= specialConfig.expiryTimestamp) {
            specialConfig = {
                seedTimestamp: currentDate.setDate(currentDate.getDate() - currentWeekday),
                expiryTimestamp: currentDate.setDate(currentDate.getDate() + daysToNextWeek),
            }
            localStorage.setItem("specialConfig", JSON.stringify(specialConfig))
            isStoreProduct = true
        }
    }

    // Update the product in the database depending on the condition
    if (isStoreProduct) {
        const numOfItems = 4
        products.forEach((e) => e.isSpecial = false)
        for (let i = 0; i < numOfItems; i++) {
            let randomNumber = Math.sin(specialConfig.seedTimestamp + i)
            if (randomNumber < 0) {
                randomNumber = 1 + randomNumber
            }
            products[Math.floor(randomNumber * products.length)].isSpecial = true
        }

        localStorage.setItem(
            "product",
            JSON.stringify(products),
        )
    }
    return products
}