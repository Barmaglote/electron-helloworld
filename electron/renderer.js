const information = document.getElementById('info')
const newLinkSubmit = document.getElementById('new-link-submit');
const newLinkInput = document.getElementById('new-link-input');
const clearSearchButton = document.getElementById('clear-storage');
const linkSection = document.querySelector('.links');
const parser = new DOMParser();

information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const infoFunc = async () => {
  const response = await window.versions.ping()
  console.log(response) // prints out 'pong'
}

infoFunc()

newLinkSubmit.addEventListener('click', (event) => {
  event.preventDefault();
  url = newLinkInput.value;

  fetch(url)
    .then(response => response.text())
    .then(parseResponse)
    .then(findTitle)
    .then(title => storeLink(title, url))
    .then(clearForm)
    .then(renderLinks)
});

newLinkInput.addEventListener('keyup', () => {
  newLinkSubmit.disabled = !newLinkInput.validity.valid
})

clearSearchButton.addEventListener('click', () => {
  localStorage.clear();
  renderLinks();
});

const parseResponse = (text) => {
  return parser.parseFromString(text, 'text/html');
}

const findTitle = (nodes) => {
  return (nodes.querySelector('title') ?? nodes.querySelector('head'))?.innerText;
}

const storeLink = (title, url) => {
  if (!title) {
    return;
  }
  localStorage.setItem(title, JSON.stringify({ title, url}));
}

const clearForm = () => {
  newLinkInput.value = '';
}

const getLinks = () => {
  return Object.keys(localStorage).filter(key => key !== null && key !== undefined).map(key => JSON.parse(localStorage.getItem(key)));
}

const convertToElement = (link) => {
  if (!link || link.title === undefined || link.title === 'undefined') {
    return '';
  }

  return `
    <div class="border-1 border-round-1 p-2">
      <h3>${link.title}</h3>
      <p><a href="${link.url}">${link.url}</p>
    </div>
  `;
}

const renderLinks = () => {
  const linkElements = getLinks().map(convertToElement).join('');
  linkSection.innerHTML = linkElements;
  clearSearchButton.disabled = !linkSection.children.length;
}

renderLinks();