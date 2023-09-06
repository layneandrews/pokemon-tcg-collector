import { useState } from 'react';
import pokemon from 'pokemontcgsdk'

pokemon.configure({apiKey: '69229fcc-45f1-4202-8bc2-adff8d879632'})

const styles = {
  splitScreen: {
    display: 'flex',
    flexDirection: 'row',
  },
  leftPane: {
    width: '35%',
  },
  rightPane: {
    width: '65%',
  },
  halfPane: {
    width: '50%',
  },
  selector: {
    color: '#2222AA'
  },
  cardSelector: {
    width: '100%',
    padding: '15px 32px',
    border: 'none',
    display: 'inline-block',
  },
  cardJSON: {
    width: '100%',
    overflowX:'auto',
    whiteSpace:'pre-wrap',
    fontSize: '12px',
    fontFamily: 'Times New Roman',
  },
  resultsNameTD: {
    textAlign: 'center',
    width: '65%',
  },
  resultsButtonTD: {
    textAlign: 'center',
    width: '35%',
  },
}

function Home() {
  const handleSub = (e) => {
    e.preventDefault()
    setLoading(true)

    const pokemon_name = e.target[0].value
    pokemon.card.where({ q: `name:${pokemon_name}` })
      .then(result => {
        updateResults(result.data)
        setLoading(false)
    });
  }

  const selectCard = (c) => {
    c.preventDefault()

    const cardData = new FormData(c.target);
    updateCardName( `${cardData.get('id')} - ${cardData.get('name')}`)
    updateCardImage( cardData.get('img_small') )
    updateCardText( cardData.get('item') )
  }

  const [loading, setLoading] = useState(false);

  const [resultsList, updateResults] = useState();

  const [cardImageURL, updateCardImage] = useState();
  const [cardName, updateCardName] = useState();
  const [cardText, updateCardText] = useState();

  return(
    <div>
      <h1>Card Lookup</h1>
        <div style={styles.splitScreen}>
          <div style={styles.halfPane}>
            <SearchBar
              placeholder="Search 4 pokeman cards"
              handleSub={handleSub}/>
            <Spinner
              loading={loading} />
            <ResultsList
              resultsList={resultsList}
              selectCard={selectCard}
              loading={loading}
              />
          </div>
          <div style={styles.halfPane}>
            <CardDisplay
              cardName={cardName}
              cardImageURL={cardImageURL}
              cardText={cardText}
              />
          </div>
        </div>
    </div>
    )
}

function ResultsList({
  resultsList,
  selectCard,
  loading
}) {
  if(
    (resultsList === undefined || resultsList === null) ||
    (loading)
    ) {
    return (<div></div>);
  }
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
              <td style={styles.resultsButtonTD}>
                <form onSubmit={selectCard}>
                  <input type='hidden' name='item' value={JSON.stringify(item)} />
                  <input type='hidden' name='id' value={item.id} />
                  <input type='hidden' name='name' value={item.name} />
                  <input type='hidden' name='img_small' value={item.images.small} />
                  <input type='hidden' name='img_large' value={item.images.large} />
                  <input type='hidden' name='rules' value={item.rules} />
                  <button style={styles.cardSelector} type="submit" disabled={loading}>{item.id}</button>
                </form>
              </td>
              <td style={styles.resultsNameTD}>{item.name}</td>
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

function Spinner({
  loading
}) {
  if(loading) {
    return (
      <div>
        <svg viewBox="-40 -40 80 80" width='100px' height='100px'>
            <ellipse cx="0" cy="0" rx="40" ry="10" fill="black" stroke="black">
              <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="0" cy="0" rx="10" ry="40" fill="black" stroke="black">
              <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="2.5s" repeatCount="indefinite" />
            </ellipse>
        </svg>
      </div>
    );
  } else {
    return (<div></div>);
  }
}

function CardDisplay({
  cardName,
  cardImageURL,
  cardText
}) {
  if (cardImageURL === undefined || cardImageURL === null) {
    return(<div></div>)
  }
  return (
  <>
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
                <img src={cardImageURL} alt='pokemon card' />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <pre style={styles.cardJSON}>{JSON.stringify(JSON.parse(cardText), null, 2)}</pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </>)
}

export default Home
