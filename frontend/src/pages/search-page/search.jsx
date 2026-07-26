import './search.css'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ShopContext } from '../../context/shop-context.jsx'
import ProductCard from '../../components/product-card/product-card.jsx'

const Search = () => {
    const shopContext = useContext(ShopContext) || {}
    const products = Array.isArray(shopContext.products)
        ? shopContext.products
        : []

    const [searchParams, setSearchParams] = useSearchParams()
    const queryFromUrl = searchParams.get('q') || ''

    const [searchInput, setSearchInput] = useState(queryFromUrl)
    const [sortOption, setSortOption] = useState('relevant')
    const [categoryFilter, setCategoryFilter] = useState('all')

    useEffect(() => {
        setSearchInput(queryFromUrl)
    }, [queryFromUrl])

    const categories = useMemo(() => {
        const availableCategories = products.map((product) => product.category).filter(Boolean)

        return [
            'all',
            ...new Set(availableCategories)
        ]
    }, [products])

    const filteredProducts = useMemo(() => {
        const normalisedQuery = queryFromUrl.trim().toLowerCase()

        let results = products.filter((product) => {
            if (!normalisedQuery) {
                return true
            }

            const searchableText = [
                product.name,
                product.category,
                product.subCategory,
                product.description,
                product.colour,
                product.color,
                ...(Array.isArray(product.colours)
                    ? product.colours
                    : []),
                ...(Array.isArray(product.colours)
                    ? product.colours
                    : [])
            ]
                .filter(Boolean).join(' ').toLowerCase()
            
            return searchableText.includes(normalisedQuery)
        })

        if (categoryFilter !== 'all') {
            results = results.filter((product) => product.category?.toLowerCase() === categoryFilter.toLowerCase())
        }

        const sortedResults = [...results]

        if (sortOption === 'price-low') {
            sortedResults.sort((firstProduct, secondProduct) => Number(firstProduct.price || 0) - Number(secondProduct.price || 0))
        }

        if (sortOption === 'price-high') {
            sortedResults.sort((firstProduct, secondProduct) => Number(secondProduct.price || 0) - Number(firstProduct.price || 0))
        }

        if (sortOption === 'name') {
            sortedResults.sort((firstProduct, secondProduct) => String(firstProduct.name || '').localeCompare(String(secondProduct.name || '')))
        }

        if (sortOption === 'bestseller') {
            sortedResults.sort((firstProduct, secondProduct) => Number(Boolean(secondProduct.bestseller)) - Number(Boolean(firstProduct.bestseller)))
        }
        
        return sortedResults
    }, [
        products,
        queryFromUrl,
        categoryFilter,
        sortOption
    ])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        const trimmedSearch = searchInput.trim()

        if (trimmedSearch) {
            setSearchParams({
                q: trimmedSearch
            })
        } else {
            setSearchParams({})
        }
    }

    const clearSearch = () => {
        setSearchInput('')
        setCategoryFilter('all')
        setSortOption('relevant')
        setSearchParams({})
    }

    return (
        <main className='search-page'>
            <section className='search-header'>
                <p className='search-eyebrow'>Discover Opal</p>
                <h1>Search our collection</h1>
                <p className='search-description'>Find clothing by product name, category, colour or style.</p>
                
                <form className='search-form' onSubmit={handleSearchSubmit}>
                    <div className='search-input-wrapper'>
                        <span className='search-input-icon' aria-hidden='true'>
                            ⌕
                        </span>

                        <input
                            type='search'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder='Search dresses, tops, trousers...'
                            aria-label='Search products'
                        />

                        {searchInput && (
                            <button
                                type='button'
                                className='search-input-clear'
                                onClick={() => setSearchInput('')}
                                aria-label='Clear search input'
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <button 
                        type='submit'
                        className='search-submit-button'
                    >
                        Search
                    </button>
                </form>
            </section>

            <section className='search-content'>
                <div className='search-results-heading'>
                    <div>
                        <p className='search-results-count'>
                            {queryFromUrl ? (
                                <>
                                    {filteredProducts.length}{' '}
                                    {filteredProducts.length === 1
                                        ? 'result'
                                        : 'results'}{' '}
                                    for
                                </>
                            ) : (
                                <>
                                    {filteredProducts.length}{' '}
                                    {filteredProducts.length === 1
                                        ? 'product'
                                        : 'products'}
                                </>
                            )}
                        </p>

                        {queryFromUrl && (
                            <h2>"{queryFromUrl}"</h2>
                        )}
                    </div>

                    {queryFromUrl && (
                        <button
                            type='button'
                            className='search-clear-button'
                            onClick={clearSearch}
                        >
                            Clear search
                        </button>
                    )}
                </div>

                <div className='search-toolbar'>
                    <label className='search-filter-field'>
                        <span>Category</span>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            {categories.map((category) => (
                                <option value={category} key={category}>
                                    {category === 'all'
                                        ? 'All categories'
                                        : category}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className='search-filter-field'>
                        <span>Sort by</span>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value='relevant'>Most Relevant</option>
                            <option value='price-low'>Price: Low to High</option>
                            <option value='price-high'>Price: High to Low</option>
                            <option value='name'>Product Name</option>
                        </select>
                    </label>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className='search-product-grid'>
                        {filteredProducts.map((product) => (
                            <ProductCard 
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='search-empty-state'>
                        <div className='search-empty-icon'>
                            ⌕
                        </div>
                        
                        <p className='search-eyebrow'>No matches found</p>
                        <h2>We could not find that style</h2>
                        <p>Check the spelling, try a more general search term or explore the complete Opal collection.</p>

                        <div className='search-empty-actions'>
                            <button
                                type='button'
                                onClick={clearSearch}
                            >
                                Try another search
                            </button>

                            <Link to='/collection'>View Collection</Link>
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}

export default Search