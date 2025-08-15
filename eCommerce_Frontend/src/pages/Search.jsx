import { useLocation, Link } from "react-router-dom";

export default function Search() {
  const location = useLocation();
  const { results, query } = location.state || { results: [], query: "" };

  if (!results || results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-500">
        No products found for "{query}"
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold mb-4">
        Search results for "{query}"
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((product) => (
          <Link
            key={product._id}
            to={`/view-product/${product._id}`}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={product.images?.[0]?.url || "https://via.placeholder.com/200"}
              alt={product.name}
              className="w-44 h-44 object-cover rounded"
            />
            <h3 className="font-semibold mt-2">{product.name}</h3>
            <p className="text-red-700 font-medium mt-1">₹{product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
