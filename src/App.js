import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route, Link, Redirect, withRouter
} from 'react-router-dom'

/*
* BrowserRouter is a router that uses the HTML5 history API 
* (pushState, replaceState and the popState event)
* to keep your UI in sync with the URL.
*/

const linkprops = {
  textDecoration: 'none',
}

const notificationprops = {
  padding: '10',
  color: '#006400',
}

const Menu = () => {
  const padding = {
    paddingRight: 5,
    textDecoration: 'none',
  }
  return (
    <div>
      <Link style={padding} to='/'>anecdotes</Link>
      <Link style={padding} to='/create'>create new</Link>
      <Link style={padding} to='/about'>about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    {console.log("anecdotes in the list ", anecdotes)}
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote =>
        <li key={anecdote.id}>
          <Link style={linkprops} to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
)

const Anecdote = ({ anecdote }) => (
  <div>
    {console.log("anecdote is: ", anecdote)}
    <h2>{anecdote.content} by {anecdote.author}</h2>
    <div>has {anecdote.votes} votes</div>
    <div>for more information, please visit {anecdote.info}</div>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div style={linkprops}>
    Anecdote app for <a style={linkprops} href='https://courses.helsinki.fi/fi/tkt21009'>Full Stack -sovelluskehitys</a>.

    See <a style={linkprops} href='https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [info, setInfo] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content,
      author,
      info,
      votes: 0
    })
    setContent('')
    setAuthor('')
    setInfo('')
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          author
          <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url for more info
          <input name='info' value={info} onChange={(e) => setInfo(e.target.value)} />
        </div>
        <button>create</button>
      </form>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1'
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2'
    },
    {
      content: 'Red Wine React(ions)',
      author: 'Alice H.E. Lethlyn',
      info: 'https://www.healthline.com/health/wine-allergens',
      votes: 0,
      id: '3'
    },
    {
      content: 'JSONs and Preparations',
      author: 'Ronald McAtkins',
      info: 'https://github.com/tabatkins/recipe-db/blob/master/db-recipes.json',
      votes: 0,
      id: '4'
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    setAnecdotes(anecdotes.concat(anecdote))
    //console.log("here now in addnew, notif: ", notification)
    setNotification(`You added anecdote '${anecdote.content}'`)
    //setTimeout launches automatically if you just call it directly, bae :)
    setTimeout(() => setNotification(''), 10000)
  }

  const anecdoteById = (id) => {
    const anecdote = anecdotes.find(a => a.id === id)
    console.log("anecdote is: ", anecdote)
    return anecdote //it appears that this thing didn't return a thing before saving it to a const and then returning that one.
  }

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <Router>
        <h1>Software anecdotes</h1>
        <Menu />
        <Route path="/about" render={() => <About />} />
        <Route path="/create" render={() =>
          notification ? <Redirect to='/' /> : <CreateNew addNew={addNew} setNotification={setNotification} />} />
          <div style={notificationprops}>{notification}</div>
        <Route exact path="/" render={() => <AnecdoteList anecdotes={anecdotes} />} />
        <Route exact path="/anecdotes/:id" render={({ match }) =>
          <Anecdote anecdote={anecdoteById(match.params.id)} />
        } />
        <Footer />
      </Router>
    </div>
  )
}

export default App;