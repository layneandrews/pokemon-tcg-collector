function Home(){

    const handleSub = () => {
        fetch("https://api.pokemontcg.io/v2/cards", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(),
        })
          .then((r) => r.json())
          .then(data => {
            console.log(data)
          });
      };
    
    return(
        <div>
            <h1>Hi this is the home component</h1>
            <form action="/search" method="GET">
            <input type="text" id="search" name="q" placeholder="Search for a Pokemon card"/>
            <button onSubmit={handleSub} type="submit">Search</button>
            </form>
        </div>
    )
}

export default Home