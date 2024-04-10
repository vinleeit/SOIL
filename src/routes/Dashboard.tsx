import React from "react"
import SoilButton from "../components/SoilButton"
import SoilProductCard from "../components/SoilProductCard"
import { GetProducts } from "../shared/services/ProductService"

export default function Dashboard() {
    var products = GetProducts()
    return (
        <div className="flex justify-center">
            <div className="py-10 px-10 lg:px-0 lg:w-2/3 space-y-10">
                <section className="space-y-6" >
                    <p className="text-3xl">Special Deals</p>
                    <div className="gap-5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                        {products
                            .filter(product => product.isSpecial)
                            .slice(0, 4)
                            .map(
                                product => <React.Fragment key={product.id}>
                                    <SoilProductCard
                                        title={product.title}
                                        price={product.price}
                                        averageRating={(product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length)}
                                        reviewCount={product.reviews.length}
                                        photoUrl={product.photoUrl}
                                        isSpecial={product.isSpecial} />
                                </React.Fragment>)}
                    </div>
                    <div className="flex flex-col items-center space-y-3">
                        <p>Do you want to see more special products?</p>
                        <SoilButton outlined>
                            See More {">>"}
                        </SoilButton>
                    </div>
                </section>
                <section className="space-y-6" >
                    <p className="text-3xl">Our Products</p>
                    <div className="gap-5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                        {products
                            .filter(product => !product.isSpecial)
                            .map(
                                product => <React.Fragment key={product.id}>
                                    <SoilProductCard
                                        title={product.title}
                                        price={product.price}
                                        averageRating={product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length}
                                        reviewCount={product.reviews.length}
                                        photoUrl={product.photoUrl}
                                        isSpecial={product.isSpecial} />
                                </React.Fragment>)}
                    </div>
                </section>
            </div>
        </div>
    )
}