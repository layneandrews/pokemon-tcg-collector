function Home() {

  const handleSub = (e) => {
    e.preventDefault()
    fetch("https://api.pokemontcg.io/v2/cards/xy1-1")
      .then((r) => r.json())
      .then(data => {
        console.log(data);
    });
  } 
    
  return(
    <div>
      <h1>Hi this is the home component</h1>
        <form onSubmit={handleSub}>
          <input type="text" placeholder="Search for a Pokemon card"/>
          <button type="submit">Search</button>
        </form>
    </div>
    )
}

export default Home