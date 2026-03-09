const template = document.createElement('template')
template.innerHTML = `
  <style>
    #snippet-div {
      position: relative;
      width: 550px;
      height: 500px;
      box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      margin: 20px;
    }

    #title-div {
      position: relative;
      display: flex;
      margin: 0 10px 0 10px;
      align-items: center;
    }
    
    #snippet-title {
      cursor: pointer;
    }

    ul {
      list-style-type: none;
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .snippet-nav {
      cursor: pointer;
    }

    pre {
      background-color:rgb(48, 48, 48);
      border-radius: 5px;
      overflow-x: auto;
      margin: 0px 10px 5px 10px;
      padding: 5px;
      color: whitesmoke;
      height: 200px;
    }

    code {
      font-family: monospace;
      color: whitesmoke;
      padding: 5px;
    }
    
    #creation-date {
      position: absolute;
      margin-top: 40px;
      font-family: sans-sarif;
      right: 5px;
      bottom: 0;
    }
      
    #description {
      height: auto;
      width: 95%;
      border: none;
      background: transparent;
      resize: none;      
      font-size: 16px;
      overflow: hidden;   
      outline: none;      
      cursor: default;
      margin-left: 10px;
      margin-right: 10px;
      height: 150px;
    }

    .tag {
      background-color: lightgray;
      border-radius: 8px;
      width: fit-content;
      padding: 3px;
      cursor: pointer;
    }

    #tag-list {
      gap: 5px;
      width: fit-content;
      padding: 3px;
    }

    #author-label {
      position: relative;
      left: 10px;
      top: 5px;
      font-weight: bolder;
      font-size: larger;
      cursor: pointer;
    }

    #nav-list {
      position: absolute;
      width: fit-content;
      right: 10px;
    }
      
    #language-label {
      color: lightblue;
    }
  </style>

  <div id="snippet-div">
    <label id="author-label"></label>
    <div id="title-div">
      <h3 id="snippet-title"></h3>
      <ul id="nav-list">
        <li> <label class="snippet-nav" id="edit-label"> Edit </label></li>
        <li> <label class="snippet-nav" id="delete-label"> Delete </label></li>
      </ul>
    </div>
    <pre><label id="language-label"></label>

<code class="language-javascript" id="code-area"></code>
    </pre>
    <textarea id="description" readonly></textarea>
    <ul id="tag-list">
      
    </ul>
    <label id="creation-date"></label>
  </div>

`

class Snippet extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.append(template.content.cloneNode(true))
  }

  connectedCallback () {
    const editLabel = this.shadow.getElementById('edit-label')
    const deleteLabel = this.shadow.getElementById('delete-label')
    const languageLabel = this.shadow.getElementById('language-label')
    const codeArea = this.shadow.getElementById('code-area')
    const descriptionArea = this.shadow.getElementById('description')
    const tagList = this.shadow.getElementById('tag-list')
    const creationDate = this.shadow.getElementById('creation-date')
    const title = this.shadow.getElementById('snippet-title')
    const author = this.shadow.getElementById('author-label')
    const navList = this.shadow.getElementById('nav-list')
    let snippetId = null

    // Gets the snippet id
    if (this.hasAttribute('snippetId')) {
      snippetId = this.getAttribute('snippetId')
    }

    // Sets the programming language
    if (this.hasAttribute('language')) {
      languageLabel.textContent = this.getAttribute('language')
    }

    // Adds the code to the code section
    if (this.hasAttribute('code')) {
      codeArea.textContent = this.getAttribute('code')
    }

    // Adds the description to the snippet
    if (this.hasAttribute('description')) {
      descriptionArea.textContent = this.getAttribute('description')
    }

    // Adds the tags related to the snippet
    if (this.hasAttribute('tags')) {
      JSON.parse(this.getAttribute('tags')).forEach(tag => {
        if (tag.length !== 0) {
          const listItem = document.createElement('li')
          listItem.className = 'tag'
          listItem.textContent = tag
          tagList.appendChild(listItem)
        }
      })
    }

    // Set the author of the snippet
    if (this.hasAttribute('author')) {
      author.textContent = this.getAttribute('author')
    }

    // Sets the title of the snippet
    if (this.hasAttribute('title')) {
      title.textContent = this.getAttribute('title')
    }

    // Sets the creation date of the snippet
    if (this.hasAttribute('date')) {
      creationDate.textContent = new Date(this.getAttribute('date')).toISOString().split('T')[0]
    }

    // If the user owns the snippet then it is editable
    if (!this.hasAttribute('editable')) {
      navList.style.display = 'none'
    }

    /**
     * Searches for the title of the snippet
     */
    const searchTitle = () => {
      window.location.href = `/snippets/search?title=${title.textContent}`
    }
    title.addEventListener('click', searchTitle)

    /**
     * Searches for the clicked tag
     * @param {string} tag the clicked tag
     */
    const searchTag = (tag) => {
      window.location.href = `/snippets/search?tag=${tag}`
    }

    tagList.addEventListener('click', (ev) => {
      if (ev.target.className === 'tag') {
        searchTag(ev.target.textContent)
      }
    })

    /**
     * Shows the profile of the user
     */
    const showProfile = () => {
      window.location.href = `/snippets/profile/${author.textContent}`
    }
    author.addEventListener('click', showProfile)

    // Edit snippet
    const editSnippet = () => {
      window.location.href = `/snippets/edit/${snippetId}`
    }
    // Edit the snippet
    editLabel.addEventListener('click', editSnippet)

    // Delete snippet
    const deleteSnippet = async () => {
      await fetch(`/snippets/delete/${snippetId}`, {
        method: 'DELETE'
      })
      window.location.href = '/'
    }

    // Delete the snippet
    deleteLabel.addEventListener('click', deleteSnippet)
  }
}

customElements.define('snippet-div', Snippet)
