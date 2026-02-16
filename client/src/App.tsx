import ProductCard from './components/ProductCard'

function App() {
  return (
    <div style={{ padding: '20px', background: '#000', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', textAlign: 'center' }}>Menú Demo</h1>
      
      {/* Ejemplo de un trago con video */}
      <ProductCard 
        name="Mojito Clásico"
        price={1200}
        image="https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000&auto=format&fit=crop"
        video="https://cdn.coverr.co/videos/coverr-bartender-making-a-cocktail-5120/1080p.mp4" 
        tags={["Happy Hour", "Refrescante"]}
        isAvailable={true}
        onAddToCart={() => alert("¡Mojito agregado!")}
      />

       {/* Ejemplo sin video y sin stock */}
       <ProductCard 
        name="Cerveza Artesanal"
        price={800}
        image="https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=1000&auto=format&fit=crop"
        tags={["IPA"]}
        isAvailable={false}
      />
    </div>
  )
}

export default App