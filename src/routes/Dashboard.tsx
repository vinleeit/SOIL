import React from "react";
import SoilProductCard from "../components/SoilProductCard";
import { GetProducts } from "../shared/services/ProductService";
import SoilTipCard from "../components/SoilTipCard";
import GetTodayTip from "../shared/services/TipService";
import { useShoppingCart } from "../components/ShoppingCartProvider";
import { GetProductPrice } from "../types/Product";
import { Review } from "../types/Review";

export default function Dashboard() {
  const tip = GetTodayTip();
  return (
    <div className="flex flex-col items-center">
      <Jumbotron />
      <WhyOrganicCards />
      <div className="lg:w-2/3 space-y-16 px-10 py-20">
        <WeeklySpecialDealsSection />
        <section>
          <SoilTipCard
            title={tip.title}
            description={tip.content}
            action={tip.source}
          />
        </section>
        <ProductsSection />
      </div>
    </div>
  );
}
function ProductsSection() {
  const products = GetProducts();
  const shoppingCartContext = useShoppingCart();
  return (
    <section className="space-y-6">
      <p className="text-3xl">Our Products</p>
      <div className="gap-5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
        {products
          .filter((product) => !product.isSpecial)
          .map((product) => (
            <React.Fragment key={product.id}>
              <SoilProductCard
                title={product.title}
                price={product.price}
                averageRating={
                  product.reviews.reduce(
                    (sum: number, review: Review) => sum + review.rating,
                    0,
                  ) / product.reviews.length
                }
                reviewCount={product.reviews.length}
                photoUrl={product.photoUrl}
                isSpecial={product.isSpecial}
                itemInCardQuantity={shoppingCartContext.getItemQuantity(
                  product,
                )}
                onAddItem={() => shoppingCartContext.addItem(product)}
                onReduceItem={() => shoppingCartContext.reduceItem(product)}
                onDeleteItem={() => shoppingCartContext.deleteItem(product)}
              />
            </React.Fragment>
          ))}
      </div>
    </section>
  );
}

function WeeklySpecialDealsSection() {
  const products = GetProducts();
  const shoppingCartContext = useShoppingCart();
  return (
    <section className="space-y-6">
      <p className="text-3xl">This Week's Special Deals</p>
      <div className="gap-5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
        {products
          .filter((product) => product.isSpecial)
          .slice(0, 4)
          .map((product) => (
            <React.Fragment key={product.id}>
              <SoilProductCard
                title={product.title}
                price={product.price}
                discountedPrice={GetProductPrice(product)}
                averageRating={
                  product.reviews.reduce(
                    (sum: number, review: Review) => sum + review.rating,
                    0,
                  ) / product.reviews.length
                }
                reviewCount={product.reviews.length}
                photoUrl={product.photoUrl}
                isSpecial={product.isSpecial}
                itemInCardQuantity={shoppingCartContext.getItemQuantity(
                  product,
                )}
                onAddItem={() => shoppingCartContext.addItem(product)}
                onReduceItem={() => shoppingCartContext.reduceItem(product)}
                onDeleteItem={() => shoppingCartContext.deleteItem(product)}
              />
            </React.Fragment>
          ))}
      </div>
    </section>
  );
}

function Jumbotron() {
  return (
    <div className="w-full py-24 bg-stone-500 flex flex-col justify-center items-center px-6 border-b-4 border-lime-800">
      <h1 className="text-5xl text-white font-bold text-center mb-6">
        Get Healthy, Go Organic
      </h1>
      <p className="text-xl text-center text-white">
        <a href="#footnote1" className="underline mr-2">
          Source
        </a>
        shows that organic food reduce risk of ingesting unwanted chemicals,
        pesticides and metals
      </p>
      <p className="text-xs mt-3 text-gray-300" id="footnote1">
        https://www.betterhealth.vic.gov.au/health/healthyliving/organic-food
      </p>
    </div>
  );
}

function WhyOrganicCards() {
  return (
    <div className="px-16  py-10 bg-lime-400 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:w-2/3 m-auto">
        <div className="bg-white text-black py-6 px-8 rounded-lg">
          <h2 className="text-lg mb-2 font-semibold">Ethics</h2>
          <p>
            Organic food promotes better handling and treatment of plants and
            animal, which contributes to environment stability.
          </p>
        </div>
        <div className="bg-white text-black py-6 px-8 rounded-lg">
          <h2 className="text-lg mb-2 font-semibold">
            Less Additional Content
          </h2>
          <p>
            Organic food uses more natural approach to farming, which does not
            use pesticides, additive, antibiotics on the process.
          </p>
        </div>
        <div className="bg-white text-black py-6 px-8 rounded-lg">
          <h2 className="text-lg mb-2 font-semibold">Standardized</h2>
          <p>
            Organic food in Australia is standardized by either Department of
            Agriculture, Fisheries and Forestry accredited certifying
            organisations.
          </p>
        </div>
      </div>
    </div>
  );
}
