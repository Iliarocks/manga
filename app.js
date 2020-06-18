const database = firebase.database();
const storage = firebase.storage();
const nonAdmin = document.querySelector('.non-admin');
const chptList = document.querySelector('.chapter-list');
const pageHolder = document.querySelector('.pages');
const chpt = document.querySelector('#chpt');
const goHome = document.querySelector('#go-home');
const nextChpt = document.querySelector('#foward');
const lastChpt = document.querySelector('#back');
const chptSelect = document.querySelector('#chapter-select');

function loadPanels() {
  var chapter = window.location.href.split('=');
  if (chapter.length <= 1) return;
  database.ref(`onePunchMan/chapters/chpt${chapter[1]}/pages`).once('value', function(snap) {
    var pages = Object.values(snap.val()).sort((a, b) => a.pg - b.pg);
    const promises = pages.map(page => page.srcTxt);
    Promise.all(promises).then(urls => {
      pageHolder.innerHTML = urls
        .map(url => `<img src="${url}">`)
        .join('\n')
    });
    chpt.innerText = 'ONE-PUNCH MAN, CHAPTER ' + chapter[1]
  })
}

function openChapter(chptId) {
  window.location += `/chapter.html?chapter=${chptId}`
}

function addEventToChpts() {
  var chapters = document.querySelectorAll('.chapter');
  chapters.forEach(chapter => chapter.onclick = e => openChapter(e.target.id))
}

function showBtns() {
  var location = window.location.href.split('=');
  if (location.length <= 1) return;
  if (location[1] === '1') lastChpt.style.display = 'none';
  database.ref(`onePunchMan/chapters`).once('value', function(snap) {
    let numOfChpts = snap.numChildren()
    if (location[1] === numOfChpts.toString()) nextChpt.style.display = 'none';
  })
}

function selected() {
  try {
    var currChpt = parseInt(window.location.href.split('=')[1])
    chptSelect[currChpt - 1].selected = true;
  } catch (e) {
    alert(e.message)
  }
}

database.ref(`onePunchMan/chapters`).on('value', function(snap) {
  if (!snap.val()) return;
  //if (window.location.href.split('=').length > 1) return;
  var chapters = Object.values(snap.val()).sort((a, b) => a.chptId - b.chptId).reverse();
  if (window.location.href.split('=').length > 1) {
    var newHTML = chapters.reverse().reduce((html, chpt) => html += `<option class="chpt-option" value="${chpt.chptId}">${chpt.chptId}</option>`, '');
    console.log(newHTML)
    chptSelect.innerHTML = newHTML;
    selected();
  } else {
    var newHTML = chapters.reduce((html, chpt) => html += `<li id="${chpt.chptId}" class="chapter"><p>Chapter ${chpt.chptId}</p> <button id="${chpt.chptId}">Read</button></li>`, '');
    chptList.innerHTML = newHTML;
    addEventToChpts()
  }
})

function start() {
  showBtns();
  loadPanels();
}

if (window.location.href.split('=').length > 1) {
  chptSelect.addEventListener('change', async function(e) {
    var location = window.location.href.split('=')[0];
    window.location = location + '=' + e.target.value;
  })

  //go to next chapter
  nextChpt.addEventListener('click', function(e) {
    var currUrl = window.location.href.split('=');
    var lastChpt = parseInt(currUrl[1]) + 1;
    window.location = `${currUrl[0]}=${lastChpt}`
  })

  //go back a chapter
  lastChpt.addEventListener('click', function(e) {
    var currUrl = window.location.href.split('=');
    var lastChpt = parseInt(currUrl[1]) - 1;
    window.location = `${currUrl[0]}=${lastChpt}`
  })

  //listen for click then go to landing page
  goHome.addEventListener('click', function(e) {
    console.log(window.location.href.split('//c'))
    //window.location = window.location.href.split('/c')[0]
    window.location = window.location.origin
  })
}