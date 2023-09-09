import { useState } from 'react';
import pokemon from 'pokemontcgsdk'

const GLOBAL_PAGE_SIZE = 10
var mainQuery = ''
var sortBy = '-set.releaseDate,-number'
var CONFIG = require('./config.json')

pokemon.configure({apiKey: CONFIG.API_KEY})

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
  fullWidth: {
    width: '100%',
  },
  hpinput: {
    width: '5em',
  },
}

function buildPokeQuery(sa) {
  var query = ''

  const name = sa['name'].value
  const atk_name = sa['atk_name'].value
  const atk_text = sa['atk_text'].value
  const supertype = sa['supertype'].value
  const legality = sa['legality'].value
  const rules = sa['rules'].value
  const hpmin = sa['hpmin'].value
  const hpmax = sa['hpmax'].value

  if ( name !== '' ) {
    query += 'name:*'+name+'* '
  }
  if ( atk_name !== '' ) {
    query += 'attacks.name:*' + atk_name + '* '
  }
  if ( atk_text !== '' ) {
    query += 'attacks.text:"*' + atk_text + '*" '
  }
  if ( supertype !== '' ) {
    query += 'supertype:' + supertype + ' '
  }
  if ( legality !== '' ) {
    query += 'legalities.' + legality + ':"Legal" '
  }
  if ( rules !== '' ) {
    query += 'rules:"*' + rules + '*" '
  }

  if ( hpmin !== '' || hpmax !== '' ) {

    query += 'hp:['

    if ( hpmin !== '' ) {
      query += hpmin
    } else {
      query += '*'
    }

    query += ' TO '

    if ( hpmax !== '' ) {
      query += hpmax
    } else {
      query += '*'
    }

    query += '] '
  }

  return query;
}

function Home() {
  //var mainQuery = ''
  const searchRequest = (e) => {
    e.preventDefault()
    setLoading(true)

    mainQuery = buildPokeQuery(e.target);

    console.log(mainQuery)
    pokemon.card.where({ q: mainQuery, orderBy: sortBy, page: 1, pageSize: GLOBAL_PAGE_SIZE })
      .then(result => {
        console.log(result)
        updateResults(result)
        setLoading(false)
    });
  }

  const changePage = (e) => {
    e.preventDefault()

    setLoading(true)
    console.log(e)
    pokemon.card.where({ q: mainQuery, orderBy: sortBy, page: e.target['id'], pageSize: GLOBAL_PAGE_SIZE })
      .then(result => {
        console.log(result)
        updateResults(result)
        setLoading(false)
      })
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
              handleSub={searchRequest}/>
            <Spinner
              loading={loading} />
            <ResultsList
              resultsList={resultsList}
              selectCard={selectCard}
              loading={loading}
              changePage={changePage}
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
  loading,
  changePage
}) {
  if(
    (resultsList === undefined || resultsList === null) ||
    (loading)
    ) {
    return (<div></div>);
  }
  var pages = 0
  var pageButtons = []
  if ( resultsList.page !== undefined ) {
    pages = Math.ceil(resultsList.totalCount / resultsList.pageSize)
    // pages = Array(pages).keys()
    for (let i = 1; i <= pages; i++) {
      pageButtons.push(<button id={i} key={i} onClick={changePage}>{i}</button>)
    }
  }
  return (
    <>
    <div>
      {pageButtons}
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {resultsList.data.map((item, index) => (
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
    </>
  )
}

function SearchBar({
  handleSub
}) {
  return (
    <form onSubmit={handleSub}>
      <table>
        <thead>
          <tr>
            <td>Search Fields:</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <label>Name: </label>
            </td><td>
              <input type="text" name="name" placeholder="Name" style={styles.fullWidth}/><br/>
            </td></tr><tr><td>
              <label>Attack Name: </label>
            </td><td>
              <input type="text" name="atk_name" placeholder="Attack Name" style={styles.fullWidth}/><br/>
            </td></tr><tr><td>
              <label>Attack Text: </label>
            </td><td>
              <input type="text" name="atk_text" placeholder="Attack Text" style={styles.fullWidth}/><br/>
            </td></tr><tr><td>
              <label>Supertype: </label>
            </td><td>
              <select name="supertype" id="supertype-select" style={styles.fullWidth} >
                <option value="">--Choose a Supertype--</option>
                <option value="pokemon">Pokemon</option>
                <option value="energy">Energy</option>
                <option value="trainer">Trainer</option>
              </select><br/>
            </td></tr><tr><td>
              <label>Legality: </label>
            </td><td>
              <select name="legality" id="legality-select" style={styles.fullWidth} >
                <option value="">--Choose a Legality--</option>
                <option value="standard">Standard</option>
                <option value="expanded">Expanded</option>
                <option value="unlimited">Unlimited</option>
              </select><br/>
            </td></tr><tr><td>
              <label>Rules Text: </label>
            </td><td>
              <input type="text" name="rules" placeholder="Rules Text" style={styles.fullWidth} /><br/>
            </td></tr><tr><td>
              <label>HP Range: </label>
            </td><td>
              <input type="number" name="hpmin" step="10" min="0" style={styles.hpinput} />
              &nbsp;to&nbsp;
              <input type="number" name="hpmax" step="10" min="10" style={styles.hpinput} />
            </td></tr><tr><td>
              <button type="submit">Search</button>
            </td>
          </tr>
        </tbody>
      </table>
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
