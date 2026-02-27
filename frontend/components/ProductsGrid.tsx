interface ProductImage {
  id: number;
  documentId: string;
  name: string;
  url: string;
}

interface Product {
  id: number;
  documentId: string;
  name: string;
  price: number;
  stock: number;
  image: ProductImage;
}

interface ProductsGridProps {
  products: Product[];
}

const { STRAPI_HOST } = process.env;

export default function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <section className="p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            {product.image && (
              <img
                src={`${STRAPI_HOST}${product.image.url}`}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-lg font-bold text-green-600 mb-2">
                ${product.price}
              </p>
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
