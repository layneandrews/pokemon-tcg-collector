import { useState } from 'react';

function Home() {
  const handleSub = (e) => {
    e.preventDefault()
    const cardId = e.target[0].value
    fetch("https://api.pokemontcg.io/v2/cards/" + cardId)
      .then((r) => r.json())
      .then(card => {
        console.log(card.data);
        var new_url = card.data.images.small;
        updateCardImage(new_url);
    });
  }

  const [cardImageURL, updateCardImage] = useState('https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png');

  return(
    <div>
      <h1>Hi this is the home component</h1>
        <SearchBar
          placeholder="Search pokeman cards"
          handleSub={handleSub}/>
        <CardDisplay
          cardImageURL={cardImageURL}/>
    </div>
    )
}

function SearchBar({
  placeholder,
  handleSub
}) {
  return (
    <form onSubmit={handleSub}>
      <input type="text" placeholder={placeholder}/>
      <button type="submit">Search</button>
    </form>
  )
}

function CardDisplay({cardImageURL}) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>
              <h3>cardTitle</h3>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div width='245px' height='342px'>
              <img width='245px' height='342px' src={cardImageURL} alt='pokemon card'/>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Home
