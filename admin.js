const puppeteer = require('puppeteer');
//const pathsGlb = ['//*[@id="content"]/div[1]/div/div[2]/div[1]/img', '//*[@id="content"]/div[1]/div/div[2]/div[2]/img', '//*[@id="content"]/div[1]/div/div[2]/div[3]/img', '/html/body/div[2]/div[3]/div[1]/div/div[2]/div[4]/img'];
const config = {
  apiKey: "AIzaSyCLSFSdumdrWV0fC3QoBsa7o5DtfD4D4Nc",
  authDomain: "manga-reader-1ab3f.firebaseapp.com",
  databaseURL: "https://manga-reader-1ab3f.firebaseio.com",
  projectId: "manga-reader-1ab3f",
  storageBucket: "manga-reader-1ab3f.appspot.com",
  messagingSenderId: "863150805755",
  appId: "1:863150805755:web:521fbaac7d55c8f03f165e"
};
const firebase = require('firebase');
const app = firebase.initializeApp(config);
//const pages = 27;

async function scrapeProduct(url, pages, chpt) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url)

  for (let pg = 1; pg <= pages; pg++) {
    let [el] = await page.$x(`//*[@id="content"]/div[1]/div/div[2]/div[${pg}]/img`);
    let src;
    try {
      src = await el.getProperty('src');
    } catch (err) {
      pg += 1;
      [el] = await page.$x(`//*[@id="content"]/div[1]/div/div[2]/div[${pg}]/img`);
      src = await el.getProperty('src');
    }
    const srcTxt = await src.jsonValue();
    console.log(srcTxt)
    firebase.database().ref(`onePunchMan/chapters/chpt${chpt}/pages/${pg}`).set({ srcTxt, pg });
  }

  browser.close();
  return;
}

scrapeProduct('https://ww3.readopm.com/chapter/one-punch-man-chapter-005/', 24, 5);