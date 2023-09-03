import { useState } from 'react';
import pokemon from 'pokemontcgsdk'

pokemon.configure({apiKey: 'API_KEY_HERE'})

const styles = {
  splitScreen: {
    display: 'flex',
    flexDirection: 'row',
  },
  leftPane: {
    width: '50%',
  },
  rightPane: {
    width: '50%',
  },
  selector: {
    color: '#2222AA'
  }
}

function Home() {
  const handleSub = (e) => {
    e.preventDefault()

    const query = e.target[0].value
    pokemon.card.where({ q: `name:${query}` })
      .then(result => {
        console.log(result.data);
        updateResults(result.data)
    });
  }

  const selectCard = (c) => {
    c.preventDefault()

    updateCardName( `${c.target['id'].value} - ${c.target['name'].value}` )
    updateCardImage( c.target['img'].value )
    //updateCardImage(c.data)
  }

  const [resultsList, updateResults] = useState([{id:1, name:'test', images: {small:'abc.jpeg'}}])

  const [cardImageURL, updateCardImage] = useState('https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png');
  const [cardName, updateCardName] = useState('Card Title')

  return(
    <div>
      <h1>Hi this is the home component</h1>
        <div style={styles.splitScreen}>
          <div style={styles.leftPane}>
            <SearchBar
              placeholder="Search pokeman cards"
              handleSub={handleSub}/>
            <ResultsList
              resultsList={resultsList}
              selectCard={selectCard}
              />
          </div>
          <div style={styles.rightPane}>
            <CardDisplay
              cardName={cardName}
              cardImageURL={cardImageURL}/>
          </div>
        </div>
    </div>
    )
}

function ResultsList({
  resultsList,
  selectCard
}) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {resultsList.map((item, index) => (
            <tr key={index}>
              <td>
                <form onSubmit={selectCard}>
                  <input type="hidden" name='id' value={item.id} />
                  <input type="hidden" name='name' value={item.name} />
                  <input type="hidden" name='img' value={item.images.small} />
                  <button type="submit">{item.id}</button>
                </form>
              </td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

function CardDisplay({
  cardName,
  cardImageURL
}) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>
              <h3>{cardName}</h3>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div>
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
